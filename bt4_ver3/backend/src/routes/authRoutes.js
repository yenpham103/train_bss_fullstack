const Router = require('@koa/router');
const authController = require('../controllers/auth.controller');

const router = new Router({ prefix: '/auth' });

// Route đăng nhập
router.post('/login', authController.login);

module.exports = router;
