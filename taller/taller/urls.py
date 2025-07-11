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
from django.urls import path, include
from pagina import views

urlpatterns = [
    path('DJANGOADMIN/', admin.site.urls),
    path('', views.index, name='index'),
    path('admin', views.admin, name='admin'),
    path('admin/', views.admin, name='admin'),
    path('front/', views.front, name='front'),
    path('reservaciones/', views.hacer_reserva, name='reservaciones'),
    
    path('get_cliente/<str:RUT>/', views.get_cliente, name='get_cliente'),
    path('edit_cliente/', views.edit_cliente, name='edit_cliente'),
    path('delete_cliente/<str:RUT>/', views.delete_cliente, name='delete_cliente'),
    path('add_cliente/', views.add_cliente, name='add_cliente'),
    
    path('get_reserva/<int:id>/', views.get_reserva, name='get_reserva'),
    path('edit_reserva/', views.edit_reserva, name='edit_reserva'),
    path('delete_reserva/<int:id>/', views.delete_reserva, name='delete_reserva'),
    path('add_reserva/', views.add_reserva, name='add_reserva'),
    
    path('get_lugar/<int:id>/', views.get_lugar, name='get_lugar'),
    path('edit_lugar/', views.edit_lugar, name='edit_lugar'),
    path('delete_lugar/<int:id>/', views.delete_lugar, name='delete_lugar'),
    path('add_lugar/', views.add_lugar, name='add_lugar'),
    
    path('get_lugares/', views.get_all_lugares, name='get_all_lugares'),
    path('leer_admin/', views.leer_admin, name='leer_admin'),
    
    path('add_reserva_cliente/', views.add_reserva_cliente, name='add_reserva_cliente'),
    path('add_cliente_registro/', views.add_cliente_registro, name='add_cliente_registro'),
    path('login_cliente/', views.login_cliente, name='login_cliente'),
    
    path('get_horarios/',views.get_horarios, name='get_horarios'),
    path('registro/', views.registro, name='registro'),
    path("validacion_cliente/", views.validacion_cliente, name="validacion_cliente"),
    
    path('usuario/', views.usuario, name='usuario'),
    path('edit_usuario/', views.edit_usuario, name='edit_usuario'),
    path("get_horarios_usuario/", views.get_horarios_usuario, name='get_horarios_usuario'),
    
    path('get_mesas/<int:id>/', views.get_mesas, name='get_mesas'),
    path('edit_mesas/', views.edit_mesas, name='edit_mesas'),
    path("get_h_mesas_admin/", views.get_h_mesas_admin, name='get_h_mesas_admin'),
    path("get_h_mesas/", views.get_h_mesas, name='get_h_mesas'),
    path("add_mesas/", views.add_mesas, name="add_mesas"),
    path("delete_mesas/<int:id>/", views.delete_mesas, name="delete_mesas"),
    
    path('products/', views.product_list, name='product_list'),
    path('get_productos/<int:id>/', views.get_productos, name='get_productos'),
    path('add_productos/', views.add_productos, name='add_productos'),
    path('edit_productos/', views.edit_productos, name='edit_productos'),
    path('delete_productos/<int:id>/', views.delete_productos, name='delete_productos'),
    
    path("add_reporte/", views.add_reporte, name="add_reporte"),
    path("delete_reporte/<int:id>/", views.delete_reporte, name="delete_reporte"),
    path("edit_reporte/", views.edit_reporte, name="edit_reporte"),
    path("get_reporte/<int:id>/", views.get_reporte, name="get_reporte"),
    
    path('add_empleado/', views.add_empleado, name='add_empleado'),
    path('get_empleado/<int:id>/', views.get_empleado, name='get_empleado'),
    path('edit_empleado/', views.edit_empleado, name='edit_empleado'),
    path('delete_empleado/<int:id>/', views.delete_empleado, name='delete_empleado'),

    path('accounts/register/', views.registro, name='register'),

    # --- Rutas para los comentarios ---
    path('comentarios/nuevo/', views.crear_comentario, name='crear_comentario'),
    path('comentarios/', views.listar_comentarios, name='listar_comentarios'),
    path('comentario/<int:comentario_id>/editar/', views.editar_comentario, name='editar_comentario'),
    path('comentario/<int:comentario_id>/eliminar/', views.eliminar_comentario, name='eliminar_comentario'),

    # --- AÑADIDO: Rutas de autenticación de Django ---
    # Esto incluye paths como /accounts/login/, /accounts/logout/, /accounts/password_change/, etc.
    path('accounts/', include('django.contrib.auth.urls')),
    
    path('promociones/add_edit/', views.add_edit_promocion, name='add_promocion'),
    path('get_promocion/<int:id>/', views.get_promocion, name='get_promocion'),
    path('delete_promocion/<int:id>/', views.delete_promocion, name='delete_promocion'),
    path('promociones/list/', views.get_promociones_list, name='get_promociones_list'),

]
