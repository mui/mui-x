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
exports.QuickFilterControl = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useForkRef_1 = require("@mui/utils/useForkRef");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var QuickFilterContext_1 = require("./QuickFilterContext");
/**
 * A component that takes user input and filters row data.
 * It renders the `baseTextField` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterControl API](https://mui.com/x/api/data-grid/quick-filter-control/)
 */
var QuickFilterControl = (0, forwardRef_1.forwardRef)(function QuickFilterControl(props, ref) {
    var _a;
    var render = props.render, className = props.className, slotProps = props.slotProps, onKeyDown = props.onKeyDown, onChange = props.onChange, other = __rest(props, ["render", "className", "slotProps", "onKeyDown", "onChange"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = (0, QuickFilterContext_1.useQuickFilterContext)(), state = _b.state, controlId = _b.controlId, controlRef = _b.controlRef, onValueChange = _b.onValueChange, onExpandedChange = _b.onExpandedChange, clearValue = _b.clearValue;
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var handleRef = (0, useForkRef_1.default)(controlRef, ref);
    var handleKeyDown = function (event) {
        if (event.key === 'Escape') {
            if (state.value === '') {
                onExpandedChange(false);
            }
            else {
                clearValue();
            }
        }
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
    };
    var handleBlur = function (event) {
        var _a, _b;
        if (state.value === '') {
            onExpandedChange(false);
        }
        (_b = (_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput) === null || _a === void 0 ? void 0 : _a.onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };
    var handleChange = function (event) {
        if (!state.expanded) {
            onExpandedChange(true);
        }
        onValueChange(event);
        onChange === null || onChange === void 0 ? void 0 : onChange(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseTextField, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTextField), { slotProps: __assign({ htmlInput: __assign(__assign({ role: 'searchbox', id: controlId, tabIndex: state.expanded ? undefined : -1 }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput), { onBlur: handleBlur }) }, slotProps), value: state.value, className: resolvedClassName }), other), { onChange: handleChange, onKeyDown: handleKeyDown, ref: handleRef }), state);
    return <React.Fragment>{element}</React.Fragment>;
});
exports.QuickFilterControl = QuickFilterControl;
QuickFilterControl.propTypes = {
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
