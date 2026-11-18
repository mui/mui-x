/**
 * Transform d3 ESM libraries to vendored CommonJS libraries
 *
 * This transpiles the ESM entry of each package to `lib-vendor/<package name>`,
 * with internally consistent references to other d3 packages. It is only meant
 * to be used for the CommonJS import path.
 */
const path = require('path');
const fs = require('fs');
const { getVendorEntry } = require('./scripts/getVendorEntry.cjs');

const packageJsonPath = path.resolve('./package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf8' }));

const vendorEntrySources = new Set(
  Object.keys(packageJson.dependencies)
    .filter((name) => /^(d3-|internmap|flatqueue)/.test(name))
    .map((name) => getVendorEntry(name).source),
);
let babelRuntimeVersion = packageJson.dependencies['@babel/runtime'];

if (!babelRuntimeVersion) {
  throw new Error(
    'package.json needs to have a dependency on `@babel/runtime` when building with `@babel/plugin-transform-runtime`.',
  );
} else if (babelRuntimeVersion === 'catalog:') {
  const runtimePackageJsonPath = require.resolve('@babel/runtime/package.json');
  babelRuntimeVersion = JSON.parse(
    fs.readFileSync(runtimePackageJsonPath, { encoding: 'utf8' }),
  ).version;
}

module.exports = function getBabelConfig(api) {
  // The config no longer varies by env, so it can be cached for the whole run.
  api.cache(true);

  return {
    // Only the entries: the UMD and minified copies in `dist/` are not used.
    only: [(filename) => vendorEntrySources.has(filename)],
    plugins: [
      [
        '@babel/plugin-transform-modules-commonjs',
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
            const d3pattern = /^(?<pkg>(d3-[^\/]+|internmap|flatqueue))(?<path>.*)/;
            const match = d3pattern.exec(sourcePath);
            if (match) {
              // We're assuming a common shape of d3 packages:
              // - Only top level imports "d3-<whatever>"
              // - With no path components (like "d3-<whatever>/path/to.js")
              if (match.groups.path) {
                throw new Error(`Unable to process ${sourcePath} import in ${currentFile}`);
              }

              // Get Vendor package path (just the package structure, no lib-vendor prefix).
              const vendorPkg = getVendorEntry(match.groups.pkg).output;

              // Derive relative path to vendor lib to have a file like move from:
              // - 'node_modules/d3-interpolate/dist/d3-interpolate.mjs'
              // - 'd3-interpolate/dist/d3-interpolate.mjs'
              // and have an import transform like:
              // - `d3-color` (d3 color is imported by d3-interpolate)
              // - `../../d3-color/dist/d3-color.js`
              // Extract just the package-relative path from the full file path
              const nodeModulesIndex = currentFile.indexOf('node_modules/');
              const relativePath =
                nodeModulesIndex !== -1
                  ? currentFile.slice(nodeModulesIndex + 'node_modules/'.length)
                  : currentFile;
              const relPathToPkg = path
                .relative(path.dirname(relativePath), vendorPkg)
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
          // Let the plugin use all the helpers available in the installed runtime version.
          version: babelRuntimeVersion,
        },
      ],
    ],
  };
};
