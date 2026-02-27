"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZAxes = useZAxes;
exports.useZAxis = useZAxis;
var useStore_1 = require("../internals/store/useStore");
var useChartZAxis_1 = require("../internals/plugins/featurePlugins/useChartZAxis");
function useZAxes() {
    var _a;
    var store = (0, useStore_1.useStore)();
    var _b = (_a = store.use(useChartZAxis_1.selectorChartZAxis)) !== null && _a !== void 0 ? _a : {
        axis: {},
        axisIds: [],
    }, zAxis = _b.axis, zAxisIds = _b.axisIds;
    return { zAxis: zAxis, zAxisIds: zAxisIds };
}
function useZAxis(identifier) {
    var _a = useZAxes(), zAxis = _a.zAxis, zAxisIds = _a.zAxisIds;
    var id = typeof identifier === 'string' ? identifier : zAxisIds[identifier !== null && identifier !== void 0 ? identifier : 0];
    return zAxis[id];
}
