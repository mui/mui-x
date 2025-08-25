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
exports.useTimeManager = useTimeManager;
exports.useApplyDefaultValuesToTimeValidationProps = useApplyDefaultValuesToTimeValidationProps;
var React = require("react");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validation_1 = require("../validation");
var hooks_1 = require("../hooks");
function useTimeManager(parameters) {
    if (parameters === void 0) { parameters = {}; }
    var _a = parameters.enableAccessibleFieldDOMStructure, enableAccessibleFieldDOMStructure = _a === void 0 ? true : _a, ampm = parameters.ampm;
    return React.useMemo(function () { return ({
        valueType: 'time',
        validator: validation_1.validateTime,
        internal_valueManager: valueManagers_1.singleItemValueManager,
        internal_fieldValueManager: valueManagers_1.singleItemFieldValueManager,
        internal_enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
        internal_useApplyDefaultValuesToFieldInternalProps: useApplyDefaultValuesToTimeFieldInternalProps,
        internal_useOpenPickerButtonAriaLabel: createUseOpenPickerButtonAriaLabel(ampm),
    }); }, [ampm, enableAccessibleFieldDOMStructure]);
}
function createUseOpenPickerButtonAriaLabel(ampm) {
    return function useOpenPickerButtonAriaLabel(value) {
        var adapter = (0, hooks_1.usePickerAdapter)();
        var translations = (0, hooks_1.usePickerTranslations)();
        return React.useMemo(function () {
            var formatKey = (ampm !== null && ampm !== void 0 ? ampm : adapter.is12HourCycleInCurrentLocale()) ? 'fullTime12h' : 'fullTime24h';
            var formattedValue = adapter.isValid(value) ? adapter.format(value, formatKey) : null;
            return translations.openTimePickerDialogue(formattedValue);
        }, [value, translations, adapter]);
    };
}
function useApplyDefaultValuesToTimeFieldInternalProps(internalProps) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var validationProps = useApplyDefaultValuesToTimeValidationProps(internalProps);
    var ampm = React.useMemo(function () { var _a; return (_a = internalProps.ampm) !== null && _a !== void 0 ? _a : adapter.is12HourCycleInCurrentLocale(); }, [internalProps.ampm, adapter]);
    return React.useMemo(function () {
        var _a;
        return (__assign(__assign(__assign({}, internalProps), validationProps), { format: (_a = internalProps.format) !== null && _a !== void 0 ? _a : (ampm ? adapter.formats.fullTime12h : adapter.formats.fullTime24h) }));
    }, [internalProps, validationProps, ampm, adapter]);
}
function useApplyDefaultValuesToTimeValidationProps(props) {
    return React.useMemo(function () {
        var _a, _b;
        return ({
            disablePast: (_a = props.disablePast) !== null && _a !== void 0 ? _a : false,
            disableFuture: (_b = props.disableFuture) !== null && _b !== void 0 ? _b : false,
        });
    }, [props.disablePast, props.disableFuture]);
}
