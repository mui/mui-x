import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { PreRequisiteUsage, checkPreRequisitesSatisfied } from '../../../util/renameIdentifiers';

const renamedSelectors = {
  gridSelectionStateSelector: 'gridRowSelectionStateSelector',
  gridVisibleSortedRowIdsSelector: 'gridExpandedSortedRowIdsSelector',
  gridVisibleSortedRowEntriesSelector: 'gridExpandedSortedRowEntriesSelector',
  gridVisibleRowCountSelector: 'gridExpandedRowCountSelector',
  gridVisibleSortedTopLevelRowEntriesSelector: 'gridFilteredSortedTopLevelRowEntriesSelector',
  gridVisibleTopLevelRowCountSelector: 'gridFilteredTopLevelRowCountSelector',
  allGridColumnsFieldsSelector: 'gridColumnFieldsSelector',
  allGridColumnsSelector: 'gridColumnDefinitionsSelector',
  visibleGridColumnsSelector: 'gridVisibleColumnDefinitionsSelector',
  filterableGridColumnsSelector: 'gridFilterableColumnDefinitionsSelector',
  getGridNumericColumnOperators: 'getGridNumericOperators',
};

const renamedEvents = { selectionChange: 'rowSelectionChange', rowsScroll: 'scrollPositionChange' };

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
    // Rename the import and usage of renamed selectors
    // - import { gridSelectionStateSelector } from '@mui/x-data-grid'
    // + import { gridRowSelectionStateSelector } from '@mui/x-data-grid'
    root
      .find(j.Identifier)
      .filter((path) => renamedSelectors.hasOwnProperty(path.node.name))
      .replaceWith((path) => j.identifier(renamedSelectors[path.node.name]));

    // Rename the usage of renamed event literals
    // - useGridApiEventHandler(apiRef, 'selectionChange', handleEvent);
    // - apiRef.current.subscribeEvent('selectionChange', handleEvent);
    // + useGridApiEventHandler(apiRef, 'rowSelectionChange', handleEvent);
    // + apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
    root
      .find(j.CallExpression)
      .find(j.Literal)
      .filter((path) => renamedEvents.hasOwnProperty(path.node.value as any))
      .replaceWith((path) => j.literal(renamedEvents[path.node.value as any]));
  }

  return root.toSource(printOptions);
}
