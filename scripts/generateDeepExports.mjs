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
  'x-charts': {
    /**
     * The list of target packages, they are traversed in order.
     * In this case, `(base -> pro), (base + pro -> premium)`.
     */
    targets: ['x-charts-pro', 'x-charts-premium'],
    /**
     * These directories will check if they contain an export from the previous package in the index.ts file.
     * If they do, they will be ignored.
     * If they don't, they will be exported in an auto-generated block.
     */
    utilities: ['constants', 'hooks', 'context', 'models', 'locales', 'colorPalettes'],
    /**
     * These will be fully ignored.
     */
    ignore: ['internals', 'tests', 'themeAugmentation', 'typeOverloads'],
  },
};

const IDENTIFIER_LINE =
  '// Re-export automatically generated, to customize, simply remove this line.';

const BLOCK_IDENTIFIER_LINE_START =
  '// This re-export-block is automatically generated, to customize, simply remove the block.';
const BLOCK_IDENTIFIER_LINE_END = '// End of re-export-block';

/**
 * Check if a utility already exports from the source package in its index.ts file
 * @param {string} targetPackagePath
 * @param {string} utilityName
 * @param {string} sourcePackageName
 * @returns {boolean}
 */
function isUtilityAlreadyExported(targetPackagePath, utilityName, sourcePackageName) {
  const utilityIndexPath = path.join(targetPackagePath, 'src', utilityName, 'index.ts');

  if (!fs.existsSync(utilityIndexPath)) {
    return false;
  }

  const content = fs.readFileSync(utilityIndexPath, 'utf8');
  const contentWithoutBlocks = removeExistingBlock(content);
  const exportLine = `export * from '@mui/${sourcePackageName}/${utilityName}';`;

  return contentWithoutBlocks.includes(exportLine);
}

/**
 * Remove existing re-export block from content
 * @param {string} content
 * @returns {string}
 */
function removeExistingBlock(content) {
  const lines = content.split('\n');
  const result = [];
  let skipBlock = false;

  for (const line of lines) {
    if (line.trim() === BLOCK_IDENTIFIER_LINE_START) {
      skipBlock = true;
      continue;
    }
    if (line.trim() === BLOCK_IDENTIFIER_LINE_END) {
      skipBlock = false;
      continue;
    }
    if (!skipBlock) {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Check if a utility file has extra exports beyond the re-export block
 * @param {string} targetPackagePath
 * @param {string} utilityName
 * @returns {boolean}
 */
function hasExtraExports(targetPackagePath, utilityName) {
  const utilityIndexPath = path.join(targetPackagePath, 'src', utilityName, 'index.ts');

  if (!fs.existsSync(utilityIndexPath)) {
    return false;
  }

  const content = fs.readFileSync(utilityIndexPath, 'utf8');
  const contentWithoutBlock = removeExistingBlock(content);

  // Check if there's any meaningful content left (not just empty lines or comments)
  const meaningfulLines = contentWithoutBlock.split('\n').filter((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*');
  });

  return meaningfulLines.length > 0;
}

/**
 * Determine the best source package to export from for a utility
 * @param {string} targetPackagePath
 * @param {string} utilityName
 * @param {string[]} sourcePackageChain - Array of source packages in order (e.g., ['x-charts', 'x-charts-pro'])
 * @returns {string} - The package name to export from
 */
function getBestSourcePackage(targetPackagePath, utilityName, sourcePackageChain) {
  const targetPackageName = path.basename(targetPackagePath);

  // Start from the most recent source package and work backwards
  for (let i = sourcePackageChain.length - 1; i >= 0; i -= 1) {
    const sourcePackage = sourcePackageChain[i];

    // Skip the current target package itself
    if (sourcePackage === targetPackageName) {
      continue;
    }

    // Check if this source package has extra exports for this utility
    const sourcePackagePath = path.join(process.cwd(), 'packages', sourcePackage);
    if (hasExtraExports(sourcePackagePath, utilityName)) {
      return sourcePackage;
    }
  }

  // If no source package has extra exports, use the base package
  return sourcePackageChain[0];
}

/**
 * Add re-export block at the beginning of the file
 * @param {string} content
 * @param {string} sourcePackageName
 * @param {string} utilityName
 * @returns {string}
 */
function addReExportBlock(content, sourcePackageName, utilityName) {
  const blockContent = [
    BLOCK_IDENTIFIER_LINE_START,
    `export * from '@mui/${sourcePackageName}/${utilityName}';`,
    BLOCK_IDENTIFIER_LINE_END,
    '',
  ].join('\n');

  return blockContent + content;
}

/**
 * Get component directories from src folder
 * @param {string} packagePath
 * @param {string[]} ignoreList
 * @returns {string[]}
 */
function getComponentDirectories(packagePath, ignoreList) {
  const srcPath = path.join(packagePath, 'src');

  if (!fs.existsSync(srcPath)) {
    return [];
  }

  return fs
    .readdirSync(srcPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !ignoreList.includes(name))
    .filter((name) => {
      const indexFile = path.join(srcPath, name, 'index.ts');
      if (!fs.existsSync(indexFile)) {
        return false;
      }
      const content = fs.readFileSync(indexFile, 'utf8');
      return !content.startsWith(IDENTIFIER_LINE);
    });
}

/**
 * Create deep export file for a component or utility
 * @param {string} targetPackagePath
 * @param {string} componentName
 * @param {string} sourcePackageName
 * @param {string[]} utilities - List of utilities that should use re-export blocks
 * @param {string[]} sourcePackageChain - Array of all source packages in order
 */
function createDeepExportFile(
  targetPackagePath,
  componentName,
  sourcePackageName,
  utilities = [],
  sourcePackageChain = [],
) {
  const exportDir = path.join(targetPackagePath, 'src', componentName);
  const exportFile = path.join(exportDir, 'index.ts');

  // Create directory if it doesn't exist
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  if (utilities.includes(componentName)) {
    // Handle utility with re-export blocks
    let existingContent = '';
    if (fs.existsSync(exportFile)) {
      existingContent = fs.readFileSync(exportFile, 'utf8');
    }

    const bestSourcePackage = getBestSourcePackage(
      targetPackagePath,
      componentName,
      sourcePackageChain,
    );

    // Check if already exported from the best source (outside of auto-generated blocks)
    if (isUtilityAlreadyExported(targetPackagePath, componentName, bestSourcePackage)) {
      return;
    }

    // Remove existing block and add new one
    let updatedContent = removeExistingBlock(existingContent);
    updatedContent = addReExportBlock(updatedContent, bestSourcePackage, componentName);

    // Only write if content changed
    if (updatedContent !== existingContent) {
      fs.writeFileSync(exportFile, updatedContent);
      console.warn(
        `  ✓ Added re-export block for utility ${componentName} from @mui/${bestSourcePackage} in ${path.relative(process.cwd(), targetPackagePath)}`,
      );
    }
    return;
  }

  // For regular components, export from the base package
  const exportContent = `${IDENTIFIER_LINE}
export * from '@mui/${sourcePackageName}/${componentName}';
`;
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
  const targetPackages = PACKAGE_MAPPINGS[basePackageName] || [];

  if (!fs.existsSync(basePackagePath)) {
    console.warn(`Base package not found: ${basePackagePath}`);
    return;
  }

  console.warn(`\n📦 Processing ${basePackageName} -> ${targetPackages.targets.join(' -> ')}...`);

  // Get component directories from the base package
  const componentDirectories = [getComponentDirectories(basePackagePath, targetPackages.ignore)];
  const sourcePackageName = [basePackageName];

  for (const targetPackage of targetPackages.targets) {
    const targetPackagePath = path.join(process.cwd(), 'packages', targetPackage);

    if (!fs.existsSync(targetPackagePath)) {
      console.warn(`Target package not found: ${targetPackagePath}`);
      return;
    }

    // Get additional components specific to pro/premium
    const targetComponentDirs = getComponentDirectories(targetPackagePath, targetPackages.ignore);
    const targetDirectories = componentDirectories.map((dirs) =>
      dirs.filter((name) => !targetComponentDirs.includes(name)),
    );

    console.warn(`\nCreating deep exports for ${targetDirectories.flat().length} components`);

    for (let i = 0; i < targetDirectories.length; i += 1) {
      for (const componentName of targetDirectories[i]) {
        createDeepExportFile(
          targetPackagePath,
          componentName,
          sourcePackageName[i],
          targetPackages.utilities,
          sourcePackageName,
        );
      }
    }

    // Also handle utilities that exist in the target package
    for (const utilityName of targetPackages.utilities) {
      const utilityDirPath = path.join(targetPackagePath, 'src', utilityName);
      if (fs.existsSync(utilityDirPath)) {
        createDeepExportFile(
          targetPackagePath,
          utilityName,
          sourcePackageName[0],
          targetPackages.utilities,
          sourcePackageName,
        );
      }
    }

    // Merge component directories for the next target package
    componentDirectories.push(targetComponentDirs);
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
