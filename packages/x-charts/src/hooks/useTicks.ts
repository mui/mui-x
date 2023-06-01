import * as React from 'react';
import { D3Scale, isBandScale } from './useScale';

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

function useTicks(options: { scale: D3Scale; ticksNumber?: number }) {
  const { scale, ticksNumber } = options;

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      return scale
        .domain()
        .map((d) => ({ value: d, offset: (scale(d) ?? 0) + scale.bandwidth() / 2 }));
    }

    return scale.ticks(ticksNumber).map((value: any) => ({
      value: scale.tickFormat(ticksNumber)(value),
      offset: scale(value),
    }));
  }, [ticksNumber, scale]);
}

export default useTicks;
