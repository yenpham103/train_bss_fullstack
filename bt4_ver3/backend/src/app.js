require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const rateLimitMiddleware = require('./middlewares/rateLimitMiddleware');

const app = new Koa();

app.use(bodyParser());
app.use(rateLimitMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
