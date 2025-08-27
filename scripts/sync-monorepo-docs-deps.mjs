#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Alphabetically sorts an object by its keys
 */
function sortObjectKeys(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
}

function cleanDeps(deps) {
  return Object.fromEntries(
    Object.entries(deps).filter(([_, version]) => !version.startsWith('workspace:')),
  );
}

function mergeDeps(target, ...sources) {
  for (const source of sources) {
    for (const [depName, version] of Object.entries(source)) {
      const targetVersion = target[depName];
      if (version.startsWith('workspace:') || targetVersion?.startsWith('workspace:')) {
        continue;
      }
      target[depName] = version;
    }
  }
  return sortObjectKeys(target);
}

async function syncMonorepoDocsDeps() {
  // eslint-disable-next-line no-console
  console.log('🔄 Syncing dependencies from @mui/monorepo docs/package.json...');

  // Resolve monorepo path
  const monorepoPath = path.resolve(process.cwd(), 'node_modules/@mui/monorepo');
  const monorepoDocsPackageJsonPath = path.resolve(monorepoPath, 'docs/package.json');

  // Read monorepo docs package.json
  const monorepoContent = await fs.readFile(monorepoDocsPackageJsonPath, 'utf8');
  const monorepoDocsPackageJson = JSON.parse(monorepoContent);

  // Read current docs package.json
  const currentDocsPackageJsonPath = path.resolve(import.meta.dirname, '../docs/package.json');
  const currentContent = await fs.readFile(currentDocsPackageJsonPath, 'utf8');
  const currentDocsPackageJson = JSON.parse(currentContent);

  // Merge dependencies
  currentDocsPackageJson.dependencies = mergeDeps(
    currentDocsPackageJson.dependencies,
    monorepoDocsPackageJson.dependencies,
  );

  currentDocsPackageJson.devDependencies = mergeDeps(
    currentDocsPackageJson.devDependencies,
    monorepoDocsPackageJson.devDependencies,
  );

  // Write back to current docs package.json
  await fs.writeFile(
    currentDocsPackageJsonPath,
    `${JSON.stringify(currentDocsPackageJson, null, 2)}\n`,
  );
  // eslint-disable-next-line no-console
  console.log('✅ Successfully synced dependencies to docs/package.json');
}

// Run the sync
syncMonorepoDocsDeps().catch(console.error);
