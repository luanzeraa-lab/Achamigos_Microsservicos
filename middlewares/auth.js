const jwt = require('jsonwebtoken'); // Importa a biblioteca para manipular JWT
const SECRET = process.env.JWT_SECRET || 'seusegredoaqui'; // Segredo para validar o token

// Middleware de autenticação JWT
module.exports = (req, res, next) => {
  // Recupera o header Authorization da requisição
  const authHeader = req.headers.authorization;

  // Se não houver token, retorna erro 401
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  // Separa o token do prefixo "Bearer"
  const [, token] = authHeader.split(' ');

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, SECRET);

    // Adiciona o id do usuário decodificado à requisição
    req.userId = decoded.id;

    // Continua para a próxima função/middleware
    return next();
  } catch (err) {
    // Se o token for inválido, retorna erro 401
    return res.status(401).json({ error: 'Token inválido' });
  }
};