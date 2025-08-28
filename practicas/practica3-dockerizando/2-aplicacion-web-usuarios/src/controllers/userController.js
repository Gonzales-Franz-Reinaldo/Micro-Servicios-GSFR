const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users/index', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getCreateUser = (req, res) => {
    res.render('users/create', { errors: null });
};

exports.postCreateUser = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const errors = [];

        if (!nombre) errors.push('Nombre is required');
        if (!email) errors.push('Email is required');

        if (errors.length > 0) {
            return res.render('users/create', { errors });
        }

        await User.create({ nombre, email });
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getEditUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('users/edit', { user, errors: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.postEditUser = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const errors = [];

        if (!nombre) errors.push('Name is required');
        if (!email) errors.push('Email is required');

        if (errors.length > 0) {
            const user = { id: req.params.id, nombre, email };
            return res.render('users/edit', { user, errors });
        }

        await User.update(req.params.id, { nombre, email });
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('users/show', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};