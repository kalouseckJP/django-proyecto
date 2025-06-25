from django.shortcuts import render
from datetime import datetime, date, timedelta, time
from .models import Espacios, Reserva, Cliente, Ad, Mesas, ReservationTable, Product, Reportes, Empleado
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.db.models import Sum, Count, F, ExpressionWrapper, IntegerField, Q
from django.utils.timezone import make_aware
from django.utils import timezone
import calendar
import json


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
    productos = Product.objects.all()
    reportes = Reportes.objects.all()
    empleados = Empleado.objects.all()
    
    today = date.today().isoformat() # AAAA-MM-DD
    tiemponow = datetime.now().strftime("%d/%m/%Y, %H:%M:%S") 
    return render(request, 'admin.html', {
        'reservas': reservas,
        'clientes': clientes,
        'lugares': lugares,
        'tiempo': tiemponow,
        'today': today,
        'mesas': mesas,
        'productos': productos,
        'reportes': reportes,
        'empleados': empleados,
    })

def front(request):
    response = render(request, 'front.html')
    response.delete_cookie('loggedIn')
    return response

def hacer_reserva(request):
    today = date.today().isoformat() # AAAA-MM-DD
    now = (datetime.now() + timedelta(minutes=30)).strftime('%H:%M')
    tiemponow = datetime.now().strftime("%d/%m/%Y, %H:%M:%S") 
    lugares = Espacios.objects.all()
    cliente = Cliente.objects.get(RUT = request.COOKIES.get("user_id"))
    rango = range(1,11)
        
    return render(request, 'reservaciones.html', 
                  {'today': today, 
                   'now': now, 
                   'lugares': lugares, 
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
        try:
            assign_tables_to_reservation(reserva)
        except Exception as e:
            print(e)
            return JsonResponse({"success": False, "id": reserva.id, "RUT": reserva.RUT.RUT, "nombre": reserva.RUT.nombre, "apellido": reserva.RUT.apellido, "telefono": reserva.RUT.telefono, "email": reserva.RUT.email, "fecha_reserva": naive_datetime, "hora_inicio": reserva.hora_inicio, "cantidad_personas": reserva.cantidad_personas, "espacio": reserva.espacio.nombre})

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
        try:
            assign_tables_to_reservation(reserva)
        except Exception as e:
            reserva.delete()
            cliente.visitas = cliente.visitas - 1
            print(e)
            return JsonResponse({'success': False, 'error':True})
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
        fecha = request.POST["fecha"]
        hora = request.POST["hora"]
        datetime_str = f"{fecha} {hora}"
        cliente = Cliente.objects.get(RUT = request.COOKIES.get("user_id"))
        fecha_reserva = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
        reserva = Reserva.objects.create(
            RUT = cliente,
            espacio = Espacios.objects.get(id = request.POST["lugar"]),
            fecha_reserva = fecha_reserva,
            hora_inicio = request.POST["hora"],
            cantidad_personas = request.POST["cantidad_personas"]
        )
        try:
            assign_tables_to_reservation2(reserva, get_h_mesas(request))
        except Exception as e:
            import traceback
            traceback.print_exc()  # Logs full stack trace
            reserva.delete()
            cliente.save()
            print(e)
            return JsonResponse({'success': False, 'error':True})
        cliente.visitas = cliente.visitas + 1
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

def get_horarios(request):
    if request.method == "POST":
        espacios = Espacios.objects.all()
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
        usuario = request.POST["RUT"]
        password = request.POST["notpassword"]
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
    reservas = Reserva.objects.filter(RUT = RUT, fecha_reserva__gte=now_local)
    if not reservas:
        response = render(request, 'usuario.html', {'reservas': reservas, 'cliente': RUT, 'vacio': True})
    else:
        response = render(request, 'usuario.html', {'reservas': reservas, 'cliente': RUT, 'vacio': False})
    return response

def get_horarios_usuario(request):
    if request.method == "POST":
        fecha_reserva = request.POST["fecha_reserva"]
        naive_datetime = datetime.fromisoformat(fecha_reserva)
        aware_datetime = make_aware(naive_datetime)
        print(aware_datetime)
        
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
            'capacidadMaxima': ele.capacidadMaxima,
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
    necesarias = int(reservation.cantidad_personas)
    mesas = Mesas.objects.filter(cantidadActual__gt=0).order_by('-capacidadMesa')
    asientos_totales_asignados = 0
    for mesa in mesas:
        dummy = mesa.cantidadActual
        personas_restantes = necesarias - asientos_totales_asignados
        if personas_restantes <= 0:
            break
        if personas_restantes > (dummy*mesa.capacidadMesa - asientos_totales_asignados):
            continue
        else:
            dummy = dummy - 1
            
        # Cantidad máxima que se podría usar de este tipo
        cantidad_usar = min(mesa.cantidadActual, (personas_restantes + mesa.capacidadMesa - 1) // mesa.capacidadMesa)

        # Reducir la cantidad si estamos sobrellenando demasiado (ej: 2 mesas de 6 para 8 personas = 12 asientos)
        while cantidad_usar > 0 and (cantidad_usar - 1) * mesa.capacidadMesa >= personas_restantes:
            cantidad_usar -= 1

        if cantidad_usar > 0:
            reservationTable = ReservationTable.objects.create(
                reservacion=reservation,
                mesa=mesa,
                cantidadUsada=cantidad_usar
            )
            asientos_totales_asignados += cantidad_usar * mesa.capacidadMesa

    if asientos_totales_asignados < necesarias:
        raise Exception("No hay suficientes mesas para satisfacer la reservación.")
    
def assign_tables_to_reservation2(reservation, mesat):
    necesarias = int(reservation.cantidad_personas)
    mesas = mesat
    print("aqui mkesas")
    asientos_totales_asignados = 0
    for mesa in mesas:
        print(mesa)
        dummy = mesa["cantidadActual"]
        print("dummy = mesacantidadActual")
        print(mesa["cantidadActual"])
        personas_restantes = necesarias - asientos_totales_asignados
        if personas_restantes <= 0:
            break
        if personas_restantes > (dummy*int(mesa["capacidadMesa"]) - asientos_totales_asignados):
            continue
        else:
            dummy = dummy - 1
            
        # Cantidad máxima que se podría usar de este tipo
        cantidad_usar = min(mesa["cantidadActual"], (personas_restantes + mesa["capacidadMesa"] - 1) // mesa["capacidadMesa"])

        # Reducir la cantidad si estamos sobrellenando demasiado (ej: 2 mesas de 6 para 8 personas = 12 asientos)
        while cantidad_usar > 0 and (cantidad_usar - 1) * mesa["cantidadActual"] >= personas_restantes:
            cantidad_usar -= 1

        if cantidad_usar > 0:
            reservationTable = ReservationTable.objects.create(
                reservacion=reservation,
                mesa=Mesas.objects.get(id = mesa["id"]),
                cantidadUsada=cantidad_usar
            )
            asientos_totales_asignados += cantidad_usar * mesa["capacidadMesa"]

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

def get_mesas(request, id):
    mesas = Mesas.objects.get(id=id)
    data = {
        "id": mesas.id,
        "capacidad_mesa": mesas.capacidadMesa,
        "tamano_mesa": mesas.tamanoMesa,
        "cantidad_mesas": mesas.cantidadMesas,
        "cantidad_actual": mesas.cantidadActual
    }
    return JsonResponse(data)

@csrf_exempt
def edit_mesas(request):
    if request.method == "POST":
        id = request.POST.get("id")
        mesas = Mesas.objects.get(id=id)
        mesas.capacidadMesa = request.POST.get("capacidad_mesa")
        mesas.tamanoMesa =  request.POST.get("tamano_mesa")
        mesas.cantidadMesas = request.POST.get("cantidad_mesas")
        mesas.cantidadActual = request.POST.get("cantidad-actual")
        mesas.save()
        return JsonResponse({"success": True,
                             "id": id,
                             "capacidad_mesa": mesas.capacidadMesa,
                             "tamano_mesa": mesas.tamanoMesa,
                             "cantidad_mesas": mesas.cantidadMesas,
                             "cantidad_actual": mesas.cantidadActual
                             })
    return JsonResponse({"success": False})

def get_h_mesas_admin(request):
    provided_datetime = timezone.now() - timedelta(hours=4)

    start = provided_datetime - timedelta(minutes=30)
    end = provided_datetime + timedelta(minutes=30)

    mesas_data = []
    
    # Loop through all mesas to recalculate availability
    for mesa in Mesas.objects.all():
        # Sum all used quantities for this mesa in overlapping reservations
        overlapping_usage = ReservationTable.objects.filter(
            mesa=mesa,
            reservacion__fecha_reserva__range=(start, end)  # adjust to your Reserva datetime field name
        ).aggregate(total_used=Sum('cantidadUsada'))['total_used'] or 0
        mesa.cantidadActual = int(mesa.cantidadMesas) - overlapping_usage
        print(mesa.cantidadActual)
        mesa.save()

        mesas_data.append({
            'id': mesa.id,
            'capacidad': mesa.capacidadMesa,
            'cantidadMesas': mesa.cantidadMesas,
            'cantidadActual': mesa.cantidadActual,
        })
        print(mesas_data)

    return JsonResponse({'success': True, 'lugares': mesas_data})

def get_h_mesas(request):
    datetime_str = request.POST.get('fecha')  # input name from form
    hora = request.POST["hora"]
    datetime_str = f"{datetime_str} {hora}"
    
    if not datetime_str:
        return JsonResponse({'success': False, 'error': 'Missing datetime'}, status=400)

    try:
        provided_datetime = datetime.fromisoformat(datetime_str)
    except ValueError:
        return JsonResponse({'success': False, 'error': 'Invalid datetime format'}, status=400)

    start = provided_datetime - timedelta(minutes=30)
    end = provided_datetime + timedelta(minutes=30)

    mesas_data = []
    
    # Loop through all mesas to recalculate availability
    for mesa in Mesas.objects.all():
        # Sum all used quantities for this mesa in overlapping reservations
        overlapping_usage = ReservationTable.objects.filter(
            mesa=mesa,
            reservacion__fecha_reserva__range=(start, end)  # adjust to your Reserva datetime field name
        ).aggregate(total_used=Sum('cantidadUsada'))['total_used'] or 0
        
        mesas_data.append({
            'id': mesa.id,
            'capacidadMesa': mesa.capacidadMesa,
            'cantidadMesas': mesa.cantidadMesas,
            'cantidadActual': mesa.cantidadMesas - overlapping_usage,
        })

    return mesas_data

def add_mesas(request):
    if request.method == "POST":
        mesa = Mesas.objects.create(
            capacidadMesa = request.POST["capacidad-mesa"],
            tamanoMesa = request.POST["tamano-mesa"],
            cantidadMesas = request.POST["cantidad-mesas"],
            cantidadActual = request.POST["cantidad-actual"],
        )
        new_row_html = render_to_string("partials/mesas_row.html", {"mesa": mesa})
        return JsonResponse({"success": True, "new_row_html": new_row_html})
    return JsonResponse({"success": False})

@csrf_exempt
def delete_mesas(request, id):
    if request.method == "DELETE":
        try:
            mesa = Mesas.objects.get(id=id)
            mesa.delete()
            return JsonResponse({"success": True})
        except Cliente.DoesNotExist:
            return JsonResponse({"success": False, "error": "Cliente no encontrado"})
    return JsonResponse({"success": False, "error": "Método no permitido"})

def product_list(request):
    offset = int(request.GET.get('offset', 0))
    limit = int(request.GET.get('limit', 10))
    products = Product.objects.all()[offset:offset + limit]

    data = [{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': str(p.price),
        'image_url': p.image
    } for p in products]

    return JsonResponse({'products': data})

def get_productos(request, id):
    producto = Product.objects.get(id=id)
    data = {
        "id": producto.id,
        "name": producto.name,
        "description": producto.description,
        "price": str(producto.price),
        "image": producto.image
    }
    return JsonResponse(data)

def add_productos(request):
    if request.method == 'POST':
        product = Product.objects.create(
            name=request.POST['name'],
            description=request.POST['description'],
            price=request.POST['price'],
            image=request.POST['image']
        )
        new_row_html = render_to_string("partials/producto_row.html", {"producto": product})
        return JsonResponse({"success": True, "new_row_html": new_row_html})
    
@csrf_exempt
def edit_productos(request):
    if request.method == 'POST':
        id = request.POST["id"]
        product = Product.objects.get(id = id)
        product.name = request.POST['name']
        product.description = request.POST['description']
        product.price = request.POST['price']
        product.image = request.POST['image']
        product.save()
        return JsonResponse({"success": True})
    
@csrf_exempt
def delete_productos(request, id):
    if request.method == 'DELETE':
        try:
            product = Product.objects.get(id = id)
            product.delete()
            return JsonResponse({'success': True})
        except Product.DoesNotExist:
            return JsonResponse({"success": False, "error": "Producto no encontrado"})
    return JsonResponse({"success": False, "error": "Método no permitido"})

def get_reporte(request, id):
    reportes = Reportes.objects.get(id = id)
    data = {
        "id": reportes.id,
        "tipo": reportes.tipo,
        "rango_inicio": reportes.rango_inicio,
        "rango_final": reportes.rango_final,
        "clientes": reportes.clientes
    }
    return JsonResponse(data)

def add_reporte(request):
    if request.method == 'POST':
        tipo = request.POST['tipo']
        print(tipo)
        fecha = request.POST['fecha']
        naive = datetime.fromisoformat(fecha)
        fecha = make_aware(naive)
        if tipo == "Mensual":
            anio = fecha.year
            mes = fecha.month
            cuenta = Reserva.objects.filter(
                fecha_reserva__year = anio,
                fecha_reserva__month = mes
            ).count()
            inicio = date(anio, mes, 1)
            dia_final = calendar.monthrange(anio, mes)[1]
            final = date(anio, mes, dia_final)
            print(f"incio: {inicio}")
            print(f"final: {final}")
            print(f"cuenta: {cuenta}")
            reporte = Reportes.objects.create(
                tipo = 'Mensual',
                rango_inicio = inicio,
                rango_final = final,
                clientes = cuenta
            )
        else:
            fecha_solo = fecha.date()
            inicio_semana = fecha_solo - timedelta(days = fecha_solo.weekday())
            fin_semana = inicio_semana + timedelta(days = 6)
            
            inicio_datetime = make_aware(datetime.combine(inicio_semana, time.min))
            fin_datetime = make_aware(datetime.combine(fin_semana, time.max))
            
            cuenta = Reserva.objects.filter(
                fecha_reserva__range=(inicio_datetime, fin_datetime)
            ).count()
            
            reporte = Reportes.objects.create(
                tipo = 'Semanal',
                rango_inicio = inicio_semana,
                rango_final = fin_semana,
                clientes = cuenta
            )
            
        new_row_html = render_to_string("partials/reporte_row.html", {"reporte": reporte})
        return JsonResponse({"success":True, "new_row_html": new_row_html})
    
@csrf_exempt
def delete_reporte(request, id):
    if request.method == 'DELETE':
        try:
            reporte = Reportes.objects.get(id = id)
            reporte.delete()
            return JsonResponse({'success': True})
        except Reportes.DoesNotExist:
            return JsonResponse({"success": False, "error": "Reporte no encontrado"})
    return JsonResponse({"success": False, "error": "Método no permitido"})

@csrf_exempt
def edit_reporte(request):
    if request.method == 'POST':
        id = request.POST["id"]
        reporte = Reportes.objects.get(id = id)
        reporte.tipo = request.POST["tipo"]
        reporte.save()
        fecha = request.POST['fecha']
        naive = datetime.fromisoformat(fecha)
        fecha = make_aware(naive)
        if reporte.tipo == "Mensual":
            anio = fecha.year
            mes = fecha.month
            cuenta = Reserva.objects.filter(
                fecha_reserva__year = anio,
                fecha_reserva__month = mes
            ).count()
            inicio = date(anio, mes, 1)
            dia_final = calendar.monthrange(anio, mes)[1]
            final = date(anio, mes, dia_final)
            print(f"incio: {inicio}")
            print(f"final: {final}")
            print(f"cuenta: {cuenta}")
            reporte.rango_inicio = inicio
            reporte.rango_final = final
            reporte.clientes = cuenta
        else:
            fecha_solo = fecha.date()
            inicio_semana = fecha_solo - timedelta(days = fecha_solo.weekday())
            fin_semana = inicio_semana + timedelta(days = 6)
            
            inicio_datetime = make_aware(datetime.combine(inicio_semana, time.min))
            fin_datetime = make_aware(datetime.combine(fin_semana, time.max))
            
            cuenta = Reserva.objects.filter(
                fecha_reserva__range=(inicio_datetime, fin_datetime)
            ).count()
            
            reporte.rango_inicio = inicio_semana
            reporte.rango_final = fin_semana
            reporte.clientes = cuenta
        reporte.save()
        return JsonResponse({"success": True,
                             "id": id,
                             "tipo": reporte.tipo,
                             "rango_inicio": reporte.rango_inicio,
                             "rango_final": reporte.rango_final,
                             "clientes": reporte.clientes})
    return JsonResponse({"success":False})

def add_empleado(request):
    if request.method == 'POST':
        empleado = Empleado.objects.create(
            nombre=request.POST['nombre'],
            apellido=request.POST['apellido'],
            rut=request.POST['RUT'],
            email=request.POST['email'],
            telefono=request.POST['telefono'],
            rol=request.POST['rol'],
            asistencia=(request.POST['asistencia'] == 'Presente')
        )
        new_row_html = render_to_string("partials/empleado_row.html", {"empleado": empleado})
        return JsonResponse({'success': True, "new_row_html": new_row_html})
    return JsonResponse({'success': False, 'message': 'Método no permitido'})

def get_empleado(request,id):
    empleado = Empleado.objects.get(id=id)
    data = {
        'id': empleado.id,
        'nombre': empleado.nombre,
        'apellido': empleado.apellido,
        'rut': empleado.rut,
        'email': empleado.email,
        'telefono': empleado.telefono,
        'rol': empleado.rol,
        'asistencia': 'Presente' if empleado.asistencia else 'Ausente',
    }
    return JsonResponse(data)

@csrf_exempt
def edit_empleado(request):
    if request.method == 'POST':
        empleado = Empleado.objects.get(id=request.POST['id'])
        empleado.nombre = request.POST['nombre']
        empleado.apellido = request.POST['apellido']
        empleado.rut = request.POST['RUT']
        empleado.email = request.POST['email']
        empleado.telefono = request.POST['telefono']
        empleado.rol = request.POST['rol']
        empleado.asistencia = request.POST['asistencia'] == 'Presente'
        empleado.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'message': 'Método no permitido'})

@csrf_exempt
def delete_empleado(request, id):
    if request.method == 'DELETE':
        try:
            empleado = Empleado.objects.get(id=id)
            empleado.delete()
            return JsonResponse({'success': True})
        except Empleado.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Empleado no encontrado'})
    return JsonResponse({'success': False, 'message': 'Método no permitido'})