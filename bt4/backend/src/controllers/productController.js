const Product = require('../models/Product');

exports.getAllProducts = async (ctx) => {
  const products = await Product.findAll();
  ctx.body = products;
};

exports.updateProductStatus = async (ctx) => {
  const { id } = ctx.params;
  const { status } = ctx.request.body;

  const product = await Product.findByPk(id);
  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'Product not found' };
    return;
  }

  product.status = status;
  await product.save();

  ctx.body = product;
};

exports.updateProductPrice = async (ctx) => {
  const { id } = ctx.params;
  const { price } = ctx.request.body;

  const product = await Product.findByPk(id);
  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'Product not found' };
    return;
  }

  product.price = price;
  await product.save();

  ctx.body = product;
};
