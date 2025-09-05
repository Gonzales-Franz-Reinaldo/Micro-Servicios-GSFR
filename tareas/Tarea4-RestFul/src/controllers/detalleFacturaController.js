const { AppDataSource } = require("../config/database");
const { DetalleFactura } = require("../entities/DetalleFactura");
const { Factura } = require("../entities/Factura");
const { Producto } = require("../entities/Producto");
const { successResponse, createError } = require("../utils/response");
const { getPaginationParams, createPaginationResponse } = require("../utils/pagination");

const detalleFacturaRepository = () => AppDataSource.getRepository("DetalleFactura");
const facturaRepository = () => AppDataSource.getRepository("Factura");
const productoRepository = () => AppDataSource.getRepository("Producto");

const obtenerDetallesPorFactura = async (req, res, next) => {
    try {
        const facturaId = parseInt(req.params.facturaId);

        const factura = await facturaRepository().findOne({
            where: { id: facturaId },
        });

        if (!factura) {
            throw createError("Factura no encontrada", 404);
        }

        const detalles = await detalleFacturaRepository().find({
            where: { factura: { id: facturaId } },
            relations: ["producto"],
        });

        res.json(successResponse(detalles, "Detalles de factura obtenidos"));
    } catch (error) {
        next(error);
    }
};

const crearDetalleFactura = async (req, res, next) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const facturaId = parseInt(req.params.facturaId);
        const { producto_id, cantidad, precio_unitario } = req.body;

        // Verificar que la factura existe
        const factura = await queryRunner.manager.findOne(Factura, {
            where: { id: facturaId },
        });

        if (!factura) {
            throw createError("Factura no encontrada", 404);
        }

        // Verificar que el producto existe
        const producto = await queryRunner.manager.findOne(Producto, {
            where: { id: parseInt(producto_id) },
        });

        if (!producto) {
            throw createError("Producto no encontrado", 404);
        }

        // Verificar stock disponible
        if (producto.stock < cantidad) {
            throw createError("Stock insuficiente", 400);
        }

        // Calcular subtotal
        const subtotal = cantidad * precio_unitario;

        // Crear el detalle
        const nuevoDetalle = queryRunner.manager.create(DetalleFactura, {
            factura,
            producto,
            cantidad,
            precio_unitario,
            subtotal,
        });

        const detalleGuardado = await queryRunner.manager.save(DetalleFactura, nuevoDetalle);

        // Actualizar stock del producto
        producto.stock -= cantidad;
        await queryRunner.manager.save(Producto, producto);

        // Recalcular total de la factura
        const detallesFactura = await queryRunner.manager.find(DetalleFactura, {
            where: { factura: { id: facturaId } },
        });

        const nuevoTotal = detallesFactura.reduce((sum, detalle) => sum + parseFloat(detalle.subtotal), 0);
        factura.total = nuevoTotal;
        await queryRunner.manager.save(Factura, factura);

        await queryRunner.commitTransaction();

        // Cargar el detalle con sus relaciones
        const detalleCompleto = await detalleFacturaRepository().findOne({
            where: { id: detalleGuardado.id },
            relations: ["producto"],
        });

        res.status(201).json(successResponse(detalleCompleto, "Detalle agregado exitosamente"));
    } catch (error) {
        await queryRunner.rollbackTransaction();
        next(error);
    } finally {
        await queryRunner.release();
    }
};

const actualizarDetalleFactura = async (req, res, next) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const detalleId = parseInt(req.params.id);
        const { cantidad, precio_unitario } = req.body;

        const detalle = await queryRunner.manager.findOne(DetalleFactura, {
            where: { id: detalleId },
            relations: ["factura", "producto"],
        });

        if (!detalle) {
            throw createError("Detalle no encontrado", 404);
        }

        // Restaurar stock anterior
        detalle.producto.stock += detalle.cantidad;

        // Verificar nuevo stock
        if (detalle.producto.stock < cantidad) {
            throw createError("Stock insuficiente", 400);
        }

        // Actualizar detalle
        detalle.cantidad = cantidad || detalle.cantidad;
        detalle.precio_unitario = precio_unitario || detalle.precio_unitario;
        detalle.subtotal = detalle.cantidad * detalle.precio_unitario;

        // Actualizar stock
        detalle.producto.stock -= detalle.cantidad;
        await queryRunner.manager.save(Producto, detalle.producto);

        const detalleActualizado = await queryRunner.manager.save(DetalleFactura, detalle);

        // Recalcular total de la factura
        const detallesFactura = await queryRunner.manager.find(DetalleFactura, {
            where: { factura: { id: detalle.factura.id } },
        });

        const nuevoTotal = detallesFactura.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);
        detalle.factura.total = nuevoTotal;
        await queryRunner.manager.save(Factura, detalle.factura);

        await queryRunner.commitTransaction();

        const detalleCompleto = await detalleFacturaRepository().findOne({
            where: { id: detalleActualizado.id },
            relations: ["producto"],
        });

        res.json(successResponse(detalleCompleto, "Detalle actualizado exitosamente"));
    } catch (error) {
        await queryRunner.rollbackTransaction();
        next(error);
    } finally {
        await queryRunner.release();
    }
};

const eliminarDetalleFactura = async (req, res, next) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const detalleId = parseInt(req.params.id);

        const detalle = await queryRunner.manager.findOne(DetalleFactura, {
            where: { id: detalleId },
            relations: ["factura", "producto"],
        });

        if (!detalle) {
            throw createError("Detalle no encontrado", 404);
        }

        // Restaurar stock
        detalle.producto.stock += detalle.cantidad;
        await queryRunner.manager.save(Producto, detalle.producto);

        // Eliminar detalle
        await queryRunner.manager.remove(DetalleFactura, detalle);

        // Recalcular total de la factura
        const detallesFactura = await queryRunner.manager.find(DetalleFactura, {
            where: { factura: { id: detalle.factura.id } },
        });

        const nuevoTotal = detallesFactura.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);
        detalle.factura.total = nuevoTotal;
        await queryRunner.manager.save(Factura, detalle.factura);

        await queryRunner.commitTransaction();

        res.json(successResponse(null, "Detalle eliminado exitosamente"));
    } catch (error) {
        await queryRunner.rollbackTransaction();
        next(error);
    } finally {
        await queryRunner.release();
    }
};

const obtenerTodosLosDetallesFactura = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const [detalles, total] = await detalleFacturaRepository().findAndCount({
            relations: ["factura", "producto"],
            skip,
            take: limit,
        });
        res.json(createPaginationResponse(detalles, total, page, limit));
    } catch (error) {
        next(error);
    }
};

const obtenerDetalleFacturaPorId = async (req, res, next) => {
    try {
        const detalle = await detalleFacturaRepository().findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["factura", "producto"],
        });
        if (!detalle) throw createError("Detalle no encontrado", 404);
        res.json(successResponse(detalle, "Detalle encontrado"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerTodosLosDetallesFactura,
    obtenerDetalleFacturaPorId,
    actualizarDetalleFactura,
    eliminarDetalleFactura,
    obtenerDetallesPorFactura,
    crearDetalleFactura,
};