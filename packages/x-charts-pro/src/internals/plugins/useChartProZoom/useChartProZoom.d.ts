import { ChartPlugin, AxisId, DefaultizedZoomOptions, ZoomData } from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';
export declare function initializeZoomData(options: Record<AxisId, Pick<DefaultizedZoomOptions, 'axisId' | 'minStart' | 'maxEnd'>>, zoomData?: readonly ZoomData[]): ZoomData[];
export declare const useChartProZoom: ChartPlugin<UseChartProZoomSignature>;
