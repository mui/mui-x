import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

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

  root.find(j.ImportDeclaration).forEach((path) => {
    const source = path.node.source.value?.toString() ?? '';
    if (!packageRegex.test(source)) {
      return;
    }

    const specifiers = path.node.specifiers || [];
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
      j(path).remove();
    } else if (remainingSpecifiers.length !== specifiers.length) {
      // Update the import declaration with remaining specifiers
      path.node.specifiers = remainingSpecifiers;
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
      .replaceWith((path) => {
        const args = path.node.arguments;
        if (args.length !== 1) {
          // If not exactly 1 argument, keep as-is (shouldn't happen)
          return path.node;
        }

        const arg = args[0];
        if (arg.type === 'SpreadElement') {
          // Can't handle spread elements
          return path.node;
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
