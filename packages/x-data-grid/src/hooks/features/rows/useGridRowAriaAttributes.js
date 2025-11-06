"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowAriaAttributes = void 0;
var React = require("react");
var useGridSelector_1 = require("../../utils/useGridSelector");
var gridColumnGroupsSelector_1 = require("../columnGrouping/gridColumnGroupsSelector");
var useGridPrivateApiContext_1 = require("../../utils/useGridPrivateApiContext");
var useGridRowAriaAttributes = function () {
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var headerGroupingMaxDepth = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnGroupsSelector_1.gridColumnGroupsHeaderMaxDepthSelector);
    return React.useCallback(function (rowNode, index) {
        var ariaAttributes = {};
        var ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based
        ariaAttributes['aria-rowindex'] = ariaRowIndex;
        // XXX: fix this properly
        if (rowNode && apiRef.current.isRowSelectable(rowNode.id)) {
            ariaAttributes['aria-selected'] = apiRef.current.isRowSelected(rowNode.id);
        }
        return ariaAttributes;
    }, [apiRef, headerGroupingMaxDepth]);
};
exports.useGridRowAriaAttributes = useGridRowAriaAttributes;
