import path from 'node:path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

const REMOVED_FUNCTIONS = ['isBarSeries', 'isDefaultizedBarSeries'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    wrapColumn: 40,
  };

  const importedFunctions: Record<string, string> = {};

  // Find and remove imports of isBarSeries and isDefaultizedBarSeries
  const packageRegex = /^@mui\/x-charts(-pro|-premium)?(\/(models|internals))?$/;

  root.find(j.ImportDeclaration).forEach((astPath) => {
    const source = astPath.node.source.value?.toString() ?? '';
    if (!packageRegex.test(source)) {
      return;
    }

    const specifiers = astPath.node.specifiers || [];
    const remainingSpecifiers: typeof specifiers = [];

    specifiers.forEach((specifier) => {
      if (specifier.type === 'ImportSpecifier') {
        const importedName = specifier.imported.name;
        if (REMOVED_FUNCTIONS.includes(importedName)) {
          // Track the local name used for this import
          const localName = specifier.local?.name || importedName;
          importedFunctions[localName] = importedName;
        } else {
          remainingSpecifiers.push(specifier);
        }
      } else {
        remainingSpecifiers.push(specifier);
      }
    });

    if (remainingSpecifiers.length === 0) {
      // Remove the entire import declaration if no specifiers remain
      j(astPath).remove();
    } else if (remainingSpecifiers.length !== specifiers.length) {
      // Update the import declaration with remaining specifiers
      astPath.node.specifiers = remainingSpecifiers;
    }
  });

  // Replace function calls with series.type === 'bar'
  // isBarSeries(series) -> series.type === 'bar'
  // isDefaultizedBarSeries(series) -> series.type === 'bar'
  Object.keys(importedFunctions).forEach((localName) => {
    root
      .find(j.CallExpression, {
        callee: {
          type: 'Identifier',
          name: localName,
        },
      })
      .replaceWith((astPath) => {
        const args = astPath.node.arguments;
        if (args.length !== 1) {
          // If not exactly 1 argument, keep as-is (shouldn't happen)
          return astPath.node;
        }

        const arg = args[0];
        if (arg.type === 'SpreadElement') {
          // Can't handle spread elements
          return astPath.node;
        }

        // Create: arg.type === 'bar'
        return j.binaryExpression(
          '===',
          j.memberExpression(arg as any, j.identifier('type')),
          j.stringLiteral('bar'),
        );
      });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-is-bar-series-helpers',
  specFiles: [
    {
      name: 'root-imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-root-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-root-imports.spec.tsx')),
    },
    {
      name: 'nested-imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-nested-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-nested-imports.spec.tsx')),
    },
  ],
});
