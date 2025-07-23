import * as React from 'react';
import { ChartPlugin, ZoomData } from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
export declare const useZoomOnWheel: ({ store, instance, svgRef, }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], "store" | "instance" | "svgRef">, setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>) => void;
