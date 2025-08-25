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
exports.useDateTimeManager = useDateTimeManager;
exports.useApplyDefaultValuesToDateTimeValidationProps = useApplyDefaultValuesToDateTimeValidationProps;
var React = require("react");
var date_utils_1 = require("../internals/utils/date-utils");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validation_1 = require("../validation");
var useUtils_1 = require("../internals/hooks/useUtils");
var hooks_1 = require("../hooks");
function useDateTimeManager(parameters) {
    if (parameters === void 0) { parameters = {}; }
    var _a = parameters.enableAccessibleFieldDOMStructure, enableAccessibleFieldDOMStructure = _a === void 0 ? true : _a;
    return React.useMemo(function () { return ({
        valueType: 'date-time',
        validator: validation_1.validateDateTime,
        internal_valueManager: valueManagers_1.singleItemValueManager,
        internal_fieldValueManager: valueManagers_1.singleItemFieldValueManager,
        internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
        internal_useApplyDefaultValuesToFieldInternalProps: useApplyDefaultValuesToDateTimeFieldInternalProps,
        internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    }); }, [enableAccessibleFieldDOMStructure]);
}
function useOpenPickerButtonAriaLabel(value) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var translations = (0, hooks_1.usePickerTranslations)();
    return React.useMemo(function () {
        var formattedValue = adapter.isValid(value) ? adapter.format(value, 'fullDate') : null;
        return translations.openDatePickerDialogue(formattedValue);
    }, [value, translations, adapter]);
}
function useApplyDefaultValuesToDateTimeFieldInternalProps(internalProps) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var validationProps = useApplyDefaultValuesToDateTimeValidationProps(internalProps);
    var ampm = React.useMemo(function () { var _a; return (_a = internalProps.ampm) !== null && _a !== void 0 ? _a : adapter.is12HourCycleInCurrentLocale(); }, [internalProps.ampm, adapter]);
    return React.useMemo(function () {
        var _a;
        return (__assign(__assign(__assign({}, internalProps), validationProps), { format: (_a = internalProps.format) !== null && _a !== void 0 ? _a : (ampm ? adapter.formats.keyboardDateTime12h : adapter.formats.keyboardDateTime24h) }));
    }, [internalProps, validationProps, ampm, adapter]);
}
function useApplyDefaultValuesToDateTimeValidationProps(props) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var defaultDates = (0, useUtils_1.useDefaultDates)();
    return React.useMemo(function () {
        var _a, _b, _c, _d, _e, _f;
        return ({
            disablePast: (_a = props.disablePast) !== null && _a !== void 0 ? _a : false,
            disableFuture: (_b = props.disableFuture) !== null && _b !== void 0 ? _b : false,
            // TODO: Explore if we can remove it from the public API
            disableIgnoringDatePartForTimeValidation: !!props.minDateTime || !!props.maxDateTime || !!props.disableFuture || !!props.disablePast,
            minDate: (0, date_utils_1.applyDefaultDate)(adapter, (_c = props.minDateTime) !== null && _c !== void 0 ? _c : props.minDate, defaultDates.minDate),
            maxDate: (0, date_utils_1.applyDefaultDate)(adapter, (_d = props.maxDateTime) !== null && _d !== void 0 ? _d : props.maxDate, defaultDates.maxDate),
            minTime: (_e = props.minDateTime) !== null && _e !== void 0 ? _e : props.minTime,
            maxTime: (_f = props.maxDateTime) !== null && _f !== void 0 ? _f : props.maxTime,
        });
    }, [
        props.minDateTime,
        props.maxDateTime,
        props.minTime,
        props.maxTime,
        props.minDate,
        props.maxDate,
        props.disableFuture,
        props.disablePast,
        adapter,
        defaultDates,
    ]);
}
