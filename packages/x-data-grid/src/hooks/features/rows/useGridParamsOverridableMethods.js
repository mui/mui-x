"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridParamsOverridableMethods = void 0;
var React = require("react");
var gridRowsUtils_1 = require("./gridRowsUtils");
var useGridParamsOverridableMethods = function (apiRef) {
    var getCellValue = React.useCallback(function (id, field) {
        var colDef = apiRef.current.getColumn(field);
        var row = apiRef.current.getRow(id);
        if (!row) {
            throw new Error("No row with id #".concat(id, " found"));
        }
        if (!colDef || !colDef.valueGetter) {
            return row[field];
        }
        return colDef.valueGetter(row[colDef.field], row, colDef, apiRef);
    }, [apiRef]);
    var getRowValue = React.useCallback(function (row, colDef) { return (0, gridRowsUtils_1.getRowValue)(row, colDef, apiRef); }, [apiRef]);
    var getRowFormattedValue = React.useCallback(function (row, colDef) {
        var value = getRowValue(row, colDef);
        if (!colDef || !colDef.valueFormatter) {
            return value;
        }
        return colDef.valueFormatter(value, row, colDef, apiRef);
    }, [apiRef, getRowValue]);
    return {
        getCellValue: getCellValue,
        getRowValue: getRowValue,
        getRowFormattedValue: getRowFormattedValue,
    };
};
exports.useGridParamsOverridableMethods = useGridParamsOverridableMethods;
