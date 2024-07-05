import { ZoomOptions, ZoomProps } from './ZoomProps';

const defaultZoomOptions = {
  min: 0,
  max: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
};

export type DefaultizedZoomOptions = Required<Omit<ZoomOptions, 'axisId'>> &
  Pick<ZoomOptions, 'axisId'> & { axis: 'x' | 'y' };

export const defaultizeZoomOptions = (
  zoom: ZoomProps['zoom'],
  axis: 'x' | 'y',
): DefaultizedZoomOptions[] | undefined => {
  if (zoom === 'x') {
    return [{ axis: 'x', ...defaultZoomOptions }];
  }
  if (zoom === 'y') {
    return [{ axis: 'y', ...defaultZoomOptions }];
  }
  if (zoom === 'xy') {
    return [
      { axis: 'x', ...defaultZoomOptions },
      { axis: 'y', ...defaultZoomOptions },
    ];
  }
  return zoom?.map((v) => ({ ...defaultZoomOptions, ...v, axis }));
};
