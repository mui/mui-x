"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarAxis = useRadarAxis;
var warning_1 = require("@mui/x-internals/warning");
var useAxis_1 = require("../../hooks/useAxis");
var useScale_1 = require("../../hooks/useScale");
var useChartContext_1 = require("../../context/ChartProvider/useChartContext");
var useChartPolarAxis_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis");
var scaleGuards_1 = require("../../internals/scaleGuards");
var degToRad_1 = require("../../internals/degToRad");
var clampAngle_1 = require("../../internals/clampAngle");
var angleConversion_1 = require("../../internals/angleConversion");
/**
 * Returns an array with on item par metrics with the different point to label.
 */
function useRadarAxis(params) {
    var _a;
    var metric = params.metric, angle = params.angle, _b = params.divisions, divisions = _b === void 0 ? 1 : _b;
    var _c = (0, useChartContext_1.useChartContext)(), instance = _c.instance, store = _c.store;
    var rotationScale = (0, useScale_1.useRotationScale)();
    var radiusAxis = (0, useAxis_1.useRadiusAxes)().radiusAxis;
    var _d = store.use(useChartPolarAxis_1.selectorChartPolarCenter), cx = _d.cx, cy = _d.cy;
    if (metric === undefined || !rotationScale || rotationScale.domain().length === 0) {
        return null;
    }
    var existingMetrics = rotationScale.domain();
    if (!existingMetrics.includes(metric)) {
        (0, warning_1.warnOnce)([
            "MUI X Charts: You radar axis try displaying values for the metric \"".concat(metric, "\" which does nto exist."),
            "either add this metric to your radar, or pick one from the existing metrics: ".concat(existingMetrics.join(', ')),
        ]);
    }
    var anglesWithDefault = angle !== undefined ? (0, degToRad_1.degToRad)(angle) : ((_a = rotationScale(metric)) !== null && _a !== void 0 ? _a : 0);
    var radiusRatio = Array.from({ length: divisions }, function (_, index) { return (index + 1) / divisions; });
    var radiusScale = radiusAxis[metric].scale;
    var R = radiusScale.range()[1];
    if ((0, scaleGuards_1.isOrdinalScale)(radiusScale)) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('MUI X Charts: Radar chart does not support ordinal axes');
        }
        return null;
    }
    return {
        metric: metric,
        angle: (0, clampAngle_1.clampAngle)((0, angleConversion_1.rad2deg)(anglesWithDefault)),
        center: { x: cx, y: cy },
        labels: radiusRatio.map(function (ratio) {
            var _a, _b, _c;
            var radius = ratio * R;
            var _d = instance.polar2svg(radius, anglesWithDefault), x = _d[0], y = _d[1];
            var value = radiusScale.invert(radius);
            var defaultTickLabel = value.toString();
            return {
                x: x,
                y: y,
                value: value,
                formattedValue: (_c = (_b = (_a = radiusAxis[metric]).valueFormatter) === null || _b === void 0 ? void 0 : _b.call(_a, radiusScale.invert(radius), {
                    location: 'tick',
                    scale: radiusScale,
                    defaultTickLabel: defaultTickLabel,
                    tickNumber: divisions,
                })) !== null && _c !== void 0 ? _c : defaultTickLabel,
            };
        }),
    };
}
