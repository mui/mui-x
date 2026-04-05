/* eslint-disable no-bitwise */
/**
 * Exports documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import { CWD } from './config';
import type { FileWrite } from './types';

export function buildExportsDocumentation(checker: ts.TypeChecker, program: ts.Program): FileWrite[] {
  const files: FileWrite[] = [];
  const packages = [
    'x-license',
    'x-data-grid',
    'x-data-grid-pro',
    'x-data-grid-premium',
    'x-data-grid-generator',
    'x-date-pickers',
    'x-date-pickers-pro',
    'x-charts',
    'x-charts-pro',
    'x-charts-premium',
    'x-tree-view',
    'x-tree-view-pro',
  ];

  const kindNames: Record<number, string> = {
    [ts.SyntaxKind.FunctionDeclaration]: 'Function',
    [ts.SyntaxKind.InterfaceDeclaration]: 'Interface',
    [ts.SyntaxKind.TypeAliasDeclaration]: 'TypeAlias',
    [ts.SyntaxKind.VariableDeclaration]: 'Variable',
    [ts.SyntaxKind.ClassDeclaration]: 'Class',
    [ts.SyntaxKind.EnumDeclaration]: 'Enum',
    [ts.SyntaxKind.ModuleDeclaration]: 'Module',
  };

  for (const pkg of packages) {
    const entryPath = path.resolve(CWD, `packages/${pkg}/src/index.ts`);
    const sf = program.getSourceFile(entryPath);
    if (!sf) {
      continue;
    }

    const modSymbol = checker.getSymbolAtLocation(sf);
    if (!modSymbol) {
      continue;
    }

    const exports = checker.getExportsOfModule(modSymbol);
    const items: { name: string; kind: string }[] = [];

    for (const exp of exports) {
      let resolved = exp;
      if (resolved.flags & ts.SymbolFlags.Alias) {
        resolved = checker.getAliasedSymbol(resolved);
      }

      const declarations = resolved.getDeclarations();
      if (!declarations || declarations.length === 0) {
        continue;
      }

      const decl = declarations[0];
      const kind = kindNames[decl.kind] || 'Variable';
      items.push({ name: exp.name, kind });
    }

    items.sort((a, b) => a.name.localeCompare(b.name));
    files.push({
      path: `scripts/${pkg}.exports.json`,
      content: JSON.stringify(items),
    });
  }

  return files;
}
