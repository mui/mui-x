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
exports.useGridPagination = exports.paginationStateInitializer = void 0;
var gridPaginationUtils_1 = require("./gridPaginationUtils");
var useGridPaginationModel_1 = require("./useGridPaginationModel");
var useGridRowCount_1 = require("./useGridRowCount");
var useGridPaginationMeta_1 = require("./useGridPaginationMeta");
var paginationStateInitializer = function (state, props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var paginationModel = __assign(__assign({}, (0, gridPaginationUtils_1.getDefaultGridPaginationModel)(props.autoPageSize)), ((_a = props.paginationModel) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.pagination) === null || _c === void 0 ? void 0 : _c.paginationModel));
    (0, gridPaginationUtils_1.throwIfPageSizeExceedsTheLimit)(paginationModel.pageSize, props.signature);
    var rowCount = (_g = (_d = props.rowCount) !== null && _d !== void 0 ? _d : (_f = (_e = props.initialState) === null || _e === void 0 ? void 0 : _e.pagination) === null || _f === void 0 ? void 0 : _f.rowCount) !== null && _g !== void 0 ? _g : (props.paginationMode === 'client' ? (_h = state.rows) === null || _h === void 0 ? void 0 : _h.totalRowCount : undefined);
    var meta = (_m = (_j = props.paginationMeta) !== null && _j !== void 0 ? _j : (_l = (_k = props.initialState) === null || _k === void 0 ? void 0 : _k.pagination) === null || _l === void 0 ? void 0 : _l.meta) !== null && _m !== void 0 ? _m : {};
    return __assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { paginationModel: paginationModel, rowCount: rowCount, meta: meta, enabled: props.pagination === true, paginationMode: props.paginationMode }) });
};
exports.paginationStateInitializer = paginationStateInitializer;
/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
var useGridPagination = function (apiRef, props) {
    (0, useGridPaginationMeta_1.useGridPaginationMeta)(apiRef, props);
    (0, useGridPaginationModel_1.useGridPaginationModel)(apiRef, props);
    (0, useGridRowCount_1.useGridRowCount)(apiRef, props);
};
exports.useGridPagination = useGridPagination;
