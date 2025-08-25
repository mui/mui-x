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
exports.DateRangePickerDay2 = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var ButtonBase_1 = require("@mui/material/ButtonBase");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var dateRangePickerDay2Classes_1 = require("./dateRangePickerDay2Classes");
var useUtilityClasses = function (ownerState, classes) {
    var isDaySelected = ownerState.isDaySelected, disableHighlightToday = ownerState.disableHighlightToday, isDayCurrent = ownerState.isDayCurrent, isDayDisabled = ownerState.isDayDisabled, isDayOutsideMonth = ownerState.isDayOutsideMonth, isDayFillerCell = ownerState.isDayFillerCell, isDayPreviewStart = ownerState.isDayPreviewStart, isDayPreviewEnd = ownerState.isDayPreviewEnd, isDayInsidePreview = ownerState.isDayInsidePreview, isDayPreviewed = ownerState.isDayPreviewed, isDaySelectionStart = ownerState.isDaySelectionStart, isDaySelectionEnd = ownerState.isDaySelectionEnd, isDayInsideSelection = ownerState.isDayInsideSelection, isDayStartOfWeek = ownerState.isDayStartOfWeek, isDayEndOfWeek = ownerState.isDayEndOfWeek, isDayStartOfMonth = ownerState.isDayStartOfMonth, isDayEndOfMonth = ownerState.isDayEndOfMonth, isDayDraggable = ownerState.isDayDraggable;
    var slots = {
        root: [
            'root',
            isDayDisabled && 'disabled',
            !disableHighlightToday && isDayCurrent && !isDaySelected && !isDayFillerCell && 'today',
            isDayOutsideMonth && 'dayOutsideMonth',
            isDayFillerCell && 'fillerCell',
            isDaySelected && 'selected',
            isDayPreviewStart && 'previewStart',
            isDayPreviewEnd && 'previewEnd',
            isDayInsidePreview && 'insidePreviewing',
            isDaySelectionStart && 'selectionStart',
            isDaySelectionEnd && 'selectionEnd',
            isDayInsideSelection && 'insideSelection',
            isDayEndOfWeek && 'endOfWeek',
            isDayStartOfWeek && 'startOfWeek',
            isDayPreviewed && 'previewed',
            isDayStartOfMonth && 'startOfMonth',
            isDayEndOfMonth && 'endOfMonth',
            isDayDraggable && 'draggable',
        ],
    };
    return (0, composeClasses_1.default)(slots, dateRangePickerDay2Classes_1.getDateRangePickerDay2UtilityClass, classes);
};
var highlightStyles = function (theme) { return ({
    content: '""' /* Creates an empty element */,
    height: '100%',
    backgroundColor: theme.vars
        ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.focusOpacity, ")")
        : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.focusOpacity),
    boxSizing: 'border-box',
    left: 'calc(var(--PickerDay-horizontalMargin) * (-1))',
    right: 'calc(var(--PickerDay-horizontalMargin) * (-1))',
}); };
var previewStyles = function (theme) { return ({
    content: '""' /* Creates an empty element */,
    height: '100%',
    border: "1.2px dashed ".concat((theme.vars || theme).palette.divider),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    boxSizing: 'border-box',
    borderOffset: '-1px',
    left: 'calc(-1 * var(--PickerDay-horizontalMargin))',
    right: 'calc(-1 * var(--PickerDay-horizontalMargin))',
}); };
var selectedDayStyles = function (theme) {
    var _a;
    return (_a = {
            color: (theme.vars || theme).palette.primary.contrastText,
            backgroundColor: (theme.vars || theme).palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
            '&:focus, &:hover': {
                willChange: 'background-color',
                backgroundColor: (theme.vars || theme).palette.primary.dark,
            }
        },
        _a["&.".concat(dateRangePickerDay2Classes_1.dateRangePickerDay2Classes.disabled)] = {
            opacity: 0.6,
        },
        _a);
};
var DateRangePickerDay2Root = (0, styles_1.styled)(ButtonBase_1.default, {
    name: 'MuiDateRangePickerDay2',
    slot: 'Root',
    overridesResolver: function (props, styles) {
        var ownerState = props.ownerState;
        return [
            styles.root,
            !ownerState.disableHighlightToday && ownerState.isDayCurrent && styles.today,
            !ownerState.isDayOutsideMonth && styles.dayOutsideMonth,
            ownerState.isDayFillerCell && styles.fillerCell,
            ownerState.isDaySelected && !ownerState.isDayInsideSelection && styles.selected,
            ownerState.isDayPreviewStart && styles.previewStart,
            ownerState.isDayPreviewEnd && styles.previewEnd,
            ownerState.isDayInsidePreview && styles.insidePreviewing,
            ownerState.isDaySelectionStart && styles.selectionStart,
            ownerState.isDaySelectionEnd && styles.selectionEnd,
            ownerState.isDayInsideSelection && styles.insideSelection,
            ownerState.isDayDraggable && styles.draggable,
            ownerState.isDayStartOfWeek && styles.startOfWeek,
            ownerState.isDayEndOfWeek && styles.endOfWeek,
        ];
    },
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({ '--PickerDay-horizontalMargin': '2px', '--PickerDay-size': '36px' }, theme.typography.caption), { width: 'var(--PickerDay-size)', height: 'var(--PickerDay-size)', borderRadius: '18px', padding: 0, position: 'relative', marginLeft: 'var(--PickerDay-horizontalMargin)', marginRight: 'var(--PickerDay-horizontalMargin)', 
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
        }, zIndex: 1, isolation: 'isolate', '&::before, &::after': {
            zIndex: -1,
            position: 'absolute',
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
        }, variants: [
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
            {
                props: { isDayDraggable: true },
                style: {
                    cursor: 'grab',
                    touchAction: 'none',
                },
            },
            {
                props: { isDayPreviewStart: true },
                style: {
                    '::after': __assign(__assign({}, previewStyles(theme)), { borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit', borderLeftColor: (theme.vars || theme).palette.divider, left: 0 }),
                },
            },
            {
                props: { isDayPreviewEnd: true },
                style: {
                    '::after': __assign(__assign({}, previewStyles(theme)), { borderTopRightRadius: 'inherit', borderBottomRightRadius: 'inherit', borderRightColor: (theme.vars || theme).palette.divider, right: 0 }),
                },
            },
            {
                props: { isDayInsidePreview: true },
                style: {
                    '::after': __assign({}, previewStyles(theme)),
                },
            },
            {
                props: { isDaySelectionStart: true },
                style: {
                    '::before': __assign(__assign({}, highlightStyles(theme)), { borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit', left: 0 }),
                },
            },
            {
                props: { isDaySelectionEnd: true },
                style: {
                    '::before': __assign(__assign({}, highlightStyles(theme)), { borderTopRightRadius: 'inherit', borderBottomRightRadius: 'inherit', right: 0 }),
                    '::after': {
                        borderLeftColor: 'transparent',
                    },
                },
            },
            {
                props: { isDayInsideSelection: true },
                color: 'initial',
                background: 'initial',
                style: {
                    '::before': __assign({}, highlightStyles(theme)),
                },
            },
            {
                props: { isDaySelected: true, isDayInsideSelection: false },
                style: __assign({}, selectedDayStyles(theme)),
            },
            {
                props: { isDaySelectionStart: true, isDaySelectionEnd: true },
                style: {
                    '::before': {
                        left: 0,
                        right: 0,
                    },
                },
            },
            {
                props: {
                    isDaySelectionStart: true,
                    isDaySelectionEnd: true,
                    isDayPreviewEnd: false,
                    isDayPreviewStart: false,
                },
                style: {
                    '::after': {
                        left: 0,
                        right: 0,
                    },
                },
            },
            {
                props: {
                    isDayPreviewEnd: true,
                    isDayPreviewStart: true,
                },
                style: {
                    '::after': {
                        left: 0,
                        right: 0,
                    },
                },
            },
            {
                props: { isDayEndOfWeek: true },
                style: {
                    '::after': {
                        borderTopRightRadius: 'inherit',
                        borderBottomRightRadius: 'inherit',
                        borderRightColor: (theme.vars || theme).palette.divider,
                        right: 0,
                    },
                    '::before': {
                        borderTopRightRadius: 'inherit',
                        borderBottomRightRadius: 'inherit',
                        right: 0,
                    },
                },
            },
            {
                props: {
                    isDayStartOfWeek: true,
                },
                style: {
                    '::after': {
                        borderTopLeftRadius: 'inherit',
                        borderBottomLeftRadius: 'inherit',
                        borderLeftColor: (theme.vars || theme).palette.divider,
                        left: 0,
                    },
                    '::before': {
                        borderTopLeftRadius: 'inherit',
                        borderBottomLeftRadius: 'inherit',
                        left: 0,
                    },
                },
            },
        ] }));
});
var noop = function () { };
var DateRangePickerDay2Raw = React.forwardRef(function DateRangePickerDay2(inProps, forwardedRef) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiDateRangePickerDay2',
    });
    var adapter = (0, hooks_1.usePickerAdapter)();
    var _a = props.autoFocus, autoFocus = _a === void 0 ? false : _a, className = props.className, classesProp = props.classes, hidden = props.hidden, isAnimating = props.isAnimating, onClick = props.onClick, onDaySelect = props.onDaySelect, _b = props.onFocus, onFocus = _b === void 0 ? noop : _b, _c = props.onBlur, onBlur = _c === void 0 ? noop : _c, _d = props.onKeyDown, onKeyDown = _d === void 0 ? noop : _d, _e = props.onMouseDown, onMouseDown = _e === void 0 ? noop : _e, _f = props.onMouseEnter, onMouseEnter = _f === void 0 ? noop : _f, children = props.children, isFirstVisibleCell = props.isFirstVisibleCell, isLastVisibleCell = props.isLastVisibleCell, day = props.day, selected = props.selected, disabled = props.disabled, today = props.today, outsideCurrentMonth = props.outsideCurrentMonth, disableHighlightToday = props.disableHighlightToday, showDaysOutsideCurrentMonth = props.showDaysOutsideCurrentMonth, isEndOfHighlighting = props.isEndOfHighlighting, isEndOfPreviewing = props.isEndOfPreviewing, isHighlighting = props.isHighlighting, isPreviewing = props.isPreviewing, isStartOfHighlighting = props.isStartOfHighlighting, isStartOfPreviewing = props.isStartOfPreviewing, isVisuallySelected = props.isVisuallySelected, draggable = props.draggable, other = __rest(props, ["autoFocus", "className", "classes", "hidden", "isAnimating", "onClick", "onDaySelect", "onFocus", "onBlur", "onKeyDown", "onMouseDown", "onMouseEnter", "children", "isFirstVisibleCell", "isLastVisibleCell", "day", "selected", "disabled", "today", "outsideCurrentMonth", "disableHighlightToday", "showDaysOutsideCurrentMonth", "isEndOfHighlighting", "isEndOfPreviewing", "isHighlighting", "isPreviewing", "isStartOfHighlighting", "isStartOfPreviewing", "isVisuallySelected", "draggable"]);
    var pickersDayOwnerState = (0, internals_1.usePickerDayOwnerState)({
        day: day,
        selected: selected,
        disabled: disabled,
        today: today,
        outsideCurrentMonth: outsideCurrentMonth,
        disableMargin: false,
        disableHighlightToday: disableHighlightToday,
        showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth,
    });
    var ownerState = __assign(__assign({}, pickersDayOwnerState), { 
        // Properties that the Base UI implementation will have
        isDaySelectionStart: isStartOfHighlighting, isDaySelectionEnd: isEndOfHighlighting, isDayInsideSelection: isHighlighting && !isStartOfHighlighting && !isEndOfHighlighting, isDaySelected: isHighlighting || Boolean(selected), isDayPreviewed: isPreviewing, isDayPreviewStart: isStartOfPreviewing, isDayPreviewEnd: isEndOfPreviewing, isDayInsidePreview: isPreviewing && !isStartOfPreviewing && !isEndOfPreviewing, 
        // Properties specific to the MUI implementation (some might be removed in the next major)
        isDayStartOfMonth: adapter.isSameDay(day, adapter.startOfMonth(day)), isDayEndOfMonth: adapter.isSameDay(day, adapter.endOfMonth(day)), isDayFirstVisibleCell: isFirstVisibleCell, isDayLastVisibleCell: isLastVisibleCell, isDayFillerCell: outsideCurrentMonth && !showDaysOutsideCurrentMonth, isDayDraggable: Boolean(draggable) });
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
    return (<DateRangePickerDay2Root ref={handleRef} centerRipple 
    // compat with DateRangePickerDay for tests
    data-testid={ownerState.isDayFillerCell ? undefined : 'DateRangePickerDay'} disabled={ownerState.isDayFillerCell ? undefined : disabled} tabIndex={selected ? 0 : -1} onKeyDown={function (event) { return onKeyDown(event, day); }} onFocus={function (event) { return onFocus(event, day); }} onBlur={function (event) { return onBlur(event, day); }} onMouseEnter={function (event) { return onMouseEnter(event, day); }} onClick={handleClick} onMouseDown={handleMouseDown} draggable={draggable} {...other} ownerState={ownerState} className={(0, clsx_1.default)(classes.root, className)}>
      {/* `ownerState.isDayFillerCell` is used for compat with `PickersDay` for tests */}
      {children !== null && children !== void 0 ? children : (ownerState.isDayFillerCell ? null : adapter.format(day, 'dayOfMonth'))}
    </DateRangePickerDay2Root>);
});
DateRangePickerDay2Raw.propTypes = {
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
     * If `true`, the day can be dragged to change the current date range.
     * @default false
     */
    draggable: prop_types_1.default.bool,
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
     * Set to `true` if the `day` is the end of a highlighted date range.
     */
    isEndOfHighlighting: prop_types_1.default.bool.isRequired,
    /**
     * Set to `true` if the `day` is the end of a previewing date range.
     */
    isEndOfPreviewing: prop_types_1.default.bool.isRequired,
    /**
     * If `true`, day is the first visible cell of the month.
     * Either the first day of the month or the first day of the week depending on `showDaysOutsideCurrentMonth`.
     */
    isFirstVisibleCell: prop_types_1.default.bool.isRequired,
    /**
     * Set to `true` if the `day` is in a highlighted date range.
     */
    isHighlighting: prop_types_1.default.bool.isRequired,
    /**
     * If `true`, day is the last visible cell of the month.
     * Either the last day of the month or the last day of the week depending on `showDaysOutsideCurrentMonth`.
     */
    isLastVisibleCell: prop_types_1.default.bool.isRequired,
    /**
     * Set to `true` if the `day` is in a preview date range.
     */
    isPreviewing: prop_types_1.default.bool.isRequired,
    /**
     * Set to `true` if the `day` is the start of a highlighted date range.
     */
    isStartOfHighlighting: prop_types_1.default.bool.isRequired,
    /**
     * Set to `true` if the `day` is the start of a previewing date range.
     */
    isStartOfPreviewing: prop_types_1.default.bool.isRequired,
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
exports.DateRangePickerDay2 = React.memo(DateRangePickerDay2Raw);
