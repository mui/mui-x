/**
 * Component discovery: finds component files across packages.
 */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'node:fs';
import { CWD } from './config';
import type { PackageConfig, DiscoveredComponent } from './types';

export function getComponentFilesInFolder(folderPath: string): string[] {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  const results: string[] = [];
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getComponentFilesInFolder(fullPath));
    } else if (/^[A-Z].*\.tsx$/.test(entry.name)) {
      results.push(fullPath.replace(/\\/g, '/'));
    }
  }
  return results;
}

export function discoverComponents(
  configs: PackageConfig[],
  checker: ts.TypeChecker,
  program: ts.Program,
): DiscoveredComponent[] {
  const components: DiscoveredComponent[] = [];

  for (const config of configs) {
    const pkgRoot = path.resolve(CWD, config.packageDir);
    const files = getComponentFilesInFolder(path.join(pkgRoot, 'src'));

    for (const filePath of files) {
      const componentName = path.basename(filePath, '.tsx');

      // Skip hooks
      if (componentName.startsWith('use')) {
        continue;
      }

      // Let the family's skip function decide
      if (config.skipComponent?.(componentName, filePath)) {
        continue;
      }

      // Verify the component is exported from the package entry point
      const entryPath = path.resolve(pkgRoot, 'src/index.ts');
      const entryFile = program.getSourceFile(entryPath);
      if (entryFile) {
        const entrySymbol = checker.getSymbolAtLocation(entryFile);
        if (entrySymbol) {
          const exports = checker.getExportsOfModule(entrySymbol);
          const isExported = exports.some(
            (exp) =>
              exp.name === componentName ||
              (config.includeUnstable && exp.name === `Unstable_${componentName}`),
          );
          if (!isExported) {
            continue;
          }
        }
      }

      // Verify the TS program can see the file
      if (!program.getSourceFile(filePath)) {
        continue;
      }

      components.push({
        name: componentName,
        filePath,
        packageName: config.name,
        packageDir: config.packageDir,
        section: config.section,
        reExportPackages: config.reExportPackages,
        defaultForwardsRefTo: config.defaultForwardsRefTo,
        subdirImportForAllPackages: config.subdirImportForAllPackages,
      });
    }
  }

  return components;
}
