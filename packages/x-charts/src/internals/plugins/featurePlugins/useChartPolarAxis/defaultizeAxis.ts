import { MakeOptional } from '@mui/x-internals/types';
import { DEFAULT_ROTATION_AXIS_KEY } from '../../../../constants';
import { ScaleName } from '../../../../models';
import { AxisId, PolarAxisConfig } from '../../../../models/axis';
import { DatasetType } from '../../../../models/seriesType/config';

export function defaultizeAxis<TScale extends ScaleName = ScaleName>(
  inAxis: MakeOptional<PolarAxisConfig<TScale, any>, 'id'>[] | undefined,
  dataset: Readonly<DatasetType> | undefined,
  axisName: 'rotation' | 'radius',
): PolarAxisConfig<TScale, any>[] {
  const DEFAULT_AXIS_KEY: AxisId = axisName === 'rotation' ? DEFAULT_ROTATION_AXIS_KEY : 5;

  const inputAxes: MakeOptional<PolarAxisConfig<ScaleName, any>, 'id'>[] =
    inAxis && inAxis.length > 0 ? inAxis : [{ id: DEFAULT_AXIS_KEY }];

  return inputAxes.map((axisConfig, index) => {
    const id = `defaultized-${axisName}-axis-${index}`;
    const dataKey = axisConfig.dataKey;

    if (dataKey === undefined || axisConfig.data !== undefined) {
      return {
        id,
        ...axisConfig,
      } as PolarAxisConfig<TScale, any>;
    }
    if (dataset === undefined) {
      throw new Error(`MUI X: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }

    return {
      id,
      data: dataset.map((d) => d[dataKey]),
      ...axisConfig,
    } as PolarAxisConfig<TScale, any>;
  });
}
