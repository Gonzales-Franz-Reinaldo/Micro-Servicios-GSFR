# Gestor de Tareas

Una aplicación web simple para gestionar tareas, construida con Node.js, Express, MongoDB, y EJS. Utiliza Tailwind CSS para los estilos y está dockerizada con Docker Compose.

## Requisitos
- Docker
- Docker Compose
- Node.js (opcional, si no usas Docker)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd task-manager


Crea un archivo .env con el siguiente contenido:

MONGO_URI=mongodb://mongo:27017/task-manager
PORT=3000



Construye y ejecuta con Docker Compose:

docker-compose up --build



Accede a la aplicación en http://localhost:3000.

Uso





Listar tareas: Visita /tareas para ver todas las tareas.



Crear tarea: Ve a /tareas/nueva para agregar una nueva tarea.



Editar tarea: Usa /tareas/:id/editar para modificar una tarea existente.



Eliminar tarea: Elimina una tarea desde su página de detalles o la lista.

Estructura del Proyecto

task-manager/
├── src/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── tasks.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── tasks/
│   │   ├── index.ejs
│   │   ├── create.ejs
│   │   ├── edit.ejs
│   │   └── show.ejs
│   └── partials/
│       ├── navbar.ejs
│       └── footer.ejs
├── public/
├── .env
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md

Notas





Usa Tailwind CSS desde su CDN para mantener el proyecto simple.



La aplicación usa method-override para soportar métodos PUT y DELETE en formularios.



MongoDB se ejecuta en un contenedor separado y persiste datos en un volumen.


## 🐳 Comandos Docker

```bash
# Construir e iniciar contenedores
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down

# Reiniciar servicios
docker-compose restart

# Acceder al contenedor de la aplicación
docker-compose exec app sh

# Acceder a MySQL
docker-compose exec mysql mysql -u root -p

3. Ejecutar comandos SQL desde archivos
Puedes copiar archivos .sql al contenedor y ejecutarlos usando:
- docker cp script.sql db:/script.sql
- docker-compose exec db mysql -u gonzales -p db_usuarios < /script.sql

1. Accede al contenedor MySQL
- docker-compose exec db bash

2. Entra al cliente MySQL dentro del contenedor
- mysql -u gonzales -p db_usuarios


1. Verifica que tienes registros en la base de datos
Haz una consulta desde la app o entra al contenedor MySQL y ejecuta:
- docker-compose exec db mysql -u gonzales -p db_usuarios

2. Detén y elimina los contenedores (pero NO el volumen)
- docker-compose down

3. Vuelve a levantar los servicios
- docker-compose up


5. Prueba eliminar el volumen (los datos se pierden)
Si quieres probar que los datos se eliminan al borrar el volumen:
- docker-compose down -v

Esto elimina los contenedores y el volumen db_data.

Luego, levanta los servicios de nuevo:
- docker-compose up


1. Realiza cambios en tu código fuente
Edita cualquier archivo de tu app (por ejemplo, una vista, controlador, etc.).
- docker-compose build app

3. Reinicia los servicios
- docker-compose up -d