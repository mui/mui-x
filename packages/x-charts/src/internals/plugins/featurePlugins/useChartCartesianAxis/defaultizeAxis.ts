import { MakeOptional } from '@mui/x-internals/types';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../../../../constants';
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

  return [
    ...(inAxis?.map((axis, index) => ({ id: `defaultized-${axisName}-axis-${index}`, ...axis })) ??
      []),
    ...(inAxis === undefined || inAxis.findIndex(({ id }) => id === DEFAULT_AXIS_KEY) === -1
      ? [{ id: DEFAULT_AXIS_KEY, scaleType: 'linear' as const }]
      : []),
  ].map((axisConfig) => {
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return axisConfig;
    }
    if (dataset === undefined) {
      throw new Error(`MUI X: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }
    return {
      ...axisConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });
}
