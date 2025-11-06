"use strict";
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
exports.propValidatorsDataGridPro = void 0;
var internals_1 = require("@mui/x-data-grid/internals");
exports.propValidatorsDataGridPro = __spreadArray(__spreadArray([], internals_1.propValidatorsDataGrid, true), [
    function (props) {
        return (props.pagination &&
            props.hideFooterRowCount &&
            'MUI X: The `hideFooterRowCount` prop has no effect when the pagination is enabled.') ||
            undefined;
    },
    function (props) {
        return (props.treeData &&
            props.filterMode === 'server' &&
            !props.dataSource &&
            'MUI X: The `filterMode="server"` prop is not available when the `treeData` is enabled.') ||
            undefined;
    },
    function (props) {
        return (!props.pagination &&
            props.checkboxSelectionVisibleOnly &&
            'MUI X: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.') ||
            undefined;
    },
    function (props) {
        return (props.signature !== internals_1.GridSignature.DataGrid &&
            props.paginationMode === 'client' &&
            props.rowsLoadingMode !== 'server' &&
            (0, internals_1.isNumber)(props.rowCount) &&
            'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect. `rowCount` is only meant to be used with `paginationMode="server"`.') ||
            undefined;
    },
    function (props) {
        return (props.signature !== internals_1.GridSignature.DataGrid &&
            (props.rowsLoadingMode === 'server' || props.onRowsScrollEnd) &&
            props.lazyLoading &&
            'MUI X: Usage of the client side lazy loading (`rowsLoadingMode="server"` or `onRowsScrollEnd=...`) cannot be used together with server side lazy loading `lazyLoading="true"`.') ||
            undefined;
    },
], false);
