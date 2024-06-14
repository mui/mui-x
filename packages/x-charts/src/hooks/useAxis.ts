import * as React from 'react';
import { CartesianContext } from '../context/CartesianContextProvider';

export function useXAxis(identifier?: number | string) {
  const { xAxis, xAxisIds } = React.useContext(CartesianContext);

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id];
}

export function useYAxis(identifier?: number | string) {
  const { yAxis, yAxisIds } = React.useContext(CartesianContext);

  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];

  return yAxis[id];
}
