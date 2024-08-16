import type { AxisConfig, ScaleName } from '../../models';
import { ChartsAxisProps } from '../../models/axis';
import { MakeOptional } from '../../models/helpers';
import { DatasetType } from '../../models/seriesType/config';

export const normalizeAxis = <
  T extends ChartsAxisProps,
  R extends MakeOptional<AxisConfig<ScaleName, any, T>, 'id'>,
>(
  axis: R[] | undefined,
  dataset: DatasetType | undefined,
  axisName: 'x' | 'y',
): R[] => {
  return (
    axis?.map((axisConfig) => {
      const dataKey = axisConfig.dataKey;
      if (dataKey === undefined || axisConfig.data !== undefined) {
        return axisConfig;
      }
      if (dataset === undefined) {
        throw Error(`MUI X: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
      }
      return {
        ...axisConfig,
        data: dataset.map((d) => d[dataKey]),
      };
    }) ?? []
  );
};
