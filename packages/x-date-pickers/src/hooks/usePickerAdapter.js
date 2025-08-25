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
exports.usePickerAdapter = exports.useLocalizationContext = void 0;
var React = require("react");
var enUS_1 = require("../locales/enUS");
var LocalizationProvider_1 = require("../LocalizationProvider/LocalizationProvider");
var useLocalizationContext = function () {
    var localization = React.useContext(LocalizationProvider_1.PickerAdapterContext);
    if (localization === null) {
        throw new Error([
            'MUI X: Can not find the date and time pickers localization context.',
            'It looks like you forgot to wrap your component in LocalizationProvider.',
            'This can also happen if you are bundling multiple versions of the `@mui/x-date-pickers` package',
        ].join('\n'));
    }
    if (localization.adapter === null) {
        throw new Error([
            'MUI X: Can not find the date and time pickers adapter from its localization context.',
            'It looks like you forgot to pass a `dateAdapter` to your LocalizationProvider.',
        ].join('\n'));
    }
    var localeText = React.useMemo(function () { return (__assign(__assign({}, enUS_1.DEFAULT_LOCALE), localization.localeText)); }, [localization.localeText]);
    return React.useMemo(function () {
        return (__assign(__assign({}, localization), { localeText: localeText }));
    }, [localization, localeText]);
};
exports.useLocalizationContext = useLocalizationContext;
var usePickerAdapter = function () { return (0, exports.useLocalizationContext)().adapter; };
exports.usePickerAdapter = usePickerAdapter;
