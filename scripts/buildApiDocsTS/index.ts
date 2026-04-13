#!/usr/bin/env tsx
/* eslint-disable no-console */
/**
 * Generates API documentation from TypeScript type definitions.
 * Replaces both `pnpm proptypes` and `pnpm docs:api`.
 *
 * Usage: tsx scripts/buildApiDocsTS/index.ts [--grep pattern]
 */
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createTSProgram } from './createProgram';
import {
  CWD,
  getPackageConfigs,
  getInterfacesToDocument,
  getJsonOnlyInterfaces,
  debug,
} from './config';
import { discoverComponents } from './componentDiscovery';
import { loadDemos } from './demoLoader';
import { extractComponentApi } from './componentExtractor';
import { generateComponentFiles, generateManifest } from './outputGenerator';
import {
  buildInterfacePages,
  buildJsonOnlyInterfaces,
  linkifyTranslations,
} from './interfaceBuilder';
import { buildGridEventsDocumentation } from './gridEventsBuilder';
import { buildGridSelectorsDocumentation } from './gridSelectorsBuilder';
import { buildExportsDocumentation } from './exportsBuilder';
import { cleanupStaleFiles, writeAllFiles } from './fileWriter';
import type { FileWrite, ComponentApi } from './types';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(grep?: string) {
  const start = Date.now();

  console.log('Building API docs...');
  const { program, checker } = createTSProgram();
  debug(`Program created in ${Date.now() - start}ms`);

  const demos = loadDemos();
  const configs = getPackageConfigs();
  let components = discoverComponents(configs, checker, program);
  if (grep) {
    const re = new RegExp(grep);
    components = components.filter((c) => re.test(c.name));
    console.log(`Filter --grep ${grep}: ${components.length} component(s) match`);
  }

  const skipped: { name: string; filePath: string; reason: string }[] = [];

  // Pre-index configs by section
  const interfaceEntries = getInterfacesToDocument();
  const jsonOnlyEntries = getJsonOnlyInterfaces();

  const allFiles: FileWrite[] = [];
  const componentsBySection = new Map<string, ComponentApi[]>();
  const allDocumentedInterfaces = new Map<string, string[]>();

  // Process each section: components + interfaces + section-specific extras
  let currentSection = '';
  for (const comp of components) {
    if (comp.section !== currentSection) {
      // When we enter a new section, also build its interfaces and extras
      if (currentSection) {
        buildSectionExtras(currentSection);
      }
      currentSection = comp.section;
      console.log(`  ${currentSection}`);
    }

    const result = extractComponentApi(comp, checker, program, demos);
    if (result.kind === 'skipped') {
      const relPath = path.relative(CWD, comp.filePath);
      skipped.push({ name: comp.name, filePath: relPath, reason: result.reason });
      debug(`    ⚠ skipped ${comp.name} — ${result.reason} (${relPath})`);
      continue;
    }

    const { api } = result;
    const sectionComponents = componentsBySection.get(comp.section) || [];
    sectionComponents.push(api);
    componentsBySection.set(comp.section, sectionComponents);
    allFiles.push(...generateComponentFiles(api));
    debug(`    ${api.name}`);
  }
  // Process the last section's extras
  if (currentSection) {
    buildSectionExtras(currentSection);
  }

  // Manifests
  for (const [section, comps] of componentsBySection) {
    allFiles.push(generateManifest(section, comps));
  }

  // Exports (cross-cutting, all packages)
  allFiles.push(...buildExportsDocumentation(checker, program));

  // Linkify [[InterfaceName]] references in translation files (reads from disk)
  for (const entry of interfaceEntries) {
    const translationDir = path.resolve(CWD, `docs/translations/api-docs/${entry.folder}`);
    linkifyTranslations(translationDir, allDocumentedInterfaces, entry.folder);
  }

  cleanupStaleFiles(allFiles);
  await writeAllFiles(allFiles);

  console.log(
    `Done in ${Date.now() - start}ms — ${allFiles.length} files written, ${skipped.length} skipped`,
  );

  /** Build interfaces, events, and selectors for a given section. */
  function buildSectionExtras(section: string) {
    // Interface pages
    const ifaceEntry = interfaceEntries.find((ie) => ie.folder === section);
    if (ifaceEntry) {
      const { files, documentedInterfaces } = buildInterfacePages(ifaceEntry, checker, program);
      allFiles.push(...files);
      for (const [name, pkgs] of documentedInterfaces) {
        allDocumentedInterfaces.set(name, pkgs);
      }
    }

    // JSON-only interfaces
    const jsonEntry = jsonOnlyEntries.find((je) => je.folder === section);
    if (jsonEntry) {
      allFiles.push(...buildJsonOnlyInterfaces(jsonEntry, checker, program));
    }

    // Data grid extras
    if (section === 'data-grid') {
      allFiles.push(...buildGridEventsDocumentation(checker, program));
      allFiles.push(...buildGridSelectorsDocumentation(checker, program));
    }
  }
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
    handler: (argv) =>
      main(argv.grep as string | undefined).catch((error) => {
        console.error(error);
        process.exit(1);
      }),
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
