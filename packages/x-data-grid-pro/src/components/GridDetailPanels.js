"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridDetailPanels = GridDetailPanels;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var detailPanel_1 = require("../hooks/features/detailPanel");
var GridDetailPanel_1 = require("./GridDetailPanel");
var gridDetailPanelSelector_1 = require("../hooks/features/detailPanel/gridDetailPanelSelector");
var useUtilityClasses = function () {
    var slots = {
        detailPanel: ['detailPanel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, {});
};
function GridDetailPanels(props) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (!rootProps.getDetailPanelContent) {
        return null;
    }
    return React.createElement(GridDetailPanelsImpl, props);
}
function GridDetailPanelsImpl(_a) {
    var virtualScroller = _a.virtualScroller;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var classes = useUtilityClasses();
    var setPanels = virtualScroller.setPanels;
    var expandedRowIds = (0, x_data_grid_1.useGridSelector)(apiRef, detailPanel_1.gridDetailPanelExpandedRowIdsSelector);
    var detailPanelsContent = (0, x_data_grid_1.useGridSelector)(apiRef, detailPanel_1.gridDetailPanelExpandedRowsContentCacheSelector);
    var detailPanelsHeights = (0, x_data_grid_1.useGridSelector)(apiRef, gridDetailPanelSelector_1.gridDetailPanelRawHeightCacheSelector);
    var getDetailPanel = React.useCallback(function (rowId) {
        var content = detailPanelsContent[rowId];
        // Check if the id exists in the current page
        var rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
        var exists = rowIndex !== undefined;
        if (!React.isValidElement(content) || !exists) {
            return null;
        }
        var heightCache = detailPanelsHeights[rowId];
        var height = heightCache.autoHeight ? 'auto' : heightCache.height;
        return (<GridDetailPanel_1.GridDetailPanel key={"panel-".concat(rowId)} rowId={rowId} height={height} className={classes.detailPanel}>
          {content}
        </GridDetailPanel_1.GridDetailPanel>);
    }, [apiRef, classes.detailPanel, detailPanelsHeights, detailPanelsContent]);
    React.useEffect(function () {
        var map = new Map();
        for (var _i = 0, expandedRowIds_1 = expandedRowIds; _i < expandedRowIds_1.length; _i++) {
            var rowId = expandedRowIds_1[_i];
            map.set(rowId, getDetailPanel(rowId));
        }
        setPanels(map);
    }, [expandedRowIds, setPanels, getDetailPanel]);
    return null;
}
