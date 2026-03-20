"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHeatmapPlotData = useHeatmapPlotData;
var React = require("react");
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
var parseColor_1 = require("../../utils/webgl/parseColor");
function useHeatmapPlotData(drawingArea, series, xScale, yScale) {
    var width = xScale.bandwidth();
    var height = yScale.bandwidth();
    var colorScale = (0, hooks_1.useZColorScale)();
    var store = (0, internals_1.useStore)();
    var getHighlightState = store.use(internals_1.selectorChartsHighlightStateCallback);
    return React.useMemo(function () {
        var centers = new Float32Array(series.data.length * 2);
        var colors = new Float32Array(series.data.length * 4);
        var saturations = new Float32Array(series.data.length);
        var xDomain = xScale.domain();
        var yDomain = yScale.domain();
        for (var dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
            var _a = series.data[dataIndex], xIndex = _a[0], yIndex = _a[1], value = _a[2];
            var x = xScale(xDomain[xIndex]);
            var y = yScale(yDomain[yIndex]);
            var color = colorScale === null || colorScale === void 0 ? void 0 : colorScale(value);
            if (x === undefined || y === undefined || !color) {
                continue;
            }
            centers[dataIndex * 2] = x + width / 2 - drawingArea.left;
            centers[dataIndex * 2 + 1] = y + height / 2 - drawingArea.top;
            var rgbColor = (0, parseColor_1.parseColor)(color);
            colors[dataIndex * 4] = rgbColor[0];
            colors[dataIndex * 4 + 1] = rgbColor[1];
            colors[dataIndex * 4 + 2] = rgbColor[2];
            colors[dataIndex * 4 + 3] = 1.0;
            var highlightState = getHighlightState({
                type: 'heatmap',
                seriesId: series.id,
                xIndex: xIndex,
                yIndex: yIndex,
            });
            if (highlightState === 'highlighted') {
                saturations[dataIndex] = 0.2;
            }
            else if (highlightState === 'faded') {
                saturations[dataIndex] = -0.2;
            }
        }
        return { centers: centers, colors: colors, saturations: saturations };
    }, [
        colorScale,
        drawingArea.left,
        drawingArea.top,
        height,
        getHighlightState,
        series.data,
        series.id,
        width,
        xScale,
        yScale,
    ]);
}
