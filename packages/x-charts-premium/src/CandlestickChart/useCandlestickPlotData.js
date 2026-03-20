"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCandlestickPlotData = useCandlestickPlotData;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var styles_1 = require("@mui/material/styles");
var parseColor_1 = require("../utils/webgl/parseColor");
var FADE_OPACITY = 0.3;
var HIGHLIGHT_BRIGHTNESS = 1.2;
function useCandlestickPlotData(drawingArea, series, xScale, yScale) {
    var theme = (0, styles_1.useTheme)();
    var store = (0, internals_1.useStore)();
    var getHighlightState = store.use(internals_1.selectorChartsHighlightStateCallback);
    var lineColor = React.useMemo(function () { return (0, parseColor_1.parseColor)(theme.palette.text.primary); }, [theme.palette.text.primary]);
    var bullishColor = React.useMemo(function () { return (0, parseColor_1.parseColor)(theme.palette.success.main); }, [theme.palette.success.main]);
    var bearishColor = React.useMemo(function () { return (0, parseColor_1.parseColor)(theme.palette.error.main); }, [theme.palette.error.main]);
    return React.useMemo(function () {
        var candleCenters = new Float32Array(series.data.length * 2);
        var candleHeights = new Float32Array(series.data.length);
        // Two wicks per candle: upper (candle top → high) and lower (candle bottom → low)
        var wickCenters = new Float32Array(series.data.length * 2 * 2);
        var wickHeights = new Float32Array(series.data.length * 2);
        var candleColors = new Float32Array(series.data.length * 4);
        var wickColors = new Float32Array(series.data.length * 2 * 4);
        var xDomain = xScale.domain();
        for (var dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
            var datum = series.data[dataIndex];
            if (datum === null) {
                // Set alpha to 0 to hide the candle and both wicks
                candleColors[dataIndex * 4 + 3] = 0.0;
                wickColors[dataIndex * 2 * 4 + 3] = 0.0;
                wickColors[(dataIndex * 2 + 1) * 4 + 3] = 0.0;
                continue;
            }
            // Can't return undefined because we're calling it with a value from the domain
            var scaledX = xScale(xDomain[dataIndex]);
            var open_1 = datum[0], high = datum[1], low = datum[2], close_1 = datum[3];
            var x = scaledX - drawingArea.left;
            var scaledOpen = yScale(open_1);
            var scaledClose = yScale(close_1);
            var candleBottom = Math.min(scaledOpen, scaledClose) - drawingArea.top;
            var candleTop = Math.max(scaledOpen, scaledClose) - drawingArea.top;
            var wickBottom = yScale(low) - drawingArea.top;
            var wickTop = yScale(high) - drawingArea.top;
            candleCenters[dataIndex * 2] = x;
            candleCenters[dataIndex * 2 + 1] = (candleTop + candleBottom) / 2;
            candleHeights[dataIndex] = candleTop - candleBottom;
            // We have two wicks per candle so that when a candle is faded the wick isn't visible behind the candle body.
            var upperWickIndex = dataIndex * 2;
            wickCenters[upperWickIndex * 2] = x;
            wickCenters[upperWickIndex * 2 + 1] = (wickTop + candleBottom) / 2;
            wickHeights[upperWickIndex] = wickTop - candleBottom;
            var lowerWickIndex = dataIndex * 2 + 1;
            wickCenters[lowerWickIndex * 2] = x;
            wickCenters[lowerWickIndex * 2 + 1] = (candleTop + wickBottom) / 2;
            wickHeights[lowerWickIndex] = candleTop - wickBottom;
            if (close_1 >= open_1) {
                // Bullish - green
                candleColors[dataIndex * 4] = bullishColor[0];
                candleColors[dataIndex * 4 + 1] = bullishColor[1];
                candleColors[dataIndex * 4 + 2] = bullishColor[2];
                candleColors[dataIndex * 4 + 3] = bullishColor[3];
            }
            else {
                // Bearish - red
                candleColors[dataIndex * 4] = bearishColor[0];
                candleColors[dataIndex * 4 + 1] = bearishColor[1];
                candleColors[dataIndex * 4 + 2] = bearishColor[2];
                candleColors[dataIndex * 4 + 3] = bearishColor[3];
            }
            for (var w = 0; w < 2; w += 1) {
                var wickIdx = (dataIndex * 2 + w) * 4;
                wickColors[wickIdx] = lineColor[0];
                wickColors[wickIdx + 1] = lineColor[1];
                wickColors[wickIdx + 2] = lineColor[2];
                wickColors[wickIdx + 3] = lineColor[3];
            }
            var identifier = { type: 'ohlc', seriesId: series.id, dataIndex: dataIndex };
            var highlightState = getHighlightState(identifier);
            var highlighted = highlightState === 'highlighted';
            var faded = highlightState === 'faded';
            if (highlighted) {
                // Mimics CSS's filter: brightness(1.2), which multiplies the RGB values by 1.2, without affecting the alpha channel
                candleColors[dataIndex * 4] *= HIGHLIGHT_BRIGHTNESS;
                candleColors[dataIndex * 4 + 1] *= HIGHLIGHT_BRIGHTNESS;
                candleColors[dataIndex * 4 + 2] *= HIGHLIGHT_BRIGHTNESS;
                for (var w = 0; w < 2; w += 1) {
                    var wickIdx = (dataIndex * 2 + w) * 4;
                    wickColors[wickIdx] *= HIGHLIGHT_BRIGHTNESS;
                    wickColors[wickIdx + 1] *= HIGHLIGHT_BRIGHTNESS;
                    wickColors[wickIdx + 2] *= HIGHLIGHT_BRIGHTNESS;
                }
            }
            else if (faded) {
                candleColors[dataIndex * 4 + 3] *= FADE_OPACITY;
                for (var w = 0; w < 2; w += 1) {
                    wickColors[(dataIndex * 2 + w) * 4 + 3] *= FADE_OPACITY;
                }
            }
        }
        return {
            candleCenters: candleCenters,
            candleHeights: candleHeights,
            candleColors: candleColors,
            wickCenters: wickCenters,
            wickHeights: wickHeights,
            wickColors: wickColors,
        };
    }, [
        bearishColor,
        bullishColor,
        drawingArea.left,
        drawingArea.top,
        getHighlightState,
        lineColor,
        series.data,
        series.id,
        xScale,
        yScale,
    ]);
}
