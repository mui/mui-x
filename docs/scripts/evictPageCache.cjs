/* Preload (NODE_OPTIONS=--require) that evicts each page's compiled server bundle
 * from require.cache after it renders, countering Next's lack of static-generation
 * worker recycling. Next's dist exports are non-configurable getters, so we wrap
 * the load-components module in a Proxy to intercept `loadComponents`. */
/* eslint-disable no-underscore-dangle */
const Module = require('module');
const path = require('path');

let sharedSnapshot = null;
let prevAdded = null;
let evicted = 0;
let pages = 0;

const evictable = (k) => !k.includes(`${path.sep}node_modules${path.sep}`);

function makeWrapped(orig) {
  return async function patchedLoadComponents(...args) {
    if (sharedSnapshot === null) {
      sharedSnapshot = new Set(Object.keys(require.cache));
    } else if (prevAdded) {
      for (const k of prevAdded) {
        if (!sharedSnapshot.has(k)) {
          delete require.cache[k];
          evicted += 1;
        }
      }
      if (global.gc) {
        global.gc();
      }
    }
    const before = new Set(Object.keys(require.cache));
    const result = await orig.apply(this, args);
    prevAdded = Object.keys(require.cache).filter((k) => !before.has(k) && evictable(k));
    pages += 1;
    if (pages % 25 === 0) {
      const mb = Math.round(process.memoryUsage().rss / 1048576);
      process.stderr.write(
        `[evict] pid ${process.pid}: ${pages} pages, ${evicted} evicted, rss ${mb}MB\n`,
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
