"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaders = void 0;
var React = require("react");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var useGridSelector_1 = require("../hooks/utils/useGridSelector");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var gridColumnsSelector_1 = require("../hooks/features/columns/gridColumnsSelector");
var gridFilterSelector_1 = require("../hooks/features/filter/gridFilterSelector");
var gridSortingSelector_1 = require("../hooks/features/sorting/gridSortingSelector");
var gridFocusStateSelector_1 = require("../hooks/features/focus/gridFocusStateSelector");
var gridColumnGroupsSelector_1 = require("../hooks/features/columnGrouping/gridColumnGroupsSelector");
var columnMenuSelector_1 = require("../hooks/features/columnMenu/columnMenuSelector");
function GridHeaders() {
    var _a;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var visibleColumns = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector);
    var filterColumnLookup = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridFilterActiveItemsLookupSelector);
    var sortColumnLookup = (0, useGridSelector_1.useGridSelector)(apiRef, gridSortingSelector_1.gridSortColumnLookupSelector);
    var columnHeaderTabIndexState = (0, useGridSelector_1.useGridSelector)(apiRef, gridFocusStateSelector_1.gridTabIndexColumnHeaderSelector);
    var hasNoCellTabIndexState = (0, useGridSelector_1.useGridSelector)(apiRef, function () { return (0, gridFocusStateSelector_1.gridTabIndexCellSelector)(apiRef) === null; });
    var columnGroupHeaderTabIndexState = (0, useGridSelector_1.useGridSelector)(apiRef, gridFocusStateSelector_1.gridTabIndexColumnGroupHeaderSelector);
    var columnHeaderFocus = (0, useGridSelector_1.useGridSelector)(apiRef, gridFocusStateSelector_1.gridFocusColumnHeaderSelector);
    var columnGroupHeaderFocus = (0, useGridSelector_1.useGridSelector)(apiRef, gridFocusStateSelector_1.gridFocusColumnGroupHeaderSelector);
    var headerGroupingMaxDepth = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnGroupsSelector_1.gridColumnGroupsHeaderMaxDepthSelector);
    var columnMenuState = (0, useGridSelector_1.useGridSelector)(apiRef, columnMenuSelector_1.gridColumnMenuSelector);
    var columnVisibility = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnVisibilityModelSelector);
    var columnGroupsHeaderStructure = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnGroupsSelector_1.gridColumnGroupsHeaderStructureSelector);
    var hasOtherElementInTabSequence = !(columnGroupHeaderTabIndexState === null &&
        columnHeaderTabIndexState === null &&
        hasNoCellTabIndexState);
    var columnsContainerRef = apiRef.current.columnHeadersContainerRef;
    return (<rootProps.slots.columnHeaders ref={columnsContainerRef} visibleColumns={visibleColumns} filterColumnLookup={filterColumnLookup} sortColumnLookup={sortColumnLookup} columnHeaderTabIndexState={columnHeaderTabIndexState} columnGroupHeaderTabIndexState={columnGroupHeaderTabIndexState} columnHeaderFocus={columnHeaderFocus} columnGroupHeaderFocus={columnGroupHeaderFocus} headerGroupingMaxDepth={headerGroupingMaxDepth} columnMenuState={columnMenuState} columnVisibility={columnVisibility} columnGroupsHeaderStructure={columnGroupsHeaderStructure} hasOtherElementInTabSequence={hasOtherElementInTabSequence} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.columnHeaders}/>);
}
var MemoizedGridHeaders = (0, fastMemo_1.fastMemo)(GridHeaders);
exports.GridHeaders = MemoizedGridHeaders;
