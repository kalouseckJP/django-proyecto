from django.shortcuts import render
from datetime import datetime, date
from .models import Espacios, Reserva, Cliente
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.db.models import Sum
from django.utils.timezone import now, timedelta, make_aware, make_naive

# Create your views here.
def index(request):
    return render(request, 'index.html')

def admin(request):
    reservas = Reserva.objects.all()
    clientes = Cliente.objects.all()
    lugares = Espacios.objects.all()
    
    today = date.today().isoformat() # AAAA-MM-DD
    tiemponow = datetime.now().strftime("%d/%m/%Y, %H:%M:%S") 
    
    # Crear una lista de lugares con capacidad dinámica
    lugares_con_capacidad = []
    tiempo_actual = now()
    rango_inicio = tiempo_actual - timedelta(minutes=60)
    rango_fin = tiempo_actual + timedelta(minutes=30)
    print(tiempo_actual, ' ' ,type(rango_inicio), ' ' ,type(rango_fin))

    for lugar in lugares:
        # Sumar la cantidad de personas en reservas dentro del rango de tiempo
        reservas_en_rango = reservas.filter(
            espacio=lugar,
        ).aggregate(total_personas=Sum('cantidad_personas'))['total_personas'] or 0
        # Calcular capacidad actual
        capacidad_actual = lugar.capacidadMaxima - reservas_en_rango
        
        # Añadir el lugar con su capacidad actual a la lista
        lugares_con_capacidad.append({
            'id': lugar.id,
            'nombre': lugar.nombre,
            'capacidadMaxima': lugar.capacidadMaxima,
            'descripcion': lugar.descripcion,
            'capacidad_actual': capacidad_actual,
        })

    return render(request, 'admin.html', {
        'reservas': reservas,
        'clientes': clientes,
        'lugares': lugares_con_capacidad,  # Usar la lista con capacidad dinámica
        'tiempo': tiemponow,
        'today': today,
    })

def front(request):
    return render(request, 'front.html')

def hacer_reserva(request):
    today = date.today().isoformat() # AAAA-MM-DD
    now = datetime.now().strftime('%H:%M') # HH:MM
    lugares = Espacios.objects.all()
    reservas = Reserva.objects.all()
    for lugar in lugares:
        # Sumar la cantidad de personas en reservas dentro del rango de tiempo
        reservas_en_rango = reservas.filter(
            espacio=lugar,
        ).aggregate(total_personas=Sum('cantidad_personas'))['total_personas'] or 0
        # Calcular capacidad actual
        capacidad_actual = lugar.capacidadMaxima - reservas_en_rango
        
    return render(request, 'reservaciones.html', {'today': today, 'now': now, 'lugares': lugares, 'capacidad_actual': capacidad_actual})

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
        cliente = Cliente.objects.get(RUT=rut)
        cliente.nombre = request.POST.get("nombre")
        cliente.apellido = request.POST.get("apellido")
        cliente.telefono = request.POST.get("telefono")
        cliente.email = request.POST.get("email")
        cliente.visitas = request.POST.get("visitas")
        cliente.save()
        return JsonResponse({"success": True, "RUT": cliente.RUT, "nombre": cliente.nombre, "apellido": cliente.apellido, "telefono": cliente.telefono, "email": cliente.email, "visitas": cliente.visitas})
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
        
        fecha_reserva = request.POST["fecha_reserva"]
        naive_datetime = datetime.fromisoformat(fecha_reserva)
        aware_datetime = make_aware(naive_datetime)
        lugar = Espacios.objects.get(id=request.POST["espacio"])
        
        id = request.POST.get("id")
        reserva = Reserva.objects.get(id=id)
        reserva.fecha_reserva = aware_datetime
        reserva.hora_inicio = aware_datetime.time()
        reserva.cantidad_personas = request.POST.get("cantidad_personas")
        reserva.espacio = lugar
        reserva.save()
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
        # Create a new Reserva object
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
        new_row_html = render_to_string("partials/reserva_row.html", {"reserva": reserva})
        return JsonResponse({"success": True, "new_row_html": new_row_html})
    return JsonResponse({"success": False})

def add_cliente(request):
    if request.method == "POST":
        # Create a new Reserva object
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
        # Create a new Reserva object
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