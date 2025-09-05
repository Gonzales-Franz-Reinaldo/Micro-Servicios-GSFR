import { EntitySchema } from 'typeorm';

export const LibroSchema = new EntitySchema({
    name: 'Libro',
    tableName: 'libro',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        titulo: {
            type: 'varchar',
        },
        autor: {
            type: 'varchar',
        },
        isbn: {
            type: 'varchar',
            unique: true,
        },
        anio_publicacion: {
            type: 'int',
        },
    },
    relations: {
        prestamos: {
            type: 'one-to-many',
            target: 'Prestamo',
            inverseSide: 'libro',
        },
    },
});