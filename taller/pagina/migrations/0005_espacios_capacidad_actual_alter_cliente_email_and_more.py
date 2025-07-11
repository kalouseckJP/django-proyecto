# Generated by Django 5.2 on 2025-05-24 00:21

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pagina', '0004_rename_cliente_reserva_rut_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='espacios',
            name='capacidad_actual',
            field=models.IntegerField(blank=True, default=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='cliente',
            name='email',
            field=models.EmailField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='cantidad_personas',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='fecha_reserva',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='hora_inicio',
            field=models.TimeField(default=django.utils.timezone.now),
        ),
    ]
