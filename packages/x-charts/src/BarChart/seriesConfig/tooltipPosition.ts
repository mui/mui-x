import { ComputedAxis } from '../../models/axis';
import type { TooltipItemPositionGetter } from '../../internals/plugins/models/seriesConfig/tooltipItemPositionGetter.types';
import { getBandSize, getValueCoordinate } from '../useBarPlotData';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'bar'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.bar?.series[identifier.seriesId];

  if (series.bar == null || itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const xScale = axesConfig.x.scale;
  const yScale = axesConfig.y.scale;

  const verticalLayout = itemSeries.layout === 'vertical';

  const baseAxisConfig = (verticalLayout ? axesConfig.x : axesConfig.y)! as ComputedAxis<'band'>;

  const bandWidth = baseAxisConfig.scale.bandwidth();

  const { barWidth, offset } = getBandSize({
    bandWidth,
    numberOfGroups: series.bar.stackingGroups.length,
    gapRatio: baseAxisConfig.barGapRatio,
  });
  const groupIndex = series.bar.stackingGroups.findIndex((group) =>
    group.ids.includes(itemSeries.id),
  );
  const barOffset = groupIndex * (barWidth + offset);

  const baseValue = baseAxisConfig.data?.[identifier.dataIndex];

  if (baseValue == null || itemSeries.data[identifier.dataIndex] == null) {
    return null;
  }

  const values = itemSeries.stackedData[identifier.dataIndex];
  const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

  const minValueCoord = Math.round(Math.min(...valueCoordinates));
  const maxValueCoord = Math.round(Math.max(...valueCoordinates));

  const { barSize, startCoordinate } = getValueCoordinate(
    verticalLayout,
    minValueCoord,
    maxValueCoord,
    itemSeries.data[identifier.dataIndex],
    itemSeries.minBarSize,
  );

  const x = verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate;
  const y = verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset;
  const height = verticalLayout ? barSize : barWidth;
  const width = verticalLayout ? barWidth : barSize;

  switch (placement) {
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'top':
    default:
      return { x: x + width / 2, y };
  }
};

export default tooltipItemPositionGetter;
