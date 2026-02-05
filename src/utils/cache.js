// Simple in-memory cache with TTL (time-to-live)

class InMemoryCache {
  constructor() {
    this.store = new Map();
  }

  _isExpired(entry) {
    return entry.expiresAt !== null && Date.now() > entry.expiresAt;
  }

  set(key, value, ttlMs = 60000) {
    const expiresAt = ttlMs ? Date.now() + ttlMs : null;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (this._isExpired(entry)) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

// Export a singleton instance for the whole app
const cache = new InMemoryCache();

module.exports = cache;
