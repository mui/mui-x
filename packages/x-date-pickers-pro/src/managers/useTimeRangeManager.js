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
exports.useTimeRangeManager = useTimeRangeManager;
var React = require("react");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var internals_1 = require("@mui/x-date-pickers/internals");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validation_1 = require("../validation");
var date_utils_1 = require("../internals/utils/date-utils");
function useTimeRangeManager(parameters) {
    if (parameters === void 0) { parameters = {}; }
    var _a = parameters.enableAccessibleFieldDOMStructure, enableAccessibleFieldDOMStructure = _a === void 0 ? true : _a, dateSeparator = parameters.dateSeparator, ampm = parameters.ampm;
    return React.useMemo(function () { return ({
        valueType: 'time',
        validator: validation_1.validateTimeRange,
        internal_valueManager: valueManagers_1.rangeValueManager,
        internal_fieldValueManager: (0, valueManagers_1.getRangeFieldValueManager)({ dateSeparator: dateSeparator }),
        internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
        internal_useApplyDefaultValuesToFieldInternalProps: useApplyDefaultValuesToTimeRangeFieldInternalProps,
        internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel(ampm),
    }); }, [enableAccessibleFieldDOMStructure, dateSeparator, ampm]);
}
function createUseOpenPickerButtonAriaLabel(ampm) {
    return function useOpenPickerButtonAriaLabel(value) {
        var adapter = (0, hooks_1.usePickerAdapter)();
        var translations = (0, hooks_1.usePickerTranslations)();
        return React.useMemo(function () {
            var formatKey = (ampm !== null && ampm !== void 0 ? ampm : adapter.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
            return translations.openRangePickerDialogue((0, date_utils_1.formatRange)(adapter, value, formatKey));
        }, [value, translations, adapter]);
    };
}
function useApplyDefaultValuesToTimeRangeFieldInternalProps(internalProps) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var validationProps = (0, internals_1.useApplyDefaultValuesToTimeValidationProps)(internalProps);
    var ampm = React.useMemo(function () { var _a; return (_a = internalProps.ampm) !== null && _a !== void 0 ? _a : adapter.is12HourCycleInCurrentLocale(); }, [internalProps.ampm, adapter]);
    return React.useMemo(function () {
        var _a;
        return (__assign(__assign(__assign({}, internalProps), validationProps), { format: (_a = internalProps.format) !== null && _a !== void 0 ? _a : (ampm ? adapter.formats.fullTime12h : adapter.formats.fullTime24h) }));
    }, [internalProps, validationProps, ampm, adapter]);
}
