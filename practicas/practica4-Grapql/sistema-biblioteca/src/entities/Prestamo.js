import { EntitySchema } from 'typeorm';

export const PrestamoSchema = new EntitySchema({
    name: 'Prestamo',
    tableName: 'prestamo',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        usuario: {
            type: 'varchar',
        },
        fecha_prestamo: {
            type: 'date',
        },
        fecha_devolucion: {
            type: 'date',
        },
    },
    relations: {
        libro: {
            type: 'many-to-one',
            target: 'Libro',
            joinColumn: true,
            inverseSide: 'prestamos',
        },
    },
});