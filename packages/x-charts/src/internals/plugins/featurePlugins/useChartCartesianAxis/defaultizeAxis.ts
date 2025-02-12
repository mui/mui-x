import { MakeOptional } from '@mui/x-internals/types';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY, DEFAULT_AXIS_SIZE } from '../../../../constants';
import { AxisConfig, ScaleName } from '../../../../models';
import { ChartsAxisProps, ChartsXAxisProps, ChartsYAxisProps } from '../../../../models/axis';
import { DatasetType } from '../../../../models/seriesType/config';

export function defaultizeAxis(
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  dataset: DatasetType | undefined,
  axisName: 'x',
): AxisConfig<ScaleName, any, ChartsXAxisProps>[];
export function defaultizeAxis(
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  dataset: DatasetType | undefined,
  axisName: 'y',
): AxisConfig<ScaleName, any, ChartsYAxisProps>[];
export function defaultizeAxis(
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  dataset: DatasetType | undefined,
  axisName: 'x' | 'y',
): AxisConfig<ScaleName, any, ChartsAxisProps>[] {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;

  const hasNoDefaultAxis =
    inAxis === undefined || inAxis.findIndex(({ id }) => id === DEFAULT_AXIS_KEY) === -1;

  const parsedAxes = [
    ...(inAxis ?? []),
    ...(hasNoDefaultAxis ? [{ id: DEFAULT_AXIS_KEY, scaleType: 'linear' as const }] : []),
  ]
    .map((axisConfig, index) => {
      const dataKey = axisConfig.dataKey;
      const defaultPosition = axisName === 'x' ? 'bottom' : 'left';

      const sharedConfig = {
        id: `defaultized-${axisName}-axis-${index}`,
        // The fist axis is defaultized to the bottom/left
        ...(index === 0 ? { position: defaultPosition } : {}),
        height: axisName === 'x' ? DEFAULT_AXIS_SIZE : 0,
        width: axisName === 'y' ? DEFAULT_AXIS_SIZE : 0,
        ...axisConfig,
      };

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
    })
    // We need to iterate over the axes to calculate the offset
    // We only calculate offset of axes that are positioned at the same side
    .map((axisConfig, index, arr) => {
      if (axisConfig.position === 'none') {
        return axisConfig;
      }

      const dimension =
        axisConfig.position === 'top' || axisConfig.position === 'bottom' ? 'height' : 'width';

      const offset = arr.slice(0, index).reduce((acc, currAxisConfig) => {
        if (currAxisConfig.position !== axisConfig.position) {
          return acc;
        }

        return acc + (currAxisConfig[dimension] ?? DEFAULT_AXIS_SIZE);
      }, axisConfig.offset ?? 0);

      return {
        ...axisConfig,
        offset,
      };
    });

  return parsedAxes;
}
