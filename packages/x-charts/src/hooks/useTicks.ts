import * as React from 'react';
import { D3Scale } from '../models/axis';
import { isBandScale } from '../internals/isBandScale';

export type TickParams = {
  maxTicks?: number;
  minTicks?: number;
  tickSpacing?: number;
};

export function getTicksNumber(
  params: TickParams & {
    range: any[];
  },
) {
  const { maxTicks = 999, minTicks = 2, tickSpacing = 50, range } = params;

  const estimatedTickNumber = Math.floor(Math.abs(range[1] - range[0]) / tickSpacing);
  return Math.min(maxTicks, Math.max(minTicks, estimatedTickNumber));
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
