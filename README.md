1.- Crear un ambiente virtual de python usando powershell: `python -m venv env `  
2.- Iniciar el ambiente virtual con powershell: `./env/Scripts/activate`  

***probablemente pida cambiar una configuración***  

3.- Instalar Django en el ambiente virtual: `pip install Django`  
4.- Instalar jwt en el ambiente virtual: `pip install jwt`  
*Si da error, ir a las variables de entornce y en variables de sistema borrar los que diga posgreSQL*  

Con eso deberia funcionar, para iniciarlo hacen el proyecto  

```
./env/Scripts/activate  
cd taller
python.exe manage.py runserver
```

Las paginas deberian cargar en localhost:8000

Las credenciales son:  
Usuario: admin  
Contraseña: 1234  
