export type ZoomOptions = {
  axisId?: string;
  axis: 'x' | 'y';
  min?: number;
  max?: number;
  step?: number;
  minSpan?: number;
  maxSpan?: number;
  panning?: boolean;
};

export type ZoomData = {
  range: [number, number];
  axisId: string;
};

export type ZoomState = {
  zoomState: ZoomData[];
  onZoomChange: (params: ZoomData) => void;
};

export type ZoomProps = {
  zoom?: ZoomOptions[] | 'x' | 'y' | 'xy';
};
