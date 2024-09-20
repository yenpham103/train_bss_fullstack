class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit;
    this.interval = interval;
    this.clients = new Map();
  }

  hit(key) {
    const now = Date.now();
    if (!this.clients.has(key)) {
      this.clients.set(key, [{ timestamp: now, count: 1 }]);
      return true;
    }

    const clientHistory = this.clients.get(key);
    const windowStart = now - this.interval;

    while (clientHistory.length && clientHistory[0].timestamp < windowStart) {
      clientHistory.shift();
    }

    if (
      clientHistory.length &&
      clientHistory[clientHistory.length - 1].timestamp > windowStart
    ) {
      const totalHits = clientHistory.reduce(
        (sum, entry) => sum + entry.count,
        0
      );
      if (totalHits >= this.limit) {
        return false;
      }
      clientHistory[clientHistory.length - 1].count++;
    } else {
      clientHistory.push({ timestamp: now, count: 1 });
    }

    return true;
  }
}

const limiter = new RateLimiter(2, 1000);

module.exports = async (ctx, next) => {
  const key = ctx.ip;
  if (!limiter.hit(key)) {
    ctx.status = 429;
    ctx.body = { error: 'Too Many Requests' };
    return;
  }
  await next();
};
