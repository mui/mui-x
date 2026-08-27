import { afterEach } from 'vitest';
import sinon from 'sinon';

// Registered only by the browser suites that import Sinon. The module costs about 341kB
// per page and, because `isolate` is off, the page keeps it for the whole run. Add this
// setup file to a package's browser config as soon as one of its tests imports Sinon.
afterEach(() => {
  // Restore the Sinon default sandbox to avoid a memory leak.
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
});
