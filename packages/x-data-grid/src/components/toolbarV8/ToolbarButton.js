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
exports.ToolbarButton = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useId_1 = require("@mui/utils/useId");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var ToolbarContext_1 = require("./ToolbarContext");
/**
 * A button for performing actions from the toolbar.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [ToolbarButton API](https://mui.com/x/api/data-grid/toolbar-button/)
 */
var ToolbarButton = (0, forwardRef_1.forwardRef)(function ToolbarButton(props, ref) {
    var _a;
    var render = props.render, onKeyDown = props.onKeyDown, onFocus = props.onFocus, disabled = props.disabled, ariaDisabled = props["aria-disabled"], other = __rest(props, ["render", "onKeyDown", "onFocus", "disabled", 'aria-disabled']);
    var id = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var buttonRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(buttonRef, ref);
    var _b = (0, ToolbarContext_1.useToolbarContext)(), focusableItemId = _b.focusableItemId, registerItem = _b.registerItem, unregisterItem = _b.unregisterItem, onItemKeyDown = _b.onItemKeyDown, onItemFocus = _b.onItemFocus, onItemDisabled = _b.onItemDisabled;
    var handleKeyDown = function (event) {
        onItemKeyDown(event);
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
    };
    var handleFocus = function (event) {
        onItemFocus(id);
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(event);
    };
    React.useEffect(function () {
        registerItem(id, buttonRef);
        return function () { return unregisterItem(id); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var previousDisabled = React.useRef(disabled);
    React.useEffect(function () {
        if (previousDisabled.current !== disabled && disabled === true) {
            onItemDisabled(id, disabled);
        }
        previousDisabled.current = disabled;
    }, [disabled, id, onItemDisabled]);
    var previousAriaDisabled = React.useRef(ariaDisabled);
    React.useEffect(function () {
        if (previousAriaDisabled.current !== ariaDisabled && ariaDisabled === true) {
            onItemDisabled(id, true);
        }
        previousAriaDisabled.current = ariaDisabled;
    }, [ariaDisabled, id, onItemDisabled]);
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseIconButton, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton), { tabIndex: focusableItemId === id ? 0 : -1 }), other), { disabled: disabled, 'aria-disabled': ariaDisabled, onKeyDown: handleKeyDown, onFocus: handleFocus, ref: handleRef }));
    return <React.Fragment>{element}</React.Fragment>;
});
exports.ToolbarButton = ToolbarButton;
ToolbarButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    color: prop_types_1.default.oneOf(['default', 'inherit', 'primary']),
    disabled: prop_types_1.default.bool,
    edge: prop_types_1.default.oneOf(['end', 'start', false]),
    id: prop_types_1.default.string,
    label: prop_types_1.default.string,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    title: prop_types_1.default.string,
    touchRippleRef: prop_types_1.default.any,
};
