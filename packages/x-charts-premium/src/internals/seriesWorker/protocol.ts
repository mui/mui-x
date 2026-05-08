// Wire-format types shared between the main thread and the series-processor
// worker. Kept free of any runtime imports so it can be referenced from both
// sides without dragging extra code into the worker bundle.

import type {
  ChartSeriesProcessorInput,
  ChartSeriesProcessorOutput,
} from '@mui/x-charts/internals';

export interface SeriesProcessorRequest {
  type: 'process';
  id: number;
  payload: ChartSeriesProcessorInput;
}

export type SeriesProcessorResponse =
  | { type: 'success'; id: number; data: ChartSeriesProcessorOutput }
  | { type: 'error'; id: number; message: string };
