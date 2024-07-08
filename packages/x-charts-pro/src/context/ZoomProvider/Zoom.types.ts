import { AxisId } from '@mui/x-charts/internals';

export type ZoomOptions = {
  min?: number;
  max?: number;
  step?: number;
  minSpan?: number;
  maxSpan?: number;
  panning?: boolean;
};

export type ZoomData = {
  min: number;
  max: number;
  axisId: AxisId;
};

export type ZoomProps = {
  zoom: ZoomData[];
  onZoomChange: (zoom: ZoomData[]) => void;
};

export type DefaultizedZoomOptions = Required<ZoomOptions> & { axisId: AxisId };
