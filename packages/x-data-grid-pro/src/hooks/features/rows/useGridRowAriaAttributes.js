"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowAriaAttributesPro = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridPrivateApiContext_1 = require("../../utils/useGridPrivateApiContext");
var useGridRootProps_1 = require("../../utils/useGridRootProps");
var useGridRowAriaAttributesPro = function (addTreeDataAttributes) {
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var props = (0, useGridRootProps_1.useGridRootProps)();
    var getRowAriaAttributesCommunity = (0, internals_1.useGridRowAriaAttributes)();
    var filteredTopLevelRowCount = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridFilteredTopLevelRowCountSelector);
    var filteredChildrenCountLookup = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridFilteredChildrenCountLookupSelector);
    var sortedVisibleRowPositionsLookup = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridExpandedSortedRowTreeLevelPositionLookupSelector);
    return React.useCallback(function (rowNode, index) {
        var _a;
        var ariaAttributes = getRowAriaAttributesCommunity(rowNode, index);
        if (!rowNode || !(props.treeData || addTreeDataAttributes)) {
            return ariaAttributes;
        }
        // pinned and footer rows are not part of the rowgroup and should not get the set specific aria attributes
        if (rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
            return ariaAttributes;
        }
        ariaAttributes['aria-level'] = rowNode.depth + 1;
        var filteredChildrenCount = (_a = filteredChildrenCountLookup[rowNode.id]) !== null && _a !== void 0 ? _a : 0;
        // aria-expanded should only be added to the rows that contain children
        if (rowNode.type === 'group' && filteredChildrenCount > 0) {
            ariaAttributes['aria-expanded'] = Boolean(rowNode.childrenExpanded);
        }
        // if the parent is null, set size and position cannot be determined
        if (rowNode.parent !== null) {
            ariaAttributes['aria-setsize'] =
                rowNode.parent === x_data_grid_1.GRID_ROOT_GROUP_ID
                    ? filteredTopLevelRowCount
                    : filteredChildrenCountLookup[rowNode.parent];
            ariaAttributes['aria-posinset'] = sortedVisibleRowPositionsLookup[rowNode.id];
        }
        return ariaAttributes;
    }, [
        props.treeData,
        addTreeDataAttributes,
        filteredTopLevelRowCount,
        filteredChildrenCountLookup,
        sortedVisibleRowPositionsLookup,
        getRowAriaAttributesCommunity,
    ]);
};
exports.useGridRowAriaAttributesPro = useGridRowAriaAttributesPro;
