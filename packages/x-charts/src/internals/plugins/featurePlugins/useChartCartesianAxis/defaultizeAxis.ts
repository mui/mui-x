import {
  DEFAULT_X_AXIS_KEY,
  DEFAULT_Y_AXIS_KEY,
  DEFAULT_AXIS_SIZE_HEIGHT,
  DEFAULT_AXIS_SIZE_WIDTH,
  AXIS_LABEL_DEFAULT_HEIGHT,
} from '../../../../constants';
import { XAxis, YAxis } from '../../../../models';
import { DefaultedXAxis, DefaultedYAxis } from '../../../../models/axis';
import { DatasetType } from '../../../../models/seriesType/config';

export function defaultizeXAxis(
  inAxes: readonly XAxis[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
): DefaultedXAxis[] {
  const offsets = {
    top: 0,
    bottom: 0,
    none: 0,
  };

  const inputAxes =
    inAxes && inAxes.length > 0
      ? inAxes
      : [{ id: DEFAULT_X_AXIS_KEY, scaleType: 'linear' as const }];

  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;

    // The first x-axis is defaultized to the bottom
    const defaultPosition = index === 0 ? 'bottom' : 'none';
    const position = axisConfig.position ?? defaultPosition;
    const defaultHeight =
      DEFAULT_AXIS_SIZE_HEIGHT + (axisConfig.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0);

    const sharedConfig = {
      id: `defaultized-x-axis-${index}`,
      offset: offsets[position],
      ...axisConfig,
      position,
      height: axisConfig.height ?? defaultHeight,
    };

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.height;
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
  inAxes: readonly YAxis[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
): DefaultedYAxis[] {
  const offsets = { right: 0, left: 0, none: 0 };

  const inputAxes =
    inAxes && inAxes.length > 0
      ? inAxes
      : [{ id: DEFAULT_Y_AXIS_KEY, scaleType: 'linear' as const }];

  const parsedAxes = inputAxes.map((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;

    // The first y-axis is defaultized to the left
    const defaultPosition = index === 0 ? 'left' : 'none';
    const position = axisConfig.position ?? defaultPosition;
    const defaultWidth =
      DEFAULT_AXIS_SIZE_WIDTH + (axisConfig.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0);

    const sharedConfig = {
      id: `defaultized-y-axis-${index}`,
      offset: offsets[position],
      ...axisConfig,
      position,
      width: axisConfig.width ?? defaultWidth,
    };

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.width;
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
