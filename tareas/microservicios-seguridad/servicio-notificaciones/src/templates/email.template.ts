import { DatosNotificacion } from '../models/notificacion.model';


export function generarEmailConfirmacion(datos: DatosNotificacion): string {
    const { usuario, evento, compra } = datos;
    
    const fechaEvento = new Date(evento.fecha).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'America/La_Paz'
    });
    
    const fechaPago = new Date(compra.fechaPago).toLocaleString('es-ES', {
        dateStyle: 'long',
        timeStyle: 'medium',
        timeZone: 'America/La_Paz'
    });

    return `
╔═══════════════════════════════════════════════════════════════╗
║                                                                                        ║
║       CONFIRMACIÓN DE PAGO - COMPRA #${String(compra.id).padStart(6, '0')}          ║
║                                                                                        ║
╚═══════════════════════════════════════════════════════════════╝

Estimado/a ${usuario.name},

¡Su pago ha sido procesado exitosamente!

═══════════════════════════════════════════════════════════════

DETALLES DE LA COMPRA:
═══════════════════════════════════════════════════════════════

Evento: ${evento.nombre}
Fecha: ${fechaEvento}
Lugar: ${evento.lugar}
Cantidad de entradas: ${compra.cantidad}
Precio unitario: $${evento.precio.toFixed(2)}
Método de pago: ${compra.metodoPago.toUpperCase()}

═══════════════════════════════════════════════════════════════

RESUMEN DE PAGO:
═══════════════════════════════════════════════════════════════

Subtotal (${compra.cantidad} x $${evento.precio.toFixed(2)}): $${compra.total.toFixed(2)}
───────────────────────────────────────────────────────────────
TOTAL PAGADO:              $${compra.total.toFixed(2)}

═══════════════════════════════════════════════════════════════

 INFORMACIÓN DE LA TRANSACCIÓN:
═══════════════════════════════════════════════════════════════

• ID de Compra: #${String(compra.id).padStart(6, '0')}
• Fecha de Pago: ${fechaPago}
• Usuario: ${usuario.email}
• Estado: PAGADO ✓

═══════════════════════════════════════════════════════════════

 ¡Gracias por tu compra!

Si tienes alguna pregunta, por favor contacta con soporte.

───────────────────────────────────────────────────────────────
Sistema de Venta de Entradas © 2025

    `.trim();
}