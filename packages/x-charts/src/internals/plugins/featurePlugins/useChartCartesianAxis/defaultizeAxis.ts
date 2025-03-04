import { MakeOptional } from '@mui/x-internals/types';
import {
  DEFAULT_X_AXIS_KEY,
  DEFAULT_Y_AXIS_KEY,
  DEFAULT_AXIS_SIZE_HEIGHT,
  DEFAULT_AXIS_SIZE_WIDTH,
  AXIS_LABEL_DEFAULT_HEIGHT,
} from '../../../../constants';
import { AxisConfig, ScaleName } from '../../../../models';
import { ChartsXAxisProps, ChartsYAxisProps } from '../../../../models/axis';
import { DatasetType } from '../../../../models/seriesType/config';

export function defaultizeAxis(
  inAxis: readonly MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axisName: 'x',
): AxisConfig<ScaleName, any, ChartsXAxisProps>[];
export function defaultizeAxis(
  inAxis: readonly MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axisName: 'y',
): AxisConfig<ScaleName, any, ChartsYAxisProps>[];
export function defaultizeAxis(
  inAxis: readonly MakeOptional<AxisConfig, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axisName: 'x' | 'y',
): AxisConfig[] {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;

  const offsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    none: 0,
  };

  const inputAxes =
    inAxis && inAxis.length > 0 ? inAxis : [{ id: DEFAULT_AXIS_KEY, scaleType: 'linear' as const }];

  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;
    const defaultPosition = axisName === 'x' ? ('bottom' as const) : ('left' as const);

    const position = axisConfig.position ?? 'none';
    const dimension = axisName === 'x' ? 'height' : 'width';

    const height =
      axisName === 'x'
        ? DEFAULT_AXIS_SIZE_HEIGHT + (axisConfig.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0)
        : 0;
    const width =
      axisName === 'y'
        ? DEFAULT_AXIS_SIZE_WIDTH + (axisConfig.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0)
        : 0;

    const sharedConfig = {
      id: `defaultized-${axisName}-axis-${index}`,
      // The fist axis is defaultized to the bottom/left
      ...(index === 0 ? { position: defaultPosition } : {}),
      height,
      width,
      offset: offsets[position],
      ...axisConfig,
    };

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] +=
        (axisConfig as any)[dimension] ?? (dimension === 'height' ? height : width);
    }

    // If `dataKey` is NOT provided
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return sharedConfig;
    }

    if (dataset === undefined) {
      throw new Error(`MUI X: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return {
      ...sharedConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });

  return parsedAxes;
}
