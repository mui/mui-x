import type { NumberValue, ScaleSymLog } from '@mui/x-charts-vendor/d3-scale';
import {
  isBandScaleConfig,
  isPointScaleConfig,
  isSymlogScaleConfig,
} from '../../../../models/axis';
import type {
  AxisConfig,
  ChartsAxisProps,
  ContinuousScaleName,
  D3Scale,
  DefaultedAxis,
  ScaleName,
} from '../../../../models/axis';
import { getScale } from '../../../getScale';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { scaleBand, scalePoint } from '../../../scales';

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;

export function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y',
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>,
): [number, number] {
  const range: [number, number] =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return axis.reverse ? [range[1], range[0]] : range;
}

/**
 * Caches the normalized ordinal scale so it is not rebuilt on every pan/zoom frame. Building a
 * band/point scale is `O(domain)` — it interns the whole domain — which is prohibitive for large
 * category axes when zooming. The domain array (the axis `data`) is referentially stable across
 * zoom, so it is the outer key; a `WeakMap` lets unused domains be collected. The inner key is the
 * scale variant (type + padding), because the same domain array can back several axes (e.g. a `band`
 * and a `point` axis sharing one `data` array), which must not share a scale. Continuous scales are
 * not cached: they are cheap to build and their domain reference changes with zoom anyway, so a
 * cache would only ever miss.
 */
const normalizedScaleCache = new WeakMap<object, Map<string, D3Scale>>();

function getCachedOrdinalScale(
  domain: ReadonlyArray<NumberValue | string>,
  variant: string,
  build: () => D3Scale,
): D3Scale {
  let variants = normalizedScaleCache.get(domain);
  if (!variants) {
    variants = new Map();
    normalizedScaleCache.set(domain, variants);
  }
  let scale = variants.get(variant);
  if (!scale) {
    scale = build();
    variants.set(variant, scale);
  }
  return scale;
}

export function getNormalizedAxisScale(
  axis: Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>,
  domain: ReadonlyArray<NumberValue | string>,
): D3Scale {
  const range = [0, 1];

  if (isBandScaleConfig(axis)) {
    const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
    return getCachedOrdinalScale(domain, `band:${categoryGapRatio}`, () =>
      scaleBand<{ toString(): string }>(domain, range)
        .paddingInner(categoryGapRatio)
        .paddingOuter(categoryGapRatio / 2),
    );
  }

  if (isPointScaleConfig(axis)) {
    return getCachedOrdinalScale(domain, 'point', () =>
      scalePoint<{ toString(): string }>(domain, range),
    );
  }

  const scaleType = axis.scaleType ?? ('linear' as const);

  const scale = getScale(scaleType as ContinuousScaleName, domain as readonly NumberValue[], range);

  if (isSymlogScaleConfig(axis) && axis.constant != null) {
    (scale as ScaleSymLog<number, number>).constant(axis.constant);
  }

  return scale;
}
