require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require("express"); // Importa o framework Express
const cors = require("cors"); // Importa o middleware CORS para permitir requisições de outros domínios
const mongoose = require('mongoose'); // Importa o Mongoose para conectar ao MongoDB
const userRoutes = require('./routes/UserRoute'); // caminho para o arquivo que você criou


const app = express(); // Cria a aplicação Express
app.use(express.json()); // Permite receber JSON no corpo das requisições
app.use(cors({ origin: "*" })); // Permite requisições de qualquer origem
app.use(userRoutes);

const port = 5001; // Define a porta do servidor

// Conexão com o MongoDB usando a string definida no .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conexão com o banco de dados bem sucedida");
    app.listen(port, () => {
      console.log(`Servidor iniciado com sucesso na porta ${port}`);
    });
  })
  .catch(err => {
    console.log("Erro ao conectar ao banco de dados:", err);
  });

