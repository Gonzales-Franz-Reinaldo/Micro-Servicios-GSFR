// src/routes/facturaRoutes.js
const express = require("express");
const {
    obtenerFacturas,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura,
} = require("../controllers/facturaController");
const {
    obtenerDetallesPorFactura,
    crearDetalleFactura,
} = require("../controllers/detalleFacturaController");
const { validateSchema, facturaSchema, detalleFacturaSchema } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Facturas
 *   description: Gestión de facturas
 */

/**
 * @swagger
 * /api/v1/facturas:
 *   get:
 *     summary: Obtener lista de facturas
 *     description: Retorna una lista paginada de facturas con filtros
 *     tags: [Facturas]
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
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicio para filtrar
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin para filtrar
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *         description: Filtrar por cliente
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida correctamente
 */
router.get("/", obtenerFacturas);

/**
 * @swagger
 * /api/v1/facturas/{id}:
 *   get:
 *     summary: Obtener factura por ID
 *     description: Retorna una factura específica con sus detalles
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *       404:
 *         description: Factura no encontrada
 */
router.get("/:id", obtenerFacturaPorId);

/**
 * @swagger
 * /api/v1/facturas:
 *   post:
 *     summary: Crear una nueva factura
 *     description: Crea una nueva factura asociada a un cliente
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha
 *               - cliente_id
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-15"
 *               cliente_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.post("/", validateSchema(facturaSchema), crearFactura);

/**
 * @swagger
 * /api/v1/facturas/{id}:
 *   put:
 *     summary: Actualizar una factura
 *     description: Actualiza los datos de una factura existente
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente
 *       404:
 *         description: Factura no encontrada
 */
router.put("/:id", validateSchema(facturaSchema), actualizarFactura);

/**
 * @swagger
 * /api/v1/facturas/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     description: Elimina una factura y todos sus detalles
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada exitosamente
 *       404:
 *         description: Factura no encontrada
 */
router.delete("/:id", eliminarFactura);

/**
 * @swagger
 * /api/v1/facturas/{id}/detalles:
 *   get:
 *     summary: Obtener detalles de una factura
 *     description: Retorna todos los detalles de una factura específica
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Detalles de la factura obtenidos
 *       404:
 *         description: Factura no encontrada
 */
router.get("/:facturaId/detalles", obtenerDetallesPorFactura);

/**
 * @swagger
 * /api/v1/facturas/{id}/detalles:
 *   post:
 *     summary: Agregar detalle a una factura
 *     description: Añade un nuevo detalle (producto) a una factura existente
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *               - precio_unitario
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *               precio_unitario:
 *                 type: number
 *                 example: 1299.99
 *     responses:
 *       201:
 *         description: Detalle agregado exitosamente
 *       400:
 *         description: Stock insuficiente
 *       404:
 *         description: Factura o producto no encontrado
 */
router.post("/:facturaId/detalles", validateSchema(detalleFacturaSchema), crearDetalleFactura);

module.exports = router;