#!/usr/bin/env node
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
  'x-charts': 'x-charts-pro',
  'x-charts-pro': 'x-charts-premium',
  'x-data-grid': 'x-data-grid-pro',
  'x-data-grid-pro': 'x-data-grid-premium',
  'x-date-pickers': 'x-date-pickers-pro',
  'x-tree-view': 'x-tree-view-pro',
};

// Get component directories from src folder
function getComponentDirectories(packagePath) {
  const srcPath = path.join(packagePath, 'src');

  if (!fs.existsSync(srcPath)) {
    return [];
  }

  return fs
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
    });
}

// Create deep export file for a component
function createDeepExportFile(targetPackagePath, componentName, sourcePackageName, isProOrPremium) {
  const exportDir = path.join(targetPackagePath, componentName);
  const exportFile = path.join(exportDir, 'index.ts');

  // Create directory if it doesn't exist
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  let exportContent;

  if (isProOrPremium) {
    // For pro/premium packages, export from both the base package and the pro/premium specific exports
    exportContent = `// Re-export automatically generated with generateDeepExports.mjs
export * from '@mui/${sourcePackageName}/${componentName}';
`;
  }
  fs.writeFileSync(exportFile, exportContent);

  console.warn(
    `✓ Created deep export for ${componentName} in ${path.relative(process.cwd(), targetPackagePath)}`,
  );
}

// Main processing function
function processPackage(basePackageName) {
  const basePackagePath = path.join(process.cwd(), 'packages', basePackageName);
  const targetPackage = PACKAGE_MAPPINGS[basePackageName] || '';

  if (!fs.existsSync(basePackagePath)) {
    console.warn(`Base package not found: ${basePackagePath}`);
    return;
  }

  console.warn(`\n📦 Processing ${basePackageName}...`);

  // Get component directories from the base package
  const componentDirectories = getComponentDirectories(basePackagePath);

  console.warn(
    `Found ${componentDirectories.length} component directories:`,
    componentDirectories.join(', '),
  );

  // Process pro and premium packages
  const targetPackagePath = path.join(process.cwd(), 'packages', targetPackage);

  if (!fs.existsSync(targetPackagePath)) {
    console.warn(`Target package not found: ${targetPackagePath}`);
    return;
  }

  console.warn(`\n  📦 Processing ${targetPackage}...`);

  // Get additional components specific to pro/premium
  const targetComponentDirs = getComponentDirectories(targetPackagePath);
  const allComponents = componentDirectories.filter((name) => !targetComponentDirs.includes(name));

  console.warn(`Creating deep exports for ${allComponents.length} components`);

  for (const componentName of allComponents) {
    createDeepExportFile(targetPackagePath, componentName, basePackageName, true);
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
  console.warn('\nComponents can now be imported as:');
  console.warn('  import { PieChart } from "@mui/x-charts-pro/PieChart"');
  console.warn('  import { DataGrid } from "@mui/x-data-grid-premium/DataGrid"');
  console.warn('  import { DatePicker } from "@mui/x-date-pickers-pro/DatePicker"');
}

// Run the script
main();
