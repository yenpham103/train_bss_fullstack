const Router = require('@koa/router');
const userController = require('../controllers/user.controller');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router({ prefix: '/users' });

router.get('/', userController.getUsers);

module.exports = router;
