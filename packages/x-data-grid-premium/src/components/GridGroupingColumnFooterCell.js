"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridGroupingColumnFooterCell = GridGroupingColumnFooterCell;
var React = require("react");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridFooterCell_1 = require("./GridFooterCell");
function GridGroupingColumnFooterCell(props) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var sx = { ml: 0 };
    if (props.rowNode.parent == null) {
        sx.ml = 0;
    }
    else if (rootProps.rowGroupingColumnMode === 'multiple') {
        sx.ml = 2;
    }
    else {
        sx.ml = "calc(var(--DataGrid-cellOffsetMultiplier) * ".concat(internals_1.vars.spacing(props.rowNode.depth), ")");
    }
    return <GridFooterCell_1.GridFooterCell sx={sx} {...props}/>;
}
