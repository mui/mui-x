import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { createSelectorMemoized } from '@mui/x-internals/store';
import type { TooltipItemPositionSelector } from '@mui/x-charts/internals';
import { selectorChartsTooltipItem } from '@mui/x-charts/internals';
import {
  selectorChartGeoData,
  selectorChartGeoFeatureIndexesByName,
  selectorChartProjection,
} from '../../internals/plugins/useGeoProjection/useGeoProjection.selectors';

const selectorTooltipItemPosition: TooltipItemPositionSelector = createSelectorMemoized(
  selectorChartsTooltipItem,
  selectorChartProjection,
  selectorChartGeoData,
  selectorChartGeoFeatureIndexesByName,
  (
    identifier: { type: string; name?: string } | null,
    projection,
    geoData,
    featureIndexesByName,
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
