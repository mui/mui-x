"use strict";
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
exports.ChartsAxisZoomSliderPreviewContent = ChartsAxisZoomSliderPreviewContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var seriesPreviewPlotMap_1 = require("./seriesPreviewPlotMap");
function ChartsAxisZoomSliderPreviewContent(props) {
    var _a, _b, _c;
    var axisId = props.axisId, x = props.x, y = props.y, width = props.width, height = props.height;
    var store = (0, internals_1.useStore)();
    var processedSeries = store.use(internals_1.selectorChartSeriesProcessed);
    var children = [];
    var clipId = "zoom-preview-mask-".concat(axisId);
    for (var _i = 0, seriesPreviewPlotMap_2 = seriesPreviewPlotMap_1.seriesPreviewPlotMap; _i < seriesPreviewPlotMap_2.length; _i++) {
        var _d = seriesPreviewPlotMap_2[_i], seriesType = _d[0], Component = _d[1];
        var hasSeries = ((_c = (_b = (_a = processedSeries[seriesType]) === null || _a === void 0 ? void 0 : _a.seriesOrder) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0;
        if (hasSeries) {
            children.push((0, jsx_runtime_1.jsx)(Component, __assign({}, props), seriesType));
        }
    }
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("clipPath", { id: clipId, children: (0, jsx_runtime_1.jsx)("rect", { x: x, y: y, width: width, height: height }) }), (0, jsx_runtime_1.jsx)("g", { clipPath: "url(#".concat(clipId, ")"), children: children })] }));
}
