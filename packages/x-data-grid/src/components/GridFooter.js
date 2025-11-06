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
exports.GridFooter = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridSelector_1 = require("../hooks/utils/useGridSelector");
var gridRowsSelector_1 = require("../hooks/features/rows/gridRowsSelector");
var gridRowSelectionSelector_1 = require("../hooks/features/rowSelection/gridRowSelectionSelector");
var gridFilterSelector_1 = require("../hooks/features/filter/gridFilterSelector");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridSelectedRowCount_1 = require("./GridSelectedRowCount");
var GridFooterContainer_1 = require("./containers/GridFooterContainer");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridFooter = (0, forwardRef_1.forwardRef)(function GridFooter(props, ref) {
    var _a, _b;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var totalTopLevelRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridTopLevelRowCountSelector);
    var selectedRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowSelectionSelector_1.gridRowSelectionCountSelector);
    var visibleTopLevelRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridFilteredTopLevelRowCountSelector);
    var selectedRowCountElement = !rootProps.hideFooterSelectedRowCount && selectedRowCount > 0 ? ((0, jsx_runtime_1.jsx)(GridSelectedRowCount_1.GridSelectedRowCount, { selectedRowCount: selectedRowCount })) : ((0, jsx_runtime_1.jsx)("div", {}));
    var rowCountElement = !rootProps.hideFooterRowCount && !rootProps.pagination ? ((0, jsx_runtime_1.jsx)(rootProps.slots.footerRowCount, __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.footerRowCount, { rowCount: totalTopLevelRowCount, visibleRowCount: visibleTopLevelRowCount }))) : null;
    var paginationElement = rootProps.pagination &&
        !rootProps.hideFooterPagination &&
        rootProps.slots.pagination && ((0, jsx_runtime_1.jsx)(rootProps.slots.pagination, __assign({}, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.pagination)));
    return ((0, jsx_runtime_1.jsxs)(GridFooterContainer_1.GridFooterContainer, __assign({}, props, { ref: ref, children: [selectedRowCountElement, rowCountElement, paginationElement] })));
});
exports.GridFooter = GridFooter;
GridFooter.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
