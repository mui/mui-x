"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTime = void 0;
var time_utils_1 = require("../internals/utils/time-utils");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validateTime = function (_a) {
    var adapter = _a.adapter, value = _a.value, timezone = _a.timezone, props = _a.props;
    if (value === null) {
        return null;
    }
    var minTime = props.minTime, maxTime = props.maxTime, minutesStep = props.minutesStep, shouldDisableTime = props.shouldDisableTime, _b = props.disableIgnoringDatePartForTimeValidation, disableIgnoringDatePartForTimeValidation = _b === void 0 ? false : _b, disablePast = props.disablePast, disableFuture = props.disableFuture;
    var now = adapter.date(undefined, timezone);
    var isAfter = (0, time_utils_1.createIsAfterIgnoreDatePart)(disableIgnoringDatePartForTimeValidation, adapter);
    switch (true) {
        case !adapter.isValid(value):
            return 'invalidDate';
        case Boolean(minTime && isAfter(minTime, value)):
            return 'minTime';
        case Boolean(maxTime && isAfter(value, maxTime)):
            return 'maxTime';
        case Boolean(disableFuture && adapter.isAfter(value, now)):
            return 'disableFuture';
        case Boolean(disablePast && adapter.isBefore(value, now)):
            return 'disablePast';
        case Boolean(shouldDisableTime && shouldDisableTime(value, 'hours')):
            return 'shouldDisableTime-hours';
        case Boolean(shouldDisableTime && shouldDisableTime(value, 'minutes')):
            return 'shouldDisableTime-minutes';
        case Boolean(shouldDisableTime && shouldDisableTime(value, 'seconds')):
            return 'shouldDisableTime-seconds';
        case Boolean(minutesStep && adapter.getMinutes(value) % minutesStep !== 0):
            return 'minutesStep';
        default:
            return null;
    }
};
exports.validateTime = validateTime;
exports.validateTime.valueManager = valueManagers_1.singleItemValueManager;
