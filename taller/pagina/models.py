from django.db import models
from django.utils import timezone

# Create your models here.

class Ad(models.Model):
    nombre = models.CharField(max_length=100)
    contrasena = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Cliente(models.Model):
    RUT = models.CharField(max_length=100, primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,default="")
    visitas = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre

class Espacios(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    capacidadMaxima = models.IntegerField()

    def __str__(self):
        return self.nombre

class Reserva(models.Model):
    id = models.AutoField(primary_key=True)
    RUT = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    espacio = models.ForeignKey(Espacios, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(default=timezone.now)
    hora_inicio = models.TimeField(default=timezone.now)
    cantidad_personas = models.IntegerField(default=1)

    def __str__(self):
        return f"Reserva {self.id} - RUT:{self.RUT.RUT} - {self.espacio.nombre} - Cantidad: {self.cantidad_personas}"

class Inventario(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.nombre} - {self.espacio.nombre}"

class Mesas(models.Model):
    id = models.AutoField(primary_key=True)
    capacidadMesa = models.IntegerField()
    tamanoMesa = models.IntegerField()
    cantidadMesas = models.IntegerField()

    def __str__(self):
        return f"Mesa {self.id} - Capacidad: {self.capacidadMesa} - Tamaño: {self.tamanoMesa}"