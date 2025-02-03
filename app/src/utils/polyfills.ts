import { Buffer } from 'buffer';

declare global {
  interface Window {
    global: Window;
    Buffer: typeof Buffer;
    process: {
      env: {
        NODE_ENV: string;
      };
      versions: Record<string, string>;
    };
  }
}

if (typeof window.global === 'undefined') {
  window.global = window;
}

window.Buffer = Buffer;

window.process = window.process || {
  env: {
    NODE_ENV: import.meta.env.MODE,
  },
  versions: {},
}; 