"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDrawingArea = useDrawingArea;
var useStore_1 = require("../internals/store/useStore");
var useChartDimensions_selectors_1 = require("../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors");
/**
 * Get the drawing area dimensions and coordinates. The drawing area is the area where the chart is rendered.
 *
 * It includes the left, top, width, height, bottom, and right dimensions.
 *
 * @returns The drawing area dimensions.
 */
function useDrawingArea() {
    var store = (0, useStore_1.useStore)();
    return store.use(useChartDimensions_selectors_1.selectorChartDrawingArea);
}
