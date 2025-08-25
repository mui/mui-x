"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeSectionOptions = exports.getHourSectionOptions = void 0;
var getHourSectionOptions = function (_a) {
    var now = _a.now, value = _a.value, adapter = _a.adapter, ampm = _a.ampm, isDisabled = _a.isDisabled, resolveAriaLabel = _a.resolveAriaLabel, timeStep = _a.timeStep, valueOrReferenceDate = _a.valueOrReferenceDate;
    var currentHours = value ? adapter.getHours(value) : null;
    var result = [];
    var isSelected = function (hour, overriddenCurrentHours) {
        var resolvedCurrentHours = overriddenCurrentHours !== null && overriddenCurrentHours !== void 0 ? overriddenCurrentHours : currentHours;
        if (resolvedCurrentHours === null) {
            return false;
        }
        if (ampm) {
            if (hour === 12) {
                return resolvedCurrentHours === 12 || resolvedCurrentHours === 0;
            }
            return resolvedCurrentHours === hour || resolvedCurrentHours - 12 === hour;
        }
        return resolvedCurrentHours === hour;
    };
    var isFocused = function (hour) {
        return isSelected(hour, adapter.getHours(valueOrReferenceDate));
    };
    var endHour = ampm ? 11 : 23;
    for (var hour = 0; hour <= endHour; hour += timeStep) {
        var label = adapter.format(adapter.setHours(now, hour), ampm ? 'hours12h' : 'hours24h');
        var ariaLabel = resolveAriaLabel(parseInt(label, 10).toString());
        label = adapter.formatNumber(label);
        result.push({
            value: hour,
            label: label,
            isSelected: isSelected,
            isDisabled: isDisabled,
            isFocused: isFocused,
            ariaLabel: ariaLabel,
        });
    }
    return result;
};
exports.getHourSectionOptions = getHourSectionOptions;
var getTimeSectionOptions = function (_a) {
    var value = _a.value, adapter = _a.adapter, isDisabled = _a.isDisabled, timeStep = _a.timeStep, resolveLabel = _a.resolveLabel, resolveAriaLabel = _a.resolveAriaLabel, _b = _a.hasValue, hasValue = _b === void 0 ? true : _b;
    var isSelected = function (timeValue) {
        if (value === null) {
            return false;
        }
        return hasValue && value === timeValue;
    };
    var isFocused = function (timeValue) {
        return value === timeValue;
    };
    return __spreadArray([], Array.from({ length: Math.ceil(60 / timeStep) }, function (_, index) {
        var timeValue = timeStep * index;
        return {
            value: timeValue,
            label: adapter.formatNumber(resolveLabel(timeValue)),
            isDisabled: isDisabled,
            isSelected: isSelected,
            isFocused: isFocused,
            ariaLabel: resolveAriaLabel(timeValue.toString()),
        };
    }), true);
};
exports.getTimeSectionOptions = getTimeSectionOptions;
