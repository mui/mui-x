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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePickerDayOwnerState = usePickerDayOwnerState;
var React = require("react");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
function usePickerDayOwnerState(parameters) {
    var disabled = parameters.disabled, selected = parameters.selected, today = parameters.today, outsideCurrentMonth = parameters.outsideCurrentMonth, day = parameters.day, disableMargin = parameters.disableMargin, disableHighlightToday = parameters.disableHighlightToday, showDaysOutsideCurrentMonth = parameters.showDaysOutsideCurrentMonth;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    return React.useMemo(function () { return (__assign(__assign({}, pickerOwnerState), { day: day, isDaySelected: selected !== null && selected !== void 0 ? selected : false, isDayDisabled: disabled !== null && disabled !== void 0 ? disabled : false, isDayCurrent: today !== null && today !== void 0 ? today : false, isDayOutsideMonth: outsideCurrentMonth !== null && outsideCurrentMonth !== void 0 ? outsideCurrentMonth : false, isDayStartOfWeek: adapter.isSameDay(day, adapter.startOfWeek(day)), isDayEndOfWeek: adapter.isSameDay(day, adapter.endOfWeek(day)), disableMargin: disableMargin !== null && disableMargin !== void 0 ? disableMargin : false, disableHighlightToday: disableHighlightToday !== null && disableHighlightToday !== void 0 ? disableHighlightToday : false, showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth !== null && showDaysOutsideCurrentMonth !== void 0 ? showDaysOutsideCurrentMonth : false })); }, [
        adapter,
        pickerOwnerState,
        day,
        selected,
        disabled,
        today,
        outsideCurrentMonth,
        disableMargin,
        disableHighlightToday,
        showDaysOutsideCurrentMonth,
    ]);
}
