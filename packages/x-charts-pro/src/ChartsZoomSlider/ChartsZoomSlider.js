"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsZoomSlider = ChartsZoomSlider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var hooks_1 = require("@mui/x-charts/hooks");
var ChartsAxisZoomSlider_1 = require("./internals/ChartsAxisZoomSlider");
/**
 * Renders the zoom slider for all x and y axes that have it enabled.
 */
function ChartsZoomSlider() {
    var _a = (0, hooks_1.useXAxes)(), xAxisIds = _a.xAxisIds, xAxes = _a.xAxis;
    var _b = (0, hooks_1.useYAxes)(), yAxisIds = _b.yAxisIds, yAxes = _b.yAxis;
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [xAxisIds.map(function (axisId) {
                var _a;
                var xAxis = xAxes[axisId];
                var slider = (_a = xAxis.zoom) === null || _a === void 0 ? void 0 : _a.slider;
                if (!(slider === null || slider === void 0 ? void 0 : slider.enabled)) {
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(ChartsAxisZoomSlider_1.ChartsAxisZoomSlider, { axisId: axisId, axisDirection: "x" }, axisId);
            }), yAxisIds.map(function (axisId) {
                var _a;
                var yAxis = yAxes[axisId];
                var slider = (_a = yAxis.zoom) === null || _a === void 0 ? void 0 : _a.slider;
                if (!(slider === null || slider === void 0 ? void 0 : slider.enabled)) {
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(ChartsAxisZoomSlider_1.ChartsAxisZoomSlider, { axisId: axisId, axisDirection: "y" }, axisId);
            })] }));
}
