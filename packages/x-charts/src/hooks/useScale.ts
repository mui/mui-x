import * as React from 'react';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../internals/isBandScale';
import { D3Scale } from '../models/axis';

/**
 * For a given scale return a function that map value to their position.
 * Usefull when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
export function getValueToPositionMapper(scale: D3Scale) {
  if (isBandScale(scale)) {
    return (value: any) => scale(value)! + scale.bandwidth() / 2;
  }
  return (value: any) => scale(value) as number;
}

export function useXScale(identifier?: number | string) {
  const { xAxis, xAxisIds } = React.useContext(CartesianContext);

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id].scale;
}

export function useYScale(identifier?: number | string) {
  const { yAxis, yAxisIds } = React.useContext(CartesianContext);

  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];

  return yAxis[id].scale;
}
