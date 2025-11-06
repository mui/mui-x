"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToDecimalPlaces = roundToDecimalPlaces;
function roundToDecimalPlaces(value, decimals) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
