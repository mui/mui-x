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

  const { negativeScale, linearScale, positiveScale } = generateScales(scale);

  // Workaround for https://github.com/d3/d3-scale/issues/162
  scale.ticks = (count?: number) => {
    const ticks = originalTicks(count);
    const constant = scale.constant();
    let negativeLogTickCount = 0;
    let linearTickCount = 0;
    let positiveLogTickCount = 0;

    ticks.forEach((tick) => {
      if (tick > -constant && tick < constant) {
        linearTickCount += 1;
      }

      if (tick <= -constant) {
        negativeLogTickCount += 1;
      }

      if (tick >= constant) {
        positiveLogTickCount += 1;
      }
    });

    const finalTicks: number[] = [];

    if (negativeLogTickCount > 0) {
      finalTicks.push(...negativeScale.ticks(negativeLogTickCount));
    }

    if (linearTickCount > 0) {
      const linearTicks = linearScale.ticks(linearTickCount);

      if (finalTicks.at(-1) === linearTicks[0]) {
        finalTicks.push(...linearTicks.slice(1));
      } else {
        finalTicks.push(...linearTicks);
      }
    }

    if (positiveLogTickCount > 0) {
      const positiveTicks = positiveScale.ticks(positiveLogTickCount);

      if (finalTicks.at(-1) === positiveTicks[0]) {
        finalTicks.push(...positiveTicks.slice(1));
      } else {
        finalTicks.push(...positiveTicks);
      }
    }

    return finalTicks;
  };

  scale.tickFormat = (count: number = 10, specifier?: string) => {
    // Calculates the proportion of the domain that each scale occupies, and use that ratio to determine the number of ticks for each scale.
    const constant = scale.constant();
    const [start, end] = scale.domain();
    const extent = end - start;

    const negativeScaleDomain = negativeScale.domain();
    const negativeScaleExtent = negativeScaleDomain[1] - negativeScaleDomain[0];
    const negativeScaleRatio = extent === 0 ? 0 : negativeScaleExtent / extent;
    const negativeScaleTickCount = negativeScaleRatio * count;

    const linearScaleDomain = linearScale.domain();
    const linearScaleExtent = linearScaleDomain[1] - linearScaleDomain[0];
    const linearScaleRatio = extent === 0 ? 0 : linearScaleExtent / extent;
    const linearScaleTickCount = linearScaleRatio * count;

    const positiveScaleDomain = positiveScale.domain();
    const positiveScaleExtent = positiveScaleDomain[1] - positiveScaleDomain[0];
    const positiveScaleRatio = extent === 0 ? 0 : positiveScaleExtent / extent;
    const positiveScaleTickCount = positiveScaleRatio * count;

    const negativeTickFormat = negativeScale.tickFormat(negativeScaleTickCount, specifier);
    const linearTickFormat = linearScale.tickFormat(linearScaleTickCount, specifier);
    const positiveTickFormat = positiveScale.tickFormat(positiveScaleTickCount, specifier);

    return (tick: NumberValue) => {
      const tickFormat =
        // eslint-disable-next-line no-nested-ternary
        tick.valueOf() <= -constant
          ? negativeTickFormat
          : tick.valueOf() >= constant
            ? positiveTickFormat
            : linearTickFormat;

      return tickFormat(tick);
    };
  };

  return scale;
}

function generateScales<Range, Output = Range, Unknown = never>(
  scale: ScaleSymLog<Range, Output, Unknown>,
) {
  const constant = scale.constant();
  const domain = scale.domain();

  const negativeDomain = [domain[0], Math.min(domain[1], -constant)];
  const negativeLogScale = scaleLog(negativeDomain, scale.range());

  const linearDomain = [Math.max(domain[0], -constant), Math.min(domain[1], constant)];
  const linearScale = scaleLinear(linearDomain, scale.range());

  const positiveDomain = [Math.max(domain[0], constant), domain[1]];
  const positiveLogScale = scaleLog(positiveDomain, scale.range());

  return {
    negativeScale: negativeLogScale,
    linearScale,
    positiveScale: positiveLogScale,
  };
}
