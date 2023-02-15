import * as React from 'react';

function useTicks(options) {
  const { maxTicks = 999, minTicks = 2, tickSpacing = 50, scale } = options;

  return React.useMemo(() => {
    // band scale
    if (scale.bandwidth) {
      return scale.domain().map((d) => ({ value: d, offset: scale(d) }));
    }

    const numberOfTicksTarget = Math.min(
      maxTicks,
      Math.max(minTicks, Math.floor((scale.range()[1] - scale.range()[0]) / tickSpacing)),
    );

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value: scale.tickFormat(numberOfTicksTarget)(value),
      offset: scale(value),
    }));
  }, [tickSpacing, minTicks, maxTicks, scale]);
}

export default useTicks;
