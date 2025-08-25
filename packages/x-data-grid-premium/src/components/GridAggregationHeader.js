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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAggregationHeader = GridAggregationHeader;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var styles_1 = require("@mui/material/styles");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridAggregationUtils_1 = require("../hooks/features/aggregation/gridAggregationUtils");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridAggregationHeaderRoot = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AggregationColumnHeader',
    overridesResolver: function (props, styles) {
        var ownerState = props.ownerState;
        return [
            styles.aggregationColumnHeader,
            ownerState.colDef.headerAlign === 'left' && styles['aggregationColumnHeader--alignLeft'],
            ownerState.colDef.headerAlign === 'center' && styles['aggregationColumnHeader--alignCenter'],
            ownerState.colDef.headerAlign === 'right' && styles['aggregationColumnHeader--alignRight'],
        ];
    },
})((_a = {
        display: 'flex',
        flexDirection: 'column'
    },
    _a["&.".concat(x_data_grid_1.gridClasses['aggregationColumnHeader--alignRight'])] = {
        alignItems: 'flex-end',
    },
    _a["&.".concat(x_data_grid_1.gridClasses['aggregationColumnHeader--alignCenter'])] = {
        alignItems: 'center',
    },
    _a));
var GridAggregationFunctionLabel = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'AggregationColumnHeaderLabel',
})({
    font: internals_1.vars.typography.font.small,
    lineHeight: 'normal',
    color: internals_1.vars.colors.foreground.muted,
    marginTop: -1,
});
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, colDef = ownerState.colDef;
    var slots = {
        root: [
            'aggregationColumnHeader',
            colDef.headerAlign === 'left' && 'aggregationColumnHeader--alignLeft',
            colDef.headerAlign === 'center' && 'aggregationColumnHeader--alignCenter',
            colDef.headerAlign === 'right' && 'aggregationColumnHeader--alignRight',
        ],
        aggregationLabel: ['aggregationColumnHeaderLabel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
function GridAggregationHeader(props) {
    var _a;
    var renderHeader = props.renderHeader, params = __rest(props, ["renderHeader"]);
    var colDef = params.colDef, aggregation = params.aggregation;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = __assign(__assign({}, rootProps), { classes: rootProps.classes, colDef: colDef });
    var classes = useUtilityClasses(ownerState);
    if (!aggregation) {
        return null;
    }
    var aggregationLabel = (0, gridAggregationUtils_1.getAggregationFunctionLabel)({
        apiRef: apiRef,
        aggregationRule: aggregation.aggregationRule,
    });
    return (<GridAggregationHeaderRoot ownerState={ownerState} className={classes.root}>
      {renderHeader ? (renderHeader(params)) : (<x_data_grid_1.GridColumnHeaderTitle label={(_a = colDef.headerName) !== null && _a !== void 0 ? _a : colDef.field} description={colDef.description} columnWidth={colDef.computedWidth}/>)}
      <GridAggregationFunctionLabel ownerState={ownerState} className={classes.aggregationLabel}>
        {aggregationLabel}
      </GridAggregationFunctionLabel>
    </GridAggregationHeaderRoot>);
}
