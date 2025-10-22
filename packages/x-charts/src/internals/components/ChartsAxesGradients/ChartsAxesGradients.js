"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxesGradients = ChartsAxesGradients;
var React = require("react");
var hooks_1 = require("../../../hooks");
var ChartsPiecewiseGradient_1 = require("./ChartsPiecewiseGradient");
var ChartsContinuousGradient_1 = require("./ChartsContinuousGradient");
var ChartsContinuousGradientObjectBound_1 = require("./ChartsContinuousGradientObjectBound");
var useZAxis_1 = require("../../../hooks/useZAxis");
var useChartGradientId_1 = require("../../../hooks/useChartGradientId");
function ChartsAxesGradients() {
    var _a = (0, hooks_1.useDrawingArea)(), top = _a.top, height = _a.height, bottom = _a.bottom, left = _a.left, width = _a.width, right = _a.right;
    var svgHeight = top + height + bottom;
    var svgWidth = left + width + right;
    var getGradientId = (0, useChartGradientId_1.useChartGradientIdBuilder)();
    var getObjectBoundGradientId = (0, useChartGradientId_1.useChartGradientIdObjectBoundBuilder)();
    var _b = (0, hooks_1.useXAxes)(), xAxis = _b.xAxis, xAxisIds = _b.xAxisIds;
    var _c = (0, hooks_1.useYAxes)(), yAxis = _c.yAxis, yAxisIds = _c.yAxisIds;
    var _d = (0, useZAxis_1.useZAxes)(), zAxis = _d.zAxis, zAxisIds = _d.zAxisIds;
    var filteredYAxisIds = yAxisIds.filter(function (axisId) { return yAxis[axisId].colorMap !== undefined; });
    var filteredXAxisIds = xAxisIds.filter(function (axisId) { return xAxis[axisId].colorMap !== undefined; });
    var filteredZAxisIds = zAxisIds.filter(function (axisId) { return zAxis[axisId].colorMap !== undefined; });
    if (filteredYAxisIds.length === 0 &&
        filteredXAxisIds.length === 0 &&
        filteredZAxisIds.length === 0) {
        return null;
    }
    return (<defs>
      {filteredYAxisIds.map(function (axisId) {
            var gradientId = getGradientId(axisId);
            var objectBoundGradientId = getObjectBoundGradientId(axisId);
            var _a = yAxis[axisId], colorMap = _a.colorMap, scale = _a.scale, colorScale = _a.colorScale, reverse = _a.reverse;
            if ((colorMap === null || colorMap === void 0 ? void 0 : colorMap.type) === 'piecewise') {
                return (<ChartsPiecewiseGradient_1.default key={gradientId} isReversed={!reverse} scale={scale} colorMap={colorMap} size={svgHeight} gradientId={gradientId} direction="y"/>);
            }
            if ((colorMap === null || colorMap === void 0 ? void 0 : colorMap.type) === 'continuous') {
                return (<React.Fragment key={gradientId}>
              <ChartsContinuousGradient_1.default isReversed={!reverse} scale={scale} colorScale={colorScale} colorMap={colorMap} size={svgHeight} gradientId={gradientId} direction="y"/>
              <ChartsContinuousGradientObjectBound_1.default isReversed={reverse} colorScale={colorScale} colorMap={colorMap} gradientId={objectBoundGradientId}/>
            </React.Fragment>);
            }
            return null;
        })}
      {filteredXAxisIds.map(function (axisId) {
            var gradientId = getGradientId(axisId);
            var objectBoundGradientId = getObjectBoundGradientId(axisId);
            var _a = xAxis[axisId], colorMap = _a.colorMap, scale = _a.scale, reverse = _a.reverse, colorScale = _a.colorScale;
            if ((colorMap === null || colorMap === void 0 ? void 0 : colorMap.type) === 'piecewise') {
                return (<ChartsPiecewiseGradient_1.default key={gradientId} isReversed={reverse} scale={scale} colorMap={colorMap} size={svgWidth} gradientId={gradientId} direction="x"/>);
            }
            if ((colorMap === null || colorMap === void 0 ? void 0 : colorMap.type) === 'continuous') {
                return (<React.Fragment key={gradientId}>
              <ChartsContinuousGradient_1.default isReversed={reverse} scale={scale} colorScale={colorScale} colorMap={colorMap} size={svgWidth} gradientId={gradientId} direction="x"/>
              <ChartsContinuousGradientObjectBound_1.default isReversed={reverse} colorScale={colorScale} colorMap={colorMap} gradientId={objectBoundGradientId}/>
            </React.Fragment>);
            }
            return null;
        })}
      {filteredZAxisIds.map(function (axisId) {
            var objectBoundGradientId = getObjectBoundGradientId(axisId);
            var _a = zAxis[axisId], colorMap = _a.colorMap, colorScale = _a.colorScale;
            if ((colorMap === null || colorMap === void 0 ? void 0 : colorMap.type) === 'continuous') {
                return (<ChartsContinuousGradientObjectBound_1.default key={objectBoundGradientId} colorScale={colorScale} colorMap={colorMap} gradientId={objectBoundGradientId}/>);
            }
            return null;
        })}
    </defs>);
}
