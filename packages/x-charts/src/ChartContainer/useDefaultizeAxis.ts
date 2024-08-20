import * as React from 'react';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { MakeOptional } from '../models/helpers';
import { AxisConfig, ScaleName } from '../models';
import { ChartsAxisProps } from '../models/axis';
import { DatasetType } from '../models/seriesType/config';

const defaultizeAxis = (
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  dataset: DatasetType | undefined,
  axisName: 'x' | 'y',
) => {
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
      throw Error(`MUI X: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }
    return {
      ...axisConfig,
      data: dataset.map((d) => d[dataKey]),
    };
  });
};

export const useDefaultizeAxis = (
  inXAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  inYAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  dataset: DatasetType | undefined,
) => {
  const xAxis = React.useMemo(() => defaultizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);
  const yAxis = React.useMemo(() => defaultizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);

  return [xAxis, yAxis];
};
