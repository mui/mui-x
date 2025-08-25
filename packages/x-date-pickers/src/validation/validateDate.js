"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDate = void 0;
var valueManagers_1 = require("../internals/utils/valueManagers");
var validateDate = function (_a) {
    var props = _a.props, value = _a.value, timezone = _a.timezone, adapter = _a.adapter;
    if (value === null) {
        return null;
    }
    var shouldDisableDate = props.shouldDisableDate, shouldDisableMonth = props.shouldDisableMonth, shouldDisableYear = props.shouldDisableYear, disablePast = props.disablePast, disableFuture = props.disableFuture, minDate = props.minDate, maxDate = props.maxDate;
    var now = adapter.date(undefined, timezone);
    switch (true) {
        case !adapter.isValid(value):
            return 'invalidDate';
        case Boolean(shouldDisableDate && shouldDisableDate(value)):
            return 'shouldDisableDate';
        case Boolean(shouldDisableMonth && shouldDisableMonth(value)):
            return 'shouldDisableMonth';
        case Boolean(shouldDisableYear && shouldDisableYear(value)):
            return 'shouldDisableYear';
        case Boolean(disableFuture && adapter.isAfterDay(value, now)):
            return 'disableFuture';
        case Boolean(disablePast && adapter.isBeforeDay(value, now)):
            return 'disablePast';
        case Boolean(minDate && adapter.isBeforeDay(value, minDate)):
            return 'minDate';
        case Boolean(maxDate && adapter.isAfterDay(value, maxDate)):
            return 'maxDate';
        default:
            return null;
    }
};
exports.validateDate = validateDate;
exports.validateDate.valueManager = valueManagers_1.singleItemValueManager;
