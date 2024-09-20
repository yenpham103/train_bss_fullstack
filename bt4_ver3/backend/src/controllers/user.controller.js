const { User } = require('../models');

exports.getAllProducts = async (ctx) => {
  try {
    const users = await User.findAll();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};
