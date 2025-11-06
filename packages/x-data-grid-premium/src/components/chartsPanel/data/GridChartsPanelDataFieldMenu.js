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
exports.GridChartsPanelDataFieldMenu = GridChartsPanelDataFieldMenu;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../../hooks/utils/useGridPrivateApiContext");
var gridChartsIntegrationSelectors_1 = require("../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors");
function GridChartsPanelDataFieldMenu(props) {
    var _a, _b;
    var field = props.field, section = props.section, blockedSections = props.blockedSections, dimensionsLabel = props.dimensionsLabel, valuesLabel = props.valuesLabel;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var activeChartId = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector);
    var dimensions = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsDimensionsSelector, activeChartId);
    var values = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsValuesSelector, activeChartId);
    var isAvailableField = section === null;
    var fieldIndexInModel = !isAvailableField
        ? (section === 'dimensions' ? dimensions : values).findIndex(function (item) { return item.field === field; })
        : -1;
    var modelLength = !isAvailableField
        ? (section === 'dimensions' ? dimensions : values).length
        : 0;
    var canMoveUp = fieldIndexInModel > 0;
    var canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
    var menuId = (0, useId_1.default)();
    var triggerId = (0, useId_1.default)();
    var triggerRef = React.useRef(null);
    var menuItems = React.useMemo(function () {
        if (isAvailableField) {
            return [
                {
                    key: 'dimensions',
                    label: apiRef.current.getLocaleText('chartsMenuAddToDimensions')(dimensionsLabel),
                },
                {
                    key: 'values',
                    label: apiRef.current.getLocaleText('chartsMenuAddToValues')(valuesLabel),
                },
            ].filter(function (item) { return !(blockedSections === null || blockedSections === void 0 ? void 0 : blockedSections.includes(item.key)); });
        }
        var moveMenuItems = [
            {
                key: 'up',
                label: apiRef.current.getLocaleText('chartsMenuMoveUp'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsMenuMoveUpIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'down',
                label: apiRef.current.getLocaleText('chartsMenuMoveDown'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsMenuMoveDownIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'top',
                label: apiRef.current.getLocaleText('chartsMenuMoveToTop'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsMenuMoveToTopIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'bottom',
                label: apiRef.current.getLocaleText('chartsMenuMoveToBottom'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsMenuMoveToBottomIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
        ];
        var removeMenuItem = [
            {
                key: null,
                label: apiRef.current.getLocaleText('chartsMenuRemove'),
                icon: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsMenuRemoveIcon, {}),
            },
        ];
        var addToSectionMenuItems = [
            {
                key: 'dimensions',
                label: apiRef.current.getLocaleText('chartsMenuAddToDimensions')(dimensionsLabel),
                icon: (0, jsx_runtime_1.jsx)("span", {}),
            },
            {
                key: 'values',
                label: apiRef.current.getLocaleText('chartsMenuAddToValues')(valuesLabel),
                icon: (0, jsx_runtime_1.jsx)("span", {}),
            },
        ].filter(function (item) { return item.key !== section && !(blockedSections === null || blockedSections === void 0 ? void 0 : blockedSections.includes(item.key)); });
        if (addToSectionMenuItems.length > 0) {
            addToSectionMenuItems.push({ divider: true });
        }
        return __spreadArray(__spreadArray(__spreadArray([], moveMenuItems, true), addToSectionMenuItems, true), removeMenuItem, true);
    }, [
        isAvailableField,
        apiRef,
        rootProps,
        canMoveUp,
        canMoveDown,
        section,
        blockedSections,
        dimensionsLabel,
        valuesLabel,
    ]);
    if (menuItems.length === 0) {
        return null;
    }
    var handleClick = function () {
        setOpen(!open);
    };
    var handleClose = function () {
        setOpen(false);
    };
    var handleMove = function (to) {
        handleClose();
        // Do nothing if the field is already in the target section
        if (to === section) {
            return;
        }
        var items = section === 'dimensions' ? dimensions : values;
        var targetField;
        var targetFieldPosition = null;
        var targetSection = section;
        switch (to) {
            case 'up':
                targetField = items[fieldIndexInModel - 1].field;
                targetFieldPosition = 'top';
                break;
            case 'down':
                targetField = items[fieldIndexInModel + 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'top':
                targetField = items[0].field;
                targetFieldPosition = 'top';
                break;
            case 'bottom':
                targetField = items[modelLength - 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'dimensions':
            case 'values':
            case null:
                targetSection = to;
                break;
            default:
                break;
        }
        apiRef.current.chartsIntegration.updateDataReference(field, section, targetSection, targetField, targetFieldPosition || undefined);
    };
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({ size: "small" }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton, { id: triggerId, "aria-haspopup": "true", "aria-controls": open ? menuId : undefined, "aria-expanded": open ? 'true' : undefined, "aria-label": apiRef.current.getLocaleText('chartsMenuOptions'), onClick: handleClick, ref: triggerRef, children: isAvailableField ? ((0, jsx_runtime_1.jsx)(rootProps.slots.chartsMenuAddIcon, { fontSize: "small" })) : ((0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuIcon, { fontSize: "small" })) })), (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridMenu, { target: triggerRef.current, open: open, onClose: handleClose, position: "bottom-start", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, __assign({ id: menuId, "aria-labelledby": triggerId, autoFocusItem: true }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList, { children: menuItems.map(function (item, index) {
                        var _a;
                        return 'divider' in item ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseDivider, {}, "divider-".concat(index))) : ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({ disabled: item.disabled, onClick: function () { return handleMove(item.key); }, iconStart: item.icon }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem, { children: item.label }), item.key));
                    }) })) })] }));
}
