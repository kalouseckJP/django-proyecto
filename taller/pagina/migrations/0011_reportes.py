# Generated by Django 5.2 on 2025-06-21 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pagina', '0010_product'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reportes',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('tipo', models.BooleanField()),
                ('rango_inicio', models.DateField()),
                ('rango_final', models.DateField()),
                ('clientes', models.PositiveIntegerField()),
            ],
        ),
    ]
