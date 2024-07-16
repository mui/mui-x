import * as React from 'react';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { MakeOptional } from '../models/helpers';
import { AxisConfig, ScaleName } from '../models';
import { ChartsAxisProps } from '../models/axis';

const defaultizeAxis = (
  inAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  axisName: 'x' | 'y',
) => {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;

  return [
    ...(inAxis?.map((axis, index) => ({ id: `defaultized-${axisName}-axis-${index}`, ...axis })) ??
      []),
    ...(inAxis === undefined || inAxis.findIndex(({ id }) => id === DEFAULT_AXIS_KEY) === -1
      ? [{ id: DEFAULT_AXIS_KEY, scaleType: 'linear' as const }]
      : []),
  ];
};

export const useDefaultizeAxis = (
  inXAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
  inYAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsAxisProps>, 'id'>[] | undefined,
) => {
  const xAxis = React.useMemo(() => defaultizeAxis(inXAxis, 'x'), [inXAxis]);
  const yAxis = React.useMemo(() => defaultizeAxis(inYAxis, 'y'), [inYAxis]);

  return [xAxis, yAxis];
};
