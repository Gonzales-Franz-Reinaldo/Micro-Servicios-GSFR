const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { getMe, getEnvioById, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// router.use(verifyToken); // Todas protegidas



router.get('/:id', getEnvioById);

module.exports = router;