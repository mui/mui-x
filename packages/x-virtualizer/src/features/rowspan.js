"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rowspan = void 0;
/* eslint-disable import/export, @typescript-eslint/no-redeclare */
var EMPTY_RANGE = { firstRowIndex: 0, lastRowIndex: 0 };
var EMPTY_CACHES = {
    spannedCells: {},
    hiddenCells: {},
    hiddenCellOriginMap: {},
};
var selectors = {
    state: function (state) { return state.rowSpanning; },
    hiddenCells: function (state) { return state.rowSpanning.caches.hiddenCells; },
    spannedCells: function (state) { return state.rowSpanning.caches.spannedCells; },
    hiddenCellsOriginMap: function (state) { return state.rowSpanning.caches.hiddenCellOriginMap; },
};
exports.Rowspan = {
    initialize: initializeState,
    use: useRowspan,
    selectors: selectors,
};
function initializeState(params) {
    var _a, _b;
    return {
        rowSpanning: (_b = (_a = params.initialState) === null || _a === void 0 ? void 0 : _a.rowSpanning) !== null && _b !== void 0 ? _b : {
            caches: EMPTY_CACHES,
            processedRange: EMPTY_RANGE,
        },
    };
}
function useRowspan(store, _params, _api) {
    var getHiddenCellsOrigin = function () { return selectors.hiddenCellsOriginMap(store.state); };
    return { getHiddenCellsOrigin: getHiddenCellsOrigin };
}
