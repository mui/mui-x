import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { createSelectorMemoized } from '@mui/x-internals/store';
import type { TooltipItemPositionSelector } from '@mui/x-charts/internals';
import { selectorChartsTooltipItem } from '@mui/x-charts/internals';
import { selectorGeoTooltipPosition } from '../../internals/plugins/useGeoProjection';

/**
 * Positions a map shape tooltip from the geo projection. It lives in the map
 * series config (rather than the core tooltip plugin) so the geo projection is a
 * tracked dependency and d3-geo is only bundled with map charts.
 */
const selectorTooltipItemPosition: TooltipItemPositionSelector = createSelectorMemoized(
  selectorChartsTooltipItem,
  selectorGeoTooltipPosition,
  // `selectorChartsTooltipItem` is typed with the community series types, which
  // don't include `mapShape`, so the identifier is matched structurally here.
  (
    identifier: { type: string; name?: string } | null,
    { projection, geoData, featureIndexesByName },
    position: 'top' | 'bottom' | 'left' | 'right' | undefined,
  ) => {
    if (identifier?.type !== 'mapShape' || identifier.name === undefined) {
      return null;
    }

    if (projection == null || geoData == null) {
      return null;
    }

    const featureIndex = featureIndexesByName.get(identifier.name)?.[0];

    if (featureIndex === undefined) {
      return null;
    }

    const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(geoData.features[featureIndex]);

    switch (position) {
      case 'right':
        return { x: x1, y: (y0 + y1) / 2 };
      case 'bottom':
        return { x: (x0 + x1) / 2, y: y1 };
      case 'left':
        return { x: x0, y: (y0 + y1) / 2 };
      case 'top':
      default:
        return { x: (x0 + x1) / 2, y: y0 };
    }
  },
);

export default selectorTooltipItemPosition;
