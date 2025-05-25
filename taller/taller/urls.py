"""
URL configuration for taller project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pagina import views

urlpatterns = [
    path('DJANGOADMIN/', admin.site.urls),
    path('', views.index, name='index'),
    path('admin', views.admin, name='admin'),
    path('admin/', views.admin, name='admin'),
    path('front', views.front, name='front'),
    path('reservaciones', views.hacer_reserva, name='reservaciones'),
    path('get_cliente/<str:RUT>/', views.get_cliente, name='get_cliente'),
    path('edit_cliente/', views.edit_cliente, name='edit_cliente'),
    path('get_reserva/<int:id>/', views.get_reserva, name='get_reserva'),
    path('edit_reserva/', views.edit_reserva, name='edit_reserva'),
    path('get_lugar/<int:id>/', views.get_lugar, name='get_lugar'),
    path('edit_lugar/', views.edit_lugar, name='edit_lugar'),
    path('delete_reserva/<int:id>/', views.delete_reserva, name='delete_reserva'),
    path('delete_cliente/<str:RUT>/', views.delete_cliente, name='delete_cliente'),
    path('delete_lugar/<int:id>/', views.delete_lugar, name='delete_lugar'),
    path('add_reserva/', views.add_reserva, name='add_reserva'),
    path('add_cliente/', views.add_cliente, name='add_cliente'),
    path('add_lugar/', views.add_lugar, name='add_lugar'),
    path('get_lugares/', views.get_all_lugares, name='get_all_lugares'),
    path('leer_admin/', views.leer_admin, name='leer_admin'),
    path('add_reserva_cliente/', views.add_reserva_cliente, name='add_reserva_cliente'),
    path('get_horarios/',views.get_horarios, name='get_horarios'),
]
