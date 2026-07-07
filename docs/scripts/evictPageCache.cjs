/* Preload (NODE_OPTIONS=--require): section-aware eviction of compiled server
 * bundles to counter Next's lack of static-generation worker recycling, WITHOUT
 * the per-page re-compile churn that OOMs the worker's small default heap.
 *
 * Pages render in path order, so each product section (`/x/<section>/...`) is
 * contiguous. We accumulate a section's compiled modules while it renders (chunks
 * stay cached -> no churn), and evict them from require.cache only once the next
 * section starts (they are not needed again). Peak ~= one section's footprint. */
/* eslint-disable no-underscore-dangle */
const Module = require('module');
const path = require('path');

let sharedSnapshot = null;
let currentSection = null;
let sectionKeysBefore = null; // require.cache keys at the section's first page
let evicted = 0;
let pages = 0;

const evictable = (k) => !k.includes(`${path.sep}node_modules${path.sep}`);

function sectionOf(page) {
  // '/x/react-data-grid/overview' -> 'x/react-data-grid'; fall back to the page itself.
  const parts = String(page || '')
    .split('/')
    .filter(Boolean);
  return parts.slice(0, 2).join('/') || '(root)';
}

function makeWrapped(orig) {
  return async function patchedLoadComponents(options) {
    const section = sectionOf(options && options.page);
    if (sharedSnapshot === null) {
      sharedSnapshot = new Set(Object.keys(require.cache));
      sectionKeysBefore = sharedSnapshot;
      currentSection = section;
    } else if (section !== currentSection) {
      // Section boundary: free the finished section's compiled modules.
      for (const k of Object.keys(require.cache)) {
        if (!sectionKeysBefore.has(k) && !sharedSnapshot.has(k) && evictable(k)) {
          delete require.cache[k];
          evicted += 1;
        }
      }
      if (global.gc) {
        global.gc();
      }
      currentSection = section;
      sectionKeysBefore = new Set(Object.keys(require.cache));
    }
    const result = await orig.call(this, options);
    pages += 1;
    if (pages % 25 === 0) {
      const mb = Math.round(process.memoryUsage().rss / 1048576);
      const heap = Math.round(process.memoryUsage().heapUsed / 1048576);
      process.stderr.write(
        `[evict] pid ${process.pid}: ${pages} pages, section ${currentSection}, ${evicted} evicted, rss ${mb}MB heap ${heap}MB\n`,
      );
    }
    return result;
  };
}

let wrapped = null;
const origLoad = Module._load;
Module._load = function patchedModuleLoad(request) {
  const exports = origLoad.apply(this, arguments);
  if (
    typeof request === 'string' &&
    request.endsWith('load-components') &&
    exports &&
    typeof exports.loadComponents === 'function'
  ) {
    return new Proxy(exports, {
      get(target, prop, receiver) {
        if (prop === 'loadComponents') {
          if (!wrapped) {
            wrapped = makeWrapped(target.loadComponents);
          }
          return wrapped;
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
  return exports;
};
