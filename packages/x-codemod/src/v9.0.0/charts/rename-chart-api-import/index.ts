import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const packageNames = ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    wrapColumn: 40,
  };

  // Find all import declarations from @mui/x-charts*/ChartContainer
  const chartContainerImportRegex = new RegExp(`^(${packageNames.join('|')})/ChartContainer$`);

  root.find(j.ImportDeclaration).forEach((path) => {
    const importSource = path.node.source.value?.toString() ?? '';
    if (!chartContainerImportRegex.test(importSource)) {
      return;
    }

    const specifiers = path.node.specifiers || [];
    const chartApiSpecifiers: typeof specifiers = [];
    const otherSpecifiers: typeof specifiers = [];

    specifiers.forEach((specifier) => {
      if (
        specifier.type === 'ImportSpecifier' &&
        specifier.imported.type === 'Identifier' &&
        specifier.imported.name === 'ChartApi'
      ) {
        chartApiSpecifiers.push(specifier);
      } else {
        otherSpecifiers.push(specifier);
      }
    });

    // If no ChartApi import found, skip
    if (chartApiSpecifiers.length === 0) {
      return;
    }

    // Get the package name (e.g., @mui/x-charts)
    const packageName = importSource.replace('/ChartContainer', '');
    const newImportSource = `${packageName}/context`;

    // If all specifiers are ChartApi, just update the import source
    if (otherSpecifiers.length === 0) {
      path.node.source = j.stringLiteral(newImportSource);
    } else {
      // Otherwise, remove ChartApi from the original import and create a new import
      path.node.specifiers = otherSpecifiers;

      // Create a new import declaration for ChartApi
      const newImport = j.importDeclaration(chartApiSpecifiers, j.stringLiteral(newImportSource));

      // Insert the new import after the current one
      path.insertAfter(newImport);
    }
  });

  return root.toSource(printOptions);
}

export const config = {
  location: import.meta.dirname,
  specFiles: [
    {
      actual: 'actual-pro-imports.spec.tsx',
      expected: 'expected-pro-imports.spec.tsx',
    },
    { actual: 'actual-nested-imports.spec.tsx', expected: 'expected-nested-imports.spec.tsx' },
  ],
};
