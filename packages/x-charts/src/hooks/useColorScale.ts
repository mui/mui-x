'use client';
import * as React from 'react';
import { AxisScaleComputedConfig, ScaleName } from '../models/axis';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useXAxes, useYAxes } from './useAxis';

export function useXColorScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { xAxis, xAxisIds } = useXAxes();

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id].colorScale;
}

export function useYColorScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { yAxis, yAxisIds } = useYAxes();

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
