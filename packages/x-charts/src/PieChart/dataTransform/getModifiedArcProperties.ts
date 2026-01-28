import type { DefaultizedPieSeriesType, PieSeriesLayout } from '../../models/seriesType/pie';
import { deg2rad } from '../../internals/angleConversion';

/**
 * Function that returns arc properties after applying transformation from highlight/fade states.
 */
export function getModifiedArcProperties(
  seriesDef: Pick<
    DefaultizedPieSeriesType,
    'cornerRadius' | 'paddingAngle' | 'id' | 'highlighted' | 'faded' | 'data'
  >,
  seriesLayout: Pick<PieSeriesLayout, 'radius'>,
  isHighlighted: boolean,
  isFaded: boolean,
) {
  const {
    faded,
    highlighted,
    paddingAngle: basePaddingAngle = 0,
    cornerRadius: baseCornerRadius = 0,
  } = seriesDef;

  const {
    radius: { inner: baseInnerRadius = 0, label: baseArcLabelRadius, outer: baseOuterRadius },
  } = seriesLayout;

  const attributesOverride = {
    additionalRadius: 0,
    ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
  };
  const paddingAngle = Math.max(0, deg2rad(attributesOverride.paddingAngle ?? basePaddingAngle));
  const innerRadius = Math.max(0, attributesOverride.innerRadius ?? baseInnerRadius);

  const outerRadius = Math.max(
    0,
    attributesOverride.outerRadius ?? baseOuterRadius + attributesOverride.additionalRadius,
  );
  const cornerRadius = attributesOverride.cornerRadius ?? baseCornerRadius;

  const arcLabelRadius =
    attributesOverride.arcLabelRadius ?? baseArcLabelRadius ?? (innerRadius + outerRadius) / 2;

  return {
    paddingAngle,
    innerRadius,
    outerRadius,
    cornerRadius,
    arcLabelRadius,
  };
}
