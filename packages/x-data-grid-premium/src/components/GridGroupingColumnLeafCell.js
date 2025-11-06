"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridGroupingColumnLeafCell = GridGroupingColumnLeafCell;
var jsx_runtime_1 = require("react/jsx-runtime");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
function GridGroupingColumnLeafCell(props) {
    var _a;
    var rowNode = props.rowNode;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            marginLeft: rootProps.rowGroupingColumnMode === 'multiple'
                ? internals_1.vars.spacing(1)
                : "calc(var(--DataGrid-cellOffsetMultiplier) * ".concat(internals_1.vars.spacing(rowNode.depth), ")"),
        }, children: (_a = props.formattedValue) !== null && _a !== void 0 ? _a : props.value }));
}
