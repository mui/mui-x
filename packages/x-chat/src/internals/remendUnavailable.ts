/**
 * CommonJS resolution target for the `#remend` subpath import (see this package's
 * `imports` field, which points ESM at the real `remend` package and CJS here).
 *
 * `remend` is ESM-only — its `exports` map declares no `require` condition — so the
 * CJS build must not name it at all. A bundler that statically resolves a
 * `require('remend')` in that output fails the build outright ("not exported under
 * the conditions [...require...]"), which is why the specifier cannot simply be
 * inlined for every format.
 *
 * Exporting no repair function is the signal: `loadRemend` sees a non-function and
 * degrades to `fallbackRepair`, exactly as it does when `remend` is absent.
 */
export default undefined;
