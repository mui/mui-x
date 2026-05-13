import { type AxisId, type SeriesId } from '@mui/x-charts/internals';

export interface PreviewPlotProps {
  axisId: AxisId;
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * If provided, only the series with these IDs will be shown in the preview.
   */
  seriesIds?: SeriesId[];
}
