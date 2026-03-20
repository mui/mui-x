"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarMetricData = useRadarMetricData;
var useDrawingArea_1 = require("../../hooks/useDrawingArea");
var useAxis_1 = require("../../hooks/useAxis");
var angleConversion_1 = require("../../internals/angleConversion");
function useRadarMetricData() {
    var rotationAxis = (0, useAxis_1.useRotationAxis)();
    var rotationScale = rotationAxis.scale, valueFormatter = rotationAxis.valueFormatter, _a = rotationAxis.labelGap, labelGap = _a === void 0 ? 10 : _a;
    var radiusAxis = (0, useAxis_1.useRadiusAxes)().radiusAxis;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var cx = drawingArea.left + drawingArea.width / 2;
    var cy = drawingArea.top + drawingArea.height / 2;
    var metrics = rotationScale.domain();
    var angles = metrics.map(function (key) { return rotationScale(key); });
    return {
        corners: metrics.map(function (metric, dataIndex) {
            var _a;
            var radiusScale = radiusAxis[metric].scale;
            var r = radiusScale.range()[1] + labelGap;
            var angle = angles[dataIndex];
            var defaultTickLabel = metric;
            return {
                x: cx + r * Math.sin(angle),
                y: cy - r * Math.cos(angle),
                angle: (0, angleConversion_1.rad2deg)(angle),
                label: (_a = valueFormatter === null || valueFormatter === void 0 ? void 0 : valueFormatter(metric, {
                    location: 'tick',
                    scale: rotationScale,
                    defaultTickLabel: defaultTickLabel,
                })) !== null && _a !== void 0 ? _a : defaultTickLabel,
            };
        }),
    };
}
