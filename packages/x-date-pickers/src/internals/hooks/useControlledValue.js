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
exports.useControlledValue = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useControlled_1 = require("@mui/utils/useControlled");
var usePickerAdapter_1 = require("../../hooks/usePickerAdapter");
/**
 * Hooks controlling the value while making sure that:
 * - The value returned by `onChange` always have the timezone of `props.value` or `props.defaultValue` if defined
 * - The value rendered is always the one from `props.timezone` if defined
 */
var useControlledValue = function (_a) {
    var name = _a.name, timezoneProp = _a.timezone, valueProp = _a.value, defaultValue = _a.defaultValue, referenceDate = _a.referenceDate, onChangeProp = _a.onChange, valueManager = _a.valueManager;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var _b = (0, useControlled_1.default)({
        name: name,
        state: 'value',
        controlled: valueProp,
        default: defaultValue !== null && defaultValue !== void 0 ? defaultValue : valueManager.emptyValue,
    }), valueWithInputTimezone = _b[0], setValue = _b[1];
    var inputTimezone = React.useMemo(function () { return valueManager.getTimezone(adapter, valueWithInputTimezone); }, [adapter, valueManager, valueWithInputTimezone]);
    var setInputTimezone = (0, useEventCallback_1.default)(function (newValue) {
        if (inputTimezone == null) {
            return newValue;
        }
        return valueManager.setTimezone(adapter, inputTimezone, newValue);
    });
    var timezoneToRender = React.useMemo(function () {
        if (timezoneProp) {
            return timezoneProp;
        }
        if (inputTimezone) {
            return inputTimezone;
        }
        if (referenceDate) {
            return adapter.getTimezone(Array.isArray(referenceDate) ? referenceDate[0] : referenceDate);
        }
        return 'default';
    }, [timezoneProp, inputTimezone, referenceDate, adapter]);
    var valueWithTimezoneToRender = React.useMemo(function () { return valueManager.setTimezone(adapter, timezoneToRender, valueWithInputTimezone); }, [valueManager, adapter, timezoneToRender, valueWithInputTimezone]);
    var handleValueChange = (0, useEventCallback_1.default)(function (newValue) {
        var otherParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherParams[_i - 1] = arguments[_i];
        }
        var newValueWithInputTimezone = setInputTimezone(newValue);
        setValue(newValueWithInputTimezone);
        onChangeProp === null || onChangeProp === void 0 ? void 0 : onChangeProp.apply(void 0, __spreadArray([newValueWithInputTimezone], otherParams, false));
    });
    return {
        value: valueWithTimezoneToRender,
        handleValueChange: handleValueChange,
        timezone: timezoneToRender,
    };
};
exports.useControlledValue = useControlledValue;
