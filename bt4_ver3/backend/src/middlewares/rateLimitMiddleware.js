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

    while (clientHistory.length && clientHistory[0].timestamp <= windowStart) {
      clientHistory.shift();
    }

    const totalHits = clientHistory.reduce(
      (sum, entry) => sum + entry.count,
      0
    );

    if (totalHits >= this.limit) {
      return false;
    }

    if (
      clientHistory.length &&
      clientHistory[clientHistory.length - 1].timestamp > windowStart
    ) {
      clientHistory[clientHistory.length - 1].count++;
    } else {
      clientHistory.push({ timestamp: now, count: 1 });
    }

    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, history] of this.clients.entries()) {
      const windowStart = now - this.interval;
      while (history.length && history[0].timestamp <= windowStart) {
        history.shift();
      }
      if (history.length === 0) {
        this.clients.delete(key);
      }
    }
  }
}

const limiter = new RateLimiter(2, 1000);

setInterval(() => limiter.cleanup(), 5 * 60 * 1000);

module.exports = async (ctx, next) => {
  const key = `${ctx.ip}:${ctx.path}`;

  if (!limiter.hit(key)) {
    ctx.status = 429;
    ctx.body = {
      error: 'Too Many Requests',
      message:
        'You are sending requests too quickly. Please wait a moment before trying again.',
      retryAfter: 1,
    };
    return;
  }
  await next();
};
