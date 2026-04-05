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
import { getPackageConfigs, debug } from './config';
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

  console.log('Building API docs...');
  const { program, checker } = createTSProgram();
  debug(`Program created in ${Date.now() - start}ms`);

  const demos = loadDemos();
  const configs = getPackageConfigs();
  const components = discoverComponents(configs, checker, program);

  const allFiles: FileWrite[] = [];
  const componentsBySection = new Map<string, ComponentApi[]>();

  // Extract component APIs grouped by section
  let currentSection = '';
  for (const comp of components) {
    if (comp.section !== currentSection) {
      currentSection = comp.section;
      console.log(`  ${currentSection}`);
    }
    const api = extractComponentApi(comp, checker, program, demos);
    if (!api) {
      continue;
    }

    const sectionComponents = componentsBySection.get(comp.section) || [];
    sectionComponents.push(api);
    componentsBySection.set(comp.section, sectionComponents);

    allFiles.push(...generateComponentFiles(api));
    debug(`    ${api.name}`);
  }

  for (const [section, comps] of componentsBySection) {
    allFiles.push(generateManifest(section, comps));
  }

  console.log('  interfaces');
  allFiles.push(...buildInterfaceDocumentation(checker, program));
  allFiles.push(...buildGridEventsDocumentation(checker, program));
  allFiles.push(...buildGridSelectorsDocumentation(checker, program));
  allFiles.push(...buildExportsDocumentation(checker, program));

  cleanupStaleFiles(allFiles);
  await writeAllFiles(allFiles);

  console.log(`Done in ${Date.now() - start}ms — ${allFiles.length} files written`);
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
