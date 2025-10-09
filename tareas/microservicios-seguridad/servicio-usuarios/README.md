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