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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowReorderPreProcessors = void 0;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridRowReorderColDef_1 = require("./gridRowReorderColDef");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    return React.useMemo(function () {
        var slots = {
            rowReorderCellContainer: ['rowReorderCellContainer'],
            columnHeaderReorder: ['columnHeaderReorder'],
        };
        return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
    }, [classes]);
};
var useGridRowReorderPreProcessors = function (privateApiRef, props) {
    var ownerState = { classes: props.classes };
    var classes = useUtilityClasses(ownerState);
    var updateReorderColumn = React.useCallback(function (columnsState) {
        var reorderColumn = __assign(__assign({}, gridRowReorderColDef_1.GRID_REORDER_COL_DEF), { cellClassName: classes.rowReorderCellContainer, headerClassName: classes.columnHeaderReorder, headerName: privateApiRef.current.getLocaleText('rowReorderingHeaderName') });
        var shouldHaveReorderColumn = props.rowReordering;
        var hasReorderColumn = columnsState.lookup[reorderColumn.field] != null;
        if (shouldHaveReorderColumn && !hasReorderColumn) {
            columnsState.lookup[reorderColumn.field] = reorderColumn;
            columnsState.orderedFields = __spreadArray([reorderColumn.field], columnsState.orderedFields, true);
        }
        else if (!shouldHaveReorderColumn && hasReorderColumn) {
            delete columnsState.lookup[reorderColumn.field];
            columnsState.orderedFields = columnsState.orderedFields.filter(function (field) { return field !== reorderColumn.field; });
        }
        else if (shouldHaveReorderColumn && hasReorderColumn) {
            columnsState.lookup[reorderColumn.field] = __assign(__assign({}, reorderColumn), columnsState.lookup[reorderColumn.field]);
            // If the column is not in the columns array (not a custom reorder column), move it to the beginning of the column order
            if (!props.columns.some(function (col) { return col.field === gridRowReorderColDef_1.GRID_REORDER_COL_DEF.field; })) {
                columnsState.orderedFields = __spreadArray([
                    reorderColumn.field
                ], columnsState.orderedFields.filter(function (field) { return field !== reorderColumn.field; }), true);
            }
        }
        return columnsState;
    }, [privateApiRef, classes, props.columns, props.rowReordering]);
    (0, internals_1.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateColumns', updateReorderColumn);
};
exports.useGridRowReorderPreProcessors = useGridRowReorderPreProcessors;
