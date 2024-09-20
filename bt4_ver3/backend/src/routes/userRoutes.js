const Router = require('@koa/router');
const userController = require('../controllers/user.controller');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router({ prefix: '/users' });

router.get('/', userController.getAllProducts);
// router.post('/', authMiddleware, productController.createProduct);
// Thêm các route khác

module.exports = router;
