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

  return Math.min(maxTicks, Math.max(minTicks, Math.floor((range[1] - range[0]) / tickSpacing)));
}

function useTicks(options: { scale: D3Scale } & TickParams) {
  const { scale, tickSpacing, minTicks, maxTicks } = options;

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      return scale
        .domain()
        .map((d) => ({ value: d, offset: (scale(d) ?? 0) + scale.bandwidth() / 2 }));
    }

    const numberOfTicksTarget = getTicksNumber({
      tickSpacing,
      minTicks,
      maxTicks,
      range: scale.range(),
    });

    return scale.ticks(numberOfTicksTarget).map((value: any) => ({
      value: scale.tickFormat(numberOfTicksTarget)(value),
      offset: scale(value),
    }));
  }, [tickSpacing, minTicks, maxTicks, scale]);
}

export default useTicks;
