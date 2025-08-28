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