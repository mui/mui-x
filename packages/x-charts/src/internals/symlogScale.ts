import {
  NumberValue,
  ScaleSymLog,
  scaleSymlog as originalScaleSymlog,
  scaleLog,
  scaleLinear,
} from '@mui/x-charts-vendor/d3-scale';

export function scaleSymlog<Range, Output = Range, Unknown = never>(
  _domain: Iterable<NumberValue>,
  _range: Iterable<Range>,
): ScaleSymLog<Range, Output, Unknown> {
  const scale = originalScaleSymlog<Range, Output, Unknown>(_domain, _range);

  const originalTicks = scale.ticks;

  // Workaround for https://github.com/d3/d3-scale/issues/162
  scale.ticks = (count?: number) => {
    const ticks = originalTicks(count);
    const constant = scale.constant();
    const domain = scale.domain();
    let negativeLogTickCount = 0;
    let linearTickCount = 0;
    let positiveLogTickCount = 0;

    ticks.forEach((tick) => {
      if (tick >= -constant && tick <= constant) {
        linearTickCount += 1;
      }

      if (tick < -constant) {
        negativeLogTickCount += 1;
      }

      if (tick > constant) {
        positiveLogTickCount += 1;
      }
    });

    const finalTicks: number[] = [];

    if (negativeLogTickCount > 0) {
      const negativeDomain = [domain[0], Math.min(domain[1], -constant)];
      const negativeLogScale = scaleLog(negativeDomain, scale.range());

      finalTicks.push(...negativeLogScale.ticks(negativeLogTickCount));
    }

    if (linearTickCount > 0) {
      const linearDomain = [Math.max(domain[0], -constant), Math.min(domain[1], constant)];
      const linearScale = scaleLinear(linearDomain, scale.range());
      finalTicks.push(...linearScale.ticks(linearTickCount));
    }

    if (positiveLogTickCount > 0) {
      const positiveDomain = [Math.max(domain[0], constant), domain[1]];
      const positiveLogScale = scaleLog(positiveDomain, scale.range());
      finalTicks.push(...positiveLogScale.ticks(positiveLogTickCount));
    }

    return finalTicks;
  };

  return scale;
}
