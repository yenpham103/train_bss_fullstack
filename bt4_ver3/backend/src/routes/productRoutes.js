const Router = require('@koa/router');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router({ prefix: '/products' });

router.get('/', authMiddleware, productController.getAllProducts);
// router.post('/', authMiddleware, productController.createProduct);
// Thêm các route khác

module.exports = router;
