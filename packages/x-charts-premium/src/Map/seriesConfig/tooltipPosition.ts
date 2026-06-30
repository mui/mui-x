import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { createSelectorMemoized } from '@mui/x-internals/store';
import type { TooltipItemPositionSelector } from '@mui/x-charts/internals';
import { selectorChartsTooltipItem, useGeoProjectionSelectors } from '@mui/x-charts/internals';

/**
 * Positions a map shape tooltip from the geo projection. It lives in the map
 * series config (rather than the core tooltip plugin) so the geo projection is a
 * tracked dependency and d3-geo is only bundled with map charts.
 */
const tooltipItemPositionSelector: TooltipItemPositionSelector = createSelectorMemoized(
  selectorChartsTooltipItem,
  useGeoProjectionSelectors.selectorGeoTooltipPosition,
  (identifier, { projection, geoData, featureIndexesByName }, position) => {
    if (identifier?.type !== 'mapShape' || projection == null || geoData == null) {
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

export default tooltipItemPositionSelector;
