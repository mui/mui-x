import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const renamedSelectors = {
  gridSelectionStateSelector: 'gridRowSelectionStateSelector',
  gridVisibleSortedRowIdsSelector: 'gridExpandedSortedRowIdsSelector',
  gridVisibleSortedRowEntriesSelector: 'gridExpandedSortedRowEntriesSelector',
  gridVisibleRowCountSelector: 'gridExpandedRowCountSelector',
  gridVisibleSortedTopLevelRowEntriesSelector: 'gridFilteredSortedTopLevelRowEntriesSelector',
  gridVisibleTopLevelRowCountSelector: 'gridFilteredTopLevelRowCountSelector',
};
const renamedEvents = { selectionChange: 'rowSelectionChange', rowsScroll: 'scrollPositionChange' };

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  // Rename the import and usage of renamed selectors
  // - import { gridSelectionStateSelector } from '@mui/x-data-grid'
  // + import { gridRowSelectionStateSelector } from '@mui/x-data-grid'
  root
    .find(j.Identifier)
    .filter((path) => !!renamedSelectors[path.node.name])
    .replaceWith((path) => j.identifier(renamedSelectors[path.node.name]));

  // Rename the usage of renamed event literals
  // - useGridApiEventHandler('selectionChange', handleEvent);
  // - apiRef.current.subscribeEvent('selectionChange', handleEvent);
  // + useGridApiEventHandler('rowSelectionChange', handleEvent);
  // + apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
  root
    .find(j.CallExpression)
    .find(j.Literal)
    .filter((path) => !!renamedEvents[path.node.value as any])
    .replaceWith((path) => j.literal(renamedEvents[path.node.value as any]));

  return root.toSource(printOptions);
}
