const { pool } = require('../config/database');

class User {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ nombre, email }) {
        const [result] = await pool.query(
            'INSERT INTO users (nombre, email) VALUES (?, ?)',
            [nombre, email]
        );
        return { id: result.insertId, nombre, email };
    }

    static async update(id, { nombre, email }) {
        await pool.query(
            'UPDATE users SET nombre = ?, email = ? WHERE id = ?',
            [nombre, email, id]
        );
        return { id, nombre, email };
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = User;