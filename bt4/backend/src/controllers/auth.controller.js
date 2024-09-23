const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.login = async (ctx) => {
  const { email, password } = ctx.request.body;

  const user = await User.findOne({ where: { email } });

  if (!user || !bcrypt.compare(password, user.password)) {
    ctx.status = 401;
    ctx.body = { message: 'Email hoặc mật khẩu không chính xác' };
    return;
  }

  // Tạo token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  ctx.body = { access_token: token };
};
