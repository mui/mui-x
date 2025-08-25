"use strict";
'use client';
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
exports.useKeepGroupedColumnsHidden = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var updateColumnVisibilityModel = function (columnVisibilityModel, rowGroupingModel, prevRowGroupingModel) {
    var newColumnVisibilityModel = __assign({}, columnVisibilityModel);
    rowGroupingModel === null || rowGroupingModel === void 0 ? void 0 : rowGroupingModel.forEach(function (field) {
        if (!(prevRowGroupingModel === null || prevRowGroupingModel === void 0 ? void 0 : prevRowGroupingModel.includes(field))) {
            newColumnVisibilityModel[field] = false;
        }
    });
    prevRowGroupingModel === null || prevRowGroupingModel === void 0 ? void 0 : prevRowGroupingModel.forEach(function (field) {
        if (!(rowGroupingModel === null || rowGroupingModel === void 0 ? void 0 : rowGroupingModel.includes(field))) {
            newColumnVisibilityModel[field] = true;
        }
    });
    return newColumnVisibilityModel;
};
/**
 * Automatically hide columns when added to the row grouping model and stop hiding them when they are removed.
 * Handles both the `props.initialState.rowGrouping.model` and `props.rowGroupingModel`
 * Does not work when used with the `hide` property of `GridColDef`
 */
var useKeepGroupedColumnsHidden = function (props) {
    var _a, _b, _c;
    var initialProps = React.useRef(props);
    var rowGroupingModel = React.useRef((_a = props.rowGroupingModel) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.rowGrouping) === null || _c === void 0 ? void 0 : _c.model);
    React.useEffect(function () {
        var _a;
        (_a = props.apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowGroupingModelChange', function (newModel) {
            var _a;
            var columnVisibilityModel = updateColumnVisibilityModel((0, x_data_grid_pro_1.gridColumnVisibilityModelSelector)(props.apiRef), newModel, rowGroupingModel.current);
            (_a = props.apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibilityModel(columnVisibilityModel);
            rowGroupingModel.current = newModel;
        });
    }, [props.apiRef]);
    return React.useMemo(function () {
        var _a;
        var invariantInitialState = initialProps.current.initialState;
        var columnVisibilityModel = updateColumnVisibilityModel((_a = invariantInitialState === null || invariantInitialState === void 0 ? void 0 : invariantInitialState.columns) === null || _a === void 0 ? void 0 : _a.columnVisibilityModel, rowGroupingModel.current, undefined);
        return __assign(__assign({}, invariantInitialState), { columns: __assign(__assign({}, invariantInitialState === null || invariantInitialState === void 0 ? void 0 : invariantInitialState.columns), { columnVisibilityModel: columnVisibilityModel }) });
    }, []);
};
exports.useKeepGroupedColumnsHidden = useKeepGroupedColumnsHidden;
