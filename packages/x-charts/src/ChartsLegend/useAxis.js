"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAxis = useAxis;
var useZAxis_1 = require("../hooks/useZAxis");
var useAxis_1 = require("../hooks/useAxis");
/**
 * Helper to select an axis definition according to its direction and id.
 */
function useAxis(_a) {
    var axisDirection = _a.axisDirection, axisId = _a.axisId;
    var _b = (0, useAxis_1.useXAxes)(), xAxis = _b.xAxis, xAxisIds = _b.xAxisIds;
    var _c = (0, useAxis_1.useYAxes)(), yAxis = _c.yAxis, yAxisIds = _c.yAxisIds;
    var _d = (0, useZAxis_1.useZAxes)(), zAxis = _d.zAxis, zAxisIds = _d.zAxisIds;
    switch (axisDirection) {
        case 'x': {
            var id = typeof axisId === 'string' ? axisId : xAxisIds[axisId !== null && axisId !== void 0 ? axisId : 0];
            return xAxis[id];
        }
        case 'y': {
            var id = typeof axisId === 'string' ? axisId : yAxisIds[axisId !== null && axisId !== void 0 ? axisId : 0];
            return yAxis[id];
        }
        case 'z':
        default: {
            var id = typeof axisId === 'string' ? axisId : zAxisIds[axisId !== null && axisId !== void 0 ? axisId : 0];
            return zAxis[id];
        }
    }
}
