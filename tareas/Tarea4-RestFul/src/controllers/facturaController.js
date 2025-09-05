const { AppDataSource } = require("../config/database");
const { Factura } = require("../entities/Factura");
const { Cliente } = require("../entities/Cliente");
const { successResponse, createError } = require("../utils/response");
const { getPaginationParams, createPaginationResponse } = require("../utils/pagination");

const facturaRepository = () => AppDataSource.getRepository("Factura");
const clienteRepository = () => AppDataSource.getRepository("Cliente");

const obtenerFacturas = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { fechaInicio, fechaFin, cliente_id } = req.query;

        let queryBuilder = facturaRepository()
            .createQueryBuilder("factura")
            .leftJoinAndSelect("factura.cliente", "cliente")
            .leftJoinAndSelect("factura.detalles", "detalles")
            .leftJoinAndSelect("detalles.producto", "producto");

        if (fechaInicio) {
            queryBuilder.andWhere("factura.fecha >= :fechaInicio", { fechaInicio });
        }

        if (fechaFin) {
            queryBuilder.andWhere("factura.fecha <= :fechaFin", { fechaFin });
        }

        if (cliente_id) {
            queryBuilder.andWhere("factura.cliente.id = :cliente_id", {
                cliente_id: parseInt(cliente_id)
            });
        }

        const [facturas, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        res.json(createPaginationResponse(facturas, total, page, limit));
    } catch (error) {
        next(error);
    }
};

const obtenerFacturaPorId = async (req, res, next) => {
    try {
        const factura = await facturaRepository().findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["cliente", "detalles", "detalles.producto"],
        });

        if (!factura) {
            throw createError("Factura no encontrada", 404);
        }

        res.json(successResponse(factura, "Factura encontrada"));
    } catch (error) {
        next(error);
    }
};

const obtenerFacturasPorCliente = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const clienteId = parseInt(req.params.clienteId);

        const cliente = await clienteRepository().findOne({
            where: { id: clienteId },
        });

        if (!cliente) {
            throw createError("Cliente no encontrado", 404);
        }

        const [facturas, total] = await facturaRepository().findAndCount({
            where: { cliente: { id: clienteId } },
            relations: ["detalles", "detalles.producto"],
            skip,
            take: limit,
            order: { fecha: "DESC" },
        });

        res.json(createPaginationResponse(facturas, total, page, limit));
    } catch (error) {
        next(error);
    }
};

const crearFactura = async (req, res, next) => {
    try {
        const { fecha, cliente_id } = req.body;

        // Verificar que el cliente existe
        const cliente = await clienteRepository().findOne({
            where: { id: parseInt(cliente_id) },
        });

        if (!cliente) {
            throw createError("Cliente no encontrado", 404);
        }

        const nuevaFactura = facturaRepository().create({
            fecha: new Date(fecha),
            cliente,
            total: 0,
        });

        const resultado = await facturaRepository().save(nuevaFactura);

        // Cargar la factura con sus relaciones
        const facturaCompleta = await facturaRepository().findOne({
            where: { id: resultado.id },
            relations: ["cliente"],
        });

        res.status(201).json(successResponse(facturaCompleta, "Factura creada exitosamente"));
    } catch (error) {
        next(error);
    }
};

const actualizarFactura = async (req, res, next) => {
    try {
        const { fecha, cliente_id } = req.body;
        const facturaId = parseInt(req.params.id);

        const factura = await facturaRepository().findOne({
            where: { id: facturaId },
            relations: ["cliente"],
        });

        if (!factura) {
            throw createError("Factura no encontrada", 404);
        }

        if (cliente_id && cliente_id !== factura.cliente.id) {
            const cliente = await clienteRepository().findOne({
                where: { id: parseInt(cliente_id) },
            });

            if (!cliente) {
                throw createError("Cliente no encontrado", 404);
            }

            factura.cliente = cliente;
        }

        if (fecha) {
            factura.fecha = new Date(fecha);
        }

        const resultado = await facturaRepository().save(factura);

        const facturaCompleta = await facturaRepository().findOne({
            where: { id: resultado.id },
            relations: ["cliente"],
        });

        res.json(successResponse(facturaCompleta, "Factura actualizada exitosamente"));
    } catch (error) {
        next(error);
    }
};

const eliminarFactura = async (req, res, next) => {
    try {
        const facturaId = parseInt(req.params.id);

        const factura = await facturaRepository().findOne({
            where: { id: facturaId },
            relations: ["detalles"],
        });

        if (!factura) {
            throw createError("Factura no encontrada", 404);
        }

        await facturaRepository().remove(factura);
        res.json(successResponse(null, "Factura eliminada exitosamente"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerFacturas,
    obtenerFacturaPorId,
    obtenerFacturasPorCliente,
    crearFactura,
    actualizarFactura,
    eliminarFactura,
};