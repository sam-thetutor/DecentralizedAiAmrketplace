import { Buffer } from 'buffer';

if (typeof global === 'undefined') {
  window.global = window;
}

window.Buffer = Buffer;

window.process = window.process || {
  env: {
    NODE_ENV: import.meta.env.MODE,
  },
  versions: {},
}; 