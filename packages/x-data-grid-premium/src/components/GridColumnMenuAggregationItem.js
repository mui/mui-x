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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuAggregationItem = GridColumnMenuAggregationItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useId_1 = require("@mui/utils/useId");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var gridAggregationUtils_1 = require("../hooks/features/aggregation/gridAggregationUtils");
var gridAggregationSelectors_1 = require("../hooks/features/aggregation/gridAggregationSelectors");
function GridColumnMenuAggregationItem(props) {
    var _a, _b;
    var colDef = props.colDef;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var inputRef = React.useRef(null);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var id = (0, useId_1.default)();
    var aggregationModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridAggregationSelectors_1.gridAggregationModelSelector);
    var availableAggregationFunctions = React.useMemo(function () {
        return (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
            aggregationFunctions: rootProps.aggregationFunctions,
            colDef: colDef,
            isDataSource: !!rootProps.dataSource,
        });
    }, [colDef, rootProps.aggregationFunctions, rootProps.dataSource]);
    var _c = ((_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseSelect) || {}, _d = _c.native, isBaseSelectNative = _d === void 0 ? false : _d, baseSelectProps = __rest(_c, ["native"]);
    var baseSelectOptionProps = ((_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseSelectOption) || {};
    var selectedAggregationRule = React.useMemo(function () {
        if (!colDef || !aggregationModel[colDef.field]) {
            return '';
        }
        var aggregationFunctionName = aggregationModel[colDef.field];
        if ((0, gridAggregationUtils_1.canColumnHaveAggregationFunction)({
            colDef: colDef,
            aggregationFunctionName: aggregationFunctionName,
            aggregationFunction: rootProps.aggregationFunctions[aggregationFunctionName],
            isDataSource: !!rootProps.dataSource,
        })) {
            return aggregationFunctionName;
        }
        return '';
    }, [rootProps.aggregationFunctions, rootProps.dataSource, aggregationModel, colDef]);
    var handleAggregationItemChange = function (event) {
        var _a;
        var _b;
        var newAggregationItem = ((_b = event.target) === null || _b === void 0 ? void 0 : _b.value) || undefined;
        var currentModel = (0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef);
        var _c = currentModel, _d = colDef.field, columnItem = _c[_d], otherColumnItems = __rest(_c, [typeof _d === "symbol" ? _d : _d + ""]);
        var newModel = newAggregationItem == null
            ? otherColumnItems
            : __assign(__assign({}, otherColumnItems), (_a = {}, _a[colDef === null || colDef === void 0 ? void 0 : colDef.field] = newAggregationItem, _a));
        apiRef.current.setAggregationModel(newModel);
        apiRef.current.hideColumnMenu();
    };
    var label = apiRef.current.getLocaleText('aggregationMenuItemHeader');
    var handleMenuItemKeyDown = React.useCallback(function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            inputRef.current.focus();
        }
    }, []);
    var handleSelectKeyDown = React.useCallback(function (event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ') {
            event.stopPropagation();
        }
    }, []);
    return (<rootProps.slots.baseMenuItem inert iconStart={<rootProps.slots.columnMenuAggregationIcon fontSize="small"/>} onKeyDown={handleMenuItemKeyDown}>
      <rootProps.slots.baseSelect labelId={"".concat(id, "-label")} id={"".concat(id, "-input")} value={selectedAggregationRule} label={label} onChange={handleAggregationItemChange} onKeyDown={handleSelectKeyDown} onBlur={function (event) { return event.stopPropagation(); }} native={isBaseSelectNative} fullWidth size="small" style={{ minWidth: 150 }} slotProps={{
            htmlInput: {
                ref: inputRef,
            },
        }} {...baseSelectProps}>
        <rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isBaseSelectNative} value="">
          ...
        </rootProps.slots.baseSelectOption>
        {availableAggregationFunctions.map(function (aggFunc) { return (<rootProps.slots.baseSelectOption {...baseSelectOptionProps} key={aggFunc} value={aggFunc} native={isBaseSelectNative}>
            {(0, gridAggregationUtils_1.getAggregationFunctionLabel)({
                apiRef: apiRef,
                aggregationRule: {
                    aggregationFunctionName: aggFunc,
                    aggregationFunction: rootProps.aggregationFunctions[aggFunc],
                },
            })}
          </rootProps.slots.baseSelectOption>); })}
      </rootProps.slots.baseSelect>
    </rootProps.slots.baseMenuItem>);
}
GridColumnMenuAggregationItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
