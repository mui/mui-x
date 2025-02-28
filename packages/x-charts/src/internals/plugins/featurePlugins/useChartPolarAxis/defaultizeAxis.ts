import { MakeOptional } from '@mui/x-internals/types';
import { DEFAULT_RADIUS_AXIS_KEY, DEFAULT_ROTATION_AXIS_KEY } from '../../../../constants';
import { AxisConfig, ScaleName } from '../../../../models';
import { ChartsAxisProps } from '../../../../models/axis';
import { DatasetType } from '../../../../models/seriesType/config';

export function defaultizeAxis<TScale extends ScaleName = ScaleName>(
  inAxis: MakeOptional<AxisConfig<TScale, any, ChartsAxisProps>, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axisName: 'rotation' | 'radius',
): (AxisConfig<TScale, any, ChartsAxisProps> | AxisConfig<'linear', any, ChartsAxisProps>)[] {
  const DEFAULT_AXIS_KEY =
    axisName === 'rotation' ? DEFAULT_ROTATION_AXIS_KEY : DEFAULT_RADIUS_AXIS_KEY;

  return [
    ...(inAxis?.map(
      (axis, index) =>
        ({
          id: `defaultized-${axisName}-axis-${index}`,
          ...axis,
        }) as AxisConfig<TScale, any, ChartsAxisProps>,
    ) ?? []),
    ...(inAxis === undefined || inAxis.findIndex(({ id }) => id === DEFAULT_AXIS_KEY) === -1
      ? [
          { id: DEFAULT_AXIS_KEY, scaleType: 'linear' } as AxisConfig<
            'linear',
            any,
            ChartsAxisProps
          >,
        ]
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
