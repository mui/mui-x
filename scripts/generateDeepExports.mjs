#!/usr/bin/env node
/* eslint-disable no-console */
// @ts-check
/**
 * Script to generate deep exports for pro and premium package versions.
 *
 * This script creates individual export files for each component/utility
 * so they can be imported as:
 * import { PieChart } from '@mui/x-charts-pro/PieChart'
 * import { DataGrid } from '@mui/x-data-grid-premium/DataGrid'
 */

import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

// Define package mappings (base -> pro)
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
 * @returns {Promise<boolean>}
 */
async function isUtilityAlreadyExported(targetPackagePath, utilityName, sourcePackageName) {
  const utilityIndexPath = path.join(targetPackagePath, 'src', utilityName, 'index.ts');

  try {
    const content = await fs.readFile(utilityIndexPath, 'utf8');
    const contentWithoutBlocks = removeExistingBlock(content);
    const exportLine = `export * from '@mui/${sourcePackageName}/${utilityName}';`;

    return contentWithoutBlocks.includes(exportLine);
  } catch (_) {
    return false;
  }
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
 * @returns {Promise<boolean>}
 */
async function hasExtraExports(targetPackagePath, utilityName) {
  const utilityIndexPath = path.join(targetPackagePath, 'src', utilityName, 'index.ts');

  try {
    const content = await fs.readFile(utilityIndexPath, 'utf8');
    const contentWithoutBlock = removeExistingBlock(content);

    // Check if there's any meaningful content left (not just empty lines or comments)
    const meaningfulLines = contentWithoutBlock.split('\n').filter((line) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*');
    });

    return meaningfulLines.length > 0;
  } catch (_) {
    return false;
  }
}

/**
 * Determine the best source package to export from for a utility
 * @param {string} targetPackagePath
 * @param {string} utilityName
 * @param {string[]} sourcePackageChain - Array of source packages in order (e.g., ['x-charts', 'x-charts-pro'])
 * @returns {Promise<string>} - The package name to export from
 */
async function getBestSourcePackage(targetPackagePath, utilityName, sourcePackageChain) {
  const targetPackageName = path.basename(targetPackagePath);

  const sourcePackageChecks = sourcePackageChain
    .filter((sourcePackage) => sourcePackage !== targetPackageName) // Skip the current target package
    .map(async (sourcePackage) => {
      const sourcePackagePath = path.join(process.cwd(), 'packages', sourcePackage);
      const hasExtras = await hasExtraExports(sourcePackagePath, utilityName);
      return hasExtras ? sourcePackage : null;
    });

  const results = await Promise.all(sourcePackageChecks);

  // Find the first non-null result (prioritizing later packages in the chain)
  for (let i = results.length - 1; i >= 0; i -= 1) {
    const result = results[i];
    if (result !== null) {
      return result;
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
 * @returns {Promise<string[]>}
 */
async function getComponentDirectories(packagePath, ignoreList) {
  const srcPath = path.join(packagePath, 'src');

  const dirents = await fs.readdir(srcPath, { withFileTypes: true });

  const directories = dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !ignoreList.includes(name));

  const validityChecks = await Promise.all(
    directories.map(async (name) => {
      const tsxIndex = path.join(srcPath, name, 'index.tsx');

      if (existsSync(tsxIndex)) {
        console.warn(`  ⚠️  Warning: Found 'index.tsx' in ${name}, renaming to 'index.ts'`);
        await fs.rename(tsxIndex, tsxIndex.replace('.tsx', '.ts'));
      }

      const indexFile = path.join(srcPath, name, 'index.ts');
      try {
        const content = await fs.readFile(indexFile, 'utf8');
        return { name, isValid: !content.startsWith(IDENTIFIER_LINE) };
      } catch (_) {
        return { name, isValid: false };
      }
    }),
  );

  return validityChecks.filter(({ isValid }) => isValid).map(({ name }) => name);
}

/**
 * Create deep export file for a component or utility
 * @param {string} targetPackagePath
 * @param {string} componentName
 * @param {string} sourcePackageName
 * @param {string[]} utilities - List of utilities that should use re-export blocks
 * @param {string[]} sourcePackageChain - Array of all source packages in order
 */
async function createDeepExportFile(
  targetPackagePath,
  componentName,
  sourcePackageName,
  utilities = [],
  sourcePackageChain = [],
) {
  const exportDir = path.join(targetPackagePath, 'src', componentName);
  const exportFile = path.join(exportDir, 'index.ts');

  // Create directory if it doesn't exist
  await fs.mkdir(exportDir, { recursive: true });

  if (utilities.includes(componentName)) {
    // Handle utility with re-export blocks
    let existingContent = '';
    try {
      existingContent = await fs.readFile(exportFile, 'utf8');
    } catch (_) {
      // Ignore errors
    }

    const bestSourcePackage = await getBestSourcePackage(
      targetPackagePath,
      componentName,
      sourcePackageChain,
    );

    // Check if already exported from the best source (outside of auto-generated blocks)
    if (await isUtilityAlreadyExported(targetPackagePath, componentName, bestSourcePackage)) {
      return;
    }

    // Remove existing block and add new one
    let updatedContent = removeExistingBlock(existingContent);
    updatedContent = addReExportBlock(updatedContent, bestSourcePackage, componentName);

    // Only write if content changed
    if (updatedContent !== existingContent) {
      await fs.writeFile(exportFile, updatedContent);
      console.log(
        `  ✓ Added re-export block for utility ${componentName} from @mui/${bestSourcePackage} in ${path.relative(process.cwd(), targetPackagePath)}`,
      );
    }
    return;
  }

  // For regular components, export from the base package
  const exportContent = `${IDENTIFIER_LINE}
export * from '@mui/${sourcePackageName}/${componentName}';
`;
  await fs.writeFile(exportFile, exportContent);
  console.log(
    `✓ Created deep export for ${componentName} in ${path.relative(process.cwd(), targetPackagePath)}`,
  );
}

/**
 * Process a base package and create deep exports for its components in target packages.
 * @param {string} basePackageName
 */
async function processPackage(basePackageName) {
  const basePackagePath = path.join(process.cwd(), 'packages', basePackageName);
  /** @type {{targets: string[]; ignore: string[]; utilities: string[];}} */
  const targetPackages = PACKAGE_MAPPINGS[basePackageName] || {};

  console.log(`\n📦 Processing ${basePackageName} -> ${targetPackages.targets.join(' -> ')}...`);

  // Get component directories from the base package
  const componentDirectories = [
    await getComponentDirectories(basePackagePath, targetPackages.ignore),
  ];
  const sourcePackageChain = [basePackageName];

  for (const targetPackage of targetPackages.targets) {
    const targetPackagePath = path.join(process.cwd(), 'packages', targetPackage);

    // Get additional components specific to pro/premium
    // eslint-disable-next-line no-await-in-loop
    const targetComponentDirs = await getComponentDirectories(
      targetPackagePath,
      targetPackages.ignore,
    );
    const targetDirectories = componentDirectories.map((dirs) =>
      dirs.filter((name) => !targetComponentDirs.includes(name)),
    );

    console.log(`\nCreating deep exports for ${targetDirectories.flat().length} components`);

    const componentTasks = targetDirectories.flatMap((componentNames, i) =>
      componentNames.map((componentName) =>
        createDeepExportFile(
          targetPackagePath,
          componentName,
          sourcePackageChain[i],
          targetPackages.utilities,
          sourcePackageChain,
        ),
      ),
    );

    const utilityTasks = targetPackages.utilities
      .filter((utilityName) => {
        const utilityDirPath = path.join(targetPackagePath, 'src', utilityName);
        return existsSync(utilityDirPath);
      })
      .map((utilityName) =>
        createDeepExportFile(
          targetPackagePath,
          utilityName,
          sourcePackageChain[0],
          targetPackages.utilities,
          sourcePackageChain,
        ),
      );

    // eslint-disable-next-line no-await-in-loop
    await Promise.all([...componentTasks, ...utilityTasks]);

    // Merge component directories for the next target package
    componentDirectories.push(targetComponentDirs);
    sourcePackageChain.push(targetPackage);
  }
}

// Main execution
async function main() {
  console.log('🚀 Generating deep exports for pro and premium packages...\n');

  // Process packages sequentially to maintain dependency order
  for (const basePackageName of Object.keys(PACKAGE_MAPPINGS)) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await processPackage(basePackageName);
    } catch (error) {
      console.error(`\nError processing ${basePackageName}:\n`);
      throw error;
    }
  }

  console.log('\n✅ Deep exports generation completed!');
}

// Run the script
main();
