const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const productRoutes = require('./routes/productRoutes');
const sequelize = require('./config/database');

const app = new Koa();

app.use(bodyParser());
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

sequelize.sync().then(() => {
  console.log('Database connected');
});

module.exports = app;
