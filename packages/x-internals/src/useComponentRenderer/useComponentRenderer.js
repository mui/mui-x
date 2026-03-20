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
exports.useComponentRenderer = useComponentRenderer;
var React = require("react");
/**
 * Resolves the rendering logic for a component.
 * Handles three scenarios:
 * 1. A render function that receives props and state
 * 2. A React element
 * 3. A default element
 *
 * @ignore - internal hook.
 */
function useComponentRenderer(defaultElement, render, props, state) {
    if (state === void 0) { state = {}; }
    if (typeof render === 'function') {
        return render(props, state);
    }
    if (render) {
        if (render.props.className) {
            props.className = mergeClassNames(render.props.className, props.className);
        }
        if (render.props.style || props.style) {
            props.style = __assign(__assign({}, props.style), render.props.style);
        }
        return React.cloneElement(render, props);
    }
    return React.createElement(defaultElement, props);
}
function mergeClassNames(className, otherClassName) {
    if (!className || !otherClassName) {
        return className || otherClassName;
    }
    return "".concat(className, " ").concat(otherClassName);
}
