"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsZoomInteracting = useIsZoomInteracting;
var internals_1 = require("@mui/x-charts/internals");
var useChartProZoom_1 = require("../../internals/plugins/useChartProZoom");
/**
 * Get access to the zoom state.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
function useIsZoomInteracting() {
    var store = (0, internals_1.useStore)();
    var isInteracting = (0, internals_1.useSelector)(store, useChartProZoom_1.selectorChartZoomIsInteracting);
    return isInteracting;
}
