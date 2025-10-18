/* eslint-env node */
import '@testing-library/jest-dom';

if (globalThis.process?.env) {
  globalThis.process.env.VITE_BACKEND_URL =
    globalThis.process.env.VITE_BACKEND_URL ?? 'http://localhost:3000';
}

import { TextEncoder, TextDecoder } from 'util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}
