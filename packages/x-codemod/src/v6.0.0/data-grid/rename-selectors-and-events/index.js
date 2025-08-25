"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameIdentifiers_1 = require("../../../util/renameIdentifiers");
var renamedSelectors = {
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
var renamedEvents = { selectionChange: 'rowSelectionChange', rowsScroll: 'scrollPositionChange' };
var preRequisites = {
    components: ['DataGrid', 'DataGridPro', 'DataGridPremium'],
    packageRegex: /@mui\/x-data-grid(-pro|-premium)?/,
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var isGridUsed = (0, renameIdentifiers_1.checkPreRequisitesSatisfied)(j, root, preRequisites);
    if (isGridUsed) {
        // Rename the import and usage of renamed selectors
        // - import { gridSelectionStateSelector } from '@mui/x-data-grid'
        // + import { gridRowSelectionStateSelector } from '@mui/x-data-grid'
        root
            .find(j.Identifier)
            .filter(function (path) { return renamedSelectors.hasOwnProperty(path.node.name); })
            .replaceWith(function (path) { return j.identifier(renamedSelectors[path.node.name]); });
        // Rename the usage of renamed event literals
        // - useGridApiEventHandler(apiRef, 'selectionChange', handleEvent);
        // - apiRef.current.subscribeEvent('selectionChange', handleEvent);
        // + useGridApiEventHandler(apiRef, 'rowSelectionChange', handleEvent);
        // + apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
        root
            .find(j.CallExpression)
            .find(j.Literal)
            .filter(function (path) { return renamedEvents.hasOwnProperty(path.node.value); })
            .replaceWith(function (path) { return j.literal(renamedEvents[path.node.value]); });
    }
    return root.toSource(printOptions);
}
