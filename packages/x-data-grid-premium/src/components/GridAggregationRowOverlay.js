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
exports.GridAggregationRowOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var gridAggregationSelectors_1 = require("../hooks/features/aggregation/gridAggregationSelectors");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['aggregationRowOverlayWrapper'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridAggregationRowOverlay = (0, forwardRef_1.forwardRef)(function GridAggregationRowOverlay(props, forwardedRef) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, x_data_grid_pro_1.useGridRootProps)();
    var classes = useUtilityClasses({ classes: rootProps.classes });
    var aggregationModel = (0, internals_1.useGridSelector)(apiRef, gridAggregationSelectors_1.gridAggregationModelSelector);
    var visibleColumns = new Set(Object.keys(aggregationModel));
    return ((0, jsx_runtime_1.jsx)("div", { className: classes.root, children: (0, jsx_runtime_1.jsx)(internals_1.GridSkeletonLoadingOverlayInner, __assign({}, props, { skeletonRowsCount: 1, visibleColumns: visibleColumns, showFirstRowBorder: true, ref: forwardedRef })) }));
});
exports.GridAggregationRowOverlay = GridAggregationRowOverlay;
