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
exports.useGridRowsOverridableMethods = void 0;
var React = require("react");
var gridRowsSelector_1 = require("./gridRowsSelector");
var gridRowsUtils_1 = require("./gridRowsUtils");
var useGridRowsOverridableMethods = function (apiRef) {
    var setRowIndex = React.useCallback(function (rowId, targetIndex) {
        var node = (0, gridRowsSelector_1.gridRowNodeSelector)(apiRef, rowId);
        if (!node) {
            throw new Error("MUI X: No row with id #".concat(rowId, " found."));
        }
        // TODO: Remove irrelevant checks
        if (node.parent !== gridRowsUtils_1.GRID_ROOT_GROUP_ID) {
            throw new Error("MUI X: The row reordering do not support reordering of grouped rows yet.");
        }
        if (node.type !== 'leaf') {
            throw new Error("MUI X: The row reordering do not support reordering of footer or grouping rows.");
        }
        apiRef.current.setState(function (state) {
            var _a;
            var group = (0, gridRowsSelector_1.gridRowTreeSelector)(apiRef)[gridRowsUtils_1.GRID_ROOT_GROUP_ID];
            var allRows = group.children;
            var oldIndex = allRows.findIndex(function (row) { return row === rowId; });
            if (oldIndex === -1 || oldIndex === targetIndex) {
                return state;
            }
            var updatedRows = __spreadArray([], allRows, true);
            updatedRows.splice(targetIndex, 0, updatedRows.splice(oldIndex, 1)[0]);
            return __assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { tree: __assign(__assign({}, state.rows.tree), (_a = {}, _a[gridRowsUtils_1.GRID_ROOT_GROUP_ID] = __assign(__assign({}, group), { children: updatedRows }), _a)) }) });
        });
        apiRef.current.publishEvent('rowsSet');
    }, [apiRef]);
    return {
        setRowIndex: setRowIndex,
    };
};
exports.useGridRowsOverridableMethods = useGridRowsOverridableMethods;
