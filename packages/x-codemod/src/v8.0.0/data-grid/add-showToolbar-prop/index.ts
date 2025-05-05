import type { Identifier, JSXIdentifier, ImportSpecifier, ObjectProperty } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // List of DataGrid components
  const dataGridComponents = new Set(['DataGrid', 'DataGridPro', 'DataGridPremium']);
  // List of allowed import sources
  const dataGridSources = new Set([
    '@mui/x-data-grid',
    '@mui/x-data-grid-pro',
    '@mui/x-data-grid-premium',
  ]);

  // Find relevant DataGrid imports
  const importedDataGrids = new Set();
  root.find(j.ImportDeclaration).forEach((path) => {
    if (dataGridSources.has(path.node.source.value as string)) {
      path.node.specifiers?.forEach((specifier) => {
        if (
          (specifier as ImportSpecifier).imported &&
          dataGridComponents.has((specifier as ImportSpecifier).imported.name)
        ) {
          const localName = (specifier as ImportSpecifier).local?.name;
          if (localName) {
            importedDataGrids.add(localName);
          }
        }
      });
    }
  });

  if (importedDataGrids.size === 0) {
    return file.source;
  }

  root.find(j.JSXOpeningElement).forEach((path) => {
    if (!importedDataGrids.has((path.node.name as JSXIdentifier).name)) {
      return;
    }

    let hasSlotsToolbar = false;
    let hasShowToolbar = false;

    path.node.attributes?.forEach((attr) => {
      if (attr.type === 'JSXAttribute') {
        if (attr.name.name === 'slots') {
          if (
            attr.value &&
            attr.value.type === 'JSXExpressionContainer' &&
            attr.value.expression.type === 'ObjectExpression'
          ) {
            hasSlotsToolbar = attr.value.expression.properties.some(
              (prop) => ((prop as ObjectProperty).key as Identifier).name === 'toolbar',
            );
          }
        }
        if (attr.name.name === 'showToolbar') {
          hasShowToolbar = true;
        }
      }
    });

    if (hasSlotsToolbar && !hasShowToolbar) {
      path.node.attributes?.push(j.jsxAttribute(j.jsxIdentifier('showToolbar')));
    }
  });

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return root.toSource(printOptions);
}
