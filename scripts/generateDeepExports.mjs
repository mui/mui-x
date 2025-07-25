#!/usr/bin/env node
// @ts-check
/**
 * Script to generate deep exports for pro and premium package versions.
 *
 * This script creates individual export files for each component/utility
 * so they can be imported as:
 * import { PieChart } from '@mui/x-charts-pro/PieChart'
 * import { DataGrid } from '@mui/x-data-grid-premium/DataGrid'
 */

import fs from 'fs';
import path from 'path';

// Define package mappings (base -> pro])
const PACKAGE_MAPPINGS = {
  'x-charts': ['x-charts-pro', 'x-charts-premium'],
  // 'x-data-grid': ['x-data-grid-pro', 'x-data-grid-premium'],
  // 'x-date-pickers': ['x-date-pickers-pro'],
  // 'x-tree-view': ['x-tree-view-pro'],
};

const IDENTIFIER_LINE =
  '// Re-export automatically generated, to customize, simply remove this line.';

/**
 * Get component directories from src folder
 * @param {string} packagePath
 * @returns {string[]}
 */
function getComponentDirectories(packagePath) {
  const srcPath = path.join(packagePath, 'src');

  if (!fs.existsSync(srcPath)) {
    return [];
  }

  return (
    fs
      .readdirSync(srcPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => {
        // Filter out utility directories that typically don't contain main components
        const utilityDirs = [
          'internals',
          'context',
          'hooks',
          'models',
          'constants',
          'tests',
          'themeAugmentation',
          'locales',
          'colorPalettes',
          'typeOverloads',
        ];
        return !utilityDirs.includes(name);
      })
      // Also remove directories that don't have an index.ts file or the index.ts file starts with the IDENTIFIER_LINE
      .filter((name) => {
        const indexFile = path.join(srcPath, name, 'index.ts');
        if (!fs.existsSync(indexFile)) {
          return false;
        }
        const content = fs.readFileSync(indexFile, 'utf8');
        return !content.startsWith(IDENTIFIER_LINE);
      })
  );
}

/**
 * Create deep export file for a component
 *
 * @param {string} targetPackagePath
 * @param {string} componentName
 * @param {string} sourcePackageName
 * @param {boolean} isProOrPremium
 */
function createDeepExportFile(targetPackagePath, componentName, sourcePackageName, isProOrPremium) {
  const exportDir = path.join(targetPackagePath, 'src', componentName);
  const exportFile = path.join(exportDir, 'index.ts');

  // Create directory if it doesn't exist
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  let exportContent;

  if (isProOrPremium) {
    // For pro/premium packages, export from both the base package and the pro/premium specific exports
    exportContent = `${IDENTIFIER_LINE}
export * from '@mui/${sourcePackageName}/${componentName}';
`;
  }
  fs.writeFileSync(exportFile, exportContent);

  console.warn(
    `✓ Created deep export for ${componentName} in ${path.relative(process.cwd(), targetPackagePath)}`,
  );
}

/**
 * Process a base package and create deep exports for its components in target packages.
 * @param {string} basePackageName
 */
function processPackage(basePackageName) {
  const basePackagePath = path.join(process.cwd(), 'packages', basePackageName);
  /** @type {string[]} */
  const targetPackages = PACKAGE_MAPPINGS[basePackageName] || [];

  if (!fs.existsSync(basePackagePath)) {
    console.warn(`Base package not found: ${basePackagePath}`);
    return;
  }

  console.warn(`\n📦 Processing ${basePackageName} -> ${targetPackages.join(' -> ')}...`);

  // Get component directories from the base package
  const componentDirectories = [getComponentDirectories(basePackagePath)];
  const sourcePackageName = [basePackageName];

  for (const targetPackage of targetPackages) {
    // Process pro and premium packages
    const targetPackagePath = path.join(process.cwd(), 'packages', targetPackage);

    if (!fs.existsSync(targetPackagePath)) {
      console.warn(`Target package not found: ${targetPackagePath}`);
      return;
    }

    // Get additional components specific to pro/premium
    const targetComponentDirs = getComponentDirectories(targetPackagePath);
    const targetDirectories = componentDirectories.map((dirs) =>
      dirs.filter((name) => !targetComponentDirs.includes(name)),
    );

    console.warn(`Creating deep exports for ${targetDirectories.flat().length} components`);

    for (let i = 0; i < targetDirectories.length; i += 1) {
      for (const componentName of targetDirectories[i]) {
        createDeepExportFile(targetPackagePath, componentName, sourcePackageName[i], true);
      }
    }

    // Merge component directories for the next target package
    componentDirectories.push(targetComponentDirs);
    // Update source package for next iteration
    sourcePackageName.push(targetPackage);
  }
}

// Main execution
function main() {
  console.warn('🚀 Generating deep exports for pro and premium packages...\n');

  for (const basePackageName of Object.keys(PACKAGE_MAPPINGS)) {
    try {
      processPackage(basePackageName);
    } catch (error) {
      console.error(`Error processing ${basePackageName}:`, error);
      throw error;
    }
  }

  console.warn('\n✅ Deep exports generation completed!');
}

// Run the script
main();
