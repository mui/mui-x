export type ZoomOptions = {
  axisId?: string;
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
  axisId?: string;
};

export type ZoomState = {
  zoomState: ZoomData[];
  onZoomChange: (params: ZoomData[]) => void;
};

export type ZoomProps = {
  zoom?: ZoomOptions[] | 'x' | 'y' | 'xy';
};
