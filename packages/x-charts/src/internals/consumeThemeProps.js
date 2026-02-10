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
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeThemeProps = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var resolveProps_1 = require("@mui/utils/resolveProps");
var React = require("react");
/**
 * A higher order component that consumes and merges the theme `defaultProps` and handles the `classes` and renders the component.
 *
 * This HOC will wrap a single component.
 * If you need to render multiple components, you can manually consume the theme and render them in your component instead of using this HOC.
 *
 * In the example below, `MyComponent` will render the `DefaultComponent` with the `direction` prop set to `'row'` and the className set to `'my-custom-root'`.
 *
 * @example
 * ```tsx
 * createTheme({
 *   components: {
 *     MuiMyComponent: {
 *       defaultProps: {
 *         direction: 'row',
 *       },
 *     },
 *   },
 * })
 *
 * type MyComponentProps = {
 *   direction: 'row' | 'column';
 *   classes?: Record<'root', string>;
 * };
 *
 * const MyComponent = consumeThemeProps(
 *   'MuiMyComponent',
 *   function DefaultComponent(props: MyComponentProps) {
 *     return (
 *       <div className={props.classes.root}>
 *         {props.direction}
 *       </div>
 *     );
 *   }
 * );
 *
 * render(<MyComponent classes={{ root: 'my-custom-root' }} />);
 * ```
 *
 * @param {string} name The mui component name.
 * @param {object} options Options for the HOC.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
var consumeThemeProps = function (name, options, InComponent) {
    return React.forwardRef(function ConsumeThemeInternal(props, ref) {
        var _a, _b;
        var themedProps = (0, styles_1.useThemeProps)({
            props: props,
            // eslint-disable-next-line mui/material-ui-name-matches-component-name
            name: name,
        });
        var defaultProps = typeof options.defaultProps === 'function'
            ? options.defaultProps(themedProps)
            : ((_a = options.defaultProps) !== null && _a !== void 0 ? _a : {});
        var outProps = (0, resolveProps_1.default)(defaultProps, themedProps);
        var theme = (0, styles_1.useTheme)();
        var classes = (_b = options.classesResolver) === null || _b === void 0 ? void 0 : _b.call(options, outProps, theme);
        var OutComponent = React.forwardRef(InComponent);
        if (process.env.NODE_ENV !== 'production') {
            OutComponent.displayName = "consumeThemeProps(".concat(name, ")");
        }
        return (0, jsx_runtime_1.jsx)(OutComponent, __assign({}, outProps, { classes: classes, ref: ref }));
    });
};
exports.consumeThemeProps = consumeThemeProps;
