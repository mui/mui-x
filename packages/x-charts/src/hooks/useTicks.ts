import * as React from 'react';
import { D3Scale, isBandScale } from './useScale';

function useTicks(options: {
  scale: D3Scale;
  maxTicks?: number;
  minTicks?: number;
  tickSpacing?: number;
}) {
  const { maxTicks = 999, minTicks = 2, tickSpacing = 50, scale } = options;

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      return scale
        .domain()
        .map((d) => ({ value: d, offset: (scale(d) ?? 0) + scale.bandwidth() / 2 }));
    }

    const numberOfTicksTarget = Math.min(
      maxTicks,
      Math.max(minTicks, Math.floor((scale.range()[1] - scale.range()[0]) / tickSpacing)),
    );

    return scale.ticks(numberOfTicksTarget).map((value: any) => ({
      value: scale.tickFormat(numberOfTicksTarget)(value),
      offset: scale(value),
    }));
  }, [tickSpacing, minTicks, maxTicks, scale]);
}

export default useTicks;
