const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
  const token = ctx.header.authorization?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: 'No token provided' };
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid token' };
  }
};
