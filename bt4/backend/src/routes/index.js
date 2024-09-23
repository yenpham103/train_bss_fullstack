const Router = require('@koa/router');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');

const router = new Router();

router.use(authRoutes.routes());
router.use(productRoutes.routes());
router.use(userRoutes.routes());

module.exports = router;
