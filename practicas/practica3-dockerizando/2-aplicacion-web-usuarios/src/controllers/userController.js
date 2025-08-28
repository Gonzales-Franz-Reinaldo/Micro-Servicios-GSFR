import { AppDataSource } from "../config/database.js";
import { handleError } from "../utils/errorHandler.js";

const userRepository = () => AppDataSource.getRepository("User");

export const getUsers = async (req, res) => {
    try {
        const users = await userRepository().find({ order: { fechaRegistro: "DESC" } });
        res.render("users/index", { users, title: "Lista de Usuarios" });
    } catch (err) {
        console.error("Error consultando usuarios:", err);
        handleError(res, 500, "Error al listar usuarios");
    }
};

export const showAddForm = (req, res) => {
    res.render("users/create", { title: "Agregar Usuario" });
};

export const addUser = async (req, res) => {
    const { nombre, correoElectronico, fechaRegistro } = req.body;
    if (!nombre || !correoElectronico || !fechaRegistro) {
        return handleError(res, 400, "Nombre, correo electrónico y fecha de registro son requeridos");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoElectronico)) {
        return handleError(res, 400, "Correo electrónico inválido");
    }
    try {
        const user = userRepository().create({ nombre, correoElectronico, fechaRegistro });
        await userRepository().save(user);
        res.redirect("/");
    } catch (err) {
        console.error("Error insertando usuario:", err);
        handleError(res, 500, "Error al agregar usuario");
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, correoElectronico, fechaRegistro } = req.body;
    if (!nombre || !correoElectronico || !fechaRegistro) {
        return handleError(res, 400, "Nombre, correo electrónico y fecha de registro son requeridos");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoElectronico)) {
        return handleError(res, 400, "Correo electrónico inválido");
    }
    try {
        const user = await userRepository().findOneBy({ id: parseInt(id) });
        if (!user) {
            return handleError(res, 404, "Usuario no encontrado");
        }
        user.nombre = nombre;
        user.correoElectronico = correoElectronico;
        user.fechaRegistro = fechaRegistro;
        await userRepository().save(user);
        res.redirect("/");
    } catch (err) {
        console.error("Error actualizando usuario:", err);
        handleError(res, 500, "Error al actualizar usuario");
    }
};

export const showEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepository().findOneBy({ id: parseInt(id) });
        if (!user) {
            return handleError(res, 404, "Usuario no encontrado");
        }
        res.render("users/edit", { user, title: "Editar Usuario" });
    } catch (err) {
        console.error("Error mostrando formulario de edición:", err);
        handleError(res, 500, "Error al mostrar formulario de edición");
    }
};

export const showUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepository().findOneBy({ id: parseInt(id) });
        if (!user) {
            return handleError(res, 404, "Usuario no encontrado");
        }
        res.render("users/view", { user, title: "Detalle Usuario" });
    } catch (err) {
        console.error("Error mostrando usuario:", err);
        handleError(res, 500, "Error al mostrar usuario");
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepository().findOneBy({ id: parseInt(id) });
        if (!user) {
            return handleError(res, 404, "Usuario no encontrado");
        }
        await userRepository().delete(id);
        res.redirect("/");
    } catch (err) {
        console.error("Error eliminando usuario:", err);
        handleError(res, 500, "Error al eliminar usuario");
    }
};