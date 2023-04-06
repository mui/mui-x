import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameIdentifiers, { PreRequisiteUsage } from '../../../util/renameIdentifiers';

const renamedIdentifiers = {
  columnField: 'field',
  operatorValue: 'operator',
};

const PACKAGE_REGEXP = /@mui\/x-data-grid(-pro|-premium)?/;

const GridComponents = ['DataGrid', 'DataGridPro', 'DataGridPremium'];

const preRequisiteUsages: { [identifierName: string]: PreRequisiteUsage } = {
  columnField: {
    possiblePaths: ['initialState', 'filterModel', 'onFilterModelChange'],
    components: GridComponents,
    packageRegex: PACKAGE_REGEXP,
  },
  operatorValue: {
    possiblePaths: ['initialState', 'filterModel', 'onFilterModelChange'],
    components: GridComponents,
    packageRegex: PACKAGE_REGEXP,
  },
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  // <DataGrid(Pro|Premium)
  //   filterModel={{
  //     items: [{
  // -     columnField: 'name',
  // +     field: 'name',
  // -     operatorValue: 'contains',
  // +     operator: 'contains',
  //       value: 'a'
  //     }]
  //   }}
  // />
  renameIdentifiers({ root, j, preRequisiteUsages, identifiers: renamedIdentifiers });

  return root.toSource(printOptions);
}
