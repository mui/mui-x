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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizationProvider = exports.MuiPickersAdapterContext = exports.PickerAdapterContext = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
exports.PickerAdapterContext = React.createContext(null);
// TODO v9: Remove this public export
/**
 * The context that provides the date adapter and default dates to the pickers.
 * @deprecated Use `usePickersAdapter` hook if you need access to the adapter instead.
 */
exports.MuiPickersAdapterContext = exports.PickerAdapterContext;
/**
 * Demos:
 *
 * - [Date format and localization](https://mui.com/x/react-date-pickers/adapters-locale/)
 * - [Calendar systems](https://mui.com/x/react-date-pickers/calendar-systems/)
 * - [Translated components](https://mui.com/x/react-date-pickers/localization/)
 * - [UTC and timezones](https://mui.com/x/react-date-pickers/timezone/)
 *
 * API:
 *
 * - [LocalizationProvider API](https://mui.com/x/api/date-pickers/localization-provider/)
 */
exports.LocalizationProvider = function LocalizationProvider(inProps) {
    var _a;
    var inLocaleText = inProps.localeText, otherInProps = __rest(inProps, ["localeText"]);
    var _b = (_a = React.useContext(exports.PickerAdapterContext)) !== null && _a !== void 0 ? _a : { utils: undefined, adapter: undefined, localeText: undefined }, parentAdapter = _b.adapter, parentLocaleText = _b.localeText;
    var props = (0, styles_1.useThemeProps)({
        // We don't want to pass the `localeText` prop to the theme, that way it will always return the theme value,
        // We will then merge this theme value with our value manually
        props: otherInProps,
        name: 'MuiLocalizationProvider',
    });
    var children = props.children, DateAdapter = props.dateAdapter, dateFormats = props.dateFormats, dateLibInstance = props.dateLibInstance, adapterLocale = props.adapterLocale, themeLocaleText = props.localeText;
    var localeText = React.useMemo(function () { return (__assign(__assign(__assign({}, themeLocaleText), parentLocaleText), inLocaleText)); }, [themeLocaleText, parentLocaleText, inLocaleText]);
    var adapter = React.useMemo(function () {
        if (!DateAdapter) {
            if (parentAdapter) {
                return parentAdapter;
            }
            return null;
        }
        var dateAdapter = new DateAdapter({
            locale: adapterLocale,
            formats: dateFormats,
            instance: dateLibInstance,
        });
        if (!dateAdapter.isMUIAdapter) {
            throw new Error([
                'MUI X: The date adapter should be imported from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`, not from `@date-io`',
                "For example, `import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'` instead of `import AdapterDayjs from '@date-io/dayjs'`",
                'More information on the installation documentation: https://mui.com/x/react-date-pickers/quickstart/#installation',
            ].join("\n"));
        }
        return dateAdapter;
    }, [DateAdapter, adapterLocale, dateFormats, dateLibInstance, parentAdapter]);
    var defaultDates = React.useMemo(function () {
        if (!adapter) {
            return null;
        }
        return {
            minDate: adapter.date('1900-01-01T00:00:00.000'),
            maxDate: adapter.date('2099-12-31T00:00:00.000'),
        };
    }, [adapter]);
    var contextValue = React.useMemo(function () {
        return {
            utils: adapter,
            adapter: adapter,
            defaultDates: defaultDates,
            localeText: localeText,
        };
    }, [defaultDates, adapter, localeText]);
    return (<exports.PickerAdapterContext.Provider value={contextValue}>{children}</exports.PickerAdapterContext.Provider>);
};
exports.LocalizationProvider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Locale for the date library you are using
     */
    adapterLocale: prop_types_1.default.any,
    children: prop_types_1.default.node,
    /**
     * Date library adapter class function.
     * @see See the localization provider {@link https://mui.com/x/react-date-pickers/quickstart/#integrate-provider-and-adapter date adapter setup section} for more details.
     */
    dateAdapter: prop_types_1.default.func,
    /**
     * Formats that are used for any child pickers
     */
    dateFormats: prop_types_1.default.shape({
        dayOfMonth: prop_types_1.default.string,
        dayOfMonthFull: prop_types_1.default.string,
        fullDate: prop_types_1.default.string,
        fullTime12h: prop_types_1.default.string,
        fullTime24h: prop_types_1.default.string,
        hours12h: prop_types_1.default.string,
        hours24h: prop_types_1.default.string,
        keyboardDate: prop_types_1.default.string,
        keyboardDateTime12h: prop_types_1.default.string,
        keyboardDateTime24h: prop_types_1.default.string,
        meridiem: prop_types_1.default.string,
        minutes: prop_types_1.default.string,
        month: prop_types_1.default.string,
        monthShort: prop_types_1.default.string,
        normalDate: prop_types_1.default.string,
        normalDateWithWeekday: prop_types_1.default.string,
        seconds: prop_types_1.default.string,
        shortDate: prop_types_1.default.string,
        weekday: prop_types_1.default.string,
        weekdayShort: prop_types_1.default.string,
        year: prop_types_1.default.string,
    }),
    /**
     * Date library instance you are using, if it has some global overrides
     * ```jsx
     * dateLibInstance={momentTimeZone}
     * ```
     */
    dateLibInstance: prop_types_1.default.any,
    /**
     * Locale for components texts
     */
    localeText: prop_types_1.default.object,
};
