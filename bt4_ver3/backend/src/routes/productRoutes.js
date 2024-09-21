const Router = require('@koa/router');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router({ prefix: '/products' });

router.use(authMiddleware);

// Lấy danh sách sản phẩm (có thể bao gồm phân trang và lọc)
router.get('/', productController.getAllProducts);

// // Tìm kiếm sản phẩm (có thể sử dụng query params)
// router.get('/', productController.searchProducts);

// Lấy thông tin chi tiết của một sản phẩm
// router.get('/:id', productController.getProductById);

// Tạo sản phẩm mới
// router.post('/', productController.createProduct);

// // Cập nhật toàn bộ thông tin sản phẩm
// router.put('/:id', productController.updateProduct);

// Cập nhật một phần thông tin sản phẩm (bao gồm trạng thái và giá)
// router.patch('/:id', productController.partialUpdateProduct);

// // Xóa sản phẩm
// router.delete('/:id', productController.deleteProduct);

module.exports = router;
