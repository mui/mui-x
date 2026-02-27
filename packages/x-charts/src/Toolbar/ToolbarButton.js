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
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var React = require("react");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useForkRef_1 = require("@mui/utils/useForkRef");
var ToolbarContext_1 = require("@mui/x-internals/ToolbarContext");
var ChartsSlotsContext_1 = require("../context/ChartsSlotsContext");
var ToolbarButton = React.forwardRef(function ToolbarButton(props, ref) {
    var render = props.render, onKeyDown = props.onKeyDown, onFocus = props.onFocus, disabled = props.disabled, ariaDisabled = props["aria-disabled"], other = __rest(props, ["render", "onKeyDown", "onFocus", "disabled", 'aria-disabled']);
    var _a = (0, ChartsSlotsContext_1.useChartsSlots)(), slots = _a.slots, slotProps = _a.slotProps;
    var buttonRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(buttonRef, ref);
    var _b = (0, ToolbarContext_1.useRegisterToolbarButton)(props, buttonRef), tabIndex = _b.tabIndex, toolbarButtonProps = __rest(_b, ["tabIndex"]);
    var element = (0, useComponentRenderer_1.useComponentRenderer)(slots.baseIconButton, render, __assign(__assign(__assign(__assign(__assign({}, slotProps === null || slotProps === void 0 ? void 0 : slotProps.baseIconButton), { tabIndex: tabIndex }), other), toolbarButtonProps), { ref: handleRef }));
    return (0, jsx_runtime_1.jsx)(React.Fragment, { children: element });
});
exports.ToolbarButton = ToolbarButton;
ToolbarButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    disabled: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    /**
     * A function to customize the rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
};
