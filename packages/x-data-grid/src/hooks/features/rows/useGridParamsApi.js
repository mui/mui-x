"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingRowIdError = void 0;
exports.useGridParamsApi = useGridParamsApi;
var React = require("react");
var domUtils_1 = require("../../../utils/domUtils");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridFocusStateSelector_1 = require("../focus/gridFocusStateSelector");
var gridListViewSelectors_1 = require("../listView/gridListViewSelectors");
var gridRowsSelector_1 = require("./gridRowsSelector");
var gridRowsUtils_1 = require("./gridRowsUtils");
var MissingRowIdError = /** @class */ (function (_super) {
    __extends(MissingRowIdError, _super);
    function MissingRowIdError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MissingRowIdError;
}(Error));
exports.MissingRowIdError = MissingRowIdError;
/**
 * @requires useGridColumns (method)
 * @requires useGridRows (method)
 * @requires useGridFocus (state)
 * @requires useGridEditing (method)
 * TODO: Impossible priority - useGridEditing also needs to be after useGridParamsApi
 * TODO: Impossible priority - useGridFocus also needs to be after useGridParamsApi
 */
function useGridParamsApi(apiRef, props) {
    var _a;
    var getColumnHeaderParams = React.useCallback(function (field) { return ({
        field: field,
        colDef: apiRef.current.getColumn(field),
    }); }, [apiRef]);
    var getRowParams = React.useCallback(function (id) {
        var row = apiRef.current.getRow(id);
        if (!row) {
            throw new MissingRowIdError("No row with id #".concat(id, " found"));
        }
        var params = {
            id: id,
            columns: apiRef.current.getAllColumns(),
            row: row,
        };
        return params;
    }, [apiRef]);
    var getCellParamsForRow = React.useCallback(function (id, field, row, _a) {
        var cellMode = _a.cellMode, colDef = _a.colDef, hasFocus = _a.hasFocus, rowNode = _a.rowNode, tabIndex = _a.tabIndex;
        var rawValue = row[field];
        var value = (colDef === null || colDef === void 0 ? void 0 : colDef.valueGetter)
            ? colDef.valueGetter(rawValue, row, colDef, apiRef)
            : rawValue;
        var params = {
            id: id,
            field: field,
            row: row,
            rowNode: rowNode,
            colDef: colDef,
            cellMode: cellMode,
            hasFocus: hasFocus,
            tabIndex: tabIndex,
            value: value,
            formattedValue: value,
            isEditable: false,
            api: apiRef.current,
        };
        if (colDef && colDef.valueFormatter) {
            params.formattedValue = colDef.valueFormatter(value, row, colDef, apiRef);
        }
        params.isEditable = colDef && apiRef.current.isCellEditable(params);
        return params;
    }, [apiRef]);
    var getCellParams = React.useCallback(function (id, field) {
        var _a;
        var row = apiRef.current.getRow(id);
        var rowNode = (0, gridRowsSelector_1.gridRowNodeSelector)(apiRef, id);
        if (!row || !rowNode) {
            throw new MissingRowIdError("No row with id #".concat(id, " found"));
        }
        var cellFocus = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
        var cellTabIndex = (0, gridFocusStateSelector_1.gridTabIndexCellSelector)(apiRef);
        var cellMode = apiRef.current.getCellMode(id, field);
        return apiRef.current.getCellParamsForRow(id, field, row, {
            colDef: props.listView && ((_a = props.listViewColumn) === null || _a === void 0 ? void 0 : _a.field) === field
                ? (0, gridListViewSelectors_1.gridListColumnSelector)(apiRef)
                : apiRef.current.getColumn(field),
            rowNode: rowNode,
            hasFocus: cellFocus !== null && cellFocus.field === field && cellFocus.id === id,
            tabIndex: cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === id ? 0 : -1,
            cellMode: cellMode,
        });
    }, [apiRef, props.listView, (_a = props.listViewColumn) === null || _a === void 0 ? void 0 : _a.field]);
    var getCellValue = React.useCallback(function (id, field) {
        var colDef = apiRef.current.getColumn(field);
        var row = apiRef.current.getRow(id);
        if (!row) {
            throw new MissingRowIdError("No row with id #".concat(id, " found"));
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
    var getColumnHeaderElement = React.useCallback(function (field) {
        if (!apiRef.current.rootElementRef.current) {
            return null;
        }
        return (0, domUtils_1.getGridColumnHeaderElement)(apiRef.current.rootElementRef.current, field);
    }, [apiRef]);
    var getRowElement = React.useCallback(function (id) {
        if (!apiRef.current.rootElementRef.current) {
            return null;
        }
        return (0, domUtils_1.getGridRowElement)(apiRef.current.rootElementRef.current, id);
    }, [apiRef]);
    var getCellElement = React.useCallback(function (id, field) {
        if (!apiRef.current.rootElementRef.current) {
            return null;
        }
        return (0, domUtils_1.getGridCellElement)(apiRef.current.rootElementRef.current, { id: id, field: field });
    }, [apiRef]);
    var paramsApi = {
        getCellValue: getCellValue,
        getCellParams: getCellParams,
        getCellElement: getCellElement,
        getRowValue: getRowValue,
        getRowFormattedValue: getRowFormattedValue,
        getRowParams: getRowParams,
        getRowElement: getRowElement,
        getColumnHeaderParams: getColumnHeaderParams,
        getColumnHeaderElement: getColumnHeaderElement,
    };
    var paramsPrivateApi = {
        getCellParamsForRow: getCellParamsForRow,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, paramsApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, paramsPrivateApi, 'private');
}
