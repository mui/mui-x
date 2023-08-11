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
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep?: number;
  /**
   * The number of ticks. This number is not guaranted.
   * Not supported by categorical axis (band, points).
   */
  tickNumber?: number;
}

export function getTicksNumber(
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

function useTicks(options: {
  scale: D3Scale;
  ticksNumber?: number;
  valueFormatter?: (value: any) => string;
}) {
  const { scale, ticksNumber, valueFormatter } = options;

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      const domain = scale.domain();

      if (scale.bandwidth() > 0) {
        // scale type = 'band'
        return [
          ...domain.map((value, index) => ({
            formattedValue: valueFormatter?.(value) ?? value,
            offset:
              index === 0
                ? scale.range()[0]
                : scale(value)! - (scale.step() - scale.bandwidth()) / 2,
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
      return domain.map((value) => ({
        formattedValue: valueFormatter?.(value) ?? value,
        offset: scale(value)!,
        labelOffset: 0,
      }));
    }

    return scale.ticks(ticksNumber).map((value: any) => ({
      formattedValue: valueFormatter?.(value) ?? scale.tickFormat(ticksNumber)(value),
      offset: scale(value),
      labelOffset: 0,
    }));
  }, [ticksNumber, scale, valueFormatter]);
}

export default useTicks;
