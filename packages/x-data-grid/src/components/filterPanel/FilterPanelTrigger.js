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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPanelTrigger = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useForkRef_1 = require("@mui/utils/useForkRef");
var GridPanelContext_1 = require("../panel/GridPanelContext");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var hooks_1 = require("../../hooks");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
/**
 * A button that opens and closes the filter panel.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Filter Panel](https://mui.com/x/react-data-grid/components/filter-panel/)
 *
 * API:
 *
 * - [FilterPanelTrigger API](https://mui.com/x/api/data-grid/filter-panel-trigger/)
 */
var FilterPanelTrigger = (0, forwardRef_1.forwardRef)(function FilterPanelTrigger(props, ref) {
    var _a;
    var render = props.render, className = props.className, onClick = props.onClick, onPointerUp = props.onPointerUp, other = __rest(props, ["render", "className", "onClick", "onPointerUp"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var buttonId = (0, useId_1.default)();
    var panelId = (0, useId_1.default)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var panelState = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridPreferencePanelStateSelector);
    var open = panelState.open && panelState.openedPanelValue === hooks_1.GridPreferencePanelsValue.filters;
    var activeFilters = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridFilterActiveItemsSelector);
    var filterCount = activeFilters.length;
    var state = { open: open, filterCount: filterCount };
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var filterPanelTriggerRef = (0, GridPanelContext_1.useGridPanelContext)().filterPanelTriggerRef;
    var handleRef = (0, useForkRef_1.default)(ref, filterPanelTriggerRef);
    var handleClick = function (event) {
        if (open) {
            apiRef.current.hidePreferences();
        }
        else {
            apiRef.current.showPreferences(hooks_1.GridPreferencePanelsValue.filters, panelId, buttonId);
        }
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    };
    var handlePointerUp = function (event) {
        if (open) {
            event.stopPropagation();
        }
        onPointerUp === null || onPointerUp === void 0 ? void 0 : onPointerUp(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseButton, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseButton), { id: buttonId, 'aria-haspopup': 'true', 'aria-expanded': open ? 'true' : undefined, 'aria-controls': open ? panelId : undefined, onClick: handleClick, onPointerUp: handlePointerUp, className: resolvedClassName }), other), { ref: handleRef }), state);
    return <React.Fragment>{element}</React.Fragment>;
});
exports.FilterPanelTrigger = FilterPanelTrigger;
FilterPanelTrigger.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * A function to customize rendering of the component.
     */
    className: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    disabled: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    startIcon: prop_types_1.default.node,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    title: prop_types_1.default.string,
    touchRippleRef: prop_types_1.default.any,
};
