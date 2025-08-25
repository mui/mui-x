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
exports.DateRangePickerDay = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var x_license_1 = require("@mui/x-license");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-date-pickers/internals");
var PickersDay_1 = require("@mui/x-date-pickers/PickersDay");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var dateRangePickerDayClasses_1 = require("./dateRangePickerDayClasses");
var useUtilityClasses = function (classes, ownerState) {
    var 
    // Properties shared with PickersDay
    isDaySelected = ownerState.isDaySelected, isDayOutsideMonth = ownerState.isDayOutsideMonth, 
    // Range-specific properties (present in the Base UI implementation)
    isDaySelectionStart = ownerState.isDaySelectionStart, isDaySelectionEnd = ownerState.isDaySelectionEnd, isDayInsideSelection = ownerState.isDayInsideSelection, isDayPreviewStart = ownerState.isDayPreviewStart, isDayPreviewEnd = ownerState.isDayPreviewEnd, isDayPreviewed = ownerState.isDayPreviewed, 
    // Range-specific properties (specific to the MUI implementation)
    isDayStartOfMonth = ownerState.isDayStartOfMonth, isDayEndOfMonth = ownerState.isDayEndOfMonth, isDayFirstVisibleCell = ownerState.isDayFirstVisibleCell, isDayLastVisibleCell = ownerState.isDayLastVisibleCell, isDayFillerCell = ownerState.isDayFillerCell;
    var slots = {
        root: [
            'root',
            isDaySelected && 'rangeIntervalDayHighlight',
            isDaySelectionStart && 'rangeIntervalDayHighlightStart',
            isDaySelectionEnd && 'rangeIntervalDayHighlightEnd',
            isDayOutsideMonth && 'outsideCurrentMonth',
            isDayStartOfMonth && 'startOfMonth',
            isDayEndOfMonth && 'endOfMonth',
            isDayFirstVisibleCell && 'firstVisibleCell',
            isDayLastVisibleCell && 'lastVisibleCell',
            isDayFillerCell && 'hiddenDayFiller',
        ],
        rangeIntervalPreview: [
            'rangeIntervalPreview',
            isDayPreviewed && 'rangeIntervalDayPreview',
            (isDayPreviewStart || isDayStartOfMonth) && 'rangeIntervalDayPreviewStart',
            (isDayPreviewEnd || isDayEndOfMonth) && 'rangeIntervalDayPreviewEnd',
        ],
        day: [
            'day',
            !isDaySelected && 'notSelectedDate',
            !isDaySelected && 'dayOutsideRangeInterval',
            !isDayInsideSelection && 'dayInsideRangeInterval',
        ],
    };
    return (0, composeClasses_1.default)(slots, dateRangePickerDayClasses_1.getDateRangePickerDayUtilityClass, classes);
};
var endBorderStyle = {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
};
var startBorderStyle = {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
};
var DateRangePickerDayRoot = (0, styles_1.styled)('div', {
    name: 'MuiDateRangePickerDay',
    slot: 'Root',
    overridesResolver: function (_, styles) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return [
            (_a = {},
                _a["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayHighlight)] = styles.rangeIntervalDayHighlight,
                _a),
            (_b = {},
                _b["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayHighlightStart)] = styles.rangeIntervalDayHighlightStart,
                _b),
            (_c = {},
                _c["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayHighlightEnd)] = styles.rangeIntervalDayHighlightEnd,
                _c),
            (_d = {},
                _d["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.firstVisibleCell)] = styles.firstVisibleCell,
                _d),
            (_e = {},
                _e["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.lastVisibleCell)] = styles.lastVisibleCell,
                _e),
            (_f = {},
                _f["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.startOfMonth)] = styles.startOfMonth,
                _f),
            (_g = {},
                _g["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.endOfMonth)] = styles.endOfMonth,
                _g),
            (_h = {},
                _h["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.outsideCurrentMonth)] = styles.outsideCurrentMonth,
                _h),
            (_j = {},
                _j["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.hiddenDayFiller)] = styles.hiddenDayFiller,
                _j),
            styles.root,
        ];
    },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return ({
        variants: [
            {
                props: { isDayFillerCell: false },
                style: (_b = {},
                    _b["&:first-of-type .".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayPreview)] = __assign(__assign({}, startBorderStyle), { borderLeftColor: (theme.vars || theme).palette.divider }),
                    _b["&:last-of-type .".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayPreview)] = __assign(__assign({}, endBorderStyle), { borderRightColor: (theme.vars || theme).palette.divider }),
                    _b),
            },
            {
                props: { isDayFillerCell: false, isDaySelected: true },
                style: {
                    borderRadius: 0,
                    color: (theme.vars || theme).palette.primary.contrastText,
                    backgroundColor: theme.vars
                        ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.focusOpacity, ")")
                        : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.focusOpacity),
                    '&:first-of-type': startBorderStyle,
                    '&:last-of-type': endBorderStyle,
                },
            },
            {
                props: function (_a) {
                    var _b = _a.ownerState, isDayFillerCell = _b.isDayFillerCell, isDaySelectionStart = _b.isDaySelectionStart, isDayFirstVisibleCell = _b.isDayFirstVisibleCell;
                    return !isDayFillerCell && (isDaySelectionStart || isDayFirstVisibleCell);
                },
                style: __assign(__assign({}, startBorderStyle), { paddingLeft: 0 }),
            },
            {
                props: function (_a) {
                    var _b = _a.ownerState, isDayFillerCell = _b.isDayFillerCell, isDaySelectionEnd = _b.isDaySelectionEnd, isDayLastVisibleCell = _b.isDayLastVisibleCell;
                    return !isDayFillerCell && (isDaySelectionEnd || isDayLastVisibleCell);
                },
                style: __assign(__assign({}, endBorderStyle), { paddingRight: 0 }),
            },
        ],
    });
});
var DateRangePickerDayRangeIntervalPreview = (0, styles_1.styled)('div', {
    name: 'MuiDateRangePickerDay',
    slot: 'RangeIntervalPreview',
    overridesResolver: function (_, styles) {
        var _a, _b, _c;
        return [
            (_a = {}, _a["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayPreview)] = styles.rangeIntervalDayPreview, _a),
            (_b = {},
                _b["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayPreviewStart)] = styles.rangeIntervalDayPreviewStart,
                _b),
            (_c = {},
                _c["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.rangeIntervalDayPreviewEnd)] = styles.rangeIntervalDayPreviewEnd,
                _c),
            styles.rangeIntervalPreview,
        ];
    },
})(function (_a) {
    var theme = _a.theme;
    return ({
        // replace default day component margin with transparent border to avoid jumping on preview
        border: '2px solid transparent',
        variants: [
            {
                props: { isDayPreviewed: true, isDayFillerCell: false },
                style: {
                    borderRadius: 0,
                    border: "2px dashed ".concat((theme.vars || theme).palette.divider),
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                },
            },
            {
                props: function (_a) {
                    var _b = _a.ownerState, isDayPreviewed = _b.isDayPreviewed, isDayFillerCell = _b.isDayFillerCell, isDayPreviewStart = _b.isDayPreviewStart, isDayFirstVisibleCell = _b.isDayFirstVisibleCell;
                    return isDayPreviewed && !isDayFillerCell && (isDayPreviewStart || isDayFirstVisibleCell);
                },
                style: __assign({ borderLeftColor: (theme.vars || theme).palette.divider }, startBorderStyle),
            },
            {
                props: function (_a) {
                    var _b = _a.ownerState, isDayPreviewed = _b.isDayPreviewed, isDayFillerCell = _b.isDayFillerCell, isDayPreviewEnd = _b.isDayPreviewEnd, isDayLastVisibleCell = _b.isDayLastVisibleCell;
                    return isDayPreviewed && !isDayFillerCell && (isDayPreviewEnd || isDayLastVisibleCell);
                },
                style: __assign({ borderRightColor: (theme.vars || theme).palette.divider }, endBorderStyle),
            },
        ],
    });
});
var DateRangePickerDayDay = (0, styles_1.styled)(PickersDay_1.PickersDay, {
    name: 'MuiDateRangePickerDay',
    slot: 'Day',
    overridesResolver: function (_, styles) {
        var _a, _b, _c;
        return [
            (_a = {}, _a["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.dayInsideRangeInterval)] = styles.dayInsideRangeInterval, _a),
            (_b = {}, _b["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.dayOutsideRangeInterval)] = styles.dayOutsideRangeInterval, _b),
            (_c = {}, _c["&.".concat(dateRangePickerDayClasses_1.dateRangePickerDayClasses.notSelectedDate)] = styles.notSelectedDate, _c),
            styles.day,
        ];
    },
})({
    // Required to overlap preview border
    transform: 'scale(1.1)',
    '& > *': {
        transform: 'scale(0.9)',
    },
    variants: [
        {
            props: { draggable: true },
            style: {
                cursor: 'grab',
                touchAction: 'none',
            },
        },
    ],
});
var DateRangePickerDayRaw = React.forwardRef(function DateRangePickerDay(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDateRangePickerDay' });
    var className = props.className, classesProp = props.classes, isEndOfHighlighting = props.isEndOfHighlighting, isEndOfPreviewing = props.isEndOfPreviewing, isHighlighting = props.isHighlighting, isPreviewing = props.isPreviewing, isStartOfHighlighting = props.isStartOfHighlighting, isStartOfPreviewing = props.isStartOfPreviewing, isVisuallySelected = props.isVisuallySelected, sx = props.sx, draggable = props.draggable, isFirstVisibleCell = props.isFirstVisibleCell, isLastVisibleCell = props.isLastVisibleCell, day = props.day, selected = props.selected, disabled = props.disabled, today = props.today, outsideCurrentMonth = props.outsideCurrentMonth, disableMargin = props.disableMargin, disableHighlightToday = props.disableHighlightToday, showDaysOutsideCurrentMonth = props.showDaysOutsideCurrentMonth, other = __rest(props, ["className", "classes", "isEndOfHighlighting", "isEndOfPreviewing", "isHighlighting", "isPreviewing", "isStartOfHighlighting", "isStartOfPreviewing", "isVisuallySelected", "sx", "draggable", "isFirstVisibleCell", "isLastVisibleCell", "day", "selected", "disabled", "today", "outsideCurrentMonth", "disableMargin", "disableHighlightToday", "showDaysOutsideCurrentMonth"]);
    (0, x_license_1.useLicenseVerifier)('x-date-pickers-pro', '__RELEASE_INFO__');
    var adapter = (0, hooks_1.usePickerAdapter)();
    var shouldRenderHighlight = isHighlighting && !outsideCurrentMonth;
    var shouldRenderPreview = isPreviewing && !outsideCurrentMonth;
    var pickersDayOwnerState = (0, internals_1.usePickerDayOwnerState)({
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
        // Properties that the Base UI implementation will have
        isDaySelectionStart: isStartOfHighlighting, isDaySelectionEnd: isEndOfHighlighting, isDayInsideSelection: isHighlighting && !isStartOfHighlighting && !isEndOfHighlighting, isDaySelected: isHighlighting, isDayPreviewed: isPreviewing, isDayPreviewStart: isStartOfPreviewing, isDayPreviewEnd: isEndOfPreviewing, isDayInsidePreview: isPreviewing && !isStartOfPreviewing && !isEndOfPreviewing, 
        // Properties specific to the MUI implementation (some might be removed in the next major)
        isDayStartOfMonth: adapter.isSameDay(day, adapter.startOfMonth(day)), isDayEndOfMonth: adapter.isSameDay(day, adapter.endOfMonth(day)), isDayFirstVisibleCell: isFirstVisibleCell, isDayLastVisibleCell: isLastVisibleCell, isDayFillerCell: outsideCurrentMonth && !showDaysOutsideCurrentMonth });
    var classes = useUtilityClasses(classesProp, ownerState);
    return (<DateRangePickerDayRoot data-testid={shouldRenderHighlight ? 'DateRangeHighlight' : undefined} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} sx={sx}>
      <DateRangePickerDayRangeIntervalPreview data-testid={shouldRenderPreview ? 'DateRangePreview' : undefined} className={classes.rangeIntervalPreview} ownerState={ownerState}>
        <DateRangePickerDayDay data-testid="DateRangePickerDay" {...other} ref={ref} day={day} selected={isVisuallySelected} disabled={disabled} today={today} outsideCurrentMonth={outsideCurrentMonth} disableMargin disableHighlightToday={disableHighlightToday} showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth} className={classes.day} ownerState={ownerState} draggable={draggable} isFirstVisibleCell={isFirstVisibleCell} isLastVisibleCell={isLastVisibleCell}/>
      </DateRangePickerDayRangeIntervalPreview>
    </DateRangePickerDayRoot>);
});
DateRangePickerDayRaw.propTypes = {
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
    onDaySelect: prop_types_1.default.func.isRequired,
    /**
     * Callback fired when the component is focused with a keyboard.
     * We trigger a `onFocus` callback too.
     */
    onFocusVisible: prop_types_1.default.func,
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
/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 *
 * API:
 *
 * - [DateRangePickerDay API](https://mui.com/x/api/date-pickers/date-range-picker-day/)
 */
exports.DateRangePickerDay = React.memo(DateRangePickerDayRaw);
