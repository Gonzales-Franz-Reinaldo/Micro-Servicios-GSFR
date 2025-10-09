# 📧 Servicio de Notificaciones

Microservicio desacoplado que escucha mensajes de RabbitMQ y envía notificaciones por email cuando se confirma el pago de una compra.

## 🏗️ Arquitectura

- **RabbitMQ**: Cola de mensajes para comunicación asíncrona
- **Nodemailer**: Envío de emails vía SMTP
- **TypeScript**: Tipado estático y mejor mantenibilidad
- **Axios**: Cliente HTTP para obtener datos de otros servicios

## 📋 Requisitos Previos

- Node.js >= 16
- RabbitMQ (Docker)
- Cuenta de Gmail con contraseña de aplicación

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

Copia `.env` y configura las variables:

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
```

## 🏃 Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📨 Formato del Mensaje

```json
{
  "compraId": 1,
  "usuarioId": "67061d8e9c5f2a001c8b4567",
  "eventoId": 1,
  "cantidad": 2,
  "total": 301.00,
  "metodoPago": "tarjeta",
  "fechaPago": "2025-10-09T12:00:00Z"
}
```

## 🧪 Pruebas

Ver sección de pruebas end-to-end en el README principal.