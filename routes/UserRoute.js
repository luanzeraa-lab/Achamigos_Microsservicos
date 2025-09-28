// Importa o Express e cria um roteador
const express = require('express');
const router = express.Router();

// Importa o controller de usuário com as funções de cadastro e login
const UserController = require('../controllers/UserController');

// Rota para cadastro de usuário: POST /users/register
router.post('/users/register', UserController.register);

// Rota para login de usuário: POST /users/login
router.post('/users/login', UserController.login);

// Exporta o roteador para ser usado no arquivo principal da aplicação
module.exports = router;