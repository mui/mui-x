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
exports.DayCalendar = DayCalendar;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var Typography_1 = require("@mui/material/Typography");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var clsx_1 = require("clsx");
var PickersDay_1 = require("../PickersDay");
var hooks_1 = require("../hooks");
var useUtils_1 = require("../internals/hooks/useUtils");
var dimensions_1 = require("../internals/constants/dimensions");
var PickersSlideTransition_1 = require("./PickersSlideTransition");
var useIsDateDisabled_1 = require("./useIsDateDisabled");
var date_utils_1 = require("../internals/utils/date-utils");
var dayCalendarClasses_1 = require("./dayCalendarClasses");
var usePickerDayOwnerState_1 = require("../PickersDay/usePickerDayOwnerState");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        header: ['header'],
        weekDayLabel: ['weekDayLabel'],
        loadingContainer: ['loadingContainer'],
        slideTransition: ['slideTransition'],
        monthContainer: ['monthContainer'],
        weekContainer: ['weekContainer'],
        weekNumberLabel: ['weekNumberLabel'],
        weekNumber: ['weekNumber'],
    };
    return (0, composeClasses_1.default)(slots, dayCalendarClasses_1.getDayCalendarUtilityClass, classes);
};
var weeksContainerHeight = (dimensions_1.DAY_SIZE + dimensions_1.DAY_MARGIN * 2) * 6;
var PickersCalendarDayRoot = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendar',
    slot: 'Root',
})({});
var PickersCalendarDayHeader = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendar',
    slot: 'Header',
})({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
var PickersCalendarWeekDayLabel = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiDayCalendar',
    slot: 'WeekDayLabel',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: 36,
        height: 40,
        margin: '0 2px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: (theme.vars || theme).palette.text.secondary,
    });
});
var PickersCalendarWeekNumberLabel = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiDayCalendar',
    slot: 'WeekNumberLabel',
})(function (_a) {
    var theme = _a.theme;
    return ({
        width: 36,
        height: 40,
        margin: '0 2px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: (theme.vars || theme).palette.text.disabled,
    });
});
var PickersCalendarWeekNumber = (0, styles_1.styled)(Typography_1.default, {
    name: 'MuiDayCalendar',
    slot: 'WeekNumber',
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, theme.typography.caption), { width: dimensions_1.DAY_SIZE, height: dimensions_1.DAY_SIZE, padding: 0, margin: "0 ".concat(dimensions_1.DAY_MARGIN, "px"), color: (theme.vars || theme).palette.text.disabled, fontSize: '0.75rem', alignItems: 'center', justifyContent: 'center', display: 'inline-flex' }));
});
var PickersCalendarLoadingContainer = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendar',
    slot: 'LoadingContainer',
})({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: weeksContainerHeight,
});
var PickersCalendarSlideTransition = (0, styles_1.styled)(PickersSlideTransition_1.PickersSlideTransition, {
    name: 'MuiDayCalendar',
    slot: 'SlideTransition',
})({
    minHeight: weeksContainerHeight,
});
var PickersCalendarWeekContainer = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendar',
    slot: 'MonthContainer',
})({ overflow: 'hidden' });
var PickersCalendarWeek = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendar',
    slot: 'WeekContainer',
})({
    margin: "".concat(dimensions_1.DAY_MARGIN, "px 0"),
    display: 'flex',
    justifyContent: 'center',
});
function WrappedDay(_a) {
    var _b;
    var parentProps = _a.parentProps, day = _a.day, focusedDay = _a.focusedDay, selectedDays = _a.selectedDays, isDateDisabled = _a.isDateDisabled, currentMonthNumber = _a.currentMonthNumber, isViewFocused = _a.isViewFocused, other = __rest(_a, ["parentProps", "day", "focusedDay", "selectedDays", "isDateDisabled", "currentMonthNumber", "isViewFocused"]);
    var disabled = parentProps.disabled, disableHighlightToday = parentProps.disableHighlightToday, isMonthSwitchingAnimating = parentProps.isMonthSwitchingAnimating, showDaysOutsideCurrentMonth = parentProps.showDaysOutsideCurrentMonth, slots = parentProps.slots, slotProps = parentProps.slotProps, timezone = parentProps.timezone;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var now = (0, useUtils_1.useNow)(timezone);
    var isFocusableDay = focusedDay != null && adapter.isSameDay(day, focusedDay);
    var isFocusedDay = isViewFocused && isFocusableDay;
    var isSelected = selectedDays.some(function (selectedDay) { return adapter.isSameDay(selectedDay, day); });
    var isToday = adapter.isSameDay(day, now);
    var isDisabled = React.useMemo(function () { return disabled || isDateDisabled(day); }, [disabled, isDateDisabled, day]);
    var isOutsideCurrentMonth = React.useMemo(function () { return adapter.getMonth(day) !== currentMonthNumber; }, [adapter, day, currentMonthNumber]);
    var ownerState = (0, usePickerDayOwnerState_1.usePickerDayOwnerState)({
        day: day,
        selected: isSelected,
        disabled: isDisabled,
        today: isToday,
        outsideCurrentMonth: isOutsideCurrentMonth,
        disableMargin: undefined, // This prop can only be defined using slotProps.day so the ownerState for useSlotProps cannot have its value.
        disableHighlightToday: disableHighlightToday,
        showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth,
    });
    var Day = (_b = slots === null || slots === void 0 ? void 0 : slots.day) !== null && _b !== void 0 ? _b : PickersDay_1.PickersDay;
    // We don't want to pass to ownerState down, to avoid re-rendering all the day whenever a prop changes.
    var _c = (0, useSlotProps_1.default)({
        elementType: Day,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.day,
        additionalProps: __assign({ disableHighlightToday: disableHighlightToday, showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth, role: 'gridcell', isAnimating: isMonthSwitchingAnimating, 
            // it is used in date range dragging logic by accessing `dataset.timestamp`
            'data-timestamp': adapter.toJsDate(day).valueOf() }, other),
        ownerState: __assign(__assign({}, ownerState), { day: day, isDayDisabled: isDisabled, isDaySelected: isSelected }),
    }), dayOwnerState = _c.ownerState, dayProps = __rest(_c, ["ownerState"]);
    var isFirstVisibleCell = React.useMemo(function () {
        var startOfMonth = adapter.startOfMonth(adapter.setMonth(day, currentMonthNumber));
        if (!showDaysOutsideCurrentMonth) {
            return adapter.isSameDay(day, startOfMonth);
        }
        return adapter.isSameDay(day, adapter.startOfWeek(startOfMonth));
    }, [currentMonthNumber, day, showDaysOutsideCurrentMonth, adapter]);
    var isLastVisibleCell = React.useMemo(function () {
        var endOfMonth = adapter.endOfMonth(adapter.setMonth(day, currentMonthNumber));
        if (!showDaysOutsideCurrentMonth) {
            return adapter.isSameDay(day, endOfMonth);
        }
        return adapter.isSameDay(day, adapter.endOfWeek(endOfMonth));
    }, [currentMonthNumber, day, showDaysOutsideCurrentMonth, adapter]);
    return (<Day {...dayProps} day={day} disabled={isDisabled} autoFocus={!isOutsideCurrentMonth && isFocusedDay} today={isToday} outsideCurrentMonth={isOutsideCurrentMonth} isFirstVisibleCell={isFirstVisibleCell} isLastVisibleCell={isLastVisibleCell} selected={isSelected} tabIndex={isFocusableDay ? 0 : -1} aria-selected={isSelected} aria-current={isToday ? 'date' : undefined}/>);
}
/**
 * @ignore - do not document.
 */
function DayCalendar(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiDayCalendar' });
    var adapter = (0, hooks_1.usePickerAdapter)();
    var onFocusedDayChange = props.onFocusedDayChange, className = props.className, classesProp = props.classes, currentMonth = props.currentMonth, selectedDays = props.selectedDays, focusedDay = props.focusedDay, loading = props.loading, onSelectedDaysChange = props.onSelectedDaysChange, onMonthSwitchingAnimationEnd = props.onMonthSwitchingAnimationEnd, readOnly = props.readOnly, reduceAnimations = props.reduceAnimations, _a = props.renderLoading, renderLoading = _a === void 0 ? function () { return <span data-testid="loading-progress">...</span>; } : _a, slideDirection = props.slideDirection, TransitionProps = props.TransitionProps, disablePast = props.disablePast, disableFuture = props.disableFuture, minDate = props.minDate, maxDate = props.maxDate, shouldDisableDate = props.shouldDisableDate, shouldDisableMonth = props.shouldDisableMonth, shouldDisableYear = props.shouldDisableYear, _b = props.dayOfWeekFormatter, dayOfWeekFormatter = _b === void 0 ? function (date) { return adapter.format(date, 'weekdayShort').charAt(0).toUpperCase(); } : _b, hasFocus = props.hasFocus, onFocusedViewChange = props.onFocusedViewChange, gridLabelId = props.gridLabelId, displayWeekNumber = props.displayWeekNumber, fixedWeekNumber = props.fixedWeekNumber, timezone = props.timezone;
    var now = (0, useUtils_1.useNow)(timezone);
    var classes = useUtilityClasses(classesProp);
    var isRtl = (0, RtlProvider_1.useRtl)();
    var isDateDisabled = (0, useIsDateDisabled_1.useIsDateDisabled)({
        shouldDisableDate: shouldDisableDate,
        shouldDisableMonth: shouldDisableMonth,
        shouldDisableYear: shouldDisableYear,
        minDate: minDate,
        maxDate: maxDate,
        disablePast: disablePast,
        disableFuture: disableFuture,
        timezone: timezone,
    });
    var translations = (0, hooks_1.usePickerTranslations)();
    var handleDaySelect = (0, useEventCallback_1.default)(function (day) {
        if (readOnly) {
            return;
        }
        onSelectedDaysChange(day);
    });
    var focusDay = function (day) {
        if (!isDateDisabled(day)) {
            onFocusedDayChange(day);
            onFocusedViewChange === null || onFocusedViewChange === void 0 ? void 0 : onFocusedViewChange(true);
        }
    };
    var handleKeyDown = (0, useEventCallback_1.default)(function (event, day) {
        switch (event.key) {
            case 'ArrowUp':
                focusDay(adapter.addDays(day, -7));
                event.preventDefault();
                break;
            case 'ArrowDown':
                focusDay(adapter.addDays(day, 7));
                event.preventDefault();
                break;
            case 'ArrowLeft': {
                var newFocusedDayDefault = adapter.addDays(day, isRtl ? 1 : -1);
                var nextAvailableMonth = adapter.addMonths(day, isRtl ? 1 : -1);
                var closestDayToFocus = (0, date_utils_1.findClosestEnabledDate)({
                    adapter: adapter,
                    date: newFocusedDayDefault,
                    minDate: isRtl ? newFocusedDayDefault : adapter.startOfMonth(nextAvailableMonth),
                    maxDate: isRtl ? adapter.endOfMonth(nextAvailableMonth) : newFocusedDayDefault,
                    isDateDisabled: isDateDisabled,
                    timezone: timezone,
                });
                focusDay(closestDayToFocus || newFocusedDayDefault);
                event.preventDefault();
                break;
            }
            case 'ArrowRight': {
                var newFocusedDayDefault = adapter.addDays(day, isRtl ? -1 : 1);
                var nextAvailableMonth = adapter.addMonths(day, isRtl ? -1 : 1);
                var closestDayToFocus = (0, date_utils_1.findClosestEnabledDate)({
                    adapter: adapter,
                    date: newFocusedDayDefault,
                    minDate: isRtl ? adapter.startOfMonth(nextAvailableMonth) : newFocusedDayDefault,
                    maxDate: isRtl ? newFocusedDayDefault : adapter.endOfMonth(nextAvailableMonth),
                    isDateDisabled: isDateDisabled,
                    timezone: timezone,
                });
                focusDay(closestDayToFocus || newFocusedDayDefault);
                event.preventDefault();
                break;
            }
            case 'Home':
                focusDay(adapter.startOfWeek(day));
                event.preventDefault();
                break;
            case 'End':
                focusDay(adapter.endOfWeek(day));
                event.preventDefault();
                break;
            case 'PageUp':
                focusDay(adapter.addMonths(day, 1));
                event.preventDefault();
                break;
            case 'PageDown':
                focusDay(adapter.addMonths(day, -1));
                event.preventDefault();
                break;
            default:
                break;
        }
    });
    var handleFocus = (0, useEventCallback_1.default)(function (event, day) { return focusDay(day); });
    var handleBlur = (0, useEventCallback_1.default)(function (event, day) {
        if (focusedDay != null && adapter.isSameDay(focusedDay, day)) {
            onFocusedViewChange === null || onFocusedViewChange === void 0 ? void 0 : onFocusedViewChange(false);
        }
    });
    var currentMonthNumber = adapter.getMonth(currentMonth);
    var currentYearNumber = adapter.getYear(currentMonth);
    var validSelectedDays = React.useMemo(function () {
        return selectedDays
            .filter(function (day) { return !!day; })
            .map(function (day) { return adapter.startOfDay(day); });
    }, [adapter, selectedDays]);
    // need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
    var transitionKey = "".concat(currentYearNumber, "-").concat(currentMonthNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    var slideNodeRef = React.useMemo(function () { return React.createRef(); }, [transitionKey]);
    var weeksToDisplay = React.useMemo(function () {
        var toDisplay = adapter.getWeekArray(currentMonth);
        var nextMonth = adapter.addMonths(currentMonth, 1);
        while (fixedWeekNumber && toDisplay.length < fixedWeekNumber) {
            var additionalWeeks = adapter.getWeekArray(nextMonth);
            var hasCommonWeek = adapter.isSameDay(toDisplay[toDisplay.length - 1][0], additionalWeeks[0][0]);
            additionalWeeks.slice(hasCommonWeek ? 1 : 0).forEach(function (week) {
                if (toDisplay.length < fixedWeekNumber) {
                    toDisplay.push(week);
                }
            });
            nextMonth = adapter.addMonths(nextMonth, 1);
        }
        return toDisplay;
    }, [currentMonth, fixedWeekNumber, adapter]);
    return (<PickersCalendarDayRoot role="grid" aria-labelledby={gridLabelId} className={classes.root}>
      <PickersCalendarDayHeader role="row" className={classes.header}>
        {displayWeekNumber && (<PickersCalendarWeekNumberLabel variant="caption" role="columnheader" aria-label={translations.calendarWeekNumberHeaderLabel} className={classes.weekNumberLabel}>
            {translations.calendarWeekNumberHeaderText}
          </PickersCalendarWeekNumberLabel>)}
        {(0, date_utils_1.getWeekdays)(adapter, now).map(function (weekday, i) { return (<PickersCalendarWeekDayLabel key={i.toString()} variant="caption" role="columnheader" aria-label={adapter.format(weekday, 'weekday')} className={classes.weekDayLabel}>
            {dayOfWeekFormatter(weekday)}
          </PickersCalendarWeekDayLabel>); })}
      </PickersCalendarDayHeader>

      {loading ? (<PickersCalendarLoadingContainer className={classes.loadingContainer}>
          {renderLoading()}
        </PickersCalendarLoadingContainer>) : (<PickersCalendarSlideTransition transKey={transitionKey} onExited={onMonthSwitchingAnimationEnd} reduceAnimations={reduceAnimations} slideDirection={slideDirection} className={(0, clsx_1.default)(className, classes.slideTransition)} {...TransitionProps} nodeRef={slideNodeRef}>
          <PickersCalendarWeekContainer data-testid="pickers-calendar" ref={slideNodeRef} role="rowgroup" className={classes.monthContainer}>
            {weeksToDisplay.map(function (week, index) { return (<PickersCalendarWeek role="row" key={"week-".concat(week[0])} className={classes.weekContainer} 
            // fix issue of announcing row 1 as row 2
            // caused by week day labels row
            aria-rowindex={index + 1}>
                {displayWeekNumber && (<PickersCalendarWeekNumber className={classes.weekNumber} role="rowheader" aria-label={translations.calendarWeekNumberAriaLabelText(adapter.getWeekNumber(week[0]))}>
                    {translations.calendarWeekNumberText(adapter.getWeekNumber(week[0]))}
                  </PickersCalendarWeekNumber>)}
                {week.map(function (day, dayIndex) { return (<WrappedDay key={day.toString()} parentProps={props} day={day} selectedDays={validSelectedDays} isViewFocused={hasFocus} focusedDay={focusedDay} onKeyDown={handleKeyDown} onFocus={handleFocus} onBlur={handleBlur} onDaySelect={handleDaySelect} isDateDisabled={isDateDisabled} currentMonthNumber={currentMonthNumber} 
                // fix issue of announcing column 1 as column 2 when `displayWeekNumber` is enabled
                aria-colindex={dayIndex + 1}/>); })}
              </PickersCalendarWeek>); })}
          </PickersCalendarWeekContainer>
        </PickersCalendarSlideTransition>)}
    </PickersCalendarDayRoot>);
}
