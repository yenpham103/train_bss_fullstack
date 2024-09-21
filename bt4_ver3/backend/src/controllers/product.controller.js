const { Product } = require('../models');
const { Op } = require('sequelize');

exports.getAllProducts = async (ctx) => {
  try {
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 8;
    const status = ctx.query.status || 'all';
    const userId = ctx.state.user.id;

    const offset = (page - 1) * limit;

    let whereClause = { user_id: userId };

    if (status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);
    ctx.status = 200;
    ctx.body = {
      products: rows,
      currentPage: page,
      totalPages: totalPages,
      totalItems: count,
    };
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

exports.updateProductStatus = async (ctx) => {
  try {
    const { id, status } = ctx.request.body;
    const userId = ctx.state.user.id;

    const product = await Product.findOne({ where: { id, user_id: userId } });

    if (!product) {
      ctx.status = 404;
      ctx.body = { error: 'Product not found' };
      return;
    }

    await product.update({ status });

    ctx.body = product;
  } catch (error) {
    console.error('Error in updateProductStatus:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

exports.updateProductPrice = async (ctx) => {
  try {
    const { id, price } = ctx.request.body;
    const userId = ctx.state.user.id;

    const product = await Product.findOne({ where: { id, user_id: userId } });

    if (!product) {
      ctx.status = 404;
      ctx.body = { error: 'Product not found' };
      return;
    }

    await product.update({ price });

    ctx.body = product;
  } catch (error) {
    console.error('Error in updateProductPrice:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

exports.searchProducts = async (ctx) => {
  try {
    const { search, status = 'all' } = ctx.query;
    const userId = ctx.state.user.id;

    let whereClause = { user_id: userId };

    if (status !== 'all') {
      whereClause.status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    ctx.body = products;
  } catch (error) {
    console.error('Error in searchProducts:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};
