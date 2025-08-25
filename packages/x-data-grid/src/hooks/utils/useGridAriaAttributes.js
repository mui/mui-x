"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridAriaAttributes = void 0;
var gridColumnsSelector_1 = require("../features/columns/gridColumnsSelector");
var useGridSelector_1 = require("./useGridSelector");
var useGridRootProps_1 = require("./useGridRootProps");
var gridColumnGroupsSelector_1 = require("../features/columnGrouping/gridColumnGroupsSelector");
var gridRowsSelector_1 = require("../features/rows/gridRowsSelector");
var useGridPrivateApiContext_1 = require("./useGridPrivateApiContext");
var utils_1 = require("../features/rowSelection/utils");
var gridFilterSelector_1 = require("../features/filter/gridFilterSelector");
var useGridAriaAttributes = function () {
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var visibleColumns = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector);
    var accessibleRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridExpandedRowCountSelector);
    var headerGroupingMaxDepth = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnGroupsSelector_1.gridColumnGroupsHeaderMaxDepthSelector);
    var pinnedRowsCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridPinnedRowsCountSelector);
    var ariaLabel = rootProps['aria-label'];
    var ariaLabelledby = rootProps['aria-labelledby'];
    // `aria-label` and `aria-labelledby` should take precedence over `label`
    var shouldUseLabelAsAriaLabel = !ariaLabel && !ariaLabelledby && rootProps.label;
    return {
        role: 'grid',
        'aria-label': shouldUseLabelAsAriaLabel ? rootProps.label : ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-colcount': visibleColumns.length,
        'aria-rowcount': headerGroupingMaxDepth + 1 + pinnedRowsCount + accessibleRowCount,
        'aria-multiselectable': (0, utils_1.isMultipleRowSelectionEnabled)(rootProps),
    };
};
exports.useGridAriaAttributes = useGridAriaAttributes;
