const { EntitySchema } = require("typeorm");

module.exports.Factura = new EntitySchema({
    name: "Factura",
    tableName: "facturas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        fecha: {
            type: "date",
            nullable: false,
        },
        total: {
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
        },
        createdAt: {
            type: "datetime",
            createDate: true,
        },
        updatedAt: {
            type: "datetime",
            updateDate: true,
        },
    },
    relations: {
        cliente: {
            type: "many-to-one",
            target: "Cliente",
            joinColumn: {
                name: "cliente_id",
            },
            nullable: false,
        },
        detalles: {
            type: "one-to-many",
            target: "DetalleFactura",
            inverseSide: "factura",
            cascade: true,
        },
    },
});
