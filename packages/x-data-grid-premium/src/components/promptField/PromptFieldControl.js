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
exports.PromptFieldControl = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var PromptFieldContext_1 = require("./PromptFieldContext");
/**
 * A component that takes user input.
 * It renders the `baseTextField` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldControl API](https://mui.com/x/api/data-grid/prompt-field-control/)
 */
var PromptFieldControl = (0, forwardRef_1.forwardRef)(function PromptFieldControl(props, ref) {
    var _a;
    var render = props.render, className = props.className, onChange = props.onChange, onKeyDown = props.onKeyDown, other = __rest(props, ["render", "className", "onChange", "onKeyDown"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = (0, PromptFieldContext_1.usePromptFieldContext)(), state = _b.state, onValueChange = _b.onValueChange, onSubmit = _b.onSubmit;
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var handleChange = function (event) {
        onValueChange(event.target.value);
        onChange === null || onChange === void 0 ? void 0 : onChange(event);
    };
    var handleKeyDown = function (event) {
        if (event.key === 'Enter' && state.value.trim()) {
            onSubmit(state.value);
        }
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseTextField, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTextField), { value: state.value, className: resolvedClassName }), other), { onChange: handleChange, onKeyDown: handleKeyDown, ref: ref }), state);
    return <React.Fragment>{element}</React.Fragment>;
});
exports.PromptFieldControl = PromptFieldControl;
PromptFieldControl.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    autoComplete: prop_types_1.default.string,
    autoFocus: prop_types_1.default.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    className: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    color: prop_types_1.default.oneOf(['error', 'primary']),
    disabled: prop_types_1.default.bool,
    error: prop_types_1.default.bool,
    fullWidth: prop_types_1.default.bool,
    helperText: prop_types_1.default.string,
    id: prop_types_1.default.string,
    inputRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.object,
        }),
    ]),
    label: prop_types_1.default.node,
    multiline: prop_types_1.default.bool,
    placeholder: prop_types_1.default.string,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['medium', 'small']),
    slotProps: prop_types_1.default.object,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    type: prop_types_1.default.oneOfType([
        prop_types_1.default.oneOf([
            'button',
            'checkbox',
            'color',
            'date',
            'datetime-local',
            'email',
            'file',
            'hidden',
            'image',
            'month',
            'number',
            'password',
            'radio',
            'range',
            'reset',
            'search',
            'submit',
            'tel',
            'text',
            'time',
            'url',
            'week',
        ]),
        prop_types_1.default.object,
    ]),
    value: prop_types_1.default.string,
};
