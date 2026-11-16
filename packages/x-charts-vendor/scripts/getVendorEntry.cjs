const fs = require('fs');
const path = require('path');

/**
 * Get the ESM entry of a vendored package and the path of its transpiled CommonJS copy.
 * d3 releases from 2026-11 ship a `dist/` bundle instead of `src/`, so read the entry from `package.json`.
 * @param {string} pkgName The vendored package name, for example `d3-scale`.
 * @returns {{ source: string, output: string }} `source` is absolute, `output` is relative to `lib-vendor`.
 */
function getVendorEntry(pkgName) {
  const pkgBase = path.resolve(__dirname, '../node_modules', pkgName);
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgBase, 'package.json'), 'utf8'));
  const exportsField = pkg.exports?.['.'] ?? pkg.exports;
  const entry =
    (typeof exportsField === 'string' ? exportsField : exportsField?.default) ??
    pkg.module ??
    pkg.main ??
    'index.js';

  return {
    source: path.join(pkgBase, entry),
    // Babel writes `.mjs` sources as `.js` files.
    output: path.posix.join(pkgName, entry.replace(/\.mjs$/, '.js')),
  };
}

module.exports = { getVendorEntry };
