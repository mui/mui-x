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
exports.GridPivotPanelFieldMenu = GridPivotPanelFieldMenu;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var gridPivotingSelectors_1 = require("../../hooks/features/pivoting/gridPivotingSelectors");
function GridPivotPanelFieldMenu(props) {
    var _a, _b;
    var field = props.field, modelKey = props.modelKey;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var isAvailableField = modelKey === null;
    var pivotModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotModelSelector);
    var fieldIndexInModel = !isAvailableField
        ? pivotModel[modelKey].findIndex(function (item) { return item.field === field; })
        : -1;
    var modelLength = !isAvailableField ? pivotModel[modelKey].length : 0;
    var canMoveUp = fieldIndexInModel > 0;
    var canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
    var menuId = (0, useId_1.default)();
    var triggerId = (0, useId_1.default)();
    var triggerRef = React.useRef(null);
    var getMenuItems = React.useCallback(function () {
        if (isAvailableField) {
            return [
                { key: 'rows', label: apiRef.current.getLocaleText('pivotMenuAddToRows') },
                { key: 'columns', label: apiRef.current.getLocaleText('pivotMenuAddToColumns') },
                { key: 'values', label: apiRef.current.getLocaleText('pivotMenuAddToValues') },
            ];
        }
        return [
            {
                key: 'up',
                label: apiRef.current.getLocaleText('pivotMenuMoveUp'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuMoveUpIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'down',
                label: apiRef.current.getLocaleText('pivotMenuMoveDown'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuMoveDownIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'top',
                label: apiRef.current.getLocaleText('pivotMenuMoveToTop'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuMoveToTopIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'bottom',
                label: apiRef.current.getLocaleText('pivotMenuMoveToBottom'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuMoveToBottomIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'rows',
                label: apiRef.current.getLocaleText('pivotMenuRows'),
                icon: modelKey === 'rows' ? (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuCheckIcon, {}) : (0, jsx_runtime_1.jsx)("span", {}),
            },
            {
                key: 'columns',
                label: apiRef.current.getLocaleText('pivotMenuColumns'),
                icon: modelKey === 'columns' ? (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuCheckIcon, {}) : (0, jsx_runtime_1.jsx)("span", {}),
            },
            {
                key: 'values',
                label: apiRef.current.getLocaleText('pivotMenuValues'),
                icon: modelKey === 'values' ? (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuCheckIcon, {}) : (0, jsx_runtime_1.jsx)("span", {}),
            },
            { divider: true },
            {
                key: null,
                label: apiRef.current.getLocaleText('pivotMenuRemove'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuRemoveIcon, {}),
            },
        ];
    }, [isAvailableField, apiRef, rootProps, canMoveUp, canMoveDown, modelKey]);
    var handleClick = function () {
        setOpen(!open);
    };
    var handleClose = function () {
        setOpen(false);
    };
    var handleMove = function (to) {
        handleClose();
        // Do nothing if the field is already in the target section
        if (to === modelKey) {
            return;
        }
        var targetField;
        var targetFieldPosition = null;
        var targetSection = modelKey;
        switch (to) {
            case 'up':
                targetField = pivotModel[modelKey][fieldIndexInModel - 1].field;
                targetFieldPosition = 'top';
                break;
            case 'down':
                targetField = pivotModel[modelKey][fieldIndexInModel + 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'top':
                targetField = pivotModel[modelKey][0].field;
                targetFieldPosition = 'top';
                break;
            case 'bottom':
                targetField = pivotModel[modelKey][modelLength - 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'rows':
            case 'columns':
            case 'values':
            case null:
                targetSection = to;
                break;
            default:
                break;
        }
        apiRef.current.updatePivotModel({
            field: field,
            targetField: targetField,
            targetFieldPosition: targetFieldPosition,
            targetSection: targetSection,
            originSection: modelKey,
        });
    };
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({ size: "small" }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton, { id: triggerId, "aria-haspopup": "true", "aria-controls": open ? menuId : undefined, "aria-expanded": open ? 'true' : undefined, "aria-label": apiRef.current.getLocaleText('pivotMenuOptions'), onClick: handleClick, ref: triggerRef, children: isAvailableField ? ((0, jsx_runtime_1.jsx)(rootProps.slots.pivotMenuAddIcon, { fontSize: "small" })) : ((0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuIcon, { fontSize: "small" })) })), (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridMenu, { target: triggerRef.current, open: open, onClose: handleClose, position: "bottom-start", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, __assign({ id: menuId, "aria-labelledby": triggerId, autoFocusItem: true }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList, { children: getMenuItems().map(function (item, index) {
                        var _a;
                        return 'divider' in item ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseDivider, {}, "divider-".concat(index))) : ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({ disabled: item.disabled, onClick: function () { return handleMove(item.key); }, iconStart: item.icon }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem, { children: item.label }), item.key));
                    }) })) })] }));
}
