import * as React from 'react';
import { CartesianContext } from '../context/CartesianContextProvider';
import { AxisScaleComputedConfig, ScaleName } from '../models/axis';
import { ZAxisContext } from '../context/ZAxisContextProvider';

export function useXColorScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { xAxis, xAxisIds } = React.useContext(CartesianContext);

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id].colorScale;
}

export function useYColorScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { yAxis, yAxisIds } = React.useContext(CartesianContext);

  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];

  return yAxis[id].colorScale;
}

export function useZColorScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);

  const id = typeof identifier === 'string' ? identifier : zAxisIds[identifier ?? 0];

  return zAxis[id]?.colorScale;
}
