// Keep adapter import paths and configured peers in sandbox exports until the
// pinned core-docs preview includes the upstream resolver fix.
function fixDemoExportDeps(source) {
  const start = '  const resolveDependencies = packageName => {';
  const end = '\n  return {\n    versions,\n    resolveDependencies\n  };';
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('The core-docs export resolver changed. Update or remove loadDemoExportDeps.');
  }

  const resolver = `  const bundledTypes = [
    ...PACKAGES_WITH_BUNDLED_TYPES,
    '@emotion/cache',
    'date-fns-jalali',
    'rxjs',
    '@tanstack/query-core'
  ];
  const resolveDependencies = (packageName, _envVars, importedModules = [packageName]) => {
    let result = { [packageName]: versions[packageName] ?? 'latest' };

    if (packageName === '@mui/lab' || packageName === '@mui/icons-material' || packageName === '@mui/x-data-grid') {
      result['@mui/material'] = versions['@mui/material'] ?? 'latest';
    }

    if (csbConfig?.postProcessImport) {
      for (const importName of importedModules) {
        Object.assign(result, csbConfig.postProcessImport(importName));
      }
    }

    if (csbConfig?.includePeerDependencies) {
      result = csbConfig.includePeerDependencies(result, { versions });
    }

    if (useTypescriptRef.current) {
      for (const dependency of Object.keys(result)) {
        if (bundledTypes.includes(dependency) || isMuiPackage(dependency) || dependency.startsWith('@types/')) {
          continue;
        }
        result[getTypesPackageName(dependency)] = 'latest';
      }
    }

    return result;
  };`;

  return source.slice(0, startIndex) + resolver + source.slice(endIndex);
}

module.exports = fixDemoExportDeps;
