const { Product } = require('../models');

exports.getAllProducts = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const products = await Product.findAll({ where: { user_id: userId } });
    ctx.body = products;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

// Thêm các phương thức khác như createProduct, updateProduct, deleteProduct
