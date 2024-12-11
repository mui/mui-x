import { AxisId, DefaultizedZoomOption, ZoomOption } from '@mui/x-charts/internals';

const defaultZoomOptions: Required<ZoomOption> = {
  minStart: 0,
  maxEnd: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
  filterMode: 'keep',
};

export const defaultizeZoom = (
  zoom: boolean | ZoomOption | undefined,
  axisId: AxisId,
  axisDirection: 'x' | 'y',
): DefaultizedZoomOption | undefined => {
  if (!zoom) {
    return undefined;
  }

  if (zoom === true) {
    return {
      axisId,
      axisDirection,
      ...defaultZoomOptions,
    };
  }

  return {
    axisId,
    axisDirection,
    ...defaultZoomOptions,
    ...zoom,
  };
};
