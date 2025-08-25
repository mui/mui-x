"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsDateDisabled = void 0;
var React = require("react");
var validation_1 = require("../validation");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var useIsDateDisabled = function (_a) {
    var shouldDisableDate = _a.shouldDisableDate, shouldDisableMonth = _a.shouldDisableMonth, shouldDisableYear = _a.shouldDisableYear, minDate = _a.minDate, maxDate = _a.maxDate, disableFuture = _a.disableFuture, disablePast = _a.disablePast, timezone = _a.timezone;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    return React.useCallback(function (day) {
        return (0, validation_1.validateDate)({
            adapter: adapter,
            value: day,
            timezone: timezone,
            props: {
                shouldDisableDate: shouldDisableDate,
                shouldDisableMonth: shouldDisableMonth,
                shouldDisableYear: shouldDisableYear,
                minDate: minDate,
                maxDate: maxDate,
                disableFuture: disableFuture,
                disablePast: disablePast,
            },
        }) !== null;
    }, [
        adapter,
        shouldDisableDate,
        shouldDisableMonth,
        shouldDisableYear,
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        timezone,
    ]);
};
exports.useIsDateDisabled = useIsDateDisabled;
