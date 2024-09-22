const Router = require('@koa/router');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router({ prefix: '/products' });

router.use(authMiddleware);

router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.patch('/:id/status', productController.updateProductStatus);
router.patch('/:id/price', productController.updateProductPrice);

module.exports = router;
