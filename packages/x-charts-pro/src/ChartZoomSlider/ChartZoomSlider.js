"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartZoomSlider = ChartZoomSlider;
var React = require("react");
var hooks_1 = require("@mui/x-charts/hooks");
var ChartAxisZoomSlider_1 = require("./internals/ChartAxisZoomSlider");
/**
 * Renders the zoom slider for all x and y axes that have it enabled.
 */
function ChartZoomSlider() {
    var _a = (0, hooks_1.useXAxes)(), xAxisIds = _a.xAxisIds, xAxes = _a.xAxis;
    var _b = (0, hooks_1.useYAxes)(), yAxisIds = _b.yAxisIds, yAxes = _b.yAxis;
    return (<React.Fragment>
      {xAxisIds.map(function (axisId) {
            var _a;
            var xAxis = xAxes[axisId];
            var slider = (_a = xAxis.zoom) === null || _a === void 0 ? void 0 : _a.slider;
            if (!(slider === null || slider === void 0 ? void 0 : slider.enabled)) {
                return null;
            }
            return <ChartAxisZoomSlider_1.ChartAxisZoomSlider key={axisId} axisId={axisId} axisDirection="x"/>;
        })}
      {yAxisIds.map(function (axisId) {
            var _a;
            var yAxis = yAxes[axisId];
            var slider = (_a = yAxis.zoom) === null || _a === void 0 ? void 0 : _a.slider;
            if (!(slider === null || slider === void 0 ? void 0 : slider.enabled)) {
                return null;
            }
            return <ChartAxisZoomSlider_1.ChartAxisZoomSlider key={axisId} axisId={axisId} axisDirection="y"/>;
        })}
    </React.Fragment>);
}
