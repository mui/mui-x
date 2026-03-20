"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCandlestickScaleErrors = checkCandlestickScaleErrors;
var internals_1 = require("@mui/x-charts/internals");
function checkCandlestickScaleErrors(seriesId, xScale) {
    if (!(0, internals_1.isBandScale)(xScale)) {
        throw new Error("MUI X Charts: Series with ID \"".concat(seriesId, "\" should have an x-axis of type \"band\". ") +
            'Candlestick charts require a band scale for the x-axis. Set the scaleType to "band" for this axis.');
    }
}
