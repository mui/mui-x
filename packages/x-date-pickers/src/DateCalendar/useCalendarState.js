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
exports.useCalendarState = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useIsDateDisabled_1 = require("./useIsDateDisabled");
var valueManagers_1 = require("../internals/utils/valueManagers");
var getDefaultReferenceDate_1 = require("../internals/utils/getDefaultReferenceDate");
var date_utils_1 = require("../internals/utils/date-utils");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var createCalendarStateReducer = function (reduceAnimations, adapter) {
    return function (state, action) {
        switch (action.type) {
            case 'setVisibleDate':
                return __assign(__assign({}, state), { slideDirection: action.direction, currentMonth: action.month, isMonthSwitchingAnimating: !adapter.isSameMonth(action.month, state.currentMonth) &&
                        !reduceAnimations &&
                        !action.skipAnimation, focusedDay: action.focusedDay });
            case 'changeMonthTimezone': {
                var newTimezone = action.newTimezone;
                if (adapter.getTimezone(state.currentMonth) === newTimezone) {
                    return state;
                }
                var newCurrentMonth = adapter.setTimezone(state.currentMonth, newTimezone);
                if (adapter.getMonth(newCurrentMonth) !== adapter.getMonth(state.currentMonth)) {
                    newCurrentMonth = adapter.setMonth(newCurrentMonth, adapter.getMonth(state.currentMonth));
                }
                return __assign(__assign({}, state), { currentMonth: newCurrentMonth });
            }
            case 'finishMonthSwitchingAnimation':
                return __assign(__assign({}, state), { isMonthSwitchingAnimating: false });
            default:
                throw new Error('missing support');
        }
    };
};
var useCalendarState = function (params) {
    var value = params.value, referenceDateProp = params.referenceDate, disableFuture = params.disableFuture, disablePast = params.disablePast, maxDate = params.maxDate, minDate = params.minDate, onMonthChange = params.onMonthChange, onYearChange = params.onYearChange, reduceAnimations = params.reduceAnimations, shouldDisableDate = params.shouldDisableDate, timezone = params.timezone, getCurrentMonthFromVisibleDate = params.getCurrentMonthFromVisibleDate;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var reducerFn = React.useRef(createCalendarStateReducer(Boolean(reduceAnimations), adapter)).current;
    var referenceDate = React.useMemo(function () {
        return valueManagers_1.singleItemValueManager.getInitialReferenceValue({
            value: value,
            adapter: adapter,
            timezone: timezone,
            props: params,
            referenceDate: referenceDateProp,
            granularity: getDefaultReferenceDate_1.SECTION_TYPE_GRANULARITY.day,
        });
    }, 
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone]);
    var _a = React.useReducer(reducerFn, {
        isMonthSwitchingAnimating: false,
        focusedDay: referenceDate,
        currentMonth: adapter.startOfMonth(referenceDate),
        slideDirection: 'left',
    }), calendarState = _a[0], dispatch = _a[1];
    var isDateDisabled = (0, useIsDateDisabled_1.useIsDateDisabled)({
        shouldDisableDate: shouldDisableDate,
        minDate: minDate,
        maxDate: maxDate,
        disableFuture: disableFuture,
        disablePast: disablePast,
        timezone: timezone,
    });
    // Ensure that `calendarState.currentMonth` timezone is updated when `referenceDate` (or timezone changes)
    // https://github.com/mui/mui-x/issues/10804
    React.useEffect(function () {
        dispatch({
            type: 'changeMonthTimezone',
            newTimezone: adapter.getTimezone(referenceDate),
        });
    }, [referenceDate, adapter]);
    var setVisibleDate = (0, useEventCallback_1.default)(function (_a) {
        var target = _a.target, reason = _a.reason;
        if (reason === 'cell-interaction' &&
            calendarState.focusedDay != null &&
            adapter.isSameDay(target, calendarState.focusedDay)) {
            return;
        }
        var skipAnimation = reason === 'cell-interaction';
        var month;
        var focusedDay;
        if (reason === 'cell-interaction') {
            month = getCurrentMonthFromVisibleDate(target, calendarState.currentMonth);
            focusedDay = target;
        }
        else {
            month = adapter.isSameMonth(target, calendarState.currentMonth)
                ? calendarState.currentMonth
                : adapter.startOfMonth(target);
            focusedDay = target;
            // If the date is disabled, we try to find a non-disabled date inside the same month.
            if (isDateDisabled(focusedDay)) {
                var startOfMonth = adapter.startOfMonth(target);
                var endOfMonth = adapter.endOfMonth(target);
                focusedDay = (0, date_utils_1.findClosestEnabledDate)({
                    adapter: adapter,
                    date: focusedDay,
                    minDate: adapter.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
                    maxDate: adapter.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
                    disablePast: disablePast,
                    disableFuture: disableFuture,
                    isDateDisabled: isDateDisabled,
                    timezone: timezone,
                });
            }
        }
        var hasChangedMonth = !adapter.isSameMonth(calendarState.currentMonth, month);
        var hasChangedYear = !adapter.isSameYear(calendarState.currentMonth, month);
        if (hasChangedMonth) {
            onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(month);
        }
        if (hasChangedYear) {
            onYearChange === null || onYearChange === void 0 ? void 0 : onYearChange(adapter.startOfYear(month));
        }
        dispatch({
            type: 'setVisibleDate',
            month: month,
            direction: adapter.isAfterDay(month, calendarState.currentMonth) ? 'left' : 'right',
            focusedDay: calendarState.focusedDay != null &&
                focusedDay != null &&
                adapter.isSameDay(focusedDay, calendarState.focusedDay)
                ? calendarState.focusedDay
                : focusedDay,
            skipAnimation: skipAnimation,
        });
    });
    var onMonthSwitchingAnimationEnd = React.useCallback(function () {
        dispatch({ type: 'finishMonthSwitchingAnimation' });
    }, []);
    return {
        referenceDate: referenceDate,
        calendarState: calendarState,
        setVisibleDate: setVisibleDate,
        isDateDisabled: isDateDisabled,
        onMonthSwitchingAnimationEnd: onMonthSwitchingAnimationEnd,
    };
};
exports.useCalendarState = useCalendarState;
