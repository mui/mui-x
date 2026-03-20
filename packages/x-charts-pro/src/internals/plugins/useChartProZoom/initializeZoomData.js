"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeZoomData = initializeZoomData;
// This is helpful to avoid the need to provide the possibly auto-generated id for each axis.
function initializeZoomData(options, zoomData) {
    var zoomDataMap = new Map();
    zoomData === null || zoomData === void 0 ? void 0 : zoomData.forEach(function (zoom) {
        var option = options[zoom.axisId];
        if (option) {
            zoomDataMap.set(zoom.axisId, zoom);
        }
    });
    return Object.values(options).map(function (_a) {
        var axisId = _a.axisId, start = _a.minStart, end = _a.maxEnd;
        if (zoomDataMap.has(axisId)) {
            return zoomDataMap.get(axisId);
        }
        return {
            axisId: axisId,
            start: start,
            end: end,
        };
    });
}
