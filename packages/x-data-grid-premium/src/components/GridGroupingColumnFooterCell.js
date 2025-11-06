"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridGroupingColumnFooterCell = GridGroupingColumnFooterCell;
var jsx_runtime_1 = require("react/jsx-runtime");
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
    return (0, jsx_runtime_1.jsx)(GridFooterCell_1.GridFooterCell, __assign({ sx: sx }, props));
}
