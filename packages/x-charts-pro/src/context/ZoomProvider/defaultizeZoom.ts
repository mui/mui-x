import { AxisConfig, ScaleName, ChartsXAxisProps } from '@mui/x-charts';
import { isDefined } from '@mui/x-charts/internals';
import { DefaultizedZoomOptions, ZoomOptions } from './Zoom.types';

const defaultZoomOptions = {
  start: 0,
  end: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
};

export const defaultizeZoom = (
  axis: Pick<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id' | 'zoom'>[] | undefined,
  axisName: 'x' | 'y',
): DefaultizedZoomOptions[] | undefined => {
  if (!axis) {
    return undefined;
  }

  const defaultized = axis
    .map((v) => {
      if (!v.zoom) {
        return undefined;
      }

      if (v.zoom === true) {
        return {
          axisId: v.id,
          axis: axisName,
          ...defaultZoomOptions,
        };
      }

      checkZoomOptionsErrors(v.zoom);

      return {
        axisId: v.id,
        axis: axisName,
        ...defaultZoomOptions,
        ...v.zoom,
      };
    })
    .filter(isDefined);

  return defaultized.length > 0 ? defaultized : undefined;
};

function checkZoomOptionsErrors(options: ZoomOptions) {
  const start = options.start ?? defaultZoomOptions.start;
  const end = options.end ?? defaultZoomOptions.end;
  const step = options.step ?? defaultZoomOptions.step;
  const minSpan = options.minSpan ?? defaultZoomOptions.minSpan;
  const maxSpan = options.maxSpan ?? defaultZoomOptions.maxSpan;

  isBetween(start, 0, 100, 'start');
  isBetween(end, 0, 100, 'end');
  isBetween(minSpan, 1, 100, 'minSpan');
  isBetween(maxSpan, 1, 100, 'maxSpan');

  if (end <= start) {
    throw new Error('MUI X Charts: The end value must be greater than the start value.');
  }

  if (step < 1) {
    throw new Error('MUI X Charts: The step value must be greater than 1.');
  }

  if (minSpan > maxSpan) {
    throw new Error(
      'MUI X Charts: The minSpan value must be less than or equal to the maxSpan value.',
    );
  }
}

function isBetween(value: number, min: number, max: number, name: string) {
  if (value < min || value > max) {
    throw new Error(`MUI X Charts: The ${name} value must be between ${min} and ${max}.`);
  }
}
