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

export function defaultizeXAxis(
  inAxis: readonly MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
): Array<AxisConfig<ScaleName, any, ChartsXAxisProps>> {
  const offsets = {
    top: 0,
    bottom: 0,
    none: 0,
  };

  const inputAxes =
    inAxis && inAxis.length > 0
      ? inAxis
      : [{ id: DEFAULT_X_AXIS_KEY, scaleType: 'linear' as const }];

  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;

    const position = axisConfig.position ?? 'none';
    const defaultHeight =
      DEFAULT_AXIS_SIZE_HEIGHT + (axisConfig.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0);

    const sharedConfig = {
      id: `defaultized-x-axis-${index}`,
      // The fist axis is defaultized to the bottom/left
      ...(index === 0 ? ({ position: 'bottom' } as const) : {}),
      height: defaultHeight,
      offset: offsets[position],
      ...axisConfig,
    };

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += axisConfig.height ?? defaultHeight;
    }

    // If `dataKey` is NOT provided
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return sharedConfig;
    }

    if (dataset === undefined) {
      throw new Error(`MUI X: x-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return {
      ...sharedConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });

  return parsedAxes;
}

export function defaultizeYAxis(
  inAxis: readonly MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
): Array<AxisConfig<ScaleName, any, ChartsYAxisProps>> {
  const offsets = { right: 0, left: 0, none: 0 };

  const inputAxes =
    inAxis && inAxis.length > 0
      ? inAxis
      : [{ id: DEFAULT_Y_AXIS_KEY, scaleType: 'linear' as const }];

  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;

    const position = axisConfig.position ?? 'none';
    const defaultWidth =
      DEFAULT_AXIS_SIZE_WIDTH + (axisConfig.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0);

    const sharedConfig = {
      id: `defaultized-y-axis-${index}`,
      // The first axis is defaultized to the left
      ...(index === 0 ? ({ position: 'left' } as const) : {}),
      width: defaultWidth,
      offset: offsets[position],
      ...axisConfig,
    };

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += axisConfig.width ?? defaultWidth;
    }

    // If `dataKey` is NOT provided
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return sharedConfig;
    }

    if (dataset === undefined) {
      throw new Error(`MUI X: y-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return {
      ...sharedConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });

  return parsedAxes;
}
