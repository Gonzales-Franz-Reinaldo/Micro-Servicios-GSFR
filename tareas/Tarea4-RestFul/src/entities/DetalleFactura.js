const { EntitySchema } = require("typeorm");

module.exports.DetalleFactura = new EntitySchema({
    name: "DetalleFactura",
    tableName: "detalle_facturas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        cantidad: {
            type: "int",
            nullable: false,
        },
        precio_unitario: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        subtotal: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        createdAt: {
            type: "datetime",
            createDate: true,
        },
    },
    relations: {
        factura: {
            type: "many-to-one",
            target: "Factura",
            joinColumn: {
                name: "factura_id",
            },
            nullable: false,
        },
        producto: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: {
                name: "producto_id",
            },
            nullable: false,
        },
    },
});