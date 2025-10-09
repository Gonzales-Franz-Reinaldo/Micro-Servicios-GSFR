# Servicio de Usuarios

Microservicio para autenticación JWT.

## Instalación
1. npm install
2. Crea .env con DB_URI y JWT_SECRET
3. npm run dev

## Endpoints
- POST /api/v1/auth/register {name, email, password, role?}
- POST /api/v1/auth/login {email, password}
- GET /api/v1/users/me (con Bearer token)
- GET /api/v1/users (admin)
- PUT /api/v1/users/:id
- DELETE /api/v1/users/:id

Prueba con Postman.


### ADMINASTRADORES
- Se pueden autenticar
- Los admins pueden crear, actualizar y eliminar eventos
- Y gestion de usuarios

### USUARIOS
- Los Usuarios pueden registrarse
- Los usuarios pueden autenticarse para consumir los servicios
- Los usuarios auntenticados pueden consultar los eventos disponibles
- Los usuarios pueden realizar la Compra de entradas
- Al comprar, se debe registrar el evento, la cantidad de entradas y el usuario que realiza la operación.
- El usuario podrá realizar el pago de la compra específica y marcarle como pagado
- Despues de confirmar el pago le debe llegar la notificación al correo del usuario