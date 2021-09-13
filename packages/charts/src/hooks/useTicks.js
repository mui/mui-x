import { useMemo } from 'react';

function useTicks(options) {
  const { maxTicks = 999, pixelsPerTick, range, scale } = options;

  return useMemo(() => {
    const numberOfTicksTarget = Math.min(
      maxTicks,
      Math.max(1, Math.floor((range[1] - range[0]) / pixelsPerTick)),
    );

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value: scale.tickFormat(numberOfTicksTarget)(value),
      offset: scale(value),
    }));
  }, [range, pixelsPerTick, maxTicks, scale]);
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
