const { User } = require('../models');

exports.getUsers = async (ctx) => {
  try {
    const users = await User.findAll();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};
