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
exports.ChartsTooltipContainer = ChartsTooltipContainer;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var ReactDOM = require("react-dom");
var prop_types_1 = require("prop-types");
var HTMLElementType_1 = require("@mui/utils/HTMLElementType");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var styles_1 = require("@mui/material/styles");
var Popper_1 = require("@mui/material/Popper");
var NoSsr_1 = require("@mui/material/NoSsr");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var utils_1 = require("./utils");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
var useStore_1 = require("../internals/store/useStore");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useChartTooltip_1 = require("../internals/plugins/featurePlugins/useChartTooltip");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartPolarInteraction_selectors_1 = require("../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors");
var useAxisSystem_1 = require("../hooks/useAxisSystem");
var hooks_1 = require("../hooks");
var useChartBrush_1 = require("../internals/plugins/featurePlugins/useChartBrush");
var selectorReturnFalse = function () { return false; };
var selectorReturnNull = function () { return null; };
function getIsOpenSelector(trigger, axisSystem, shouldPreventBecauseOfBrush) {
    if (shouldPreventBecauseOfBrush) {
        return selectorReturnFalse;
    }
    if (trigger === 'item') {
        return useChartTooltip_1.selectorChartsTooltipItemIsDefined;
    }
    if (axisSystem === 'polar') {
        return useChartPolarInteraction_selectors_1.selectorChartsInteractionPolarAxisTooltip;
    }
    if (axisSystem === 'cartesian') {
        return useChartCartesianAxis_1.selectorChartsInteractionAxisTooltip;
    }
    return selectorReturnFalse;
}
var ChartsTooltipRoot = (0, styles_1.styled)(Popper_1.default, {
    name: 'MuiChartsTooltip',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        pointerEvents: 'none',
        zIndex: theme.zIndex.modal,
    });
});
/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltipContainer(inProps) {
    var _a, _b;
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiChartsTooltipContainer',
    });
    var _c = props.trigger, trigger = _c === void 0 ? 'axis' : _c, position = props.position, _d = props.anchor, anchor = _d === void 0 ? 'pointer' : _d, propClasses = props.classes, children = props.children, other = __rest(props, ["trigger", "position", "anchor", "classes", "children"]);
    var store = (0, useStore_1.useStore)();
    var svgRef = (0, hooks_1.useSvgRef)();
    var anchorRef = React.useRef(null);
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    var pointerType = store.use(useChartInteraction_1.selectorChartsPointerType);
    var isFineMainPointer = (0, utils_1.useIsFineMainPointer)();
    var popperRef = React.useRef(null);
    var positionRef = (0, useLazyRef_1.default)(function () { return ({ x: 0, y: 0 }); });
    var axisSystem = (0, useAxisSystem_1.useAxisSystem)();
    var shouldPreventBecauseOfBrush = store.use(useChartBrush_1.selectorBrushShouldPreventTooltip);
    var isOpen = store.use(getIsOpenSelector(trigger, axisSystem, shouldPreventBecauseOfBrush));
    var lastInteraction = store.use(useChartInteraction_1.selectorChartsLastInteraction);
    var computedAnchor = lastInteraction === 'keyboard' || pointerType === null ? 'node' : anchor;
    var itemPosition = store.use(trigger === 'item' && computedAnchor === 'node'
        ? useChartTooltip_1.selectorChartsTooltipItemPosition
        : selectorReturnNull, position);
    var isTooltipNodeAnchored = itemPosition !== null;
    React.useEffect(function () {
        var svgElement = svgRef.current;
        if (svgElement === null) {
            return function () { };
        }
        if (isTooltipNodeAnchored) {
            // Tooltip position is already handled by the anchor element
            return undefined;
        }
        var pointerUpdate = (0, rafThrottle_1.rafThrottle)(function (x, y) {
            var _a;
            // eslint-disable-next-line react-compiler/react-compiler
            positionRef.current = { x: x, y: y };
            (_a = popperRef.current) === null || _a === void 0 ? void 0 : _a.update();
        });
        var handlePointerEvent = function (event) {
            pointerUpdate(event.clientX, event.clientY);
        };
        svgElement.addEventListener('pointermove', handlePointerEvent);
        svgElement.addEventListener('pointerenter', handlePointerEvent);
        return function () {
            svgElement.removeEventListener('pointermove', handlePointerEvent);
            svgElement.removeEventListener('pointerenter', handlePointerEvent);
            pointerUpdate.clear();
        };
    }, [svgRef, positionRef, isTooltipNodeAnchored]);
    var pointerAnchorEl = React.useMemo(function () { return ({
        getBoundingClientRect: function () { return ({
            x: positionRef.current.x,
            y: positionRef.current.y,
            top: positionRef.current.y,
            left: positionRef.current.x,
            right: positionRef.current.x,
            bottom: positionRef.current.y,
            width: 0,
            height: 0,
            toJSON: function () { return ''; },
        }); },
    }); }, [positionRef]);
    var isMouse = pointerType === 'mouse' || isFineMainPointer;
    var isTouch = pointerType === 'touch' || !isFineMainPointer;
    var modifiers = React.useMemo(function () { return __spreadArray(__spreadArray([
        {
            name: 'offset',
            options: {
                offset: function () {
                    if (isTouch && !isTooltipNodeAnchored) {
                        return [0, 64];
                    }
                    // The popper offset: [skidding, distance]
                    return [0, 8];
                },
            },
        }
    ], (!isMouse
        ? [
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['top-end', 'top-start', 'bottom-end', 'bottom'],
                },
            },
        ]
        : []), true), [
        { name: 'preventOverflow', options: { altAxis: true } },
    ], false); }, [isMouse, isTooltipNodeAnchored, isTouch]);
    if (trigger === 'none') {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [svgRef.current &&
                ReactDOM.createPortal((0, jsx_runtime_1.jsx)("rect", __assign({ ref: anchorRef }, itemPosition, { display: "hidden", 
                    // On ios a rect with no width/height is not detectable by the popper.js
                    pointerEvents: "none", opacity: 0, width: 1, height: 1 })), svgRef.current), (0, jsx_runtime_1.jsx)(NoSsr_1.default, { children: isOpen && ((0, jsx_runtime_1.jsx)(ChartsTooltipRoot, __assign({}, other, { className: classes === null || classes === void 0 ? void 0 : classes.root, open: isOpen, placement: (_b = (_a = other.placement) !== null && _a !== void 0 ? _a : position) !== null && _b !== void 0 ? _b : (!isTooltipNodeAnchored && isMouse ? 'right-start' : 'top'), popperRef: popperRef, anchorEl: itemPosition ? anchorRef.current : pointerAnchorEl, modifiers: modifiers, children: children }))) })] }));
}
ChartsTooltipContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Determine if the tooltip should be placed on the pointer location or on the node.
     * @default 'pointer'
     */
    anchor: prop_types_1.default.oneOf(['node', 'pointer']),
    /**
     * An HTML element, [virtualElement](https://popper.js.org/docs/v2/virtual-elements/),
     * or a function that returns either.
     * It's used to set the position of the popper.
     * The return value will passed as the reference object of the Popper instance.
     */
    anchorEl: prop_types_1.default /* @typescript-to-proptypes-ignore */.oneOfType([
        HTMLElementType_1.default,
        prop_types_1.default.object,
        prop_types_1.default.func,
    ]),
    /**
     * Popper render function or node.
     */
    children: prop_types_1.default.node,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The component used for the root node.
     * Either a string to use a HTML element or a component.
     */
    component: prop_types_1.default.elementType,
    /**
     * The components used for each slot inside the Popper.
     * Either a string to use a HTML element or a component.
     *
     * @deprecated use the `slots` prop instead. This prop will be removed in a future major release. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/).
     * @default {}
     */
    components: prop_types_1.default.shape({
        Root: prop_types_1.default.elementType,
    }),
    /**
     * The props used for each slot inside the Popper.
     *
     * @deprecated use the `slotProps` prop instead. This prop will be removed in a future major release. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/).
     * @default {}
     */
    componentsProps: prop_types_1.default.shape({
        root: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object]),
    }),
    /**
     * An HTML element or function that returns one.
     * The `container` will have the portal children appended to it.
     *
     * You can also provide a callback, which is called in a React layout effect.
     * This lets you set the container from a ref, and also makes server-side rendering possible.
     *
     * By default, it uses the body of the top-level document object,
     * so it's simply `document.body` most of the time.
     */
    container: prop_types_1.default.oneOfType([
        function (props, propName) {
            if (props[propName] == null) {
                return new Error("Prop '".concat(propName, "' is required but wasn't specified"));
            }
            if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
                return new Error("Expected prop '".concat(propName, "' to be of type Element"));
            }
            return null;
        },
        prop_types_1.default.func,
    ]),
    /**
     * The `children` will be under the DOM hierarchy of the parent component.
     * @default false
     */
    disablePortal: prop_types_1.default.bool,
    /**
     * Always keep the children in the DOM.
     * This prop can be useful in SEO situation or
     * when you want to maximize the responsiveness of the Popper.
     * @default false
     */
    keepMounted: prop_types_1.default.bool,
    /**
     * Popper.js is based on a "plugin-like" architecture,
     * most of its features are fully encapsulated "modifiers".
     *
     * A modifier is a function that is called each time Popper.js needs to
     * compute the position of the popper.
     * For this reason, modifiers should be very performant to avoid bottlenecks.
     * To learn how to create a modifier, [read the modifiers documentation](https://popper.js.org/docs/v2/modifiers/).
     */
    modifiers: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        data: prop_types_1.default.object,
        effect: prop_types_1.default.func,
        enabled: prop_types_1.default.bool,
        fn: prop_types_1.default.func,
        name: prop_types_1.default.any,
        options: prop_types_1.default.object,
        phase: prop_types_1.default.oneOf([
            'afterMain',
            'afterRead',
            'afterWrite',
            'beforeMain',
            'beforeRead',
            'beforeWrite',
            'main',
            'read',
            'write',
        ]),
        requires: prop_types_1.default.arrayOf(prop_types_1.default.string),
        requiresIfExists: prop_types_1.default.arrayOf(prop_types_1.default.string),
    })),
    /**
     * If `true`, the component is shown.
     */
    open: prop_types_1.default.bool,
    /**
     * Popper placement.
     * @default 'bottom'
     */
    placement: prop_types_1.default.oneOf([
        'auto-end',
        'auto-start',
        'auto',
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
    ]),
    /**
     * Options provided to the [`Popper.js`](https://popper.js.org/docs/v2/constructors/#options) instance.
     * @default {}
     */
    popperOptions: prop_types_1.default.shape({
        modifiers: prop_types_1.default.array,
        onFirstUpdate: prop_types_1.default.func,
        placement: prop_types_1.default.oneOf([
            'auto-end',
            'auto-start',
            'auto',
            'bottom-end',
            'bottom-start',
            'bottom',
            'left-end',
            'left-start',
            'left',
            'right-end',
            'right-start',
            'right',
            'top-end',
            'top-start',
            'top',
        ]),
        strategy: prop_types_1.default.oneOf(['absolute', 'fixed']),
    }),
    /**
     * A ref that points to the used popper instance.
     */
    popperRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                destroy: prop_types_1.default.func.isRequired,
                forceUpdate: prop_types_1.default.func.isRequired,
                setOptions: prop_types_1.default.func.isRequired,
                state: prop_types_1.default.shape({
                    attributes: prop_types_1.default.object.isRequired,
                    elements: prop_types_1.default.object.isRequired,
                    modifiersData: prop_types_1.default.object.isRequired,
                    options: prop_types_1.default.object.isRequired,
                    orderedModifiers: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
                    placement: prop_types_1.default.oneOf([
                        'auto-end',
                        'auto-start',
                        'auto',
                        'bottom-end',
                        'bottom-start',
                        'bottom',
                        'left-end',
                        'left-start',
                        'left',
                        'right-end',
                        'right-start',
                        'right',
                        'top-end',
                        'top-start',
                        'top',
                    ]).isRequired,
                    rects: prop_types_1.default.object.isRequired,
                    reset: prop_types_1.default.bool.isRequired,
                    scrollParents: prop_types_1.default.object.isRequired,
                    strategy: prop_types_1.default.oneOf(['absolute', 'fixed']).isRequired,
                    styles: prop_types_1.default.object.isRequired,
                }).isRequired,
                update: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * Determines the tooltip position relatively to the anchor.
     */
    position: prop_types_1.default.oneOf(['bottom', 'left', 'right', 'top']),
    /**
     * The props used for each slot inside the Popper.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * The components used for each slot inside the Popper.
     * Either a string to use a HTML element or a component.
     * @default {}
     */
    slots: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * Help supporting a react-transition-group/Transition component.
     * @default false
     */
    transition: prop_types_1.default.bool,
    /**
     * Select the kind of tooltip to display
     * - 'item': Shows data about the item below the mouse;
     * - 'axis': Shows values associated with the hovered x value;
     * - 'none': Does not display tooltip.
     * @default 'axis'
     */
    trigger: prop_types_1.default.oneOf(['axis', 'item', 'none']),
};
