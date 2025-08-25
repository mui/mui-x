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
exports.QuickFilterClear = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var QuickFilterContext_1 = require("./QuickFilterContext");
/**
 * A button that resets the filter value.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterClear API](https://mui.com/x/api/data-grid/quick-filter-clear/)
 */
var QuickFilterClear = (0, forwardRef_1.forwardRef)(function QuickFilterClear(props, ref) {
    var _a;
    var render = props.render, className = props.className, onClick = props.onClick, other = __rest(props, ["render", "className", "onClick"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = (0, QuickFilterContext_1.useQuickFilterContext)(), state = _b.state, clearValue = _b.clearValue;
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var handleClick = function (event) {
        clearValue();
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseIconButton, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton), { className: resolvedClassName, tabIndex: -1 }), other), { onClick: handleClick, ref: ref }), state);
    return <React.Fragment>{element}</React.Fragment>;
});
exports.QuickFilterClear = QuickFilterClear;
QuickFilterClear.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
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
