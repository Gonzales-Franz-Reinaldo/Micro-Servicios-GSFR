const { EntitySchema } = require('typeorm');

const Medico = new EntitySchema({
    name: 'Medico',
    tableName: 'medicos',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        nombre: {
            type: 'varchar',
            length: 100,
            nullable: false
        },
        apellido: {
            type: 'varchar',
            length: 100,
            nullable: false
        },
        cedula_profesional: {
            type: 'varchar',
            length: 20,
            unique: true,
            nullable: false
        },
        anos_experiencia: {
            type: 'int',
            nullable: false,
            default: 0
        },
        correo_electronico: {
            type: 'varchar',
            length: 150,
            unique: true,
            nullable: false
        }
    }
});

module.exports = Medico;