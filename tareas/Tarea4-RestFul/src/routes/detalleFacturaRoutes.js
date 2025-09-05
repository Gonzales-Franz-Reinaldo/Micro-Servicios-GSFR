const express = require("express");
const {
    actualizarDetalleFactura,
    eliminarDetalleFactura,
    obtenerDetalleFacturaPorId,
    obtenerTodosLosDetallesFactura
} = require("../controllers/detalleFacturaController");
const { validateSchema, detalleFacturaSchema } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Detalles de Factura
 *   description: Gestión de detalles de facturas
 */

/**
 * @swagger
 * /api/v1/detalles:
 *   get:
 *     summary: Obtener todos los detalles de factura
 *     description: Retorna una lista paginada de todos los detalles de factura
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista de detalles obtenida correctamente
 */
router.get("/", obtenerTodosLosDetallesFactura);

/**
 * @swagger
 * /api/v1/detalles/{id}:
 *   get:
 *     summary: Obtener detalle de factura por ID
 *     description: Retorna un detalle de factura específico
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *       404:
 *         description: Detalle no encontrado
 */
router.get("/:id", obtenerDetalleFacturaPorId);

/**
 * @swagger
 * /api/v1/detalles/{id}:
 *   put:
 *     summary: Actualizar un detalle de factura
 *     description: Actualiza cantidad o precio unitario de un detalle
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 example: 3
 *               precio_unitario:
 *                 type: number
 *                 example: 1199.99
 *     responses:
 *       200:
 *         description: Detalle actualizado exitosamente
 *       400:
 *         description: Stock insuficiente
 *       404:
 *         description: Detalle no encontrado
 */
router.put("/:id", actualizarDetalleFactura);

/**
 * @swagger
 * /api/v1/detalles/{id}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     description: Elimina un detalle de una factura y restaura el stock
 *     tags: [Detalles de Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle
 *     responses:
 *       200:
 *         description: Detalle eliminado exitosamente
 *       404:
 *         description: Detalle no encontrado
 */
router.delete("/:id", eliminarDetalleFactura);

module.exports = router;