"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuSortItem = GridColumnMenuSortItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useGridSelector_1 = require("../../../../hooks/utils/useGridSelector");
var gridSortingSelector_1 = require("../../../../hooks/features/sorting/gridSortingSelector");
var useGridApiContext_1 = require("../../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../../hooks/utils/useGridRootProps");
function GridColumnMenuSortItem(props) {
    var _a;
    var colDef = props.colDef, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var sortModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridSortingSelector_1.gridSortModelSelector);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var sortDirection = React.useMemo(function () {
        if (!colDef) {
            return null;
        }
        var sortItem = sortModel.find(function (item) { return item.field === colDef.field; });
        return sortItem === null || sortItem === void 0 ? void 0 : sortItem.sort;
    }, [colDef, sortModel]);
    var sortingOrder = (_a = colDef.sortingOrder) !== null && _a !== void 0 ? _a : rootProps.sortingOrder;
    var onSortMenuItemClick = React.useCallback(function (event) {
        onClick(event);
        var direction = event.currentTarget.getAttribute('data-value') || null;
        var allowMultipleSorting = rootProps.multipleColumnsSortingMode === 'always';
        apiRef.current.sortColumn(colDef.field, (direction === sortDirection ? null : direction), allowMultipleSorting);
    }, [apiRef, colDef, onClick, sortDirection, rootProps.multipleColumnsSortingMode]);
    if (rootProps.disableColumnSorting ||
        !colDef ||
        !colDef.sortable ||
        !sortingOrder.some(function (item) { return !!item; })) {
        return null;
    }
    var getLabel = function (key) {
        var label = apiRef.current.getLocaleText(key);
        return typeof label === 'function' ? label(colDef) : label;
    };
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [sortingOrder.includes('asc') && sortDirection !== 'asc' ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: onSortMenuItemClick, "data-value": "asc", iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuSortAscendingIcon, { fontSize: "small" }), children: getLabel('columnMenuSortAsc') })) : null, sortingOrder.includes('desc') && sortDirection !== 'desc' ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: onSortMenuItemClick, "data-value": "desc", iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuSortDescendingIcon, { fontSize: "small" }), children: getLabel('columnMenuSortDesc') })) : null, sortingOrder.includes(null) && sortDirection != null ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: onSortMenuItemClick, iconStart: rootProps.slots.columnMenuUnsortIcon ? ((0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuUnsortIcon, { fontSize: "small" })) : ((0, jsx_runtime_1.jsx)("span", {})), children: apiRef.current.getLocaleText('columnMenuUnsort') })) : null] }));
}
GridColumnMenuSortItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
