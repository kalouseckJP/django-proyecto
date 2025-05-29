from django.shortcuts import render
from datetime import datetime, date, timedelta
from .models import Espacios, Reserva, Cliente, Ad, Mesas, ReservationTable
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.db.models import Sum, Count, F, ExpressionWrapper, IntegerField, Q
from django.utils.timezone import make_aware
from django.utils import timezone

# Create your views here.
def registro(request):
    response = render(request, 'registrar.html')
    return response

def index(request):
    response = render(request, 'index.html')
    response.delete_cookie('loggedIn')
    return response

def admin(request):
    reservas = Reserva.objects.all()
    clientes = Cliente.objects.all()
    lugares = Espacios.objects.all()
    mesas = Mesas.objects.all()
    
    today = date.today().isoformat() # AAAA-MM-DD
    tiemponow = datetime.now().strftime("%d/%m/%Y, %H:%M:%S") 
    
    print(reservas)
    return render(request, 'admin.html', {
        'reservas': reservas,
        'clientes': clientes,
        'lugares': lugares,  # Usar la lista con capacidad dinámica
        'tiempo': tiemponow,
        'today': today,
        'mesas': mesas,
    })

def front(request):
    response = render(request, 'front.html')
    response.delete_cookie('loggedIn')
    return response

def hacer_reserva(request):
    today = date.today().isoformat() # AAAA-MM-DD
    now = datetime.now().strftime('%H:%M') # HH:MM
    tiemponow = datetime.now().strftime("%d/%m/%Y, %H:%M:%S") 
    lugares = Espacios.objects.all()
    reservas = Reserva.objects.all()
    cliente = Cliente.objects.get(RUT = request.COOKIES.get("user_id"))
    rango = range(1,11)
    for lugar in lugares:
        # Sumar la cantidad de personas en reservas dentro del rango de tiempo
        reservas_en_rango = reservas.filter(
            espacio=lugar,
        ).aggregate(total_personas=Sum('cantidad_personas'))['total_personas'] or 0
        # Calcular capacidad actual
        capacidad_actual = lugar.capacidadMaxima - reservas_en_rango
        
    return render(request, 'reservaciones.html', 
                  {'today': today, 
                   'now': now, 
                   'lugares': lugares, 
                   'capacidad_actual': capacidad_actual,
                   'tiemponow': tiemponow, 
                   'rango': rango, 
                   "cliente": cliente})

def get_cliente(request, RUT):
    cliente = Cliente.objects.get(RUT=RUT)
    data = {
        "RUT": cliente.RUT,
        "nombre": cliente.nombre,
        "apellido": cliente.apellido,
        "telefono": cliente.telefono,
        "email": cliente.email,
        "visitas": cliente.visitas,
    }
    return JsonResponse(data)

@csrf_exempt
def edit_cliente(request):
    if request.method == "POST":
        rut = request.POST.get("RUT")
        print("rut: ")
        print(rut)
        cliente = Cliente.objects.get(RUT=rut)
        cliente.nombre = request.POST.get("nombre")
        cliente.apellido = request.POST.get("apellido")
        cliente.telefono = request.POST.get("telefono")
        cliente.email = request.POST.get("email")
        cliente.visitas = request.POST.get("visitas")
        cliente.save()
        return JsonResponse({"success": True, "RUT": cliente.RUT, "nombre": cliente.nombre, "apellido": cliente.apellido, "telefono": cliente.telefono, "email": cliente.email, "visitas": cliente.visitas})
    return JsonResponse({"success": False})

@csrf_exempt
def edit_usuario(request):
    if request.method == "POST":
        rut = request.POST.get("RUT")
        print("rut: ")
        print(rut)
        cliente = Cliente.objects.get(RUT=rut)
        cliente.nombre = request.POST.get("nombre")
        cliente.apellido = request.POST.get("apellido")
        cliente.telefono = request.POST.get("telefono")
        cliente.email = request.POST.get("email")
        cliente.contrasena = request.POST.get("password")
        cliente.save()
        response = JsonResponse({"success": True})
        response.set_cookie(key='user_nombre',value=cliente.nombre,max_age=86400,path='/')
        response.set_cookie(key='user_apellido',value=cliente.apellido,max_age=86400,path='/')
        return response
    return JsonResponse({"success": False})

def get_reserva(request, id):
    now = datetime.now().strftime("%Y-%m-%dT%H:%M") 
    reserva = Reserva.objects.get(id=id)
    data = {
        "id": reserva.id,
        "nombre": reserva.RUT.nombre,
        "apellido": reserva.RUT.apellido,
        "RUT": reserva.RUT.RUT,
        "telefono": reserva.RUT.telefono,
        "email": reserva.RUT.email,
        "fecha_reserva": reserva.fecha_reserva,
        "hora_inicio": reserva.hora_inicio,
        "cantidad_personas": reserva.cantidad_personas,
        "espacio": reserva.espacio.nombre,
        "now": now,
    }
    return JsonResponse(data)

@csrf_exempt
def edit_reserva(request):
    if request.method == "POST":
        id = request.POST["id"]
        fecha_reserva = request.POST["fecha_reserva"]
        naive_datetime = datetime.fromisoformat(fecha_reserva)
        aware_datetime = make_aware(naive_datetime)
        lugar = Espacios.objects.get(id=request.POST["espacio"])
        
        reserva = Reserva.objects.get(id=id)
        reserva.fecha_reserva = aware_datetime
        reserva.hora_inicio = aware_datetime.time()
        reserva.cantidad_personas = request.POST.get("cantidad_personas")
        reserva.espacio = lugar
        reserva.save()
        assign_tables_to_reservation(reserva)
        return JsonResponse({"success": True, "id": reserva.id, "RUT": reserva.RUT.RUT, "nombre": reserva.RUT.nombre, "apellido": reserva.RUT.apellido, "telefono": reserva.RUT.telefono, "email": reserva.RUT.email, "fecha_reserva": naive_datetime, "hora_inicio": reserva.hora_inicio, "cantidad_personas": reserva.cantidad_personas, "espacio": reserva.espacio.nombre})
    return JsonResponse({"success": False})

def get_lugar(request, id):
    lugar = Espacios.objects.get(id=id)
    data = {
        "id": lugar.id,
        "nombre": lugar.nombre,
        "capacidadMaxima": lugar.capacidadMaxima,
        "descripcion": lugar.descripcion,
    }
    return JsonResponse(data)

@csrf_exempt
def edit_lugar(request):
    if request.method == "POST":
        id = request.POST.get("id")
        lugar = Espacios.objects.get(id=id)
        lugar.nombre = request.POST.get("nombre")
        lugar.capacidadMaxima = request.POST.get("capacidadMaxima")
        lugar.descripcion = request.POST.get("descripcion")
        lugar.save()
        return JsonResponse({"success": True, "id": lugar.id, "nombre": lugar.nombre, "capacidadMaxima": lugar.capacidadMaxima, "descripcion": lugar.descripcion})
    return JsonResponse({"success": False})

@csrf_exempt
def delete_reserva(request, id):
    if request.method == "DELETE":
        try:
            reserva = Reserva.objects.get(id=id)
            delete_reserva_mesas(reserva)
            reserva.delete()
            return JsonResponse({"success": True})
        except Reserva.DoesNotExist:
            return JsonResponse({"success": False, "error": "Reserva no encontrada"})
    return JsonResponse({"success": False, "error": "Método no permitido"})

@csrf_exempt
def delete_cliente(request, RUT):
    if request.method == "DELETE":
        try:
            cliente = Cliente.objects.get(RUT=RUT)
            cliente.delete()
            return JsonResponse({"success": True})
        except Cliente.DoesNotExist:
            return JsonResponse({"success": False, "error": "Cliente no encontrado"})
    return JsonResponse({"success": False, "error": "Método no permitido"})

@csrf_exempt
def delete_lugar(request, id):
    if request.method == "DELETE":
        try:
            lugar = Espacios.objects.get(id=id)
            lugar.delete()
            return JsonResponse({"success": True})
        except Espacios.DoesNotExist:
            return JsonResponse({"success": False, "error": "Lugar no encontrado"})
    return JsonResponse({"success": False, "error": "Método no permitido"})

def add_reserva(request):
    if request.method == "POST":
        cliente = Cliente.objects.get(RUT=request.POST["RUT"])
        lugar = Espacios.objects.get(id=request.POST["espacio"])
        
        fecha_reserva = request.POST["fecha_reserva"]
        naive_datetime = datetime.fromisoformat(fecha_reserva)
        aware_datetime = make_aware(naive_datetime)
        
        reserva = Reserva.objects.create(
            RUT=cliente,
            fecha_reserva=aware_datetime,
            hora_inicio=aware_datetime.time(),
            cantidad_personas=request.POST["cantidad_personas"],
            espacio=lugar,
        )
        cliente.visitas = cliente.visitas+1
        cliente.save()
        assign_tables_to_reservation(reserva)
        new_row_html = render_to_string("partials/reserva_row.html", {"reserva": reserva})
        return JsonResponse({"success": True, "new_row_html": new_row_html})
    return JsonResponse({"success": False})

def leer_admin(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        if Ad.objects.filter(nombre=username, contrasena=password).exists():
            response = JsonResponse({"success": True})
            response.set_cookie("loggedIn", "true")
        else:
            response = JsonResponse({"success": False})
    return response

def add_cliente(request):
    if request.method == "POST":
        cliente = Cliente.objects.create(
            RUT=request.POST["RUT"],
            nombre=request.POST["nombre"],
            apellido=request.POST["apellido"],
            telefono=request.POST["telefono"],
            email=request.POST["email"],
            visitas=request.POST["visitas"],
        )
        new_row_html = render_to_string("partials/cliente_row.html", {"cliente": cliente})
        return JsonResponse({"success": True, "new_row_html": new_row_html})
    return JsonResponse({"success": False})

def add_lugar(request):
    if request.method == "POST":
        lugar = Espacios.objects.create(
            nombre=request.POST["nombre"],
            capacidadMaxima=request.POST["capacidadMaxima"],
            descripcion=request.POST["descripcion"],
        )
        new_row_html = render_to_string("partials/lugar_row.html", {"lugar": lugar})
        return JsonResponse({"success": True, "new_row_html": new_row_html})
    return JsonResponse({"success": False})

def get_all_lugares(request):
    lugares = Espacios.objects.all().values('id', 'nombre', 'capacidadMaxima', 'descripcion')
    return JsonResponse(list(lugares), safe=False)

def add_reserva_cliente(request):
    if request.method == "POST":
        reserva = Reserva.objects.create(
            RUT = Cliente.objects.get(RUT = request.COOKIES.get("user_id")),
            espacio = Espacios.objects.get(id = request.POST["lugar"]),
            fecha_reserva = request.POST["fecha"],
            hora_inicio = request.POST["hora"],
            cantidad_personas = request.POST["cantidad_personas"]
        )
        assign_tables_to_reservation(reserva)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

def get_horarios(request):
    if request.method == "POST":
        espacios = Espacios.objects.all()
        reservas = Reserva.objects.all()
        fecha = request.POST["fecha"]
        hora = request.POST["hora"]
        
        if fecha and hora:
            combined_str = f"{fecha} {hora}"  # '2025-05-23 14:30'
            combined_datetime = datetime.strptime(combined_str, "%Y-%m-%d %H:%M")
        
        start_range = combined_datetime - timedelta(minutes=30)
        end_range = combined_datetime + timedelta(minutes=30)
                
        espacios = Espacios.objects.annotate(
            overlapping_reservas = Count(
                'reserva',
                filter=Q(reserva__fecha_reserva__range = (start_range, end_range))
            ),
            available_spots = ExpressionWrapper(
                F('capacidadMaxima') - Count('reserva',filter=Q(reserva__fecha_reserva__range = (start_range, end_range))),
                output_field = IntegerField()
            )
        )
        for lugares_test in espacios:
            upd_lugar = Espacios.objects.get(id=lugares_test.id)
            if upd_lugar.capacidad_actual != lugares_test.available_spots:
                upd_lugar.capacidad_actual = lugares_test.available_spots
                upd_lugar.save()
            print(lugares_test.available_spots)
        
        
        data = [{
            'id': ele.id,
            'nombre': ele.nombre,
            'descripcion': ele.descripcion,
            'capacidadMaxima': ele. capacidadMaxima,
            'capacidad_actual': ele.capacidad_actual,
            'reservas_actuales': ele.overlapping_reservas,
            'espacio_disponible': ele.available_spots
        }for ele in espacios]
        
        return JsonResponse({'success': True, 'lugares': data})
    return JsonResponse({'success': False})

def add_cliente_registro(request):
    if request.method == "POST":
        if Cliente.objects.filter(RUT = request.POST["RUT"]).exists():
            return JsonResponse({"success": True, "existente": True})
        else:
            Cliente.objects.create(
                RUT=request.POST["RUT"],
                nombre=request.POST["username"],
                apellido=request.POST["apellido"],
                telefono=request.POST["telefono"],
                email=request.POST["email"],
                contrasena=request.POST["password"],
                visitas=0,
            )
            cliente = Cliente.objects.get(RUT = request.POST["RUT"])
            response = JsonResponse({"success": True, "existente": False})
            response.set_cookie(key='user_id',value=cliente.RUT,max_age=86400,path='/')
            response.set_cookie(key='user_nombre',value=cliente.nombre,max_age=86400,path='/')
            response.set_cookie(key='user_apellido',value=cliente.apellido,max_age=86400,path='/')
            return response
    return JsonResponse({"success": False})

def login_cliente(request):
    response = render(request,'inicio_sesion.html')
    return response

def validacion_cliente(request):
    if request.method == "POST":
        usuario = request.POST["username"]
        password = request.POST["password"]
        match = Cliente.objects.filter(
            Q(RUT = usuario) | Q(email = usuario) | Q(telefono = usuario)
        ).first()
        if match and match.contrasena == password:
            response = JsonResponse({"success": True, "existe": True})
            response.set_cookie(key='user_id',value=match.RUT,max_age=86400,path='/')
            response.set_cookie(key='user_nombre',value=match.nombre,max_age=86400,path='/')
            response.set_cookie(key='user_apellido',value=match.apellido,max_age=86400,path='/')
            return response
        else:
            return JsonResponse({"success": True,"existe": False})
    return JsonResponse({"success": False})

def usuario(request):
    RUT = Cliente.objects.get(RUT = request.COOKIES.get('user_id'))
    now_local = timezone.localtime(timezone.now())-timedelta(hours=4)

    print(timezone.now())
    print(now_local)
    reservas = Reserva.objects.filter(RUT = RUT, fecha_reserva__gte=now_local)
    if not reservas:
        response = render(request, 'usuario.html', {'reservas': reservas, 'cliente': RUT, 'vacio': True})
    else:
        response = render(request, 'usuario.html', {'reservas': reservas, 'cliente': RUT, 'vacio': False})
    return response

def get_horarios_usuario(request):
    if request.method == "POST":
        espacios = Espacios.objects.all()
        fecha_reserva = request.POST["fecha_reserva"]
        naive_datetime = datetime.fromisoformat(fecha_reserva)
        aware_datetime = make_aware(naive_datetime)
        
        start_range = aware_datetime - timedelta(minutes=30)
        end_range = aware_datetime + timedelta(minutes=30)
                
        espacios = Espacios.objects.annotate(
            overlapping_reservas = Count(
                'reserva',
                filter=Q(reserva__fecha_reserva__range = (start_range, end_range))
            ),
            available_spots = ExpressionWrapper(
                F('capacidadMaxima') - Count('reserva',filter=Q(reserva__fecha_reserva__range = (start_range, end_range))),
                output_field = IntegerField()
            )
        )
        for lugares_test in espacios:
            upd_lugar = Espacios.objects.get(id=lugares_test.id)
            if upd_lugar.capacidad_actual != lugares_test.available_spots:
                upd_lugar.capacidad_actual = lugares_test.available_spots
                upd_lugar.save()
            print(lugares_test.available_spots)
        
        
        data = [{
            'id': ele.id,
            'nombre': ele.nombre,
            'descripcion': ele.descripcion,
            'capacidadMaxima': ele. capacidadMaxima,
            'capacidad_actual': ele.capacidad_actual,
            'reservas_actuales': ele.overlapping_reservas,
            'espacio_disponible': ele.available_spots
        }for ele in espacios]
        
        return JsonResponse({'success': True, 'lugares': data})
    return JsonResponse({'success': False})

def add_reserva_mesa(request):
    if request.method == "POST":
        reserva = Reserva.objects.get(RUT = request.POST["RUT"])
        mesa = Mesas.objects.get(id = request.POST["mesa"])
        
        return
    
def get_reserva_mesa(request, reservaRequest, mesa):
    reserva = Reserva.objects.get(id = reservaRequest)
    mesa = Mesas.objects.get(id = mesa)
    reserva_mesa = ReservationTable.objects.get(reserva = reserva, mesa = mesa)
    data = {
        "reserva": reserva_mesa.reservacion,
        "mesa": reserva_mesa.mesa,
        "cantidadMesas": reserva_mesa.cantidadUsada
    }
    return JsonResponse(data)

def assign_tables_to_reservation(reservation):
    print(reservation.cantidad_personas)
    necesarias = int(reservation.cantidad_personas)
    mesas = Mesas.objects.filter(cantidadActual__gt=0).order_by('-capacidadMesa')
    asientos_totales_asignados = 0

    for mesa in mesas:
        personas_restantes = necesarias - asientos_totales_asignados
        if personas_restantes <= 0:
            break

        # Cantidad máxima que se podría usar de este tipo
        cantidad_usar = min(mesa.cantidadActual, (personas_restantes + mesa.capacidadMesa - 1) // mesa.capacidadMesa)

        # Reducir la cantidad si estamos sobrellenando demasiado (ej: 2 mesas de 6 para 8 personas = 12 asientos)
        while cantidad_usar > 0 and (cantidad_usar - 1) * mesa.capacidadMesa >= personas_restantes:
            cantidad_usar -= 1

        if cantidad_usar > 0:
            ReservationTable.objects.create(
                reservacion=reservation,
                mesa=mesa,
                cantidadUsada=cantidad_usar
            )
            mesa.cantidadActual -= cantidad_usar
            mesa.save()

            asientos_totales_asignados += cantidad_usar * mesa.capacidadMesa

    if asientos_totales_asignados < necesarias:
        raise Exception("No hay suficientes mesas para satisfacer la reservación.")

def delete_reserva_mesas(reserva):
    print('llega aqui?')
    reserva_mesa = ReservationTable.objects.filter(reservacion = reserva)
    print(reserva_mesa)
    for mesas in reserva_mesa:
        mesa = mesas.mesa
        mesa.cantidadActual = mesa.cantidadActual + mesas.cantidadUsada
        mesa.save()
    reserva_mesa.delete()
    