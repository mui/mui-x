import type { TooltipItemPositionGetter } from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'mapPoint'> = (params) => {
  const { series, identifier, axesConfig } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.mapPoint?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  if (axesConfig.geo === undefined) {
    return null;
  }

  const { projection } = axesConfig.geo;

  if (projection == null) {
    return null;
  }

  const item = itemSeries.data?.[identifier.dataIndex];

  if (item == null) {
    return null;
  }

  const point = projection(item.coordinates);

  if (point == null) {
    return null;
  }

  return { x: point[0], y: point[1] };
};

export default tooltipItemPositionGetter;
