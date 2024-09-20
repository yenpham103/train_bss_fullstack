const rateLimit = require('koa-ratelimit');

const db = new Map();

module.exports = rateLimit({
  driver: 'memory',
  db: db,
  duration: 1000,
  errorMessage: 'Rate limit exceeded, please try again later.',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  max: 2,
  disableHeader: false,
});
