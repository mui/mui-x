import * as React from 'react';
import { D3Scale } from '../models/axis';
import { isBandScale } from '../internals/isBandScale';

export interface TickParams {
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep?: number;
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep?: number;
  /**
   * The number of ticks. This number is not guaranted.
   * Not supported by categorical axis (band, points).
   */
  tickNumber?: number;
  /**
   * Defines which ticks are displayed. Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has a data property.
   * - an array containing the values where ticks should be displayed.
   * @default 'auto'
   */
  tickInterval?: 'auto' | ((value: any, index: number) => boolean) | any[];
}

export function getTickNumber(
  params: TickParams & {
    range: any[];
    domain: any[];
  },
) {
  const { tickMaxStep, tickMinStep, tickNumber, range, domain } = params;

  const maxTicks =
    tickMinStep === undefined ? 999 : Math.floor(Math.abs(domain[1] - domain[0]) / tickMinStep);
  const minTicks =
    tickMaxStep === undefined ? 2 : Math.ceil(Math.abs(domain[1] - domain[0]) / tickMaxStep);

  const defaultizedTickNumber = tickNumber ?? Math.floor(Math.abs(range[1] - range[0]) / 50);

  return Math.min(maxTicks, Math.max(minTicks, defaultizedTickNumber));
}

export type TickItemType = {
  /**
   * This property is undefined only if it's the tick closing the last band
   */
  value?: any;
  formattedValue?: string;
  offset: number;
  labelOffset: number;
};

export function useTicks(
  options: {
    scale: D3Scale;
    valueFormatter?: (value: any) => string;
  } & Pick<TickParams, 'tickNumber' | 'tickInterval'>,
): TickItemType[] {
  const { scale, tickNumber, valueFormatter, tickInterval } = options;

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      const domain = scale.domain();

      if (scale.bandwidth() > 0) {
        // scale type = 'band'
        return [
          ...domain.map((value) => ({
            value,
            formattedValue: valueFormatter?.(value) ?? `${value}`,
            offset: scale(value)! - (scale.step() - scale.bandwidth()) / 2,
            labelOffset: scale.step() / 2,
          })),

          {
            formattedValue: undefined,
            offset: scale.range()[1],
            labelOffset: 0,
          },
        ];
      }

      // scale type = 'point'
      const filteredDomain =
        (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
        (typeof tickInterval === 'object' && tickInterval) ||
        domain;

      return filteredDomain.map((value) => ({
        value,
        formattedValue: valueFormatter?.(value) ?? `${value}`,
        offset: scale(value)!,
        labelOffset: 0,
      }));
    }

    const ticks = typeof tickInterval === 'object' ? tickInterval : scale.ticks(tickNumber);
    return ticks.map((value: any) => ({
      value,
      formattedValue: valueFormatter?.(value) ?? scale.tickFormat(tickNumber)(value),
      offset: scale(value),
      labelOffset: 0,
    }));
  }, [tickNumber, scale, valueFormatter, tickInterval]);
}
