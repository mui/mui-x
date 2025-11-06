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
exports.useGridRowPinning = exports.rowPinningStateInitializer = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
function createPinnedRowsInternalCache(pinnedRows, getRowId) {
    var _a, _b;
    var cache = {
        topIds: [],
        bottomIds: [],
        idLookup: {},
    };
    (_a = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.top) === null || _a === void 0 ? void 0 : _a.forEach(function (rowModel) {
        var id = (0, internals_1.getRowIdFromRowModel)(rowModel, getRowId);
        cache.topIds.push(id);
        cache.idLookup[id] = rowModel;
    });
    (_b = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.bottom) === null || _b === void 0 ? void 0 : _b.forEach(function (rowModel) {
        var id = (0, internals_1.getRowIdFromRowModel)(rowModel, getRowId);
        cache.bottomIds.push(id);
        cache.idLookup[id] = rowModel;
    });
    return cache;
}
var rowPinningStateInitializer = function (state, props, apiRef) {
    var _a;
    apiRef.current.caches.pinnedRows = createPinnedRowsInternalCache(props.pinnedRows, props.getRowId);
    return __assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { additionalRowGroups: __assign(__assign({}, (_a = state.rows) === null || _a === void 0 ? void 0 : _a.additionalRowGroups), { pinnedRows: { top: [], bottom: [] } }) }) });
};
exports.rowPinningStateInitializer = rowPinningStateInitializer;
var useGridRowPinning = function (apiRef, props) {
    var setPinnedRows = React.useCallback(function (newPinnedRows) {
        apiRef.current.caches.pinnedRows = createPinnedRowsInternalCache(newPinnedRows, props.getRowId);
        apiRef.current.requestPipeProcessorsApplication('hydrateRows');
    }, [apiRef, props.getRowId]);
    (0, x_data_grid_1.useGridApiMethod)(apiRef, {
        unstable_setPinnedRows: setPinnedRows,
    }, 'public');
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        apiRef.current.unstable_setPinnedRows(props.pinnedRows);
    }, [apiRef, props.pinnedRows]);
};
exports.useGridRowPinning = useGridRowPinning;
