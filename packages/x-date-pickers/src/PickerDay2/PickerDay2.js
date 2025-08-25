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
exports.PickerDay2 = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var ButtonBase_1 = require("@mui/material/ButtonBase");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var dimensions_1 = require("../internals/constants/dimensions");
var pickerDay2Classes_1 = require("./pickerDay2Classes");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var usePickerDayOwnerState_1 = require("../PickersDay/usePickerDayOwnerState");
var useUtilityClasses = function (ownerState, classes) {
    var isDaySelected = ownerState.isDaySelected, disableHighlightToday = ownerState.disableHighlightToday, isDayCurrent = ownerState.isDayCurrent, isDayDisabled = ownerState.isDayDisabled, isDayOutsideMonth = ownerState.isDayOutsideMonth, isDayFillerCell = ownerState.isDayFillerCell;
    var slots = {
        root: [
            'root',
            isDaySelected && !isDayFillerCell && 'selected',
            isDayDisabled && 'disabled',
            !disableHighlightToday && isDayCurrent && !isDaySelected && !isDayFillerCell && 'today',
            isDayOutsideMonth && 'dayOutsideMonth',
            isDayFillerCell && 'fillerCell',
        ],
    };
    return (0, composeClasses_1.default)(slots, pickerDay2Classes_1.getPickerDay2UtilityClass, classes);
};
var PickerDay2Root = (0, styles_1.styled)(ButtonBase_1.default, {
    name: 'MuiPickerDay2',
    slot: 'Root',
    overridesResolver: function (props, styles) {
        var ownerState = props.ownerState;
        return [
            styles.root,
            !ownerState.disableHighlightToday && ownerState.isDayCurrent && styles.today,
            !ownerState.isDayOutsideMonth && styles.dayOutsideMonth,
            ownerState.isDayFillerCell && styles.fillerCell,
        ];
    },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (__assign(__assign({ '--PickerDay-horizontalMargin': "".concat(dimensions_1.DAY_MARGIN, "px"), '--PickerDay-size': "".concat(dimensions_1.DAY_SIZE, "px") }, theme.typography.caption), { width: 'var(--PickerDay-size)', height: 'var(--PickerDay-size)', borderRadius: 'calc(var(--PickerDay-size) / 2)', padding: 0, 
        // explicitly setting to `transparent` to avoid potentially getting impacted by change from the overridden component
        backgroundColor: 'transparent', transition: theme.transitions.create('background-color', {
            duration: theme.transitions.duration.short,
        }), color: (theme.vars || theme).palette.text.primary, '@media (pointer: fine)': {
            '&:hover': {
                backgroundColor: theme.vars
                    ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.hoverOpacity, ")")
                    : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.hoverOpacity),
            },
        }, '&:focus': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.focusOpacity, ")")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.focusOpacity),
        }, marginLeft: 'var(--PickerDay-horizontalMargin)', marginRight: 'var(--PickerDay-horizontalMargin)', variants: [
            {
                props: { isDaySelected: true },
                style: (_b = {
                        color: (theme.vars || theme).palette.primary.contrastText,
                        backgroundColor: (theme.vars || theme).palette.primary.main,
                        fontWeight: theme.typography.fontWeightMedium,
                        '&:focus, &:hover': {
                            willChange: 'background-color',
                            backgroundColor: (theme.vars || theme).palette.primary.dark,
                        }
                    },
                    _b["&.".concat(pickerDay2Classes_1.pickerDay2Classes.disabled)] = {
                        opacity: 0.6,
                    },
                    _b),
            },
            {
                props: { isDayDisabled: true },
                style: {
                    color: (theme.vars || theme).palette.text.disabled,
                },
            },
            {
                props: { isDayFillerCell: true },
                style: {
                    // visibility: 'hidden' does not work here as it hides the element from screen readers
                    // and results in unexpected relationships between week day and day columns.
                    opacity: 0,
                    pointerEvents: 'none',
                },
            },
            {
                props: { isDayOutsideMonth: true },
                style: {
                    color: (theme.vars || theme).palette.text.secondary,
                },
            },
            {
                props: {
                    isDayCurrent: true,
                    isDaySelected: false,
                },
                style: {
                    outline: "1px solid ".concat((theme.vars || theme).palette.text.secondary),
                    outlineOffset: -1,
                },
            },
        ] }));
});
var noop = function () { };
var PickerDay2Raw = React.forwardRef(function PickerDay2(inProps, forwardedRef) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickerDay2',
    });
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var _a = props.autoFocus, autoFocus = _a === void 0 ? false : _a, className = props.className, classesProp = props.classes, hidden = props.hidden, isAnimating = props.isAnimating, onClick = props.onClick, onDaySelect = props.onDaySelect, _b = props.onFocus, onFocus = _b === void 0 ? noop : _b, _c = props.onBlur, onBlur = _c === void 0 ? noop : _c, _d = props.onKeyDown, onKeyDown = _d === void 0 ? noop : _d, _e = props.onMouseDown, onMouseDown = _e === void 0 ? noop : _e, _f = props.onMouseEnter, onMouseEnter = _f === void 0 ? noop : _f, children = props.children, isFirstVisibleCell = props.isFirstVisibleCell, isLastVisibleCell = props.isLastVisibleCell, day = props.day, selected = props.selected, disabled = props.disabled, today = props.today, outsideCurrentMonth = props.outsideCurrentMonth, disableMargin = props.disableMargin, disableHighlightToday = props.disableHighlightToday, showDaysOutsideCurrentMonth = props.showDaysOutsideCurrentMonth, isVisuallySelected = props.isVisuallySelected, other = __rest(props, ["autoFocus", "className", "classes", "hidden", "isAnimating", "onClick", "onDaySelect", "onFocus", "onBlur", "onKeyDown", "onMouseDown", "onMouseEnter", "children", "isFirstVisibleCell", "isLastVisibleCell", "day", "selected", "disabled", "today", "outsideCurrentMonth", "disableMargin", "disableHighlightToday", "showDaysOutsideCurrentMonth", "isVisuallySelected"]);
    var pickersDayOwnerState = (0, usePickerDayOwnerState_1.usePickerDayOwnerState)({
        day: day,
        selected: selected,
        disabled: disabled,
        today: today,
        outsideCurrentMonth: outsideCurrentMonth,
        disableMargin: disableMargin,
        disableHighlightToday: disableHighlightToday,
        showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth,
    });
    var ownerState = __assign(__assign({}, pickersDayOwnerState), { 
        // Properties specific to the MUI implementation (some might be removed in the next major)
        isDayFillerCell: outsideCurrentMonth && !showDaysOutsideCurrentMonth });
    var classes = useUtilityClasses(ownerState, classesProp);
    var ref = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, forwardedRef);
    // Since this is rendered when a Popper is opened we can't use passive effects.
    // Focusing in passive effects in Popper causes scroll jump.
    (0, useEnhancedEffect_1.default)(function () {
        if (autoFocus && !disabled && !isAnimating && !outsideCurrentMonth) {
            // ref.current being null would be a bug in MUI
            ref.current.focus();
        }
    }, [autoFocus, disabled, isAnimating, outsideCurrentMonth]);
    // For a day outside the current month, move the focus from mouseDown to mouseUp
    // Goal: have the onClick ends before sliding to the new month
    var handleMouseDown = function (event) {
        onMouseDown(event);
        if (outsideCurrentMonth) {
            event.preventDefault();
        }
    };
    var handleClick = function (event) {
        event.defaultMuiPrevented = true;
        if (!disabled) {
            onDaySelect(day);
        }
        if (outsideCurrentMonth) {
            event.currentTarget.focus();
        }
        if (onClick) {
            onClick(event);
        }
    };
    return (<PickerDay2Root ref={handleRef} centerRipple 
    // compat with PickersDay for tests
    data-testid={ownerState.isDayFillerCell ? undefined : 'day'} disabled={disabled} tabIndex={selected ? 0 : -1} onKeyDown={function (event) { return onKeyDown(event, day); }} onFocus={function (event) { return onFocus(event, day); }} onBlur={function (event) { return onBlur(event, day); }} onMouseEnter={function (event) { return onMouseEnter(event, day); }} onClick={handleClick} onMouseDown={handleMouseDown} {...other} ownerState={ownerState} className={(0, clsx_1.default)(classes.root, className)}>
      {/* `ownerState.isDayFillerCell` is used for compat with `PickersDay` for tests */}
      {children !== null && children !== void 0 ? children : (ownerState.isDayFillerCell ? null : adapter.format(day, 'dayOfMonth'))}
    </PickerDay2Root>);
});
PickerDay2Raw.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * A ref for imperative actions.
     * It currently only supports `focusVisible()` action.
     */
    action: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                focusVisible: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * If `true`, the ripples are centered.
     * They won't start at the cursor interaction position.
     * @default false
     */
    centerRipple: prop_types_1.default.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    component: prop_types_1.default.elementType,
    /**
     * The date to show.
     */
    day: prop_types_1.default.object.isRequired,
    /**
     * If `true`, renders as disabled.
     * @default false
     */
    disabled: prop_types_1.default.bool,
    /**
     * If `true`, today's date is rendering without highlighting with circle.
     * @default false
     */
    disableHighlightToday: prop_types_1.default.bool,
    /**
     * If `true`, days are rendering without margin. Useful for displaying linked range of days.
     * @default false
     */
    disableMargin: prop_types_1.default.bool,
    /**
     * If `true`, the ripple effect is disabled.
     *
     * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
     * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
     * @default false
     */
    disableRipple: prop_types_1.default.bool,
    /**
     * If `true`, the touch ripple effect is disabled.
     * @default false
     */
    disableTouchRipple: prop_types_1.default.bool,
    /**
     * If `true`, the base button will have a keyboard focus ripple.
     * @default false
     */
    focusRipple: prop_types_1.default.bool,
    /**
     * This prop can help identify which element has keyboard focus.
     * The class name will be applied when the element gains the focus through keyboard interaction.
     * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
     * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
     * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
     * if needed.
     */
    focusVisibleClassName: prop_types_1.default.string,
    isAnimating: prop_types_1.default.bool,
    /**
     * If `true`, day is the first visible cell of the month.
     * Either the first day of the month or the first day of the week depending on `showDaysOutsideCurrentMonth`.
     */
    isFirstVisibleCell: prop_types_1.default.bool.isRequired,
    /**
     * If `true`, day is the last visible cell of the month.
     * Either the last day of the month or the last day of the week depending on `showDaysOutsideCurrentMonth`.
     */
    isLastVisibleCell: prop_types_1.default.bool.isRequired,
    /**
     * Indicates if the day should be visually selected.
     */
    isVisuallySelected: prop_types_1.default.bool,
    onBlur: prop_types_1.default.func,
    onDaySelect: prop_types_1.default.func.isRequired,
    onFocus: prop_types_1.default.func,
    /**
     * Callback fired when the component is focused with a keyboard.
     * We trigger a `onFocus` callback too.
     */
    onFocusVisible: prop_types_1.default.func,
    onKeyDown: prop_types_1.default.func,
    onMouseEnter: prop_types_1.default.func,
    /**
     * If `true`, day is outside of month and will be hidden.
     */
    outsideCurrentMonth: prop_types_1.default.bool.isRequired,
    /**
     * If `true`, renders as selected.
     * @default false
     */
    selected: prop_types_1.default.bool,
    /**
     * If `true`, days outside the current month are rendered:
     *
     * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
     *
     * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
     *
     * - ignored if `calendars` equals more than `1` on range pickers.
     * @default false
     */
    showDaysOutsideCurrentMonth: prop_types_1.default.bool,
    style: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * @default 0
     */
    tabIndex: prop_types_1.default.number,
    /**
     * If `true`, renders as today date.
     * @default false
     */
    today: prop_types_1.default.bool,
    /**
     * Props applied to the `TouchRipple` element.
     */
    TouchRippleProps: prop_types_1.default.object,
    /**
     * A ref that points to the `TouchRipple` element.
     */
    touchRippleRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                pulsate: prop_types_1.default.func.isRequired,
                start: prop_types_1.default.func.isRequired,
                stop: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
};
exports.PickerDay2 = React.memo(PickerDay2Raw);
