"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAggregationRowOverlay = void 0;
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
    return (<div className={classes.root}>
        <internals_1.GridSkeletonLoadingOverlayInner {...props} skeletonRowsCount={1} visibleColumns={visibleColumns} showFirstRowBorder ref={forwardedRef}/>
      </div>);
});
exports.GridAggregationRowOverlay = GridAggregationRowOverlay;
