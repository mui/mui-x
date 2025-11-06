"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridParamsOverridableMethods = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridAggregationSelectors_1 = require("../aggregation/gridAggregationSelectors");
var useGridParamsOverridableMethods = function (apiRef) {
    var communityMethods = (0, internals_1.useGridParamsOverridableMethods)(apiRef);
    var getCellValue = React.useCallback(function (id, field) {
        var _a, _b;
        return (_b = (_a = (0, gridAggregationSelectors_1.gridCellAggregationResultSelector)(apiRef, {
            id: id,
            field: field,
        })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : communityMethods.getCellValue(id, field);
    }, [apiRef, communityMethods]);
    var getRowValue = React.useCallback(function (row, colDef) {
        var _a, _b;
        return (_b = (_a = (0, gridAggregationSelectors_1.gridCellAggregationResultSelector)(apiRef, {
            id: (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row),
            field: colDef.field,
        })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : communityMethods.getRowValue(row, colDef);
    }, [apiRef, communityMethods]);
    var getRowFormattedValue = React.useCallback(function (row, colDef) {
        var _a, _b;
        return (_b = (_a = (0, gridAggregationSelectors_1.gridCellAggregationResultSelector)(apiRef, {
            id: (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row),
            field: colDef.field,
        })) === null || _a === void 0 ? void 0 : _a.formattedValue) !== null && _b !== void 0 ? _b : communityMethods.getRowFormattedValue(row, colDef);
    }, [apiRef, communityMethods]);
    return {
        getCellValue: getCellValue,
        getRowValue: getRowValue,
        getRowFormattedValue: getRowFormattedValue,
    };
};
exports.useGridParamsOverridableMethods = useGridParamsOverridableMethods;
