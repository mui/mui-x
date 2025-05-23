import {
  AXIS_LABEL_DEFAULT_HEIGHT,
  DEFAULT_AXIS_SIZE_HEIGHT,
  DEFAULT_AXIS_SIZE_WIDTH,
  DEFAULT_X_AXIS_KEY,
  DEFAULT_Y_AXIS_KEY,
} from '@mui/x-charts/constants';
import { DatasetType, DefaultedXAxis, DefaultedYAxis } from '@mui/x-charts/internals';
import { XAxis, YAxis } from '@mui/x-charts/models';

type InXAxis = XAxis;

export function defaultizeXAxis(
  inAxes: readonly InXAxis[] | undefined,
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

    const id = axisConfig.id ?? `defaultized-x-axis-${index}`;
    const sharedConfig = {
      offset: offsets[position],
      ...axisConfig,
      id,
      position,
      height: axisConfig.height ?? defaultHeight,
      zoom: undefined,
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
      throw new Error(`MUI X Charts: x-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return {
      ...sharedConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });

  return parsedAxes;
}

type InYAxis = YAxis;

export function defaultizeYAxis(
  inAxes: readonly InYAxis[] | undefined,
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

    const id = axisConfig.id ?? `defaultized-y-axis-${index}`;
    const sharedConfig = {
      offset: offsets[position],
      ...axisConfig,
      id,
      position,
      width: axisConfig.width ?? defaultWidth,
      zoom: undefined,
    } satisfies DefaultedYAxis;

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.width;
    }

    // If `dataKey` is NOT provided
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return sharedConfig;
    }

    if (dataset === undefined) {
      throw new Error(`MUI X Charts: y-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    // If `dataKey` is provided
    return {
      ...sharedConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });

  return parsedAxes;
}
