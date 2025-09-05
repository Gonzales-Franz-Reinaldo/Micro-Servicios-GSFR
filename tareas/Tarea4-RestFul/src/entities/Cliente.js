const { EntitySchema } = require("typeorm");

module.exports.Cliente = new EntitySchema({
    name: "Cliente",
    tableName: "clientes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        ci: {
            type: "varchar",
            length: 15,
            unique: true,
            nullable: false,
        },
        nombres: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        apellidos: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        sexo: {
            type: "enum",
            enum: ["M", "F"],
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
        facturas: {
            type: "one-to-many",
            target: "Factura",
            inverseSide: "cliente",
        },
    },
});