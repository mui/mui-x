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
exports.DateRangeCalendar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useMediaQuery_1 = require("@mui/material/useMediaQuery");
var resolveComponentProps_1 = require("@mui/utils/resolveComponentProps");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var x_license_1 = require("@mui/x-license");
var internals_1 = require("@mui/x-date-pickers/internals");
var warning_1 = require("@mui/x-internals/warning");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var dateRangeCalendarClasses_1 = require("./dateRangeCalendarClasses");
var date_utils_1 = require("../internals/utils/date-utils");
var date_range_manager_1 = require("../internals/utils/date-range-manager");
var DateRangePickerDay_1 = require("../DateRangePickerDay");
var valueManagers_1 = require("../internals/utils/valueManagers");
var useDragRange_1 = require("./useDragRange");
var useRangePosition_1 = require("../internals/hooks/useRangePosition");
var dimensions_1 = require("../internals/constants/dimensions");
var PickersRangeCalendarHeader_1 = require("../PickersRangeCalendarHeader");
var useNullablePickerRangePositionContext_1 = require("../internals/hooks/useNullablePickerRangePositionContext");
var DateRangePickerDay2_1 = require("../DateRangePickerDay2");
var releaseInfo = '__RELEASE_INFO__';
var DateRangeCalendarRoot = (0, styles_1.styled)('div', {
    name: 'MuiDateRangeCalendar',
    slot: 'Root',
})({
    display: 'flex',
    flexDirection: 'row',
});
var DateRangeCalendarMonthContainer = (0, styles_1.styled)('div', {
    name: 'MuiDateRangeCalendar',
    slot: 'Container',
    overridesResolver: function (_, styles) { return styles.monthContainer; }, // FIXME: Inconsistent naming with slot
})(function (_a) {
    var theme = _a.theme;
    return ({
        '&:not(:last-of-type)': {
            borderRight: "1px solid ".concat((theme.vars || theme).palette.divider),
        },
    });
});
var weeksContainerHeight = (dimensions_1.DAY_RANGE_SIZE + dimensions_1.DAY_MARGIN * 2) * 6;
var InnerDayCalendarForRange = (0, styles_1.styled)(internals_1.DayCalendar)(function (_a) {
    var _b, _c;
    var theme = _a.theme;
    return (_b = {
            minWidth: 312,
            minHeight: weeksContainerHeight
        },
        _b["&.".concat(dateRangeCalendarClasses_1.dateRangeCalendarClasses.dayDragging)] = (_c = {},
            _c["& .".concat(DateRangePickerDay2_1.dateRangePickerDay2Classes.root, ", & .").concat(DateRangePickerDay_1.dateRangePickerDayClasses.day)] = {
                cursor: 'grabbing',
            },
            _c["& .".concat(DateRangePickerDay_1.dateRangePickerDayClasses.root, ":not(.").concat(DateRangePickerDay_1.dateRangePickerDayClasses.rangeIntervalDayHighlightStart, "):not(.").concat(DateRangePickerDay_1.dateRangePickerDayClasses.rangeIntervalDayHighlightEnd, ") .").concat(DateRangePickerDay_1.dateRangePickerDayClasses.day, ":not(.").concat(DateRangePickerDay_1.dateRangePickerDayClasses.notSelectedDate, ")")] = {
                // we can't override `PickersDay` background color here, because it's styles take precedence
                opacity: 0.6,
            },
            _c),
        _b["&:not(.".concat(dateRangeCalendarClasses_1.dateRangeCalendarClasses.dayDragging, ") .").concat(DateRangePickerDay_1.dateRangePickerDayClasses.dayOutsideRangeInterval)] = {
            '@media (pointer: fine)': {
                '&:hover': {
                    border: "1px solid ".concat((theme.vars || theme).palette.grey[500]),
                },
            },
        },
        _b);
});
var DayCalendarForRange = InnerDayCalendarForRange;
function useDateRangeCalendarDefaultizedProps(props, name) {
    var _a, _b, _c, _d, _e, _f, _g;
    var themeProps = (0, styles_1.useThemeProps)({
        props: props,
        name: name,
    });
    var reduceAnimations = (0, internals_1.useReduceAnimations)(themeProps.reduceAnimations);
    var validationProps = (0, internals_1.useApplyDefaultValuesToDateValidationProps)(themeProps);
    return __assign(__assign(__assign({}, themeProps), validationProps), { renderLoading: (_a = themeProps.renderLoading) !== null && _a !== void 0 ? _a : (function () { return <span data-testid="loading-progress">...</span>; }), reduceAnimations: reduceAnimations, loading: (_b = props.loading) !== null && _b !== void 0 ? _b : false, openTo: (_c = themeProps.openTo) !== null && _c !== void 0 ? _c : 'day', views: (_d = themeProps.views) !== null && _d !== void 0 ? _d : ['day'], calendars: (_e = themeProps.calendars) !== null && _e !== void 0 ? _e : 2, disableDragEditing: (_f = themeProps.disableDragEditing) !== null && _f !== void 0 ? _f : false, availableRangePositions: (_g = themeProps.availableRangePositions) !== null && _g !== void 0 ? _g : ['start', 'end'] });
}
var useUtilityClasses = function (classes, ownerState) {
    var slots = {
        root: ['root'],
        monthContainer: ['monthContainer'],
        dayCalendar: [ownerState.isDraggingDay && 'dayDragging'],
    };
    return (0, composeClasses_1.default)(slots, dateRangeCalendarClasses_1.getDateRangeCalendarUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 * - [DateRangeCalendar](https://mui.com/x/react-date-pickers/date-range-calendar/)
 *
 * API:
 *
 * - [DateRangeCalendar API](https://mui.com/x/api/date-pickers/date-range-calendar/)
 */
var DateRangeCalendar = React.forwardRef(function DateRangeCalendar(inProps, ref) {
    var _a;
    var props = useDateRangeCalendarDefaultizedProps(inProps, 'MuiDateRangeCalendar');
    var shouldHavePreview = (0, useMediaQuery_1.default)(internals_1.DEFAULT_DESKTOP_MODE_MEDIA_QUERY, {
        defaultMatches: false,
    });
    var valueProp = props.value, defaultValue = props.defaultValue, referenceDate = props.referenceDate, onChange = props.onChange, className = props.className, classesProp = props.classes, disableFuture = props.disableFuture, disablePast = props.disablePast, minDate = props.minDate, maxDate = props.maxDate, shouldDisableDate = props.shouldDisableDate, reduceAnimations = props.reduceAnimations, onMonthChange = props.onMonthChange, rangePositionProp = props.rangePosition, defaultRangePositionProp = props.defaultRangePosition, onRangePositionChangeProp = props.onRangePositionChange, calendars = props.calendars, _b = props.currentMonthCalendarPosition, currentMonthCalendarPosition = _b === void 0 ? 1 : _b, slots = props.slots, slotProps = props.slotProps, loading = props.loading, renderLoading = props.renderLoading, disableHighlightToday = props.disableHighlightToday, focusedViewProp = props.focusedView, onFocusedViewChange = props.onFocusedViewChange, readOnly = props.readOnly, disabled = props.disabled, showDaysOutsideCurrentMonth = props.showDaysOutsideCurrentMonth, dayOfWeekFormatter = props.dayOfWeekFormatter, disableAutoMonthSwitching = props.disableAutoMonthSwitching, autoFocus = props.autoFocus, fixedWeekNumber = props.fixedWeekNumber, disableDragEditing = props.disableDragEditing, displayWeekNumber = props.displayWeekNumber, timezoneProp = props.timezone, availableRangePositions = props.availableRangePositions, views = props.views, inView = props.view, openTo = props.openTo, onViewChange = props.onViewChange, other = __rest(props, ["value", "defaultValue", "referenceDate", "onChange", "className", "classes", "disableFuture", "disablePast", "minDate", "maxDate", "shouldDisableDate", "reduceAnimations", "onMonthChange", "rangePosition", "defaultRangePosition", "onRangePositionChange", "calendars", "currentMonthCalendarPosition", "slots", "slotProps", "loading", "renderLoading", "disableHighlightToday", "focusedView", "onFocusedViewChange", "readOnly", "disabled", "showDaysOutsideCurrentMonth", "dayOfWeekFormatter", "disableAutoMonthSwitching", "autoFocus", "fixedWeekNumber", "disableDragEditing", "displayWeekNumber", "timezone", "availableRangePositions", "views", "view", "openTo", "onViewChange"]);
    var rangePositionContext = (0, useNullablePickerRangePositionContext_1.useNullablePickerRangePositionContext)();
    var _c = (0, internals_1.useControlledValue)({
        name: 'DateRangeCalendar',
        timezone: timezoneProp,
        value: valueProp,
        referenceDate: referenceDate,
        defaultValue: defaultValue,
        onChange: onChange,
        valueManager: valueManagers_1.rangeValueManager,
    }), value = _c.value, handleValueChange = _c.handleValueChange, timezone = _c.timezone;
    var _d = (0, internals_1.useViews)({
        view: inView,
        views: views,
        openTo: openTo,
        onChange: handleValueChange,
        onViewChange: onViewChange,
        autoFocus: autoFocus,
        focusedView: focusedViewProp,
        onFocusedViewChange: onFocusedViewChange,
    }), view = _d.view, setFocusedView = _d.setFocusedView, focusedView = _d.focusedView, setValueAndGoToNextView = _d.setValueAndGoToNextView;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var id = (0, useId_1.default)();
    var _e = (0, useRangePosition_1.useRangePosition)({
        rangePosition: rangePositionProp !== null && rangePositionProp !== void 0 ? rangePositionProp : rangePositionContext === null || rangePositionContext === void 0 ? void 0 : rangePositionContext.rangePosition,
        defaultRangePosition: defaultRangePositionProp,
        onRangePositionChange: onRangePositionChangeProp !== null && onRangePositionChangeProp !== void 0 ? onRangePositionChangeProp : rangePositionContext === null || rangePositionContext === void 0 ? void 0 : rangePositionContext.setRangePosition,
    }), rangePosition = _e.rangePosition, setRangePosition = _e.setRangePosition;
    var handleDatePositionChange = (0, useEventCallback_1.default)(function (position) {
        if (rangePosition !== position) {
            setRangePosition(position);
        }
    });
    var handleSelectedDayChange = (0, useEventCallback_1.default)(function (newDate, selectionState, allowRangeFlip) {
        if (allowRangeFlip === void 0) { allowRangeFlip = false; }
        var _a = (0, date_range_manager_1.calculateRangeChange)({
            newDate: newDate,
            adapter: adapter,
            range: value,
            rangePosition: rangePosition,
            allowRangeFlip: allowRangeFlip,
            shouldMergeDateAndTime: true,
            referenceDate: referenceDate,
        }), nextSelection = _a.nextSelection, newRange = _a.newRange;
        var isNextSectionAvailable = availableRangePositions.includes(nextSelection);
        if (isNextSectionAvailable) {
            setRangePosition(nextSelection);
        }
        var isFullRangeSelected = rangePosition === 'end' && (0, date_utils_1.isRangeValid)(adapter, newRange);
        setValueAndGoToNextView(newRange, isFullRangeSelected || !isNextSectionAvailable ? 'finish' : 'partial', view);
    });
    var handleDrop = (0, useEventCallback_1.default)(function (newDate) {
        handleSelectedDayChange(newDate, undefined, true);
    });
    var shouldDisableDragEditing = disableDragEditing || disabled || readOnly;
    // Range going for the start of the start day to the end of the end day.
    // This makes sure that `isWithinRange` works with any time in the start and end day.
    var valueDayRange = React.useMemo(function () { return [
        !adapter.isValid(value[0]) ? value[0] : adapter.startOfDay(value[0]),
        !adapter.isValid(value[1]) ? value[1] : adapter.endOfDay(value[1]),
    ]; }, [value, adapter]);
    var _f = (0, useDragRange_1.useDragRange)({
        disableDragEditing: shouldDisableDragEditing,
        onDrop: handleDrop,
        onDatePositionChange: handleDatePositionChange,
        adapter: adapter,
        dateRange: valueDayRange,
        timezone: timezone,
    }), isDragging = _f.isDragging, rangeDragDay = _f.rangeDragDay, draggingDatePosition = _f.draggingDatePosition, dragEventHandlers = __rest(_f, ["isDragging", "rangeDragDay", "draggingDatePosition"]);
    var pickersOwnerState = (0, internals_1.usePickerPrivateContext)().ownerState;
    var ownerState = __assign(__assign({}, pickersOwnerState), { isDraggingDay: isDragging });
    var classes = useUtilityClasses(classesProp, ownerState);
    var draggingRange = React.useMemo(function () {
        if (!valueDayRange[0] || !valueDayRange[1] || !rangeDragDay) {
            return [null, null];
        }
        var newRange = (0, date_range_manager_1.calculateRangeChange)({
            adapter: adapter,
            range: valueDayRange,
            newDate: rangeDragDay,
            rangePosition: rangePosition,
            allowRangeFlip: true,
        }).newRange;
        return newRange[0] !== null && newRange[1] !== null
            ? [adapter.startOfDay(newRange[0]), adapter.endOfDay(newRange[1])]
            : newRange;
    }, [rangePosition, rangeDragDay, adapter, valueDayRange]);
    var wrappedShouldDisableDate = React.useMemo(function () {
        if (!shouldDisableDate) {
            return undefined;
        }
        return function (dayToTest) {
            return shouldDisableDate(dayToTest, draggingDatePosition || rangePosition);
        };
    }, [shouldDisableDate, rangePosition, draggingDatePosition]);
    var _g = (0, internals_1.useCalendarState)({
        value: value[0] || value[1],
        referenceDate: (0, date_range_manager_1.resolveReferenceDate)(referenceDate, rangePosition),
        disableFuture: disableFuture,
        disablePast: disablePast,
        maxDate: maxDate,
        minDate: minDate,
        onMonthChange: onMonthChange,
        reduceAnimations: reduceAnimations,
        shouldDisableDate: wrappedShouldDisableDate,
        timezone: timezone,
        getCurrentMonthFromVisibleDate: function (visibleDate, prevMonth) {
            var firstVisibleMonth = adapter.addMonths(prevMonth, 1 - currentMonthCalendarPosition);
            var lastVisibleMonth = adapter.endOfMonth(adapter.addMonths(firstVisibleMonth, calendars - 1));
            // The new focused day is inside the visible calendars,
            // Do not change the current month
            if (adapter.isWithinRange(visibleDate, [firstVisibleMonth, lastVisibleMonth])) {
                return prevMonth;
            }
            // The new focused day is after the last visible month,
            // Move the current month so that the new focused day is inside the first visible month
            if (adapter.isAfter(visibleDate, lastVisibleMonth)) {
                return adapter.startOfMonth(adapter.addMonths(visibleDate, currentMonthCalendarPosition - 1));
            }
            // The new focused day is before the first visible month,
            // Move the current month so that the new focused day is inside the last visible month
            return adapter.startOfMonth(adapter.addMonths(visibleDate, currentMonthCalendarPosition - calendars));
        },
    }), calendarState = _g.calendarState, setVisibleDate = _g.setVisibleDate, onMonthSwitchingAnimationEnd = _g.onMonthSwitchingAnimationEnd;
    var CalendarHeader = (_a = slots === null || slots === void 0 ? void 0 : slots.calendarHeader) !== null && _a !== void 0 ? _a : PickersRangeCalendarHeader_1.PickersRangeCalendarHeader;
    var calendarHeaderProps = (0, useSlotProps_1.default)({
        elementType: CalendarHeader,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.calendarHeader,
        additionalProps: {
            calendars: calendars,
            views: ['day'],
            view: 'day',
            currentMonth: calendarState.currentMonth,
            onMonthChange: function (month) { return setVisibleDate({ target: month, reason: 'header-navigation' }); },
            minDate: minDate,
            maxDate: maxDate,
            disabled: disabled,
            disablePast: disablePast,
            disableFuture: disableFuture,
            reduceAnimations: reduceAnimations,
            timezone: timezone,
            slots: slots,
            slotProps: slotProps,
        },
        ownerState: ownerState,
    });
    // TODO: Move this logic inside the render instead of using an effect
    var prevValue = React.useRef(null);
    React.useEffect(function () {
        var _a, _b;
        var date = rangePosition === 'start' ? value[0] : value[1];
        if (!adapter.isValid(date)) {
            return;
        }
        var prevDate = rangePosition === 'start' ? (_a = prevValue.current) === null || _a === void 0 ? void 0 : _a[0] : (_b = prevValue.current) === null || _b === void 0 ? void 0 : _b[1];
        prevValue.current = value;
        // The current date did not change, this call comes either from a `rangePosition` change or a change in the other date.
        // In both cases, we don't want to change the visible month(s).
        if (disableAutoMonthSwitching && prevDate && adapter.isEqual(prevDate, date)) {
            return;
        }
        var displayingMonthRange = calendars - currentMonthCalendarPosition;
        var currentMonthNumber = adapter.getMonth(calendarState.currentMonth);
        var requestedMonthNumber = adapter.getMonth(date);
        if (!adapter.isSameYear(calendarState.currentMonth, date) ||
            requestedMonthNumber < currentMonthNumber ||
            requestedMonthNumber > currentMonthNumber + displayingMonthRange) {
            var newMonth = rangePosition === 'start'
                ? date
                : // If need to focus end, scroll to the state when "end" is displaying in the last calendar
                    adapter.addMonths(date, -displayingMonthRange);
            setVisibleDate({ target: newMonth, reason: 'controlled-value-change' });
        }
    }, [rangePosition, value]); // eslint-disable-line
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
    };
    var _h = React.useState(null), rangePreviewDay = _h[0], setRangePreviewDay = _h[1];
    var CalendarTransitionProps = React.useMemo(function () { return ({
        onMouseLeave: function () { return setRangePreviewDay(null); },
    }); }, []);
    var previewingRange = (0, date_range_manager_1.calculateRangePreview)({
        adapter: adapter,
        range: valueDayRange,
        newDate: rangePreviewDay,
        rangePosition: rangePosition,
    });
    var handleDayMouseEnter = (0, useEventCallback_1.default)(function (event, newRangePreviewDay) {
        var cleanNewRangePreviewDay;
        if (valueDayRange[0] == null && valueDayRange[1] == null) {
            cleanNewRangePreviewDay = null;
        }
        else if ((0, date_utils_1.isWithinRange)(adapter, newRangePreviewDay, valueDayRange)) {
            cleanNewRangePreviewDay = null;
        }
        else {
            cleanNewRangePreviewDay = newRangePreviewDay;
        }
        if (!(0, internals_1.areDatesEqual)(adapter, cleanNewRangePreviewDay, rangePreviewDay)) {
            setRangePreviewDay(cleanNewRangePreviewDay);
        }
    });
    var slotsForDayCalendar = __assign({ day: DateRangePickerDay_1.DateRangePickerDay }, slots);
    var slotPropsForDayCalendar = __assign(__assign({}, slotProps), { day: function (dayOwnerState) {
            var _a;
            var day = dayOwnerState.day, isDaySelected = dayOwnerState.isDaySelected;
            var isSelectedStartDate = (0, date_utils_1.isStartOfRange)(adapter, day, valueDayRange);
            var isSelectedEndDate = (0, date_utils_1.isEndOfRange)(adapter, day, valueDayRange);
            var shouldInitDragging = !shouldDisableDragEditing && valueDayRange[0] && valueDayRange[1];
            var isElementDraggable = shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
            var datePosition;
            if (isSelectedStartDate) {
                datePosition = 'start';
            }
            else if (isSelectedEndDate) {
                datePosition = 'end';
            }
            var isStartOfHighlighting = isDragging
                ? (0, date_utils_1.isStartOfRange)(adapter, day, draggingRange)
                : isSelectedStartDate;
            var isEndOfHighlighting = isDragging
                ? (0, date_utils_1.isEndOfRange)(adapter, day, draggingRange)
                : isSelectedEndDate;
            return __assign(__assign(__assign({ isPreviewing: shouldHavePreview ? (0, date_utils_1.isWithinRange)(adapter, day, previewingRange) : false, isStartOfPreviewing: shouldHavePreview
                    ? (0, date_utils_1.isStartOfRange)(adapter, day, previewingRange)
                    : false, isEndOfPreviewing: shouldHavePreview ? (0, date_utils_1.isEndOfRange)(adapter, day, previewingRange) : false, isHighlighting: (0, date_utils_1.isWithinRange)(adapter, day, isDragging ? draggingRange : valueDayRange), isStartOfHighlighting: isStartOfHighlighting, isEndOfHighlighting: isDragging
                    ? (0, date_utils_1.isEndOfRange)(adapter, day, draggingRange)
                    : isSelectedEndDate, onMouseEnter: shouldHavePreview ? handleDayMouseEnter : undefined, 
                // apply selected styling to the dragging start or end day
                isVisuallySelected: isDaySelected || (isDragging && (isStartOfHighlighting || isEndOfHighlighting)), 'data-position': datePosition }, dragEventHandlers), { draggable: isElementDraggable ? true : undefined }), ((_a = (0, resolveComponentProps_1.default)(slotProps === null || slotProps === void 0 ? void 0 : slotProps.day, dayOwnerState)) !== null && _a !== void 0 ? _a : {}));
        } });
    var calendarMonths = React.useMemo(function () { return Array.from({ length: calendars }).map(function (_, index) { return index; }); }, [calendars]);
    var visibleMonths = React.useMemo(function () {
        if (process.env.NODE_ENV !== 'production') {
            if (currentMonthCalendarPosition > calendars || currentMonthCalendarPosition < 1) {
                (0, warning_1.warnOnce)([
                    'MUI X: The `currentMonthCalendarPosition` prop must be an integer between `1` and the amount of calendars rendered.',
                    'For example if you have 2 calendars rendered, it should be equal to either 1 or 2.',
                ]);
            }
        }
        var firstMonth = adapter.addMonths(calendarState.currentMonth, 1 - currentMonthCalendarPosition);
        return Array.from({ length: calendars }).map(function (_, index) {
            return adapter.addMonths(firstMonth, index);
        });
    }, [adapter, calendarState.currentMonth, calendars, currentMonthCalendarPosition]);
    var hasFocus = focusedView !== null;
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
    return (<DateRangeCalendarRoot ref={ref} className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other}>
      <x_license_1.Watermark packageName="x-date-pickers-pro" releaseInfo={releaseInfo}/>
      {calendarMonths.map(function (monthIndex) {
            var month = visibleMonths[monthIndex];
            var labelId = "".concat(id, "-grid-").concat(monthIndex, "-label");
            return (<DateRangeCalendarMonthContainer key={monthIndex} className={classes.monthContainer}>
            <CalendarHeader {...calendarHeaderProps} month={month} monthIndex={monthIndex} labelId={labelId}/>
            <DayCalendarForRange className={classes.dayCalendar} {...calendarState} {...baseDateValidationProps} {...commonViewProps} onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd} onFocusedDayChange={function (focusedDate) {
                    return setVisibleDate({ target: focusedDate, reason: 'cell-interaction' });
                }} reduceAnimations={reduceAnimations} selectedDays={value} onSelectedDaysChange={handleSelectedDayChange} currentMonth={month} TransitionProps={CalendarTransitionProps} shouldDisableDate={wrappedShouldDisableDate} hasFocus={hasFocus} onFocusedViewChange={function (isViewFocused) { return setFocusedView('day', isViewFocused); }} showDaysOutsideCurrentMonth={calendars === 1 && showDaysOutsideCurrentMonth} dayOfWeekFormatter={dayOfWeekFormatter} loading={loading} renderLoading={renderLoading} slots={slotsForDayCalendar} slotProps={slotPropsForDayCalendar} fixedWeekNumber={fixedWeekNumber} displayWeekNumber={displayWeekNumber} timezone={timezone} gridLabelId={labelId}/>
          </DateRangeCalendarMonthContainer>);
        })}
    </DateRangeCalendarRoot>);
});
exports.DateRangeCalendar = DateRangeCalendar;
DateRangeCalendar.propTypes = {
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
     * Range positions available for selection.
     * This list is checked against when checking if a next range position can be selected.
     *
     * Used on Date Time Range pickers with current `rangePosition` to force a `finish` selection after just one range position selection.
     * @default ['start', 'end']
     */
    availableRangePositions: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['end', 'start']).isRequired),
    /**
     * The number of calendars to render.
     * @default 2
     */
    calendars: prop_types_1.default.oneOf([1, 2, 3]),
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * Position the current month is rendered in.
     * @default 1
     */
    currentMonthCalendarPosition: prop_types_1.default.oneOf([1, 2, 3]),
    /**
     * Formats the day of week displayed in the calendar header.
     * @param {PickerValidDate} date The date of the day of week provided by the adapter.
     * @returns {string} The name to display.
     * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
     */
    dayOfWeekFormatter: prop_types_1.default.func,
    /**
     * The initial position in the edited date range.
     * Used when the component is not controlled.
     * @default 'start'
     */
    defaultRangePosition: prop_types_1.default.oneOf(['end', 'start']),
    /**
     * The default selected value.
     * Used when the component is not controlled.
     */
    defaultValue: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
     * @default false
     */
    disableAutoMonthSwitching: prop_types_1.default.bool,
    /**
     * If `true`, the component is disabled.
     * When disabled, the value cannot be changed and no interaction is possible.
     * @default false
     */
    disabled: prop_types_1.default.bool,
    /**
     * If `true`, editing dates by dragging is disabled.
     * @default false
     */
    disableDragEditing: prop_types_1.default.bool,
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
    focusedView: prop_types_1.default.oneOf(['day']),
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
     * Callback fired when the range position changes.
     * @param {RangePosition} rangePosition The new range position.
     */
    onRangePositionChange: prop_types_1.default.func,
    /**
     * Callback fired on view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view.
     */
    onViewChange: prop_types_1.default.func,
    /**
     * The default visible view.
     * Used when the component view is not controlled.
     * Must be a valid option from `views` list.
     */
    openTo: prop_types_1.default.oneOf(['day']),
    /**
     * The position in the currently edited date range.
     * Used when the component position is controlled.
     */
    rangePosition: prop_types_1.default.oneOf(['end', 'start']),
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
    referenceDate: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.object.isRequired),
        prop_types_1.default.object,
    ]),
    /**
     * Component rendered on the "day" view when `props.loading` is true.
     * @returns {React.ReactNode} The node to render when loading.
     * @default () => "..."
     */
    renderLoading: prop_types_1.default.func,
    /**
     * Disable specific date.
     *
     * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
     *
     * @param {PickerValidDate} day The date to test.
     * @param {string} position The date to test, 'start' or 'end'.
     * @returns {boolean} Returns `true` if the date should be disabled.
     */
    shouldDisableDate: prop_types_1.default.func,
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
    value: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * The visible view.
     * Used when the component view is controlled.
     * Must be a valid option from `views` list.
     */
    view: prop_types_1.default.oneOf(['day']),
    /**
     * Available views.
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['day'])),
};
