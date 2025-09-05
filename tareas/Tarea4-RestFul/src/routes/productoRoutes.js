
// src/routes/productoRoutes.js
const express = require("express");
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} = require("../controllers/productoController");
const { validateSchema, productoSchema } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/v1/productos:
 *   get:
 *     summary: Obtener lista de productos
 *     description: Retorna una lista paginada de productos con filtros
 *     tags: [Productos]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar en nombre o descripción
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Filtrar por marca
 *       - in: query
 *         name: minPrecio
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrecio
 *         schema:
 *           type: number
 *         description: Precio máximo
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", obtenerProductos);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Retorna un producto específico
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
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
 *                   example: "Producto encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", obtenerProductoPorId);

/**
 * @swagger
 * /api/v1/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto en el inventario
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - marca
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Laptop Gaming"
 *               descripcion:
 *                 type: string
 *                 example: "Laptop para gaming con RTX 4060"
 *               marca:
 *                 type: string
 *                 example: "ASUS"
 *               stock:
 *                 type: integer
 *                 example: 10
 *               precio:
 *                 type: number
 *                 example: 1299.99
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post("/", validateSchema(productoSchema), crearProducto);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     description: Actualiza los datos de un producto existente
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", validateSchema(productoSchema), actualizarProducto);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina un producto del inventario (solo si no tiene ventas)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       400:
 *         description: No se puede eliminar el producto porque tiene ventas asociadas
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", eliminarProducto);

module.exports = router;