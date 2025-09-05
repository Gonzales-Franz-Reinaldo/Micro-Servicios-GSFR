// src/routes/index.js
const express = require("express");
const clienteRoutes = require("./clienteRoutes");
const productoRoutes = require("./productoRoutes");
const facturaRoutes = require("./facturaRoutes");
const detalleFacturaRoutes = require("./detalleFacturaRoutes");

const router = express.Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: Información de la API
 *     description: Retorna información básica de la API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Información de la API
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
 *                   example: "API Sistema de Ventas v1.0.0"
 *                 data:
 *                   type: object
 *                   properties:
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     endpoints:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["/clientes", "/productos", "/facturas"]
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Sistema de Ventas v1.0.0",
        data: {
            version: "1.0.0",
            endpoints: [
                "/clientes",
                "/productos",
                "/facturas",
                "/facturas/:id/detalles"
            ],
            documentation: "/api-docs"
        }
    });
});

// Definir las rutas
router.use("/clientes", clienteRoutes);
router.use("/productos", productoRoutes);
router.use("/facturas", facturaRoutes);
router.use("/detalles", detalleFacturaRoutes);

module.exports = router;
