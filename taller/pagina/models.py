from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator # Añadido para validación de calificación

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
    price = models.PositiveIntegerField()
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
    
class Comentario(models.Model):
    id = models.AutoField(primary_key=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='comentarios')
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE, related_name='comentarios', null=True, blank=True)
    
    # Campo corregido de 'texto_comentario' a 'contenido' para que coincida con el formulario
    contenido = models.TextField() 
    
    calificacion = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)], # Las opciones del 1 al 5
        null=True, 
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)] # Añadido validadores para asegurar el rango
    ) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Añadido para ordenar los comentarios por fecha de creación descendente (más recientes primero)
        ordering = ['-fecha_creacion'] 

    def __str__(self):
        return f"Comentario de {self.cliente.nombre} sobre {self.reserva.id if self.reserva else 'general'}"
    
    
class Promocion(models.Model):
    # Opciones para el tipo de descuento
    TIPO_DESCUENTO_CHOICES = [
        ('porcentaje', 'Porcentaje'),
        ('monto_fijo', 'Monto Fijo'),
    ]

    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    
    tipo_descuento = models.CharField(
        max_length=20,
        choices=TIPO_DESCUENTO_CHOICES,
        default='porcentaje'
    )
    valor_descuento = models.IntegerField(
        max_length=2
    )
    
    # ForeignKey al modelo Product
    producto = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE, # Si el producto se elimina, la promoción también
        related_name='promociones' # Permite acceder a promociones desde un producto
    )
    
    fecha_inicio = models.DateTimeField(default=timezone.now)
    fecha_fin = models.DateTimeField()
    
    # Días de la semana como una cadena de texto (ej. "Lunes,Miércoles,Viernes")
    dias_semana_aplicables = models.CharField(max_length=100, blank=True, default="")
    
    esta_activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.valor_descuento}{'%' if self.tipo_descuento == 'porcentaje' else '$'}) en {self.producto.name}"