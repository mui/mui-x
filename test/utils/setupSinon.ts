import { afterEach } from 'vitest';
import sinon from 'sinon';

// Registered only by the browser suites that actually import Sinon. The module costs about
// 341kB per page and, with `isolate: false`, the page holds it for the whole run.
afterEach(() => {
  // Restore the Sinon default sandbox to avoid a memory leak.
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
});
