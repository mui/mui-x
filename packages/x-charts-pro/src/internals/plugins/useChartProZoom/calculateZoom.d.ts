import { DefaultizedZoomOptions, ZoomData } from '@mui/x-charts/internals';
/**
 * Calculates the new zoom range based on the current zoom, step, and constraints.
 *
 * A step of 0.1 or -0.1 means that 10% of the current range will be subtracted/added, respectively, and assuming no
 * constraints (e.g., minSpan, maxEnd) are faced.
 *
 * @param zoom Current zoom range with start and end values.
 * @param step Percentage of the current zoom range to adjust (positive to zoom in, negative to zoom out). Ranges from 0 to 1.
 * @param minSpan Minimum allowed span between start and end values.
 * @param maxSpan Maximum allowed span between start and end values.
 * @param minStart Minimum allowed start value.
 * @param maxEnd Maximum allowed end value.
 */
export declare function calculateZoom<T extends Readonly<Pick<ZoomData, 'start' | 'end'>>>(zoom: T, step: number, { minSpan, maxSpan, minStart, maxEnd, }: Pick<DefaultizedZoomOptions, 'minSpan' | 'maxSpan' | 'minStart' | 'maxEnd'>): T & {
    start: number;
    end: number;
};
