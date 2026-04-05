#!/usr/bin/env tsx
/* eslint-disable no-console */
/**
 * Generates API documentation from TypeScript type definitions.
 * Replaces both `pnpm proptypes` and `pnpm docs:api`.
 *
 * Usage: tsx scripts/buildApiDocsTS/index.ts [--grep pattern]
 */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createTSProgram } from './createProgram';
import { getPackageConfigs } from './config';
import { discoverComponents } from './componentDiscovery';
import { loadDemos } from './demoLoader';
import { extractComponentApi } from './componentExtractor';
import { generateComponentFiles, generateManifest } from './outputGenerator';
import { buildInterfaceDocumentation } from './interfaceBuilder';
import { buildGridEventsDocumentation } from './gridEventsBuilder';
import { buildGridSelectorsDocumentation } from './gridSelectorsBuilder';
import { buildExportsDocumentation } from './exportsBuilder';
import { cleanupStaleFiles, writeAllFiles } from './fileWriter';
import type { FileWrite, ComponentApi } from './types';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const start = Date.now();

  console.log('Creating TypeScript program...');
  const { program, checker } = createTSProgram();
  console.log(`  Program created in ${Date.now() - start}ms`);

  console.log('Loading demos from markdown...');
  const demos = loadDemos();
  console.log(`  Found demos for ${demos.size} components`);

  console.log('Discovering components...');
  const configs = getPackageConfigs();
  const components = discoverComponents(configs, checker, program);
  console.log(`  Found ${components.length} components`);

  console.log('Extracting component APIs...');
  const allFiles: FileWrite[] = [];
  const componentsBySection = new Map<string, ComponentApi[]>();

  for (const comp of components) {
    const api = extractComponentApi(comp, checker, program, demos);
    if (!api) {
      continue;
    }

    const sectionComponents = componentsBySection.get(comp.section) || [];
    sectionComponents.push(api);
    componentsBySection.set(comp.section, sectionComponents);

    allFiles.push(...generateComponentFiles(api));
    console.log(`  ${api.name}\r`);
  }
  console.log(`  Extracted ${allFiles.length / 3} component APIs`);

  // Generate manifests
  console.log('Generating manifests...');
  for (const [section, comps] of componentsBySection) {
    allFiles.push(generateManifest(section, comps));
  }

  // Interface documentation
  console.log('Building interface documentation...');
  allFiles.push(...buildInterfaceDocumentation(checker, program));

  // Grid events
  console.log('Building grid events...');
  allFiles.push(...buildGridEventsDocumentation(checker, program));

  // Grid selectors
  console.log('Building grid selectors...');
  allFiles.push(...buildGridSelectorsDocumentation(checker, program));

  // Exports
  console.log('Building exports documentation...');
  allFiles.push(...buildExportsDocumentation(checker, program));

  // Clean up stale files from previous runs
  console.log('Cleaning up stale files...');
  cleanupStaleFiles(allFiles);

  // Write all files
  console.log(`Writing ${allFiles.length} files...`);
  await writeAllFiles(allFiles);

  console.log(`Done in ${Date.now() - start}ms`);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Generates API documentation from TypeScript type definitions.',
    builder: (command) =>
      command.option('grep', {
        description: 'Filter components by name pattern',
        type: 'string',
      }),
    handler: () =>
      main().catch((error) => {
        console.error(error);
        process.exit(1);
      }),
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
