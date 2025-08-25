"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridDetailPanel = GridDetailPanel;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useResizeObserver_1 = require("@mui/x-internals/useResizeObserver");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var DetailPanel = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'DetailPanel',
})({
    width: 'calc(var(--DataGrid-rowWidth) - var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
    backgroundColor: internals_1.vars.colors.background.base,
    overflow: 'auto',
});
function GridDetailPanel(props) {
    var rowId = props.rowId, height = props.height, className = props.className, children = props.children;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var ref = React.useRef(null);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = rootProps;
    var hasAutoHeight = height === 'auto';
    var rowNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, rowId);
    React.useLayoutEffect(function () {
        if (hasAutoHeight && typeof ResizeObserver === 'undefined') {
            // Fallback for IE
            apiRef.current.storeDetailPanelHeight(rowId, ref.current.clientHeight);
        }
    }, [apiRef, hasAutoHeight, rowId]);
    (0, useResizeObserver_1.useResizeObserver)(ref, function (entries) {
        var entry = entries[0];
        var observedHeight = entry.borderBoxSize && entry.borderBoxSize.length > 0
            ? entry.borderBoxSize[0].blockSize
            : entry.contentRect.height;
        apiRef.current.storeDetailPanelHeight(rowId, observedHeight);
    }, hasAutoHeight);
    if ((rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'skeletonRow') {
        return null;
    }
    return (<DetailPanel ref={ref} ownerState={ownerState} role="presentation" style={{ height: height }} className={className}>
      {children}
    </DetailPanel>);
}
