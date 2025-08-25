"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsTooltip = ChartsTooltip;
var React = require("react");
var prop_types_1 = require("prop-types");
var HTMLElementType_1 = require("@mui/utils/HTMLElementType");
var ChartsItemTooltipContent_1 = require("./ChartsItemTooltipContent");
var ChartsAxisTooltipContent_1 = require("./ChartsAxisTooltipContent");
var ChartsTooltipContainer_1 = require("./ChartsTooltipContainer");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltip(props) {
    var propClasses = props.classes, _a = props.trigger, trigger = _a === void 0 ? 'axis' : _a;
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    return (<ChartsTooltipContainer_1.ChartsTooltipContainer {...props} classes={propClasses}>
      {trigger === 'axis' ? (<ChartsAxisTooltipContent_1.ChartsAxisTooltipContent classes={classes}/>) : (<ChartsItemTooltipContent_1.ChartsItemTooltipContent classes={classes}/>)}
    </ChartsTooltipContainer_1.ChartsTooltipContainer>);
}
ChartsTooltip.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
