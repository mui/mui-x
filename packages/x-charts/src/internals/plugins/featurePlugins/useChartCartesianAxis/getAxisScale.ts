import { type NumberValue, type ScaleSymLog } from '@mui/x-charts-vendor/d3-scale';
import {
  type AxisConfig,
  type ChartsAxisProps,
  type ContinuousScaleName,
  type D3Scale,
  type DefaultedAxis,
  isBandScaleConfig,
  isPointScaleConfig,
  isSymlogScaleConfig,
  type ScaleName,
} from '../../../../models/axis';
import { getScale } from '../../../getScale';
import { type ChartDrawingArea } from '../../../../hooks/useDrawingArea';
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

export function getNormalizedAxisScale(
  axis: Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>,
  domain: ReadonlyArray<NumberValue | string>,
): D3Scale {
  const range = [0, 1];

  if (isBandScaleConfig(axis)) {
    const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;

    return scaleBand<{ toString(): string }>(domain, range)
      .paddingInner(categoryGapRatio)
      .paddingOuter(categoryGapRatio / 2);
  }

  if (isPointScaleConfig(axis)) {
    return scalePoint<{ toString(): string }>(domain, range);
  }

  const scaleType = axis.scaleType ?? ('linear' as const);

  const scale = getScale(scaleType as ContinuousScaleName, domain as readonly NumberValue[], range);

  if (isSymlogScaleConfig(axis) && axis.constant != null) {
    (scale as ScaleSymLog<number, number>).constant(axis.constant);
  }

  return scale;
}
