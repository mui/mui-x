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
exports.useGridRowSelectionPreProcessors = void 0;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var constants_1 = require("../../../constants");
var colDef_1 = require("../../../colDef");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    return React.useMemo(function () {
        var slots = {
            cellCheckbox: ['cellCheckbox'],
            columnHeaderCheckbox: ['columnHeaderCheckbox'],
        };
        return (0, composeClasses_1.default)(slots, constants_1.getDataGridUtilityClass, classes);
    }, [classes]);
};
var useGridRowSelectionPreProcessors = function (apiRef, props) {
    var ownerState = { classes: props.classes };
    var classes = useUtilityClasses(ownerState);
    var updateSelectionColumn = React.useCallback(function (columnsState) {
        var selectionColumn = __assign(__assign({}, colDef_1.GRID_CHECKBOX_SELECTION_COL_DEF), { cellClassName: classes.cellCheckbox, headerClassName: classes.columnHeaderCheckbox, headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName') });
        var shouldHaveSelectionColumn = props.checkboxSelection;
        var hasSelectionColumn = columnsState.lookup[colDef_1.GRID_CHECKBOX_SELECTION_FIELD] != null;
        if (shouldHaveSelectionColumn && !hasSelectionColumn) {
            columnsState.lookup[colDef_1.GRID_CHECKBOX_SELECTION_FIELD] = selectionColumn;
            columnsState.orderedFields = __spreadArray([colDef_1.GRID_CHECKBOX_SELECTION_FIELD], columnsState.orderedFields, true);
        }
        else if (!shouldHaveSelectionColumn && hasSelectionColumn) {
            delete columnsState.lookup[colDef_1.GRID_CHECKBOX_SELECTION_FIELD];
            columnsState.orderedFields = columnsState.orderedFields.filter(function (field) { return field !== colDef_1.GRID_CHECKBOX_SELECTION_FIELD; });
        }
        else if (shouldHaveSelectionColumn && hasSelectionColumn) {
            columnsState.lookup[colDef_1.GRID_CHECKBOX_SELECTION_FIELD] = __assign(__assign({}, selectionColumn), columnsState.lookup[colDef_1.GRID_CHECKBOX_SELECTION_FIELD]);
            // If the column is not in the columns array (not a custom selection column), move it to the beginning of the column order
            if (!props.columns.some(function (col) { return col.field === colDef_1.GRID_CHECKBOX_SELECTION_FIELD; })) {
                columnsState.orderedFields = __spreadArray([
                    colDef_1.GRID_CHECKBOX_SELECTION_FIELD
                ], columnsState.orderedFields.filter(function (field) { return field !== colDef_1.GRID_CHECKBOX_SELECTION_FIELD; }), true);
            }
        }
        return columnsState;
    }, [apiRef, classes, props.columns, props.checkboxSelection]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'hydrateColumns', updateSelectionColumn);
};
exports.useGridRowSelectionPreProcessors = useGridRowSelectionPreProcessors;
