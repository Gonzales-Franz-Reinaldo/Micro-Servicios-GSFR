# CRUD de Usuarios - Node.js + Express + MySQL + Docker

Una aplicación web completa para gestión de usuarios desarrollada con Node.js, Express, EJS, MySQL y Docker. Incluye operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) con una interfaz moderna usando Tailwind CSS.

## 🚀 Características

- ✅ **CRUD completo**: Crear, listar, ver, editar y eliminar usuarios
- 🎨 **Interfaz moderna**: Diseño responsivo con Tailwind CSS
- 🐳 **Dockerizado**: Configuración completa con Docker Compose
- 📱 **Responsive**: Adaptado para dispositivos móviles y desktop
- 🛡️ **Validación**: Validación tanto en frontend como backend
- 🔄 **Tiempo real**: Validación de formularios en tiempo real
- 📧 **Email único**: Verificación de emails duplicados
- 🎭 **Layouts**: Sistema de plantillas con EJS layouts
- 🚦 **Manejo de errores**: Gestión completa de errores y estados

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **MySQL2** - Cliente MySQL para Node.js
- **EJS** - Motor de plantillas
- **Express Validator** - Validación de datos
- **Method Override** - Soporte para métodos HTTP PUT/DELETE

### Frontend
- **EJS** - Sistema de plantillas
- **Tailwind CSS** - Framework CSS utilitario
- **Font Awesome** - Iconos
- **JavaScript vanilla** - Interactividad del frontend

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de contenedores
- **MySQL 8.0** - Base de datos

## 📁 Estructura del Proyecto

```
user-crud-app/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de la base de datos
│   ├── controllers/
│   │   └── userController.js    # Controlador de usuarios
│   ├── models/
│   │   └── User.js              # Modelo de usuario
│   ├── routes/
│   │   └── userRoutes.js        # Rutas de usuarios
│   └── app.js                   # Aplicación principal
├── views/
│   ├── layouts/
│   │   └── main.ejs             # Layout principal
│   ├── users/
│   │   ├── index.ejs            # Lista de usuarios
│   │   ├── create.ejs           # Crear usuario
│   │   ├── edit.ejs             # Editar usuario
│   │   └── show.ejs             # Ver usuario
│   ├── partials/
│   │   ├── header.ejs           # Header de la aplicación
│   │   └── footer.ejs           # Footer de la aplicación
│   └── error.ejs                # Página de error
├── public/
│   ├── css/
│   │   └── style.css            # Estilos personalizados
│   └── js/
│       └── main.js              # JavaScript del frontend
├── docker-compose.yml           # Configuración de Docker Compose
├── Dockerfile                   # Configuración de Docker
├── init.sql                     # Script inicial de la base de datos
├── package.json                 # Dependencias de Node.js
├── .env.example                 # Variables de entorno de ejemplo
├── .gitignore                   # Archivos ignorados por Git
└── README.md                    # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd user-crud-app
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación**
   - Aplicación: http://localhost:3000
   - MySQL: localhost:3306

### Opción 2: Instalación Local

1. **Prerequisitos**
   - Node.js (v16 o superior)
   - MySQL (v8.0 o superior)
   - npm o yarn

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar MySQL**
   - Crear base de datos `user_crud_db`
   - Ejecutar el script `init.sql`

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones locales
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

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

```

## 📊 Base de Datos

### Tabla `users`

| Campo      | Tipo         | Descripción                    |
|------------|--------------|--------------------------------|
| id         | INT          | ID único (Primary Key)         |
| name       | VARCHAR(100) | Nombre completo del usuario    |
| email      | VARCHAR(100) | Correo electrónico (único)     |
| created_at | TIMESTAMP    | Fecha de creación              |
| updated_at | TIMESTAMP    | Fecha de última actualización  |



## 📱 API Endpoints

| Método | Endpoint           | Descripción              |
|--------|-------------------|--------------------------|
| GET    | /users            | Listar todos los usuarios|
| GET    | /users/create     | Formulario crear usuario |
| POST   | /users            | Crear nuevo usuario      |
| GET    | /users/:id        | Ver usuario específico   |
| GET    | /users/:id/edit   | Formulario editar usuario|
| PUT    | /users/:id        | Actualizar usuario       |
| DELETE | /users/:id        | Eliminar usuario         |


## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=user_crud_db
DB_PORT=3306

# Aplicación
NODE_ENV=development
PORT=3000
```

### Configuración de Producción

1. **Variables de entorno**
   ```bash
   NODE_ENV=production
   # Configurar SSL para MySQL si es necesario
   ```

2. **Optimizaciones**
   - Minificar CSS/JS
   - Configurar proxy reverso (Nginx)
   - SSL/TLS para HTTPS
   - Logs de producción

## 🚀 Despliegue

### Docker Compose (Producción)
```yaml
# Añadir healthchecks, restart policies, volumes nombrados
# Configurar redes personalizadas
# Variables de entorno seguras
```





## 📝 Scripts de Desarrollo

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "db:reset": "docker-compose exec mysql mysql -u root -p < init.sql"
  }
}
```

## 🐛 Resolución de Problemas

### Error de Conexión MySQL
```bash
# Verificar que MySQL esté corriendo
docker-compose ps

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar servicios
docker-compose restart
```

### Error de Puertos
```bash
# Verificar puertos en uso
lsof -i :3000
lsof -i :3306
