/**
 * Creates the TypeScript program used to analyze packages.
 */
import * as ts from 'typescript';
import * as path from 'path';
import { CWD } from './config';

export function createTSProgram(): { program: ts.Program; checker: ts.TypeChecker } {
  // Pin to the monorepo root tsconfig explicitly — don't walk up from CWD, since running
  // the script from a subpackage would pick up the wrong config.
  const configPath = path.resolve(CWD, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, CWD);

  // Include all package entry points so we can verify exports from any package.
  // Premium/pro packages re-export from base, but we still need the base entry
  // files in the program to resolve their module symbols directly.
  const entryPoints = [
    'packages/x-data-grid/src/index.ts',
    'packages/x-data-grid-pro/src/index.ts',
    'packages/x-data-grid-premium/src/index.ts',
    'packages/x-data-grid-generator/src/index.ts',
    'packages/x-date-pickers/src/index.ts',
    'packages/x-date-pickers-pro/src/index.ts',
    'packages/x-charts/src/index.ts',
    'packages/x-charts-pro/src/index.ts',
    'packages/x-charts-premium/src/index.ts',
    'packages/x-tree-view/src/index.ts',
    'packages/x-tree-view-pro/src/index.ts',
    'packages/x-chat-headless/src/index.ts',
    'packages/x-chat/src/index.ts',
    'packages/x-license/src/index.ts',
  ].map((p) => path.resolve(CWD, p));

  const program = ts.createProgram(entryPoints, {
    ...parsed.options,
    skipLibCheck: true,
    noEmit: true,
  });

  return { program, checker: program.getTypeChecker() };
}
