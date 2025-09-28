const User = require('../models/UserModel'); // Importa o modelo de usuário
const bcrypt = require('bcryptjs'); // Biblioteca para criptografar e comparar senhas
const jwt = require('jsonwebtoken'); // Biblioteca para gerar tokens JWT

const SECRET = process.env.JWT_SECRET || 'seusegredoaqui'; // Segredo para assinar o token JWT

// Função para cadastro de usuário
exports.register = async (req, res) => {
  try {
    // Extrai os campos do corpo da requisição
    const { nome, cnpj, telefone, userLogin, senha, email, endereco, tipo, userStatus, linkUser } = req.body;

    // Verifica se já existe um usuário com o mesmo e-mail
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    // Verifica se já existe um usuário com o mesmo login
    if (await User.findOne({ userLogin })) {
      return res.status(400).json({ error: 'Login já cadastrado' });
    }

    // Cria o novo usuário no banco de dados
    const user = await User.create({
      nome, cnpj, telefone, userLogin, senha, email, endereco, tipo, userStatus, linkUser
    });

    // Remove os campos sensíveis antes de retornar a resposta
    const userObj = user.toObject();
    delete userObj.senha;
    delete userObj.__v;

    // Retorna o usuário cadastrado (sem senha e __v)
    return res.status(201).json(userObj);
  } catch (err) {
    // Em caso de erro, retorna mensagem de erro genérica
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Função para login de usuário
exports.login = async (req, res) => {
  try {
    // Extrai login e senha do corpo da requisição
    const { userLogin, senha } = req.body;

    // Busca o usuário pelo login e seleciona o campo senha
    const user = await User.findOne({ userLogin }).select('+senha');

    // Verifica se o usuário existe e se a senha está correta
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token JWT com o id do usuário
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });

    // Remove os campos sensíveis antes de retornar a resposta
    const userObj = user.toObject();
    delete userObj.senha;
    delete userObj.__v;

    // Retorna o usuário (sem senha e __v) e o token JWT
    return res.json({ user: userObj, token });
  } catch (err) {
    // Em caso de erro, retorna mensagem de erro genérica
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};