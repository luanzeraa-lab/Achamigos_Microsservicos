const mongoose = require('mongoose'); // Importa o mongoose para manipulação do MongoDB
const bcrypt = require('bcryptjs');   // Importa o bcrypt para criptografar senhas

// Define o schema para o endereço do usuário
const EnderecoSchema = new mongoose.Schema({
  cep:    { type: String, required: true },   // CEP do endereço
  rua:    { type: String, required: true },   // Rua do endereço
  cidade: { type: String, required: true },   // Cidade do endereço
  numero: { type: String, required: true }    // Número do endereço
});

// Define o schema principal do usuário
const UserSchema = new mongoose.Schema({
  nome:        { type: String, required: true },   // Nome do usuário
  cnpj:        { type: String, required: true },   // CNPJ do usuário
  telefone:    { type: String, required: true },   // Telefone do usuário
  userLogin:   { type: String, required: true },   // Login do usuário
  senha:       { type: String, required: true },   // Senha do usuário (será criptografada)
  email:       { type: String, required: true, unique: true }, // E-mail do usuário (único)
  endereco:    { type: EnderecoSchema, required: true },       // Endereço do usuário (subdocumento)
  tipo:        { type: String, required: true },   // Tipo de usuário
  userStatus:  { type: String, required: true },   // Status do usuário
  linkUser:    { type: String }                    // Link do usuário (opcional)
});

// Middleware que criptografa a senha antes de salvar o usuário no banco
UserSchema.pre('save', async function(next) {
  // Só criptografa se a senha foi modificada ou é novo usuário
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 8); // Criptografa a senha com salt 8
  next();
});

// Exporta o modelo User para ser usado em outras partes da aplicação
module.exports = mongoose.model('User', UserSchema);