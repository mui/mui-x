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
exports.consumeSlots = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var resolveProps_1 = require("@mui/utils/resolveProps");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var React = require("react");
/**
 * A higher order component that consumes a slot from the props and renders the component provided in the slot.
 *
 * This HOC will wrap a single component, and will render the component provided in the slot, if it exists.
 *
 * If you need to render multiple components, you can manually consume the slots from the props and render them in your component instead of using this HOC.
 *
 * In the example below, `MyComponent` will render the component provided in `mySlot` slot, if it exists. Otherwise, it will render the `DefaultComponent`.
 *
 * @example
 *
 * ```tsx
 * type MyComponentProps = {
 *   direction: 'row' | 'column';
 *   slots?: {
 *     mySlot?: React.JSXElementConstructor<{ direction: 'row' | 'column' }>;
 *   }
 * };
 *
 * const MyComponent = consumeSlots(
 *   'MuiMyComponent',
 *   'mySlot',
 *   function DefaultComponent(props: MyComponentProps) {
 *     return (
 *       <div className={props.classes.root}>
 *         {props.direction}
 *       </div>
 *     );
 *   }
 * );
 * ```
 *
 * @param {string} name The mui component name.
 * @param {string} slotPropName The name of the prop to retrieve the slot from.
 * @param {object} options Options for the HOC.
 * @param {boolean} options.propagateSlots Whether to propagate the slots to the component, this is always false if the slot is provided.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Array<keyof Props>} options.omitProps An array of props to omit from the component.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
var consumeSlots = function (name, slotPropName, options, InComponent) {
    function ConsumeSlotsInternal(props, ref) {
        var _a, _b, _c, _d;
        var themedProps = (0, styles_1.useThemeProps)({
            props: props,
            // eslint-disable-next-line mui/material-ui-name-matches-component-name
            name: name,
        });
        var defaultProps = typeof options.defaultProps === 'function'
            ? options.defaultProps(themedProps)
            : ((_a = options.defaultProps) !== null && _a !== void 0 ? _a : {});
        var defaultizedProps = (0, resolveProps_1.default)(defaultProps, themedProps);
        var _e = defaultizedProps, slots = _e.slots, slotProps = _e.slotProps, other = __rest(_e, ["slots", "slotProps"]);
        var theme = (0, styles_1.useTheme)();
        var classes = (_b = options.classesResolver) === null || _b === void 0 ? void 0 : _b.call(options, defaultizedProps, theme);
        // Can be a function component or a forward ref component.
        var Component = (_c = slots === null || slots === void 0 ? void 0 : slots[slotPropName]) !== null && _c !== void 0 ? _c : InComponent;
        var propagateSlots = options.propagateSlots && !(slots === null || slots === void 0 ? void 0 : slots[slotPropName]);
        var _f = (0, useSlotProps_1.default)({
            elementType: Component,
            externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps[slotPropName],
            additionalProps: __assign(__assign(__assign({}, other), { classes: classes }), (propagateSlots && { slots: slots, slotProps: slotProps })),
            ownerState: {},
        }), ownerState = _f.ownerState, originalOutProps = __rest(_f, ["ownerState"]);
        var outProps = __assign({}, originalOutProps);
        for (var _i = 0, _g = (_d = options.omitProps) !== null && _d !== void 0 ? _d : []; _i < _g.length; _i++) {
            var prop = _g[_i];
            delete outProps[prop];
        }
        if (process.env.NODE_ENV !== 'production') {
            Component.displayName = "".concat(name, ".slots.").concat(slotPropName);
        }
        return (0, jsx_runtime_1.jsx)(Component, __assign({}, outProps, { ref: ref }));
    }
    return React.forwardRef(ConsumeSlotsInternal);
};
exports.consumeSlots = consumeSlots;
