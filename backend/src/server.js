const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth.routes');
const processoRoutes = require('./routes/processo.routes');
const movimentacaoRoutes = require('./routes/movimentacao.routes');
const anexoRoutes = require('./routes/anexo.routes');
const tramitacaoRoutes = require('./routes/tramitacao.routes');
const finalizacaoRoutes = require('./routes/finalizacao.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use('/auth', authRoutes);
app.use(dashboardRoutes);
app.use('/processos', processoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
app.use('/finalizacoes', finalizacaoRoutes);
app.use('/tramitacoes', tramitacaoRoutes);
app.use('/anexos', anexoRoutes);


app.get('/ping', (req, res) => {
  res.json({ ok: true });
});


async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });

  app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333');
  });
}

start();
