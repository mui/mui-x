"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPath = createPath;
exports.useCreateBarPaths = useCreateBarPaths;
var appendAtKey_1 = require("../../internals/appendAtKey");
var MAX_POINTS_PER_PATH = 1000;
function generateBarPath(x, y, width, height, topLeftBorderRadius, topRightBorderRadius, bottomRightBorderRadius, bottomLeftBorderRadius) {
    var tLBR = Math.min(topLeftBorderRadius, width / 2, height / 2);
    var tRBR = Math.min(topRightBorderRadius, width / 2, height / 2);
    var bRBR = Math.min(bottomRightBorderRadius, width / 2, height / 2);
    var bLBR = Math.min(bottomLeftBorderRadius, width / 2, height / 2);
    return "M".concat(x + tLBR, ",").concat(y, "\n   h").concat(width - tLBR - tRBR, "\n   a").concat(tRBR, ",").concat(tRBR, " 0 0 1 ").concat(tRBR, ",").concat(tRBR, "\n   v").concat(height - tRBR - bRBR, "\n   a").concat(bRBR, ",").concat(bRBR, " 0 0 1 -").concat(bRBR, ",").concat(bRBR, "\n   h-").concat(width - bRBR - bLBR, "\n   a").concat(bLBR, ",").concat(bLBR, " 0 0 1 -").concat(bLBR, ",-").concat(bLBR, "\n   v-").concat(height - bLBR - tLBR, "\n   a").concat(tLBR, ",").concat(tLBR, " 0 0 1 ").concat(tLBR, ",-").concat(tLBR, "\n   Z");
}
function createPath(barData, borderRadius) {
    return generateBarPath(barData.x, barData.y, barData.width, barData.height, barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'top' ? borderRadius : 0, barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'top' ? borderRadius : 0, barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'bottom'
        ? borderRadius
        : 0, barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'bottom' ? borderRadius : 0);
}
/**
 * Hook that creates bar paths for a given series data. Used by the batch bar renderer.
 * @param seriesData
 * @param borderRadius
 */
function useCreateBarPaths(seriesData, borderRadius) {
    var paths = new Map();
    var temporaryPaths = new Map();
    for (var j = 0; j < seriesData.data.length; j += 1) {
        var barData = seriesData.data[j];
        var pathString = createPath(barData, borderRadius);
        var tempPath = (0, appendAtKey_1.appendAtKey)(temporaryPaths, barData.color, pathString);
        if (tempPath.length >= MAX_POINTS_PER_PATH) {
            (0, appendAtKey_1.appendAtKey)(paths, barData.color, tempPath.join(''));
            temporaryPaths.delete(barData.color);
        }
    }
    for (var _i = 0, _a = temporaryPaths.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], fill = _b[0], tempPath = _b[1];
        if (tempPath.length > 0) {
            (0, appendAtKey_1.appendAtKey)(paths, fill, tempPath.join(''));
        }
    }
    return paths;
}
