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
    contrasena = models.CharField(default="123abc", blank=False)

    def __str__(self):
        return self.nombre

class Espacios(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    capacidadMaxima = models.IntegerField()
    capacidad_actual = models.IntegerField(blank=True)

    def save(self, *args, **kwargs):
        if not self.capacidad_actual:
            self.capacidad_actual = self.capacidadMaxima
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

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
    cantidadActual = models.IntegerField()

    def __str__(self):
        return f"Mesa {self.id} - Capacidad: {self.capacidadMesa} - Tamaño: {self.tamanoMesa}"
    
class Reserva(models.Model):
    id = models.AutoField(primary_key=True)
    RUT = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    espacio = models.ForeignKey(Espacios, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(default=timezone.now)
    hora_inicio = models.TimeField(default=timezone.now)
    cantidad_personas = models.IntegerField(default=1)
    mesas =  models.ManyToManyField(Mesas, through='ReservationTable')

    def __str__(self):
        return f"Reserva {self.id} - RUT:{self.RUT.RUT} - {self.espacio.nombre} - Cantidad: {self.cantidad_personas}"


class ReservationTable(models.Model):
    reservacion = models.ForeignKey(Reserva, on_delete=models.CASCADE)
    mesa = models.ForeignKey(Mesas, on_delete=models.CASCADE)
    cantidadUsada = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.cantidadUsada} x {self.mesa} for {self.reservacion}"
    
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField()
    def __str__(self):
        return f"{self.name} - Valor: {self.price}"
    
class Reportes(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField()
    rango_inicio = models.DateField()
    rango_final = models.DateField()
    clientes = models.PositiveIntegerField()
    def __str__(self):
        return f"{self.id} - {self.rango_inicio} - {self.rango_final} - Cliente: {self.clientes}"
    
class Empleado(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, unique=True)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15)
    rol = models.CharField(max_length=50)
    
    # Asistencia: True = Presente, False = Ausente
    asistencia = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"