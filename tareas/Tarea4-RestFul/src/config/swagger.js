const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sistema de Ventas API",
            version: "1.0.0",
            description: "API RESTful para gestión de sistema de ventas con clientes, productos y facturas",
            contact: {
                name: "Desarrollador",
                email: "dev@ejemplo.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Servidor de desarrollo",
            },
        ],
        components: {
            schemas: {
                Cliente: {
                    type: "object",
                    required: ["ci", "nombres", "apellidos", "sexo"],
                    properties: {
                        id: {
                            type: "integer",
                            description: "ID único del cliente",
                            example: 1,
                        },
                        ci: {
                            type: "string",
                            description: "Cédula de identidad",
                            example: "1234567890",
                        },
                        nombres: {
                            type: "string",
                            description: "Nombres del cliente",
                            example: "Juan Carlos",
                        },
                        apellidos: {
                            type: "string",
                            description: "Apellidos del cliente",
                            example: "Pérez González",
                        },
                        sexo: {
                            type: "string",
                            enum: ["M", "F"],
                            description: "Sexo del cliente",
                            example: "M",
                        },
                    },
                },
                Producto: {
                    type: "object",
                    required: ["nombre", "marca", "precio"],
                    properties: {
                        id: {
                            type: "integer",
                            description: "ID único del producto",
                            example: 1,
                        },
                        nombre: {
                            type: "string",
                            description: "Nombre del producto",
                            example: "Laptop Gaming",
                        },
                        descripcion: {
                            type: "string",
                            description: "Descripción del producto",
                            example: "Laptop para gaming con RTX 4060",
                        },
                        marca: {
                            type: "string",
                            description: "Marca del producto",
                            example: "ASUS",
                        },
                        stock: {
                            type: "integer",
                            description: "Stock disponible",
                            example: 10,
                        },
                        precio: {
                            type: "number",
                            format: "decimal",
                            description: "Precio del producto",
                            example: 1299.99,
                        },
                    },
                },
                Factura: {
                    type: "object",
                    required: ["fecha", "cliente_id"],
                    properties: {
                        id: {
                            type: "integer",
                            description: "ID único de la factura",
                            example: 1,
                        },
                        fecha: {
                            type: "string",
                            format: "date",
                            description: "Fecha de la factura",
                            example: "2024-03-15",
                        },
                        cliente_id: {
                            type: "integer",
                            description: "ID del cliente",
                            example: 1,
                        },
                        total: {
                            type: "number",
                            format: "decimal",
                            description: "Total de la factura",
                            example: 1299.99,
                        },
                    },
                },
                DetalleFactura: {
                    type: "object",
                    required: ["producto_id", "cantidad", "precio_unitario"],
                    properties: {
                        id: {
                            type: "integer",
                            description: "ID único del detalle",
                            example: 1,
                        },
                        factura_id: {
                            type: "integer",
                            description: "ID de la factura",
                            example: 1,
                        },
                        producto_id: {
                            type: "integer",
                            description: "ID del producto",
                            example: 1,
                        },
                        cantidad: {
                            type: "integer",
                            description: "Cantidad del producto",
                            example: 2,
                        },
                        precio_unitario: {
                            type: "number",
                            format: "decimal",
                            description: "Precio unitario",
                            example: 1299.99,
                        },
                        subtotal: {
                            type: "number",
                            format: "decimal",
                            description: "Subtotal (cantidad * precio_unitario)",
                            example: 2599.98,
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        message: {
                            type: "string",
                            example: "Mensaje de error",
                        },
                        error: {
                            type: "string",
                            example: "Detalles del error",
                        },
                    },
                },
                PaginatedResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        data: {
                            type: "array",
                            items: {},
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                page: {
                                    type: "integer",
                                    example: 1,
                                },
                                limit: {
                                    type: "integer",
                                    example: 10,
                                },
                                total: {
                                    type: "integer",
                                    example: 50,
                                },
                                totalPages: {
                                    type: "integer",
                                    example: 5,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;