/**
 * Grid selectors documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import { CWD } from './config';
import { extractJsDoc } from './jsDocUtils';
import type { FileWrite } from './types';

export function buildGridSelectorsDocumentation(
  checker: ts.TypeChecker,
  program: ts.Program,
): FileWrite[] {
  const files: FileWrite[] = [];

  const entryPath = path.resolve(CWD, 'packages/x-data-grid-premium/src/index.ts');
  const sf = program.getSourceFile(entryPath);
  if (!sf) {
    return files;
  }

  const modSymbol = checker.getSymbolAtLocation(sf);
  if (!modSymbol) {
    return files;
  }

  const exports = checker.getExportsOfModule(modSymbol);
  const selectors: any[] = [];

  for (const exp of exports) {
    if (!exp.name.endsWith('Selector')) {
      continue;
    }
    if (exp.name === 'useGridSelector') {
      continue;
    }
    if (!/^[a-z]/.test(exp.name)) {
      continue;
    }

    let resolved = exp;
    // eslint-disable-next-line no-bitwise
    if (resolved.flags & ts.SymbolFlags.Alias) {
      resolved = checker.getAliasedSymbol(resolved);
    }

    const jsDoc = extractJsDoc(resolved, checker);
    if (jsDoc.ignore) {
      continue;
    }

    const type = checker.getTypeOfSymbol(resolved);
    const callSigs = type.getCallSignatures();

    let returnType = '';
    if (callSigs.length > 0) {
      const retType = checker.getReturnTypeOfSignature(callSigs[0]);
      returnType = checker
        .typeToString(retType, undefined, ts.TypeFormatFlags.NoTruncation)
        .replace(/"/g, "'");
      // Clean up generic params
      returnType = returnType.replace(/<GridApi(?:Community|Pro)?>/g, '');
    }

    // Extract JSDoc tags from declarations
    let categoryStr: string | undefined;
    let deprecatedStr: string | undefined;
    const selectorDecls = resolved.getDeclarations() || [];
    for (const decl of selectorDecls) {
      for (const jsDocTag of ts.getJSDocTags(decl)) {
        const comment =
          typeof jsDocTag.comment === 'string'
            ? jsDocTag.comment
            : ts.getTextOfJSDocComment(jsDocTag.comment);
        if (jsDocTag.tagName.text === 'category' && comment) {
          categoryStr = comment;
        } else if (jsDocTag.tagName.text === 'deprecated') {
          deprecatedStr = comment || '';
        }
      }
    }

    const selector: any = {
      name: exp.name,
      returnType,
    };

    if (categoryStr) {
      selector.category = categoryStr;
    }
    if (deprecatedStr !== undefined) {
      selector.deprecated = deprecatedStr || true;
    }
    if (jsDoc.description) {
      selector.description = jsDoc.description;
    }

    selectors.push(selector);
  }

  selectors.sort((a, b) => a.name.localeCompare(b.name));
  files.push({
    path: 'docs/pages/x/api/data-grid/selectors.json',
    content: JSON.stringify(selectors),
  });

  return files;
}
