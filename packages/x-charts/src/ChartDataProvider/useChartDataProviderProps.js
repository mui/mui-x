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
exports.useChartDataProviderProps = void 0;
var styles_1 = require("@mui/material/styles");
var allPlugins_1 = require("../internals/plugins/allPlugins");
var useChartDataProviderProps = function (inProps) {
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartDataProvider' });
    var children = props.children, localeText = props.localeText, _a = props.plugins, plugins = _a === void 0 ? allPlugins_1.DEFAULT_PLUGINS : _a, seriesConfig = props.seriesConfig, slots = props.slots, slotProps = props.slotProps, other = __rest(props, ["children", "localeText", "plugins", "seriesConfig", "slots", "slotProps"]);
    var theme = (0, styles_1.useTheme)();
    var chartProviderProps = {
        plugins: plugins,
        seriesConfig: seriesConfig,
        pluginParams: __assign({ theme: theme.palette.mode }, other),
    };
    return {
        children: children,
        localeText: localeText,
        chartProviderProps: chartProviderProps,
        slots: slots,
        slotProps: slotProps,
    };
};
exports.useChartDataProviderProps = useChartDataProviderProps;
