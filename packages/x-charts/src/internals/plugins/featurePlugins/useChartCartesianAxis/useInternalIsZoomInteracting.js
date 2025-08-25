"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInternalIsZoomInteracting = useInternalIsZoomInteracting;
var useSelector_1 = require("../../../store/useSelector");
var useStore_1 = require("../../../store/useStore");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
/**
 * Check if the zoom is interacting.
 *
 * This should probably be moved/merged to the AnimationContext when we move it to the new API.
 *
 * @ignore Internal hook, similar to the PRO one.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
function useInternalIsZoomInteracting() {
    var store = (0, useStore_1.useStore)();
    var isInteracting = (0, useSelector_1.useSelector)(store, useChartCartesianAxisRendering_selectors_1.selectorChartZoomIsInteracting);
    return isInteracting;
}
