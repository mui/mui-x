import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import type { TooltipItemPositionGetter } from '@mui/x-charts/internals';
import { useGeoProjectionSelectors } from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'mapShape'> = (params) => {
  const { series, identifier, store, placement } = params;

  if (!identifier || identifier.name === undefined) {
    return null;
  }
  const itemSeries = series.mapShape?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  // The geo projection lives in a feature plugin only registered by map charts,
  // so the map series reads it from the store here instead of the core tooltip
  // plugin injecting it for every chart (which would bundle d3-geo everywhere).
  const { projection, geoData, featureIndexesByName } =
    useGeoProjectionSelectors.selectorGeoTooltipPosition(store.state);

  if (projection == null || geoData == null) {
    return null;
  }

  const featureIndex = featureIndexesByName.get(identifier.name)?.[0];

  if (featureIndex === undefined) {
    return null;
  }

  const feature = geoData.features[featureIndex];

  const path = geoPath(projection);

  const [[x0, y0], [x1, y1]] = path.bounds(feature);

  switch (placement) {
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
};

export default tooltipItemPositionGetter;
