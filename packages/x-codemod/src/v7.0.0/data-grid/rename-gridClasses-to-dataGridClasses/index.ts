import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { PreRequisiteUsage, checkPreRequisitesSatisfied } from '../../../util/renameIdentifiers';

const renamedImports = {
  gridClasses: 'dataGridClasses',
};

const preRequisites: PreRequisiteUsage = {
  components: ['DataGrid', 'DataGridPro', 'DataGridPremium'],
  packageRegex: /@mui\/x-data-grid(-pro|-premium)?/,
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const isGridUsed = checkPreRequisitesSatisfied(j, root, preRequisites);

  if (isGridUsed) {
    // Rename the import and usage of renamed imports
    // - import { DataGrid, gridClasses } from '@mui/x-data-grid'
    // + import { DataGrid, dataGridClasses } from '@mui/x-data-grid'
    root
      .find(j.Identifier)
      .filter((path) => renamedImports.hasOwnProperty(path.node.name))
      .replaceWith((path) => j.identifier(renamedImports[path.node.name]));
  }

  return root.toSource(printOptions);
}
