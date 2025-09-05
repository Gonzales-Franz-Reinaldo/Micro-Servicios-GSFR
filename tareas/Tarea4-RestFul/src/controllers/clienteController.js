const { AppDataSource } = require("../config/database");
const { Cliente } = require("../entities/Cliente");
const { successResponse, createError } = require("../utils/response");
const { getPaginationParams, createPaginationResponse } = require("../utils/pagination");

const clienteRepository = () => AppDataSource.getRepository("Cliente");

const obtenerClientes = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { search } = req.query;

        let queryBuilder = clienteRepository().createQueryBuilder("cliente");

        if (search) {
            queryBuilder.where(
                "cliente.nombres LIKE :search OR cliente.apellidos LIKE :search OR cliente.ci LIKE :search",
                { search: `%${search}%` }
            );
        }

        const [clientes, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        res.json(createPaginationResponse(clientes, total, page, limit));
    } catch (error) {
        next(error);
    }
};

const obtenerClientePorId = async (req, res, next) => {
    try {
        const cliente = await clienteRepository().findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["facturas"],
        });

        if (!cliente) {
            throw createError("Cliente no encontrado", 404);
        }

        res.json(successResponse(cliente, "Cliente encontrado"));
    } catch (error) {
        next(error);
    }
};

const crearCliente = async (req, res, next) => {
    try {
        const { ci, nombres, apellidos, sexo } = req.body;

        const clienteExistente = await clienteRepository().findOne({
            where: { ci },
        });

        if (clienteExistente) {
            throw createError("Ya existe un cliente con ese CI", 409);
        }

        const nuevoCliente = clienteRepository().create({
            ci,
            nombres,
            apellidos,
            sexo,
        });

        const resultado = await clienteRepository().save(nuevoCliente);
        res.status(201).json(successResponse(resultado, "Cliente creado exitosamente"));
    } catch (error) {
        next(error);
    }
};

const actualizarCliente = async (req, res, next) => {
    try {
        const { ci, nombres, apellidos, sexo } = req.body;
        const clienteId = parseInt(req.params.id);

        const cliente = await clienteRepository().findOne({
            where: { id: clienteId },
        });

        if (!cliente) {
            throw createError("Cliente no encontrado", 404);
        }

        // Verificar si el CI ya existe en otro cliente
        if (ci && ci !== cliente.ci) {
            const clienteConCI = await clienteRepository().findOne({
                where: { ci },
            });

            if (clienteConCI && clienteConCI.id !== clienteId) {
                throw createError("Ya existe un cliente con ese CI", 409);
            }
        }

        cliente.ci = ci || cliente.ci;
        cliente.nombres = nombres || cliente.nombres;
        cliente.apellidos = apellidos || cliente.apellidos;
        cliente.sexo = sexo || cliente.sexo;

        const resultado = await clienteRepository().save(cliente);
        res.json(successResponse(resultado, "Cliente actualizado exitosamente"));
    } catch (error) {
        next(error);
    }
};

const eliminarCliente = async (req, res, next) => {
    try {
        const clienteId = parseInt(req.params.id);

        const cliente = await clienteRepository().findOne({
            where: { id: clienteId },
            relations: ["facturas"],
        });

        if (!cliente) {
            throw createError("Cliente no encontrado", 404);
        }

        if (cliente.facturas && cliente.facturas.length > 0) {
            throw createError("No se puede eliminar el cliente porque tiene facturas asociadas", 400);
        }

        await clienteRepository().remove(cliente);
        res.json(successResponse(null, "Cliente eliminado exitosamente"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
};