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
exports.DateCalendar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useCalendarState_1 = require("./useCalendarState");
var PickersFadeTransitionGroup_1 = require("./PickersFadeTransitionGroup");
var DayCalendar_1 = require("./DayCalendar");
var MonthCalendar_1 = require("../MonthCalendar");
var YearCalendar_1 = require("../YearCalendar");
var useViews_1 = require("../internals/hooks/useViews");
var PickersCalendarHeader_1 = require("../PickersCalendarHeader");
var date_utils_1 = require("../internals/utils/date-utils");
var PickerViewRoot_1 = require("../internals/components/PickerViewRoot");
var useReduceAnimations_1 = require("../internals/hooks/useReduceAnimations");
var dateCalendarClasses_1 = require("./dateCalendarClasses");
var useControlledValue_1 = require("../internals/hooks/useControlledValue");
var valueManagers_1 = require("../internals/utils/valueManagers");
var dimensions_1 = require("../internals/constants/dimensions");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var useDateManager_1 = require("../managers/useDateManager");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        viewTransitionContainer: ['viewTransitionContainer'],
    };
    return (0, composeClasses_1.default)(slots, dateCalendarClasses_1.getDateCalendarUtilityClass, classes);
};
function useDateCalendarDefaultizedProps(props, name) {
    var _a, _b, _c, _d;
    var themeProps = (0, styles_1.useThemeProps)({
        props: props,
        name: name,
    });
    var reduceAnimations = (0, useReduceAnimations_1.useReduceAnimations)(themeProps.reduceAnimations);
    var validationProps = (0, useDateManager_1.useApplyDefaultValuesToDateValidationProps)(themeProps);
    return __assign(__assign(__assign({}, themeProps), validationProps), { loading: (_a = themeProps.loading) !== null && _a !== void 0 ? _a : false, openTo: (_b = themeProps.openTo) !== null && _b !== void 0 ? _b : 'day', views: (_c = themeProps.views) !== null && _c !== void 0 ? _c : ['year', 'day'], reduceAnimations: reduceAnimations, renderLoading: (_d = themeProps.renderLoading) !== null && _d !== void 0 ? _d : (function () { return <span data-testid="loading-progress">...</span>; }) });
}
var DateCalendarRoot = (0, styles_1.styled)(PickerViewRoot_1.PickerViewRoot, {
    name: 'MuiDateCalendar',
    slot: 'Root',
})({
    display: 'flex',
    flexDirection: 'column',
    height: dimensions_1.VIEW_HEIGHT,
});
var DateCalendarViewTransitionContainer = (0, styles_1.styled)(PickersFadeTransitionGroup_1.PickersFadeTransitionGroup, {
    name: 'MuiDateCalendar',
    slot: 'ViewTransitionContainer',
})({});
/**
 * Demos:
 *
 * - [DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [DateCalendar API](https://mui.com/x/api/date-pickers/date-calendar/)
 */
exports.DateCalendar = React.forwardRef(function DateCalendar(inProps, ref) {
    var _a;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var id = (0, useId_1.default)();
    var props = useDateCalendarDefaultizedProps(inProps, 'MuiDateCalendar');
    var autoFocus = props.autoFocus, onViewChange = props.onViewChange, valueProp = props.value, defaultValue = props.defaultValue, referenceDateProp = props.referenceDate, disableFuture = props.disableFuture, disablePast = props.disablePast, onChange = props.onChange, onYearChange = props.onYearChange, onMonthChange = props.onMonthChange, reduceAnimations = props.reduceAnimations, shouldDisableDate = props.shouldDisableDate, shouldDisableMonth = props.shouldDisableMonth, shouldDisableYear = props.shouldDisableYear, inView = props.view, views = props.views, openTo = props.openTo, className = props.className, classesProp = props.classes, disabled = props.disabled, readOnly = props.readOnly, minDate = props.minDate, maxDate = props.maxDate, disableHighlightToday = props.disableHighlightToday, focusedViewProp = props.focusedView, onFocusedViewChange = props.onFocusedViewChange, showDaysOutsideCurrentMonth = props.showDaysOutsideCurrentMonth, fixedWeekNumber = props.fixedWeekNumber, dayOfWeekFormatter = props.dayOfWeekFormatter, slots = props.slots, slotProps = props.slotProps, loading = props.loading, renderLoading = props.renderLoading, displayWeekNumber = props.displayWeekNumber, yearsOrder = props.yearsOrder, yearsPerRow = props.yearsPerRow, monthsPerRow = props.monthsPerRow, timezoneProp = props.timezone, other = __rest(props, ["autoFocus", "onViewChange", "value", "defaultValue", "referenceDate", "disableFuture", "disablePast", "onChange", "onYearChange", "onMonthChange", "reduceAnimations", "shouldDisableDate", "shouldDisableMonth", "shouldDisableYear", "view", "views", "openTo", "className", "classes", "disabled", "readOnly", "minDate", "maxDate", "disableHighlightToday", "focusedView", "onFocusedViewChange", "showDaysOutsideCurrentMonth", "fixedWeekNumber", "dayOfWeekFormatter", "slots", "slotProps", "loading", "renderLoading", "displayWeekNumber", "yearsOrder", "yearsPerRow", "monthsPerRow", "timezone"]);
    var _b = (0, useControlledValue_1.useControlledValue)({
        name: 'DateCalendar',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDateProp,
        onChange: onChange,
        valueManager: valueManagers_1.singleItemValueManager,
    }), value = _b.value, handleValueChange = _b.handleValueChange, timezone = _b.timezone;
    var _c = (0, useViews_1.useViews)({
        view: inView,
        views: views,
        openTo: openTo,
        onChange: handleValueChange,
        onViewChange: onViewChange,
        autoFocus: autoFocus,
        focusedView: focusedViewProp,
        onFocusedViewChange: onFocusedViewChange,
    }), view = _c.view, setView = _c.setView, focusedView = _c.focusedView, setFocusedView = _c.setFocusedView, goToNextView = _c.goToNextView, setValueAndGoToNextView = _c.setValueAndGoToNextView;
    var _d = (0, useCalendarState_1.useCalendarState)({
        value: value,
        referenceDate: referenceDateProp,
        reduceAnimations: reduceAnimations,
        onMonthChange: onMonthChange,
        minDate: minDate,
        maxDate: maxDate,
        shouldDisableDate: shouldDisableDate,
        disablePast: disablePast,
        disableFuture: disableFuture,
        timezone: timezone,
        getCurrentMonthFromVisibleDate: function (visibleDate, prevMonth) {
            if (adapter.isSameMonth(visibleDate, prevMonth)) {
                return prevMonth;
            }
            return adapter.startOfMonth(visibleDate);
        },
    }), referenceDate = _d.referenceDate, calendarState = _d.calendarState, setVisibleDate = _d.setVisibleDate, isDateDisabled = _d.isDateDisabled, onMonthSwitchingAnimationEnd = _d.onMonthSwitchingAnimationEnd;
    // When disabled, limit the view to the selected date
    var minDateWithDisabled = (disabled && value) || minDate;
    var maxDateWithDisabled = (disabled && value) || maxDate;
    var gridLabelId = "".concat(id, "-grid-label");
    var hasFocus = focusedView !== null;
    var CalendarHeader = (_a = slots === null || slots === void 0 ? void 0 : slots.calendarHeader) !== null && _a !== void 0 ? _a : PickersCalendarHeader_1.PickersCalendarHeader;
    var calendarHeaderProps = (0, useSlotProps_1.default)({
        elementType: CalendarHeader,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.calendarHeader,
        additionalProps: {
            views: views,
            view: view,
            currentMonth: calendarState.currentMonth,
            onViewChange: setView,
            onMonthChange: function (month) { return setVisibleDate({ target: month, reason: 'header-navigation' }); },
            minDate: minDateWithDisabled,
            maxDate: maxDateWithDisabled,
            disabled: disabled,
            disablePast: disablePast,
            disableFuture: disableFuture,
            reduceAnimations: reduceAnimations,
            timezone: timezone,
            labelId: gridLabelId,
        },
        ownerState: ownerState,
    });
    var handleDateMonthChange = (0, useEventCallback_1.default)(function (newDate) {
        var startOfMonth = adapter.startOfMonth(newDate);
        var endOfMonth = adapter.endOfMonth(newDate);
        var closestEnabledDate = isDateDisabled(newDate)
            ? (0, date_utils_1.findClosestEnabledDate)({
                adapter: adapter,
                date: newDate,
                minDate: adapter.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
                maxDate: adapter.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
                disablePast: disablePast,
                disableFuture: disableFuture,
                isDateDisabled: isDateDisabled,
                timezone: timezone,
            })
            : newDate;
        if (closestEnabledDate) {
            setValueAndGoToNextView(closestEnabledDate, 'finish');
            setVisibleDate({ target: closestEnabledDate, reason: 'cell-interaction' });
        }
        else {
            goToNextView();
            setVisibleDate({ target: startOfMonth, reason: 'cell-interaction' });
        }
    });
    var handleDateYearChange = (0, useEventCallback_1.default)(function (newDate) {
        var startOfYear = adapter.startOfYear(newDate);
        var endOfYear = adapter.endOfYear(newDate);
        var closestEnabledDate = isDateDisabled(newDate)
            ? (0, date_utils_1.findClosestEnabledDate)({
                adapter: adapter,
                date: newDate,
                minDate: adapter.isBefore(minDate, startOfYear) ? startOfYear : minDate,
                maxDate: adapter.isAfter(maxDate, endOfYear) ? endOfYear : maxDate,
                disablePast: disablePast,
                disableFuture: disableFuture,
                isDateDisabled: isDateDisabled,
                timezone: timezone,
            })
            : newDate;
        if (closestEnabledDate) {
            setValueAndGoToNextView(closestEnabledDate, 'finish');
            setVisibleDate({ target: closestEnabledDate, reason: 'cell-interaction' });
        }
        else {
            goToNextView();
            setVisibleDate({ target: startOfYear, reason: 'cell-interaction' });
        }
    });
    var handleSelectedDayChange = (0, useEventCallback_1.default)(function (day) {
        if (day) {
            // If there is a date already selected, then we want to keep its time
            return handleValueChange((0, date_utils_1.mergeDateAndTime)(adapter, day, value !== null && value !== void 0 ? value : referenceDate), 'finish', view);
        }
        return handleValueChange(day, 'finish', view);
    });
    React.useEffect(function () {
        if (adapter.isValid(value)) {
            setVisibleDate({ target: value, reason: 'controlled-value-change' });
        }
    }, [value]); // eslint-disable-line
    var classes = useUtilityClasses(classesProp);
    var baseDateValidationProps = {
        disablePast: disablePast,
        disableFuture: disableFuture,
        maxDate: maxDate,
        minDate: minDate,
    };
    var commonViewProps = {
        disableHighlightToday: disableHighlightToday,
        readOnly: readOnly,
        disabled: disabled,
        timezone: timezone,
        gridLabelId: gridLabelId,
        slots: slots,
        slotProps: slotProps,
    };
    var prevOpenViewRef = React.useRef(view);
    React.useEffect(function () {
        // If the view change and the focus was on the previous view
        // Then we update the focus.
        if (prevOpenViewRef.current === view) {
            return;
        }
        if (focusedView === prevOpenViewRef.current) {
            setFocusedView(view, true);
        }
        prevOpenViewRef.current = view;
    }, [focusedView, setFocusedView, view]);
    var selectedDays = React.useMemo(function () { return [value]; }, [value]);
    return (<DateCalendarRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <CalendarHeader {...calendarHeaderProps} slots={slots} slotProps={slotProps}/>
      <DateCalendarViewTransitionContainer reduceAnimations={reduceAnimations} className={classes.viewTransitionContainer} transKey={view} ownerState={ownerState}>
        <div>
          {view === 'year' && (<YearCalendar_1.YearCalendar {...baseDateValidationProps} {...commonViewProps} value={value} onChange={handleDateYearChange} shouldDisableYear={shouldDisableYear} hasFocus={hasFocus} onFocusedViewChange={function (isViewFocused) { return setFocusedView('year', isViewFocused); }} yearsOrder={yearsOrder} yearsPerRow={yearsPerRow} referenceDate={referenceDate}/>)}

          {view === 'month' && (<MonthCalendar_1.MonthCalendar {...baseDateValidationProps} {...commonViewProps} hasFocus={hasFocus} className={className} value={value} onChange={handleDateMonthChange} shouldDisableMonth={shouldDisableMonth} onFocusedViewChange={function (isViewFocused) { return setFocusedView('month', isViewFocused); }} monthsPerRow={monthsPerRow} referenceDate={referenceDate}/>)}

          {view === 'day' && (<DayCalendar_1.DayCalendar {...calendarState} {...baseDateValidationProps} {...commonViewProps} onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd} hasFocus={hasFocus} onFocusedDayChange={function (focusedDate) {
                return setVisibleDate({ target: focusedDate, reason: 'cell-interaction' });
            }} reduceAnimations={reduceAnimations} selectedDays={selectedDays} onSelectedDaysChange={handleSelectedDayChange} shouldDisableDate={shouldDisableDate} shouldDisableMonth={shouldDisableMonth} shouldDisableYear={shouldDisableYear} onFocusedViewChange={function (isViewFocused) { return setFocusedView('day', isViewFocused); }} showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth} fixedWeekNumber={fixedWeekNumber} dayOfWeekFormatter={dayOfWeekFormatter} displayWeekNumber={displayWeekNumber} loading={loading} renderLoading={renderLoading}/>)}
        </div>
      </DateCalendarViewTransitionContainer>
    </DateCalendarRoot>);
});
exports.DateCalendar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * If `true`, the main element is focused during the first mount.
     * This main element is:
     * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
     * - the `input` element if there is a field rendered.
     */
    autoFocus: prop_types_1.default.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * Formats the day of week displayed in the calendar header.
     * @param {PickerValidDate} date The date of the day of week provided by the adapter.
     * @returns {string} The name to display.
     * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
     */
    dayOfWeekFormatter: prop_types_1.default.func,
    /**
     * The default selected value.
     * Used when the component is not controlled.
     */
    defaultValue: prop_types_1.default.object,
    /**
     * If `true`, the component is disabled.
     * When disabled, the value cannot be changed and no interaction is possible.
     * @default false
     */
    disabled: prop_types_1.default.bool,
    /**
     * If `true`, disable values after the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disableFuture: prop_types_1.default.bool,
    /**
     * If `true`, today's date is rendering without highlighting with circle.
     * @default false
     */
    disableHighlightToday: prop_types_1.default.bool,
    /**
     * If `true`, disable values before the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disablePast: prop_types_1.default.bool,
    /**
     * If `true`, the week number will be display in the calendar.
     */
    displayWeekNumber: prop_types_1.default.bool,
    /**
     * The day view will show as many weeks as needed after the end of the current month to match this value.
     * Put it to 6 to have a fixed number of weeks in Gregorian calendars
     */
    fixedWeekNumber: prop_types_1.default.number,
    /**
     * Controlled focused view.
     */
    focusedView: prop_types_1.default.oneOf(['day', 'month', 'year']),
    /**
     * If `true`, calls `renderLoading` instead of rendering the day calendar.
     * Can be used to preload information and show it in calendar.
     * @default false
     */
    loading: prop_types_1.default.bool,
    /**
     * Maximal selectable date.
     * @default 2099-12-31
     */
    maxDate: prop_types_1.default.object,
    /**
     * Minimal selectable date.
     * @default 1900-01-01
     */
    minDate: prop_types_1.default.object,
    /**
     * Months rendered per row.
     * @default 3
     */
    monthsPerRow: prop_types_1.default.oneOf([3, 4]),
    /**
     * Callback fired when the value changes.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TView The view type. Will be one of date or time views.
     * @param {TValue} value The new value.
     * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
     * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
     */
    onChange: prop_types_1.default.func,
    /**
     * Callback fired on focused view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view to focus or not.
     * @param {boolean} hasFocus `true` if the view should be focused.
     */
    onFocusedViewChange: prop_types_1.default.func,
    /**
     * Callback fired on month change.
     * @param {PickerValidDate} month The new month.
     */
    onMonthChange: prop_types_1.default.func,
    /**
     * Callback fired on view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view.
     */
    onViewChange: prop_types_1.default.func,
    /**
     * Callback fired on year change.
     * @param {PickerValidDate} year The new year.
     */
    onYearChange: prop_types_1.default.func,
    /**
     * The default visible view.
     * Used when the component view is not controlled.
     * Must be a valid option from `views` list.
     */
    openTo: prop_types_1.default.oneOf(['day', 'month', 'year']),
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * If `true`, disable heavy animations.
     * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
     */
    reduceAnimations: prop_types_1.default.bool,
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
     */
    referenceDate: prop_types_1.default.object,
    /**
     * Component displaying when passed `loading` true.
     * @returns {React.ReactNode} The node to render when loading.
     * @default () => <span>...</span>
     */
    renderLoading: prop_types_1.default.func,
    /**
     * Disable specific date.
     *
     * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
     *
     * @param {PickerValidDate} day The date to test.
     * @returns {boolean} If `true` the date will be disabled.
     */
    shouldDisableDate: prop_types_1.default.func,
    /**
     * Disable specific month.
     * @param {PickerValidDate} month The month to test.
     * @returns {boolean} If `true`, the month will be disabled.
     */
    shouldDisableMonth: prop_types_1.default.func,
    /**
     * Disable specific year.
     * @param {PickerValidDate} year The year to test.
     * @returns {boolean} If `true`, the year will be disabled.
     */
    shouldDisableYear: prop_types_1.default.func,
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
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
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
     * Choose which timezone to use for the value.
     * Example: "default", "system", "UTC", "America/New_York".
     * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
     * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
     * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
     */
    timezone: prop_types_1.default.string,
    /**
     * The selected value.
     * Used when the component is controlled.
     */
    value: prop_types_1.default.object,
    /**
     * The visible view.
     * Used when the component view is controlled.
     * Must be a valid option from `views` list.
     */
    view: prop_types_1.default.oneOf(['day', 'month', 'year']),
    /**
     * Available views.
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['day', 'month', 'year']).isRequired),
    /**
     * Years are displayed in ascending (chronological) order by default.
     * If `desc`, years are displayed in descending order.
     * @default 'asc'
     */
    yearsOrder: prop_types_1.default.oneOf(['asc', 'desc']),
    /**
     * Years rendered per row.
     * @default 3
     */
    yearsPerRow: prop_types_1.default.oneOf([3, 4]),
};
