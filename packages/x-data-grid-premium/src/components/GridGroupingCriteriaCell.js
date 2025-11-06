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
exports.GridGroupingCriteriaCell = GridGroupingCriteriaCell;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-data-grid/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var gridPivotingSelectors_1 = require("../hooks/features/pivoting/gridPivotingSelectors");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['groupingCriteriaCell'],
        toggle: ['groupingCriteriaCellToggle'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
function GridGroupingCriteriaCell(props) {
    var _a, _b;
    var id = props.id, field = props.field, rowNode = props.rowNode, hideDescendantCount = props.hideDescendantCount, formattedValue = props.formattedValue;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var ownerState = { classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    var filteredDescendantCountLookup = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridFilteredDescendantCountLookupSelector);
    var filteredDescendantCount = (_a = filteredDescendantCountLookup[rowNode.id]) !== null && _a !== void 0 ? _a : 0;
    var pivotActive = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotActiveSelector);
    var maxTreeDepth = (0, x_data_grid_pro_1.gridRowMaximumTreeDepthSelector)(apiRef);
    var shouldShowToggleContainer = !pivotActive || maxTreeDepth > 2;
    var shouldShowToggleButton = !pivotActive || rowNode.depth < maxTreeDepth - 2;
    var Icon = rowNode.childrenExpanded
        ? rootProps.slots.groupingCriteriaCollapseIcon
        : rootProps.slots.groupingCriteriaExpandIcon;
    var handleKeyDown = function (event) {
        if (event.key === ' ') {
            // We call event.stopPropagation to avoid unfolding the row and also scrolling to bottom
            // TODO: Remove and add a check inside useGridKeyboardNavigation
            event.stopPropagation();
        }
        apiRef.current.publishEvent('cellKeyDown', props, event);
    };
    var handleClick = function (event) {
        apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation();
    };
    var cellContent;
    var colDef = apiRef.current.getColumn(rowNode.groupingField);
    if (typeof colDef.renderCell === 'function') {
        cellContent = colDef.renderCell(props);
    }
    else if (typeof formattedValue !== 'undefined') {
        cellContent = (0, jsx_runtime_1.jsx)("span", { children: formattedValue });
    }
    else {
        cellContent = (0, jsx_runtime_1.jsx)("span", { children: rowNode.groupingKey });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: classes.root, style: {
            marginLeft: rootProps.rowGroupingColumnMode === 'multiple'
                ? 0
                : "calc(var(--DataGrid-cellOffsetMultiplier) * ".concat(rowNode.depth, " * ").concat(internals_1.vars.spacing(1), ")"),
        }, children: [shouldShowToggleContainer ? ((0, jsx_runtime_1.jsx)("div", { className: classes.toggle, children: shouldShowToggleButton && filteredDescendantCount > 0 && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({ size: "small", onClick: handleClick, onKeyDown: handleKeyDown, tabIndex: -1, "aria-label": rowNode.childrenExpanded
                        ? apiRef.current.getLocaleText('treeDataCollapse')
                        : apiRef.current.getLocaleText('treeDataExpand') }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseIconButton, { children: (0, jsx_runtime_1.jsx)(Icon, { fontSize: "inherit" }) }))) })) : null, cellContent, !hideDescendantCount && filteredDescendantCount > 0 ? ((0, jsx_runtime_1.jsxs)("span", { style: { whiteSpace: 'pre' }, children: [" (", filteredDescendantCount, ")"] })) : null] }));
}
