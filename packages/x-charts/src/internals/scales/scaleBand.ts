/* eslint-disable func-names */
// Adapted from d3-scale v4.0.2
// https://github.com/d3/d3-scale/blob/d6904a4bde09e16005e0ad8ca3e25b10ce54fa0d/src/band.js
import { InternMap, range as sequence } from '@mui/x-charts-vendor/d3-array';
import type { NumberValue, ScaleBand } from '@mui/x-charts-vendor/d3-scale';

export function keyof(value: any): string | number {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === 'object' && value !== null) {
    return value.valueOf();
  }

  return value;
}

/**
 * Constructs a new band scale with the specified range, no padding, no rounding and center alignment.
 * The domain defaults to the empty domain.
 * If range is not specified, it defaults to the unit range [0, 1].
 *
 * The generic corresponds to the data type of domain elements.
 *
 * @param range A two-element array of numeric values.
 */
export function scaleBand<Domain extends { toString(): string } = string>(
  range?: Iterable<NumberValue>,
): ScaleBand<Domain>;
/**
 * Constructs a new band scale with the specified domain and range, no padding, no rounding and center alignment.
 *
 * The generic corresponds to the data type of domain elements.
 *
 * @param domain Array of domain values.
 * @param range A two-element array of numeric values.
 */
export function scaleBand<Domain extends { toString(): string }>(
  domain: Iterable<Domain>,
  range: Iterable<NumberValue>,
): ScaleBand<Domain>;
export function scaleBand(...args: any[]): ScaleBand<any> {
  // @ts-expect-error, InternMap accepts two arguments, but its types are set as Map, which doesn't.
  let index = new InternMap(undefined, keyof);
  let domain: any[] = [];
  let ordinalRange: number[] = [];
  let r0 = 0;
  let r1 = 1;
  let step: number;
  let bandwidth: number;
  let isRound = false;
  let paddingInner = 0;
  let paddingOuter = 0;
  let align = 0.5;

  const scale = (d: any): number | undefined => {
    const i = index.get(d);
    if (i === undefined) {
      return undefined;
    }
    return ordinalRange[i % ordinalRange.length];
  };

  const rescale = () => {
    const n = domain.length;
    const reverse = r1 < r0;
    const start = reverse ? r1 : r0;
    const stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (isRound) {
      step = Math.floor(step);
    }
    const adjustedStart = start + (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    const finalStart = isRound ? Math.round(adjustedStart) : adjustedStart;
    const finalBandwidth = isRound ? Math.round(bandwidth) : bandwidth;
    bandwidth = finalBandwidth;
    const values = sequence(n).map((i) => finalStart + step * i);
    ordinalRange = reverse ? values.reverse() : values;
    return scale;
  };

  scale.domain = function (_?: Iterable<any>) {
    if (!arguments.length) {
      return domain.slice();
    }
    domain = [];
    // @ts-expect-error, InternMap accepts two arguments.
    index = new InternMap(undefined, keyof);
    for (const value of _!) {
      if (index.has(value)) {
        continue;
      }
      index.set(value, domain.push(value) - 1);
    }
    return rescale();
  };

  scale.range = function (_?: [NumberValue, NumberValue]) {
    if (!arguments.length) {
      return [r0, r1];
    }
    const [v0, v1] = _!;
    r0 = +v0;
    r1 = +v1;
    return rescale();
  };

  scale.rangeRound = function (_: [NumberValue, NumberValue]) {
    const [v0, v1] = _;
    r0 = +v0;
    r1 = +v1;
    isRound = true;
    return rescale();
  };

  scale.bandwidth = function () {
    return bandwidth;
  };

  scale.step = function () {
    return step;
  };

  scale.round = function (_?: boolean) {
    if (!arguments.length) {
      return isRound;
    }
    isRound = !!_;
    return rescale();
  };

  scale.padding = function (_?: number) {
    if (!arguments.length) {
      return paddingInner;
    }
    paddingInner = Math.min(1, (paddingOuter = +_!));
    return rescale();
  };

  scale.paddingInner = function (_?: number) {
    if (!arguments.length) {
      return paddingInner;
    }
    paddingInner = Math.min(1, _!);
    return rescale();
  };

  scale.paddingOuter = function (_?: number) {
    if (!arguments.length) {
      return paddingOuter;
    }
    paddingOuter = +_!;
    return rescale();
  };

  scale.align = function (_?: number) {
    if (!arguments.length) {
      return align;
    }
    align = Math.max(0, Math.min(1, _!));
    return rescale();
  };

  scale.copy = () => {
    return scaleBand(domain, [r0, r1])
      .round(isRound)
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .align(align);
  };

  // Initialize from arguments
  const [arg0, arg1] = args;
  if (args.length > 1) {
    scale.domain(arg0);
    scale.range(arg1);
  } else if (arg0) {
    scale.range(arg0);
  } else {
    rescale();
  }

  return scale as any;
}
