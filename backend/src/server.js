const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);

sequelize.sync().then(() => {
  app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333');
  });
});
