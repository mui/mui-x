"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAxisSystem = useAxisSystem;
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartPolarAxis_1 = require("../internals/plugins/featurePlugins/useChartPolarAxis");
var useStore_1 = require("../internals/store/useStore");
/**
 * @internals
 *
 * Get the coordinate system implemented.
 * The hook assumes polar and cartesian are never implemented at the same time.
 * @returns The coordinate system
 */
function useAxisSystem() {
    var store = (0, useStore_1.useStore)();
    var rawRotationAxis = store.use(useChartPolarAxis_1.selectorChartRawRotationAxis);
    var rawXAxis = store.use(useChartCartesianAxis_1.selectorChartRawXAxis);
    if (rawRotationAxis !== undefined) {
        return 'polar';
    }
    if (rawXAxis !== undefined) {
        return 'cartesian';
    }
    return 'none';
}
