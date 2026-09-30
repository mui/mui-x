import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Node-only: reads the source tree and package.json off disk, so the browser project
// excludes this directory (see `vitest.config.browser.mts`). The runtime behaviour of
// the loader is covered in `src/internals/streamingMarkdownRepair.test.ts`, which stays
// browser-compatible.
//
// `remend` is ESM-only, so the specifier it is imported under has to differ per output
// format. Getting that wrong is invisible to a unit test but breaks consumers: a
// specifier a bundler can't statically resolve leaves an unresolvable bare import in the
// browser bundle — dead code, plus a global load-error event under bundlers that wrap
// dynamic imports in a preload helper. Naming `remend` directly in the CJS output fails
// the build instead. See https://github.com/mui/mui-x/issues/23160.
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

describe('remend specifier packaging', () => {
  it('imports a statically analyzable specifier', () => {
    const source = fs.readFileSync(
      path.join(packageRoot, 'src/internals/streamingMarkdownRepair.ts'),
      'utf8',
    );

    expect(source).to.contain("import('#remend')");
    // A specifier read from a variable, or hidden behind an ignore hint, is
    // unanalyzable: bundlers leave a bare specifier that can never resolve in a
    // browser instead of bundling the dependency.
    expect(source).not.to.match(/import\(\s*(\/\*[^*]*\*\/\s*)*[A-Za-z_$]/);
  });

  it('maps `#remend` per module format in package.json', () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
    const remendImport = packageJson.imports['#remend'];

    // ESM gets the real package, so bundlers resolve and bundle it.
    expect(remendImport.import).to.equal('remend');
    // Every other condition (CJS) resolves to a file inside this package rather than
    // to `remend`, which declares no `require` export — a bundler resolving that in
    // the CJS output fails the build outright.
    expect(remendImport.default).to.match(/^\.\//);
    expect(packageJson.dependencies.remend).to.be.a('string');
  });
});
