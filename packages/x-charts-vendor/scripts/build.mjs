/**
 * Build d3 vendor libraries from `node_modules`.
 *
 * **Note - transitive dependencies**: Because pnpm lacks a `nohoist` option,
 * if you have a `d3-*` dependency that has a transitive dependency on another
 * module (e.g., `d3-interpolate` depends on `d3-color`) you need to add a
 * compatible version to `package.json:devDependencies` here to make sure we
 * get the library in our `node_modules` and appropriately build it.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { rimraf } from 'rimraf';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vendorPkg = JSON.parse(
  await fs.readFile(path.resolve(__dirname, '../package.json'), 'utf-8'),
);
const VENDOR_PKGS = new Set(Object.keys(vendorPkg.dependencies));

const { log, error } = console;

// Build output directory
const BUILD_DIR = path.resolve(__dirname, '../build');

// Templates.
const getEsmIndex = (pkg) => `// \`x-charts-vendor/${pkg.name}\` (ESM)
// See upstream license: ${pkg.repository.url.replace(/\.git$/, '')}/blob/main/LICENSE
//
// Our ESM package uses the underlying installed dependencies of \`node_modules/${pkg.name}\`
export * from "${pkg.name}";
`;

const getEsmDefaultExport = (pkg) => `export { default } from "${pkg.name}";
`;

const getCjsIndex = (pkg, hasSrc) => `// \`x-charts-vendor/${pkg.name}\` (CommonJS)
// See upstream license: ${pkg.repository.url.replace(/\.git$/, '')}/blob/main/LICENSE
//
// Our CommonJS package relies on transpiled vendor files in \`lib-vendor/${pkg.name}\`
module.exports = require("./lib-vendor/${pkg.name}/${hasSrc ? 'src/' : ''}index.js");
`;

const getTypeDefinitionFile = (pkg) => `// \`x-charts-vendor/${pkg.name}\` (TypeScript)
//
// Export the type definitions for this package:
export * from "${pkg.name}";
`;

const DEFAULT_EXPORT_PKGS = new Set(['flatqueue']);

// Generate the exports field for package.json
const generateExports = (pkgNames) => {
  const exports = {
    './package.json': './package.json',
  };

  for (const pkgName of pkgNames) {
    exports[`./${pkgName}`] = {
      import: {
        types: `./${pkgName}.d.ts`,
        default: `./${pkgName}.mjs`,
      },
      require: {
        types: `./${pkgName}.d.ts`,
        default: `./${pkgName}.js`,
      },
      default: {
        types: `./${pkgName}.d.ts`,
        default: `./${pkgName}.mjs`,
      },
    };
  }

  return exports;
};

// Main.
const main = async () => {
  // Get d3-related packages we want to vendor.
  const pkgs = (await fs.readdir(path.resolve(__dirname, '../node_modules/'))).filter((name) =>
    /^(d3-|internmap|flatqueue)/.test(name),
  );

  // Safety check: we assume that **all** are flattened to root level of this
  // package, and want to make sure there are no nested dependencies.
  for (const pkgName of pkgs) {
    const pkgModsPath = path.resolve(__dirname, `../node_modules/git${pkgName}/node_modules`);
    const stat = await fs.lstat(pkgModsPath).catch(() => null);
    if (stat) {
      throw new Error(`Found nested modules: ${pkgModsPath}`);
    }
  }

  // Clean out and ensure build directory exists
  const VendorBasePath = path.join(BUILD_DIR, 'lib-vendor');

  log('Cleaning old build directory.');
  await rimraf(BUILD_DIR);

  log('Creating build directory.');
  await fs.mkdir(VendorBasePath, { recursive: true });

  // Transpile.
  log('Transpiling vendor sources.');
  await execa(
    'pnpm',
    [
      'babel',
      '--config-file',
      path.resolve(__dirname, '../.babelrc.js'),
      '-d',
      VendorBasePath,
      path.resolve(__dirname, '../node_modules'),
    ],
    {
      stdio: 'inherit',
    },
  );

  // Track vendor package names for explicit exports
  const vendorPkgNames = [];

  // Iterate and generate index files.
  log('Copying licenses and generating indexes.');
  for (const pkgName of pkgs) {
    // Only process packages that are in our dependencies
    if (!VENDOR_PKGS.has(pkgName)) {
      continue;
    }

    log(`- ${pkgName}`);
    vendorPkgNames.push(pkgName);

    const pkgBase = path.resolve(__dirname, `../node_modules/${pkgName}`);
    const pkgPath = path.join(pkgBase, `package.json`);
    const pkg = await fs.readFile(pkgPath).then((buf) => JSON.parse(buf.toString()));
    const libVendorPath = path.join(VendorBasePath, pkgName);

    // Check if the vendor package has a src directory
    let hasSrc = false;
    await fs
      .readdir(path.join(libVendorPath, 'src'))
      .then(() => {
        hasSrc = true;
      })
      .catch(() => {
        hasSrc = false;
      });

    // Generate ESM index
    const esmContent =
      getEsmIndex(pkg) + (DEFAULT_EXPORT_PKGS.has(pkgName) ? getEsmDefaultExport(pkg) : '');

    // Generate CJS index
    const cjsContent = getCjsIndex(pkg, hasSrc);

    // Generate type definitions
    const typeContent = getTypeDefinitionFile(pkg);

    // Write files directly to build directory
    await Promise.all([
      // ESM
      fs.writeFile(path.join(BUILD_DIR, `${pkgName}.mjs`), esmContent),
      // CJS
      fs.writeFile(path.join(BUILD_DIR, `${pkgName}.js`), cjsContent),
      // Types
      fs.writeFile(path.join(BUILD_DIR, `${pkgName}.d.ts`), typeContent),
      // Copy license to lib-vendor
      fs.copyFile(path.join(pkgBase, 'LICENSE'), path.join(libVendorPath, 'LICENSE')).catch(() => {
        // The package has no license file
      }),
    ]);
  }

  // Generate build package.json with explicit exports
  log('Generating build package.json.');
  const buildPkg = { ...vendorPkg };

  // Remove devDependencies and scripts from build package.json
  delete buildPkg.devDependencies;
  delete buildPkg.scripts;

  // Remove publishConfig.directory since the build output is already in the build directory
  if (buildPkg.publishConfig) {
    delete buildPkg.publishConfig.directory;
  }

  // Add type and sideEffects fields for proper module resolution
  buildPkg.type = 'commonjs';
  buildPkg.sideEffects = false;

  // Set explicit exports
  buildPkg.exports = generateExports(vendorPkgNames);

  await fs.writeFile(path.join(BUILD_DIR, 'package.json'), JSON.stringify(buildPkg, null, 2));

  // Copy README.md to build directory
  log('Copying README.md to build directory.');
  await fs.copyFile(path.resolve(__dirname, '../README.md'), path.join(BUILD_DIR, 'README.md'));
};

main()
  .then(() => {
    log('Build finished.');
  })
  .catch((err) => {
    error(err);
    process.exit(1);
  });
