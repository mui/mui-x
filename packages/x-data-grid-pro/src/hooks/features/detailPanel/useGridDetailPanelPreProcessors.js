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
exports.useGridDetailPanelPreProcessors = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridDetailPanelToggleColDef_1 = require("./gridDetailPanelToggleColDef");
var gridDetailPanelSelector_1 = require("./gridDetailPanelSelector");
var useGridDetailPanelPreProcessors = function (privateApiRef, props) {
    var addToggleColumn = React.useCallback(function (columnsState) {
        var detailPanelToggleColumn = __assign(__assign({}, gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_COL_DEF), { headerName: privateApiRef.current.getLocaleText('detailPanelToggle') });
        var shouldHaveToggleColumn = !!props.getDetailPanelContent;
        var hasToggleColumn = columnsState.lookup[gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD] != null;
        if (shouldHaveToggleColumn && !hasToggleColumn) {
            columnsState.lookup[gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD] = detailPanelToggleColumn;
            columnsState.orderedFields = __spreadArray([
                gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD
            ], columnsState.orderedFields, true);
        }
        else if (!shouldHaveToggleColumn && hasToggleColumn) {
            delete columnsState.lookup[gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD];
            columnsState.orderedFields = columnsState.orderedFields.filter(function (field) { return field !== gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD; });
        }
        else if (shouldHaveToggleColumn && hasToggleColumn) {
            columnsState.lookup[gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD] = __assign(__assign({}, detailPanelToggleColumn), columnsState.lookup[gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD]);
            // If the column is not in the columns array (not a custom detail panel toggle column), move it to the beginning of the column order
            if (!props.columns.some(function (col) { return col.field === gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD; })) {
                columnsState.orderedFields = __spreadArray([
                    gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD
                ], columnsState.orderedFields.filter(function (field) { return field !== gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD; }), true);
            }
        }
        return columnsState;
    }, [privateApiRef, props.columns, props.getDetailPanelContent]);
    var addExpandedClassToRow = React.useCallback(function (classes, id) {
        if (props.getDetailPanelContent == null) {
            return classes;
        }
        var expandedRowIds = (0, gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector)(privateApiRef);
        if (!expandedRowIds.has(id)) {
            return classes;
        }
        return __spreadArray(__spreadArray([], classes, true), [x_data_grid_1.gridClasses['row--detailPanelExpanded']], false);
    }, [privateApiRef, props.getDetailPanelContent]);
    (0, internals_1.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateColumns', addToggleColumn);
    (0, internals_1.useGridRegisterPipeProcessor)(privateApiRef, 'rowClassName', addExpandedClassToRow);
};
exports.useGridDetailPanelPreProcessors = useGridDetailPanelPreProcessors;
