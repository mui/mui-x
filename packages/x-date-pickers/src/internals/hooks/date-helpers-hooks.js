"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNextMonthDisabled = useNextMonthDisabled;
exports.usePreviousMonthDisabled = usePreviousMonthDisabled;
exports.useMeridiemMode = useMeridiemMode;
var React = require("react");
var time_utils_1 = require("../utils/time-utils");
var usePickerAdapter_1 = require("../../hooks/usePickerAdapter");
function useNextMonthDisabled(month, _a) {
    var disableFuture = _a.disableFuture, maxDate = _a.maxDate, timezone = _a.timezone;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    return React.useMemo(function () {
        var now = adapter.date(undefined, timezone);
        var lastEnabledMonth = adapter.startOfMonth(disableFuture && adapter.isBefore(now, maxDate) ? now : maxDate);
        return !adapter.isAfter(lastEnabledMonth, month);
    }, [disableFuture, maxDate, month, adapter, timezone]);
}
function usePreviousMonthDisabled(month, _a) {
    var disablePast = _a.disablePast, minDate = _a.minDate, timezone = _a.timezone;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    return React.useMemo(function () {
        var now = adapter.date(undefined, timezone);
        var firstEnabledMonth = adapter.startOfMonth(disablePast && adapter.isAfter(now, minDate) ? now : minDate);
        return !adapter.isBefore(firstEnabledMonth, month);
    }, [disablePast, minDate, month, adapter, timezone]);
}
function useMeridiemMode(date, ampm, onChange, selectionState) {
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var cleanDate = React.useMemo(function () { return (!adapter.isValid(date) ? null : date); }, [adapter, date]);
    var meridiemMode = (0, time_utils_1.getMeridiem)(cleanDate, adapter);
    var handleMeridiemChange = React.useCallback(function (mode) {
        var timeWithMeridiem = cleanDate == null ? null : (0, time_utils_1.convertToMeridiem)(cleanDate, mode, Boolean(ampm), adapter);
        onChange(timeWithMeridiem, selectionState !== null && selectionState !== void 0 ? selectionState : 'partial');
    }, [ampm, cleanDate, onChange, selectionState, adapter]);
    return { meridiemMode: meridiemMode, handleMeridiemChange: handleMeridiemChange };
}
