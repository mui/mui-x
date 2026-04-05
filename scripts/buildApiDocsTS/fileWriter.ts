/**
 * File writing utilities: stale file cleanup and prettier-formatted output.
 */
import * as path from 'path';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as prettier from 'prettier';
import { CWD } from './config';
import type { FileWrite } from './types';

export function cleanupStaleFiles(fileWrites: FileWrite[]): void {
  const generatedPaths = new Set(fileWrites.map((f) => path.resolve(CWD, f.path)));

  // Only clean directories that we write to
  const apiDirs = [
    'docs/pages/x/api/charts',
    'docs/pages/x/api/data-grid',
    'docs/pages/x/api/date-pickers',
    'docs/pages/x/api/tree-view',
  ];

  for (const dir of apiDirs) {
    const absDir = path.resolve(CWD, dir);
    if (!fs.existsSync(absDir)) {
      continue;
    }
    for (const file of fs.readdirSync(absDir)) {
      if (!file.endsWith('.json') && !file.endsWith('.js')) {
        continue;
      }
      const absFile = path.join(absDir, file);
      if (!generatedPaths.has(absFile)) {
        fs.unlinkSync(absFile);
      }
    }
  }

  // Also clean translation directories
  const translationDirs = [
    'docs/translations/api-docs/charts',
    'docs/translations/api-docs/data-grid',
    'docs/translations/api-docs/date-pickers',
    'docs/translations/api-docs/tree-view',
  ];

  for (const dir of translationDirs) {
    const absDir = path.resolve(CWD, dir);
    if (!fs.existsSync(absDir)) {
      continue;
    }
    for (const subdir of fs.readdirSync(absDir, { withFileTypes: true })) {
      if (!subdir.isDirectory()) {
        continue;
      }
      const subPath = path.join(absDir, subdir.name);
      // Check if any generated file targets this subdirectory
      const hasGeneratedFiles = fileWrites.some((f) =>
        path.resolve(CWD, f.path).startsWith(subPath),
      );
      if (!hasGeneratedFiles) {
        fs.rmSync(subPath, { recursive: true });
      }
    }
  }
}

export async function writeAllFiles(fileWrites: FileWrite[]): Promise<void> {
  // Ensure directories exist
  const dirs = new Set(fileWrites.map((f) => path.dirname(path.resolve(CWD, f.path))));
  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Format and write files in parallel batches.
  // Resolve prettier config per-file (the repo has no root .prettierrc —
  // config comes from the monorepo via overrides and editorconfig).
  const BATCH_SIZE = 50;
  for (let i = 0; i < fileWrites.length; i += BATCH_SIZE) {
    const batch = fileWrites.slice(i, i + BATCH_SIZE);
    // eslint-disable-next-line no-await-in-loop -- intentional batching to avoid overwhelming the filesystem
    await Promise.all(
      batch.map(async (fw) => {
        const fullPath = path.resolve(CWD, fw.path);
        const config = await prettier.resolveConfig(fullPath);
        const formatted = await prettier.format(fw.content, {
          ...config,
          filepath: fullPath,
        });
        await fsp.writeFile(fullPath, formatted, 'utf8');
      }),
    );
  }
}
