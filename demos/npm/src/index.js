'use strict';

// lru-cache 7.x ships a CommonJS entry point, so requiring it directly works.
const { LRUCache } = require('lru-cache');

const cache = new LRUCache({ max: 100 });

/** Store a value under a key, evicting the least-recently-used entry at capacity. */
exports.remember = function remember(key, value) {
  cache.set(key, value);
};

/** Return the value for a key, or `undefined` if it is not currently cached. */
exports.recall = function recall(key) {
  return cache.get(key);
};
