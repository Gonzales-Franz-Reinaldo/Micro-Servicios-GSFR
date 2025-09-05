const { AppDataSource } = require("../config/database");
const { Producto } = require("../entities/Producto");
const { successResponse, createError } = require("../utils/response");
const { getPaginationParams, createPaginationResponse } = require("../utils/pagination");

const productoRepository = () => AppDataSource.getRepository("Producto");

const obtenerProductos = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const { search, marca, minPrecio, maxPrecio } = req.query;

        let queryBuilder = productoRepository().createQueryBuilder("producto");

        if (search) {
            queryBuilder.where(
                "producto.nombre LIKE :search OR producto.descripcion LIKE :search",
                { search: `%${search}%` }
            );
        }

        if (marca) {
            queryBuilder.andWhere("producto.marca = :marca", { marca });
        }

        if (minPrecio) {
            queryBuilder.andWhere("producto.precio >= :minPrecio", { minPrecio: parseFloat(minPrecio) });
        }

        if (maxPrecio) {
            queryBuilder.andWhere("producto.precio <= :maxPrecio", { maxPrecio: parseFloat(maxPrecio) });
        }

        const [productos, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        res.json(createPaginationResponse(productos, total, page, limit));
    } catch (error) {
        next(error);
    }
};

const obtenerProductoPorId = async (req, res, next) => {
    try {
        const producto = await productoRepository().findOne({
            where: { id: parseInt(req.params.id) },
        });

        if (!producto) {
            throw createError("Producto no encontrado", 404);
        }

        res.json(successResponse(producto, "Producto encontrado"));
    } catch (error) {
        next(error);
    }
};

const crearProducto = async (req, res, next) => {
    try {
        const { nombre, descripcion, marca, stock, precio } = req.body;

        const nuevoProducto = productoRepository().create({
            nombre,
            descripcion,
            marca,
            stock: stock || 0,
            precio,
        });

        const resultado = await productoRepository().save(nuevoProducto);
        res.status(201).json(successResponse(resultado, "Producto creado exitosamente"));
    } catch (error) {
        next(error);
    }
};

const actualizarProducto = async (req, res, next) => {
    try {
        const { nombre, descripcion, marca, stock, precio } = req.body;
        const productoId = parseInt(req.params.id);

        const producto = await productoRepository().findOne({
            where: { id: productoId },
        });

        if (!producto) {
            throw createError("Producto no encontrado", 404);
        }

        producto.nombre = nombre || producto.nombre;
        producto.descripcion = descripcion !== undefined ? descripcion : producto.descripcion;
        producto.marca = marca || producto.marca;
        producto.stock = stock !== undefined ? stock : producto.stock;
        producto.precio = precio || producto.precio;

        const resultado = await productoRepository().save(producto);
        res.json(successResponse(resultado, "Producto actualizado exitosamente"));
    } catch (error) {
        next(error);
    }
};

const eliminarProducto = async (req, res, next) => {
    try {
        const productoId = parseInt(req.params.id);

        const producto = await productoRepository().findOne({
            where: { id: productoId },
            relations: ["detalleFacturas"],
        });

        if (!producto) {
            throw createError("Producto no encontrado", 404);
        }

        if (producto.detalleFacturas && producto.detalleFacturas.length > 0) {
            throw createError("No se puede eliminar el producto porque tiene ventas asociadas", 400);
        }

        await productoRepository().remove(producto);
        res.json(successResponse(null, "Producto eliminado exitosamente"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};