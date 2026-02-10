"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarGridData = useRadarGridData;
var useScale_1 = require("../../hooks/useScale");
var hooks_1 = require("../../hooks");
var useChartPolarAxis_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis");
var useChartContext_1 = require("../../context/ChartProvider/useChartContext");
function useRadarGridData() {
    var _a = (0, useChartContext_1.useChartContext)(), instance = _a.instance, store = _a.store;
    var rotationScale = (0, useScale_1.useRotationScale)();
    var radiusAxis = (0, hooks_1.useRadiusAxes)().radiusAxis;
    var _b = store.use(useChartPolarAxis_1.selectorChartPolarCenter), cx = _b.cx, cy = _b.cy;
    if (!rotationScale || rotationScale.domain().length === 0) {
        return null;
    }
    var metrics = rotationScale.domain();
    var angles = metrics.map(function (key) { return rotationScale(key); });
    return {
        center: {
            x: cx,
            y: cy,
        },
        corners: metrics.map(function (metric, dataIndex) {
            var radiusScale = radiusAxis[metric].scale;
            var r = radiusScale.range()[1];
            var angle = angles[dataIndex];
            var _a = instance.polar2svg(r, angle), x = _a[0], y = _a[1];
            return {
                x: x,
                y: y,
            };
        }),
        radius: radiusAxis[metrics[0]].scale.range()[1],
    };
}
