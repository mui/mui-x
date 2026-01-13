import { defaultizeZoom } from './defaultizeZoom';
import { type ZoomOptions } from './zoom.types';
import {
  DEFAULT_X_AXIS_KEY,
  DEFAULT_Y_AXIS_KEY,
  DEFAULT_AXIS_SIZE_HEIGHT,
  DEFAULT_AXIS_SIZE_WIDTH,
  AXIS_LABEL_DEFAULT_HEIGHT,
} from '../../../../constants';
import { type XAxis, type YAxis } from '../../../../models';
import { type DefaultedXAxis, type DefaultedYAxis } from '../../../../models/axis';
import { type DatasetType } from '../../../../models/seriesType/config';

type InXAxis = XAxis & { zoom?: boolean | ZoomOptions };

export function defaultizeXAxis(
  inAxes: readonly InXAxis[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axesGap: number,
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
      zoom: defaultizeZoom(axisConfig.zoom, id, 'x', axisConfig.reverse),
    };

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.height + axesGap;

      if (sharedConfig.zoom?.slider.enabled) {
        offsets[position] += sharedConfig.zoom.slider.size + axesGap;
      }
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

type InYAxis = YAxis & { zoom?: boolean | ZoomOptions };

export function defaultizeYAxis(
  inAxes: readonly InYAxis[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axesGap: number,
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
      zoom: defaultizeZoom(axisConfig.zoom, id, 'y', axisConfig.reverse),
    } satisfies DefaultedYAxis;

    // Increment the offset for the next axis
    if (position !== 'none') {
      offsets[position] += sharedConfig.width + axesGap;

      if (sharedConfig.zoom?.slider.enabled) {
        offsets[position] += sharedConfig.zoom.slider.size + axesGap;
      }
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
