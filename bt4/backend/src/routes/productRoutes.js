const Router = require('@koa/router');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');

const router = new Router({ prefix: '/api/products' });

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', productController.getAllProducts);
router.patch('/:id/status', productController.updateProductStatus);
router.patch('/:id/price', productController.updateProductPrice);

module.exports = router;
