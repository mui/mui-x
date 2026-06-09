import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import type { TooltipItemPositionGetter } from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'mapShape'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.mapShape?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  if (axesConfig.geo === undefined) {
    return null;
  }

  const { projection, geoData, featureIndexesByName } = axesConfig.geo;

  if (projection == null || geoData == null) {
    return null;
  }

  const featureIndex = featureIndexesByName.get(itemSeries.data[identifier.dataIndex].name)?.[0];

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
