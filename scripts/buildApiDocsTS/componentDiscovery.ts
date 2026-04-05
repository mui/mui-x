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
    let files: string[] = [];

    // Always scan — whitelist mode filters by name afterwards
    files = getComponentFilesInFolder(path.join(pkgRoot, 'src'));
    const allowedNames = config.componentNames ? new Set(config.componentNames) : null;

    for (const filePath of files) {
      if (!fs.existsSync(filePath)) {
        continue;
      }
      if (config.skipComponent?.(filePath)) {
        continue;
      }

      const componentName = path.basename(filePath, '.tsx');
      if (componentName.startsWith('use')) {
        continue;
      }

      // In whitelist mode, only include components in the allowed set
      if (allowedNames && !allowedNames.has(componentName)) {
        continue;
      }

      // Check if exported from the package
      const sourceFile = program.getSourceFile(filePath);
      if (!sourceFile) {
        continue;
      }

      // For scan mode, verify the component is actually exported
      if (config.discovery === 'scan') {
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
      }

      components.push({
        name: componentName,
        filePath,
        packageName: config.name,
        packageDir: config.packageDir,
        section: config.section,
        reExportPackages: config.reExportPackages,
      });
    }
  }

  return components;
}
