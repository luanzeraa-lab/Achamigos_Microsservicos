require('dotenv').config(); 
const express = require("express"); 
const cors = require("cors"); 
const mongoose = require('mongoose'); 
const userRoutes = require('./routes/UserRoute'); 
const apiKeyAuth = require('./middlewares/apiKeyAuth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();

// Middlewares básicos
app.use(express.json()); 
app.use(cors({ origin: "*" }));

// Arquivos estáticos (ícones, CSS do Swagger etc.)
app.use('/public', express.static(`${__dirname}/public`));

// Swagger Docs
const swaggerOptions = {
  customCssUrl: '/public/custom.css',
  customSiteTitle: "API Achamigos",
  customfavIcon: "/public/AchamigosFav.png",
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Middleware de autenticação por API Key
app.use(apiKeyAuth);

// Rotas principais
app.use(userRoutes);

// Rota base (teste rápido)
app.get("/", (req, res) => {
  res.json({ message: "🚀 Microsserviço Achamigos rodando com sucesso!" });
});

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conexão com o banco de dados bem-sucedida!"))
  .catch(err => console.log("❌ Erro ao conectar ao banco de dados:", err));

// Só roda localmente (não na Vercel)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`🚀 Servidor local iniciado na porta ${port}`);
  });
}

// Exporta o app para a Vercel usar
module.exports = app;
