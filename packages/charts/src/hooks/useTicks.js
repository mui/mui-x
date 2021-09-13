import { useMemo } from 'react';

function useTicks(options) {
  const { maxTicks = 999, pixelsPerTick = 10, scale } = options;

  return useMemo(() => {
    const numberOfTicksTarget = Math.min(
      maxTicks,
      Math.max(1, Math.floor((scale.range()[1] - scale.range()[0]) / pixelsPerTick)),
    );

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value: scale.tickFormat(numberOfTicksTarget)(value),
      offset: scale(value),
    }));
  }, [pixelsPerTick, maxTicks, scale]);
}

export default useTicks;

// function useTicks(scale, count) {
//   return useMemo(() => {
//     return d3.scale.linear()
//       .domain(scale.domain())
//       .range(scale.range())
//       .ticks(count);
//   }, [scale, count]);
// }
