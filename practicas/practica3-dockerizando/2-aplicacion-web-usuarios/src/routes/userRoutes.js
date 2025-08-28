const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.get('/create', userController.getCreateUser);
router.post('/create', userController.postCreateUser);
router.get('/edit/:id', userController.getEditUser);
router.post('/edit/:id', userController.postEditUser);
router.get('/show/:id', userController.getUser);
router.post('/delete/:id', userController.deleteUser);

module.exports = router;