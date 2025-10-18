// This file runs before Jest loads any tests
import dotenv from 'dotenv';
import http from 'http';

// Load test environment variables
process.env.NODE_ENV = 'test';
dotenv.config({ path: '.env.test' });

// Prevent actual network binding during tests (sandbox restrictions)
http.Server.prototype.listen = function (...args) {
  const maybeCallback = args[args.length - 1];
  const callback = typeof maybeCallback === 'function' ? maybeCallback : null;

  this._mockAddress = { port: 0 };
  const originalAddress = this.address;
  this.address = () => this._mockAddress;

  if (callback) {
    callback.call(this);
  }

  this.close = (cb) => {
    if (typeof cb === 'function') {
      cb.call(this);
    }
    this.address = originalAddress;
    return this;
  };

  return this;
};
