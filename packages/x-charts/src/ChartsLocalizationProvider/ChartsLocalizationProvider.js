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
exports.ChartsLocalizationContext = void 0;
exports.ChartsLocalizationProvider = ChartsLocalizationProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var enUS_1 = require("../locales/enUS");
exports.ChartsLocalizationContext = React.createContext(null);
/**
 * Demos:
 *
 * - [localization](https://mui.com/x/react-charts/localization/)
 *
 * API:
 *
 * - [ChartsLocalizationProvider API](https://mui.com/x/api/charts/charts-localization-provider/)
 */
function ChartsLocalizationProvider(inProps) {
    var _a;
    var inLocaleText = inProps.localeText, other = __rest(inProps, ["localeText"]);
    var parentLocaleText = ((_a = React.useContext(exports.ChartsLocalizationContext)) !== null && _a !== void 0 ? _a : {
        localeText: undefined,
    }).localeText;
    var props = (0, styles_1.useThemeProps)({
        // We don't want to pass the `localeText` prop to the theme, that way it will always return the theme value,
        // We will then merge this theme value with our value manually
        props: other,
        name: 'MuiChartsLocalizationProvider',
    });
    var children = props.children, themeLocaleText = props.localeText;
    var localeText = React.useMemo(function () { return (__assign(__assign(__assign(__assign({}, enUS_1.DEFAULT_LOCALE), themeLocaleText), parentLocaleText), inLocaleText)); }, [themeLocaleText, parentLocaleText, inLocaleText]);
    var contextValue = React.useMemo(function () {
        return {
            localeText: localeText,
        };
    }, [localeText]);
    return ((0, jsx_runtime_1.jsx)(exports.ChartsLocalizationContext.Provider, { value: contextValue, children: children }));
}
ChartsLocalizationProvider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    /**
     * Localized text for chart components.
     */
    localeText: prop_types_1.default.object,
};
