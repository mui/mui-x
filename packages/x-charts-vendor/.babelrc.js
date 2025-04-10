/**
 * Transform d3 ESM libraries to vendored CommonJS libraries
 *
 * This produces `lib-vendor/d3-<package name>/src` files that have
 * internally consistent references to other d3 packages. It is only meant
 * to be used for the CommonJS import path.
 */
const path = require('path');
const fs = require('fs');

const packageJsonPath = path.resolve('./package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf8' }));
const babelRuntimeVersion = packageJson.dependencies['@babel/runtime'];

if (!babelRuntimeVersion) {
  throw new Error(
    'package.json needs to have a dependency on `@babel/runtime` when building with `@babel/plugin-transform-runtime`.',
  );
}

module.exports = function getBabelConfig(api) {
  const useESModules = api.env(['modern', 'stable', 'rollup']);

  return {
    only: [/node_modules\/(d3-.*|internmap|delaunator|robust-predicates)\/.*\.js/],
    plugins: [
      [
        '@babel/transform-modules-commonjs',
        {
          strict: false,
          allowTopLevelThis: true,
        },
      ],
      [
        'module-resolver',
        {
          // Convert all imports for _other_ d3 dependencies to the relative
          // path in our vendor package.
          resolvePath(sourcePath, currentFile) {
            const d3pattern =
              /^(?<pkg>(d3-[^\/]+|internmap|delaunator|robust-predicates))(?<path>.*)/;
            const match = d3pattern.exec(sourcePath);
            if (match) {
              // We're assuming a common shape of d3 packages:
              // - Only top level imports "d3-<whatever>"
              // - With no path components (like "d3-<whatever>/path/to.js")
              if (match.groups.path) {
                throw new Error(`Unable to process ${sourcePath} import in ${currentFile}`);
              }

              // Get Vendor package path.
              const vendorPkg = ['delaunator', 'robust-predicates'].includes(match.groups.pkg)
                ? path.resolve(__dirname, `./lib-vendor/${match.groups.pkg}/index.js`)
                : path.resolve(__dirname, `./lib-vendor/${match.groups.pkg}/src/index.js`);

              // Derive relative path to vendor lib to have a file like move from:
              // - 'node_modules/d3-interpolate/src/rgb.js'
              // - 'lib-vendor/d3-interpolate/src/rgb.js'
              // and have an import transform like:
              // - `d3-color` (d3 color is imported by d3-interpolate)
              // - `../../d3-color`
              const currentFileVendor = currentFile.replace(/^node_modules/, 'lib-vendor');
              const relPathToPkg = path
                .relative(path.dirname(currentFileVendor), vendorPkg)
                .replace(/\\/g, '/');

              return relPathToPkg;
            }

            return sourcePath;
          },
        },
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          useESModules,
          // any package needs to declare 7.25.0 as a runtime dependency. default is ^7.0.0
          version: babelRuntimeVersion || '^7.25.0',
        },
      ],
    ],
  };
};
