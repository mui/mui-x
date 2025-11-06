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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowsMeta = exports.rowsMetaStateInitializer = void 0;
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridPaginationSelector_1 = require("../pagination/gridPaginationSelector");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridRowsSelector_1 = require("./gridRowsSelector");
var gridDimensionsSelectors_1 = require("../dimensions/gridDimensionsSelectors");
var rowsMetaStateInitializer = function (state, props, apiRef) {
    // FIXME: This should be handled in the virtualizer eventually, but there are interdependencies
    // between state initializers that need to be untangled carefully.
    var baseRowHeight = (0, gridDimensionsSelectors_1.gridRowHeightSelector)(apiRef);
    var dataRowCount = (0, gridRowsSelector_1.gridRowCountSelector)(apiRef);
    var pagination = (0, gridPaginationSelector_1.gridPaginationSelector)(apiRef);
    var rowCount = Math.min(pagination.enabled ? pagination.paginationModel.pageSize : dataRowCount, dataRowCount);
    return __assign(__assign({}, state), { rowsMeta: {
            currentPageTotalHeight: rowCount * baseRowHeight,
            positions: Array.from({ length: rowCount }, function (_, i) { return i * baseRowHeight; }),
            pinnedTopRowsTotalHeight: 0,
            pinnedBottomRowsTotalHeight: 0,
        } });
};
exports.rowsMetaStateInitializer = rowsMetaStateInitializer;
/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
var useGridRowsMeta = function (apiRef, _props) {
    var virtualizer = apiRef.current.virtualizer;
    var _a = virtualizer.api.rowsMeta, getRowHeight = _a.getRowHeight, setLastMeasuredRowIndex = _a.setLastMeasuredRowIndex, storeRowHeightMeasurement = _a.storeRowHeightMeasurement, resetRowHeights = _a.resetRowHeights, hydrateRowsMeta = _a.hydrateRowsMeta, observeRowHeight = _a.observeRowHeight, rowHasAutoHeight = _a.rowHasAutoHeight, getRowHeightEntry = _a.getRowHeightEntry, getLastMeasuredRowIndex = _a.getLastMeasuredRowIndex;
    (0, pipeProcessing_1.useGridRegisterPipeApplier)(apiRef, 'rowHeight', hydrateRowsMeta);
    var rowsMetaApi = {
        unstable_getRowHeight: getRowHeight,
        unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
        unstable_storeRowHeightMeasurement: storeRowHeightMeasurement,
        resetRowHeights: resetRowHeights,
    };
    var rowsMetaPrivateApi = {
        hydrateRowsMeta: hydrateRowsMeta,
        observeRowHeight: observeRowHeight,
        rowHasAutoHeight: rowHasAutoHeight,
        getRowHeightEntry: getRowHeightEntry,
        getLastMeasuredRowIndex: getLastMeasuredRowIndex,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, rowsMetaApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, rowsMetaPrivateApi, 'private');
};
exports.useGridRowsMeta = useGridRowsMeta;
