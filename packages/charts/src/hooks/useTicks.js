import { useMemo } from 'react';
import useScale from './useScale';

function useTicks(options) {
  const { domain, maxTicks = 999, pixelsPerTick, range, scale: scaleOption, scaleType } = options;

  return useMemo(() => {
    const scale = scaleOption || useScale(scaleType, domain, range).nice();
    const numberOfTicksTarget = Math.min(
      maxTicks,
      Math.max(1, Math.floor((range[1] - range[0]) / pixelsPerTick)),
    );

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value: scale.tickFormat(numberOfTicksTarget)(value),
      offset: scale(value),
    }));
  }, [domain, range, pixelsPerTick, maxTicks, scaleType]);
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
