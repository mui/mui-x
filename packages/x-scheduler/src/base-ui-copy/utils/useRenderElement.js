"use strict";
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
exports.useRenderElement = useRenderElement;
var React = require("react");
var mergeObjects_1 = require("@base-ui-components/utils/mergeObjects");
var reactVersion_1 = require("@base-ui-components/utils/reactVersion");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var merge_props_1 = require("@base-ui-components/react/merge-props");
var getStyleHookProps_1 = require("./getStyleHookProps");
var resolveClassName_1 = require("./resolveClassName");
var EMPTY_OBJECT = {};
/**
 * Renders a Base UI element.
 *
 * @param element The default HTML element to render. Can be overridden by the `render` prop.
 * @param componentProps An object containing the `render` and `className` props to be used for element customization. Other props are ignored.
 * @param params Additional parameters for rendering the element.
 */
function useRenderElement(element, componentProps, params) {
    var _a;
    if (params === void 0) { params = {}; }
    var renderProp = componentProps.render;
    var outProps = useRenderElementProps(componentProps, params);
    if (params.enabled === false) {
        return null;
    }
    var state = (_a = params.state) !== null && _a !== void 0 ? _a : EMPTY_OBJECT;
    return evaluateRenderProp(element, renderProp, outProps, state);
}
/**
 * Computes render element final props.
 */
function useRenderElementProps(componentProps, params) {
    var _a;
    if (params === void 0) { params = {}; }
    var classNameProp = componentProps.className, renderProp = componentProps.render;
    var _b = params.state, state = _b === void 0 ? EMPTY_OBJECT : _b, ref = params.ref, props = params.props, disableStyleHooks = params.disableStyleHooks, customStyleHookMapping = params.customStyleHookMapping, _c = params.enabled, enabled = _c === void 0 ? true : _c;
    var className = enabled ? (0, resolveClassName_1.resolveClassName)(classNameProp, state) : undefined;
    var styleHooks;
    if (disableStyleHooks !== true) {
        // SAFETY: We use typings to ensure `disableStyleHooks` is either always set or
        // always unset, so this `if` block is stable across renders.
        /* eslint-disable-next-line react-hooks/rules-of-hooks */
        styleHooks = React.useMemo(function () { return (enabled ? (0, getStyleHookProps_1.getStyleHookProps)(state, customStyleHookMapping) : EMPTY_OBJECT); }, [state, customStyleHookMapping, enabled]);
    }
    var outProps = enabled
        ? ((_a = (0, mergeObjects_1.mergeObjects)(styleHooks, Array.isArray(props) ? (0, merge_props_1.mergePropsN)(props) : props)) !== null && _a !== void 0 ? _a : EMPTY_OBJECT)
        : EMPTY_OBJECT;
    // SAFETY: The `useForkRef` functions use a single hook to store the same value,
    // switching between them at runtime is safe. If this assertion fails, React will
    // throw at runtime anyway.
    // This also skips the `useForkRef` call on the server, which is fine because
    // refs are not used on the server side.
    /* eslint-disable react-hooks/rules-of-hooks */
    if (typeof document !== 'undefined') {
        if (!enabled) {
            (0, useMergedRefs_1.useMergedRefs)(null, null);
        }
        else if (Array.isArray(ref)) {
            outProps.ref = (0, useMergedRefs_1.useMergedRefsN)(__spreadArray([outProps.ref, getChildRef(renderProp)], ref, true));
        }
        else {
            outProps.ref = (0, useMergedRefs_1.useMergedRefs)(outProps.ref, getChildRef(renderProp), ref);
        }
    }
    if (!enabled) {
        return EMPTY_OBJECT;
    }
    if (className !== undefined) {
        outProps.className = (0, merge_props_1.mergeClassNames)(outProps.className, className);
    }
    return outProps;
}
function evaluateRenderProp(element, render, props, state) {
    if (render) {
        if (typeof render === 'function') {
            return render(props, state);
        }
        var mergedProps = (0, merge_props_1.mergeProps)(props, render.props);
        mergedProps.ref = props.ref;
        return React.cloneElement(render, mergedProps);
    }
    if (element) {
        if (typeof element === 'string') {
            return renderTag(element, props);
        }
    }
    // Unreachable, but the typings on `useRenderElement` need to be reworked
    // to annotate it correctly.
    throw new Error('Base UI: Render element or function are not defined.');
}
function renderTag(Tag, props) {
    if (Tag === 'button') {
        return <button type="button" {...props}/>;
    }
    if (Tag === 'img') {
        return <img alt="" {...props}/>;
    }
    return React.createElement(Tag, props);
}
function getChildRef(render) {
    if (render && typeof render !== 'function') {
        return (0, reactVersion_1.isReactVersionAtLeast)(19) ? render.props.ref : render.ref;
    }
    return null;
}
