1.- Crear un ambiente virtual de python usando powershell: python -m venv env
2.- Iniciar el ambiente virtual con powershell: ./env/Scripts/activate
*probablemente pida cambiar una config*
3.- Instalar Django en el ambiente virtual: pip install Django
*Si da error, ir a las variables de entornce y en variables de sistema borrar los que diga posgreSQL*

Con eso deberia funcionar, para iniciarlo hacen el proyecto 
1.- ./env/Scripts/activate
2.- cd taller
3.- python.exe manage.py runserver

Las paginas deberian cargar en localhost:8000
