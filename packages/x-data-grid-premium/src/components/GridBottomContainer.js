"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridBottomContainer = GridBottomContainer;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var GridAggregationRowOverlay_1 = require("./GridAggregationRowOverlay");
var reexports_1 = require("../typeOverloads/reexports");
var hooks_1 = require("../hooks");
var useUtilityClasses = function () {
    var slots = {
        root: ['bottomContainer'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, {});
};
var Element = (0, system_1.styled)('div')({
    position: 'sticky',
    zIndex: 40,
    bottom: 'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
});
function GridBottomContainer(props) {
    var classes = useUtilityClasses();
    var rootProps = (0, reexports_1.useGridRootProps)();
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var isLoading = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridRowsLoadingSelector);
    var tree = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridRowTreeSelector);
    var aggregationModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, hooks_1.gridAggregationModelSelector);
    var aggregationPosition = rootProps.getAggregationPosition(tree[x_data_grid_pro_1.GRID_ROOT_GROUP_ID]);
    var hasAggregation = React.useMemo(function () { return Object.keys(aggregationModel).length > 0; }, [aggregationModel]);
    var children = props.children, other = __rest(props, ["children"]);
    return (<Element {...other} className={(0, clsx_1.default)(classes.root, x_data_grid_pro_1.gridClasses['container--bottom'])} role="presentation">
      {hasAggregation && isLoading && aggregationPosition === 'footer' ? (<GridAggregationRowOverlay_1.GridAggregationRowOverlay />) : (children)}
    </Element>);
}
