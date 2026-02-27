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
exports.RadarDataProvider = RadarDataProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var RadarChart_plugins_1 = require("../RadarChart.plugins");
var ChartDataProvider_1 = require("../../ChartDataProvider");
var defaultizeMargin_1 = require("../../internals/defaultizeMargin");
var seriesConfig_1 = require("../seriesConfig");
var RADAR_SERIES_CONFIG = { radar: seriesConfig_1.radarSeriesConfig };
var DEFAULT_RADAR_MARGIN = { top: 30, bottom: 30, left: 50, right: 50 };
function RadarDataProvider(props) {
    var series = props.series, children = props.children, width = props.width, height = props.height, colors = props.colors, skipAnimation = props.skipAnimation, margin = props.margin, radar = props.radar, highlight = props.highlight, plugins = props.plugins, other = __rest(props, ["series", "children", "width", "height", "colors", "skipAnimation", "margin", "radar", "highlight", "plugins"]);
    var rotationAxes = React.useMemo(function () { return [
        {
            id: 'radar-rotation-axis',
            scaleType: 'point',
            data: radar.metrics.map(function (metric) { return (typeof metric === 'string' ? metric : metric.name); }),
            startAngle: radar.startAngle,
            endAngle: radar.startAngle !== undefined ? radar.startAngle + 360 : undefined,
            labelGap: radar.labelGap,
            valueFormatter: function (name, _a) {
                var _b, _c;
                var location = _a.location;
                return (_c = (_b = radar.labelFormatter) === null || _b === void 0 ? void 0 : _b.call(radar, name, { location: location })) !== null && _c !== void 0 ? _c : name;
            },
        },
    ]; }, [radar]);
    var radiusAxis = React.useMemo(function () {
        return radar.metrics.map(function (m) {
            var _a = typeof m === 'string' ? { name: m } : m, name = _a.name, _b = _a.min, min = _b === void 0 ? 0 : _b, _c = _a.max, max = _c === void 0 ? radar.max : _c;
            return {
                id: name,
                label: name,
                scaleType: 'linear',
                min: min,
                max: max,
            };
        });
    }, [radar]);
    var defaultizedSeries = React.useMemo(function () {
        return series.map(function (s) {
            var _a;
            return (__assign({ type: 'radar', highlightScope: (_a = s.highlightScope) !== null && _a !== void 0 ? _a : (highlight === 'series' ? { highlight: 'series', fade: 'global' } : undefined) }, s));
        });
    }, [series, highlight]);
    var defaultizedMargin = React.useMemo(function () { return (0, defaultizeMargin_1.defaultizeMargin)(margin, DEFAULT_RADAR_MARGIN); }, [margin]);
    return ((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, __assign({}, other, { series: defaultizedSeries, width: width, height: height, margin: defaultizedMargin, colors: colors, skipAnimation: skipAnimation, plugins: plugins !== null && plugins !== void 0 ? plugins : RadarChart_plugins_1.RADAR_PLUGINS, rotationAxis: rotationAxes, radiusAxis: radiusAxis, seriesConfig: RADAR_SERIES_CONFIG, children: children })));
}
