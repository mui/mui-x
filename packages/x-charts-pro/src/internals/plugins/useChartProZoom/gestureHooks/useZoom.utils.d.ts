import { DefaultizedZoomOptions, ZoomData } from '@mui/x-charts/internals';
/**
 * Helper to get the range (in percents of a reference range) corresponding to a given scale.
 * @param centerRatio {number} The ratio of the point that should not move between the previous and next range.
 * @param scaleRatio {number} The target scale ratio.
 * @returns The range to display.
 */
export declare const zoomAtPoint: (centerRatio: number, scaleRatio: number, currentZoomData: ZoomData, options: DefaultizedZoomOptions) => number[];
/**
 * Checks if the new span is valid.
 */
export declare function isSpanValid(minRange: number, maxRange: number, isZoomIn: boolean, option: DefaultizedZoomOptions): boolean;
/**
 * Get the scale ratio and if it's a zoom in or out from a wheel event.
 */
export declare function getWheelScaleRatio(event: WheelEvent, step: number): {
    scaleRatio: number;
    isZoomIn: boolean;
};
/**
 * Get the ratio of the point in the horizontal center of the area.
 */
export declare function getHorizontalCenterRatio(point: {
    x: number;
    y: number;
}, area: {
    left: number;
    width: number;
}): number;
/**
 * Get the ratio of the point in the vertical center of the area.
 */
export declare function getVerticalCenterRatio(point: {
    x: number;
    y: number;
}, area: {
    top: number;
    height: number;
}): number;
/**
 * Translate the zoom data by a given movement.
 */
export declare function translateZoom(initialZoomData: readonly ZoomData[], movement: {
    x: number;
    y: number;
}, drawingArea: {
    width: number;
    height: number;
}, optionsLookup: Record<string | number, DefaultizedZoomOptions>): ZoomData[];
