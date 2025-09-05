const { EntitySchema } = require("typeorm");

module.exports.Producto = new EntitySchema({
    name: "Producto",
    tableName: "productos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: true,
        },
        marca: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        stock: {
            type: "int",
            default: 0,
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
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
        detalleFacturas: {
            type: "one-to-many",
            target: "DetalleFactura",
            inverseSide: "producto",
        },
    },
});