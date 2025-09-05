import { AppDataSource } from '../config/dataSource.js';

const libroRepository = AppDataSource.getRepository('Libro');
const prestamoRepository = AppDataSource.getRepository('Prestamo');

export const resolvers = {
    Query: {
        getLibros: async () => {
            return await libroRepository.find({ relations: ['prestamos'] });
        },
        getPrestamos: async () => {
            return await prestamoRepository.find({ relations: ['libro'] });
        },
        getPrestamoById: async (_, { id }) => {
            return await prestamoRepository.findOne({ where: { id }, relations: ['libro'] });
        },
        getPrestamosByUsuario: async (_, { usuario }) => {
            return await prestamoRepository.find({ where: { usuario }, relations: ['libro'] });
        },
    },
    Mutation: {
        createLibro: async (_, { input }) => {
            const libro = libroRepository.create(input);
            return await libroRepository.save(libro);
        },
        createPrestamo: async (_, { input }) => {
            const { libroId, ...rest } = input;
            const libro = await libroRepository.findOneBy({ id: libroId });
            if (!libro) throw new Error('Libro not found');
            const prestamo = prestamoRepository.create({ ...rest, libro });
            return await prestamoRepository.save(prestamo);
        },
    },
};