
const express = require("express");
const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
} = require("../controllers/clienteController");
const { obtenerFacturasPorCliente } = require("../controllers/facturaController");
const { validateSchema, clienteSchema } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */

/**
 * @swagger
 * /api/v1/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Crea un nuevo cliente en el sistema
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ci
 *               - nombres
 *               - apellidos
 *               - sexo
 *             properties:
 *               ci:
 *                 type: string
 *                 example: "1234567890"
 *                 description: Cédula de identidad
 *               nombres:
 *                 type: string
 *                 example: "Juan Carlos"
 *                 description: Nombres del cliente
 *               apellidos:
 *                 type: string
 *                 example: "Pérez González"
 *                 description: Apellidos del cliente
 *               sexo:
 *                 type: string
 *                 enum: [M, F]
 *                 example: "M"
 *                 description: Sexo del cliente
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cliente creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe un cliente con ese CI
 */
router.post("/", validateSchema(clienteSchema), crearCliente);

/**
 * @swagger
 * /api/v1/clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     description: Actualiza los datos de un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: Ya existe un cliente with ese CI
 */
router.put("/:id", validateSchema(clienteSchema), actualizarCliente);

/**
 * @swagger
 * /api/v1/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente del sistema (solo si no tiene facturas)
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       400:
 *         description: No se puede eliminar el cliente porque tiene facturas
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", eliminarCliente);

module.exports = router;