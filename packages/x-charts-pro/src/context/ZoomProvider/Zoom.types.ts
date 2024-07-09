import { AxisId } from '@mui/x-charts/internals';

export type ZoomOptions = {
  /**
   * The starting percentage of the zoom range. In the range of 0 to 100.
   *
   * @default 0
   */
  start?: number;
  /**
   * The ending percentage of the zoom range. In the range of 0 to 100.
   *
   * @default 100
   */
  end?: number;
  step?: number;
  minSpan?: number;
  maxSpan?: number;
  panning?: boolean;
};

export type ZoomData = {
  start: number;
  end: number;
  axisId: AxisId;
};

export type ZoomProps = {
  zoom: ZoomData[];
  onZoomChange: (zoom: ZoomData[]) => void;
};

export type DefaultizedZoomOptions = Required<ZoomOptions> & { axisId: AxisId; axis: 'x' | 'y' };
