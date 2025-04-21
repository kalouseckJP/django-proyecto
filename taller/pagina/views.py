from django.shortcuts import render
from datetime import datetime, date
from .models import Espacios, Reserva, Cliente

# Create your views here.
def index(request):
    return render(request, 'index.html')

def admin(request):
    reservas = Reserva.objects.all()
    clientes = Cliente.objects.all()
    return render(request, 'admin.html', {'reservas': reservas, 'clientes': clientes})

def front(request):
    return render(request, 'front.html')

def hacer_reserva(request):
    today = date.today().isoformat() # AAAA-MM-DD
    now = datetime.now().strftime('%H:%M') # HH:MM
    lugares = Espacios.objects.all()
    return render(request, 'reservaciones.html', {'today': today, 'now': now, 'lugares': lugares})