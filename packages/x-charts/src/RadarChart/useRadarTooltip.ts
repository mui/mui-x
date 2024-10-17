import * as React from 'react';
import { InteractionContext, ItemInteractionData } from '../context/InteractionProvider';
import { useSeries } from '../hooks/useSeries';
import { ChartSeriesType } from '../models/seriesType/config';
import { getLabel } from '../internals/getLabel';
import { CommonSeriesType } from '../models/seriesType/common';
import { RadarItemIdentifier } from '../models/seriesType/radar';
import { usePolarContext } from '../context/PolarProvider';

export interface RadarTooltipPoint {
  label: string | undefined;
  value: number;
  formattedValue: string | undefined;
}

export interface UseRadarSeriesTooltipReturnValue {
  identifier: RadarItemIdentifier;
  color: string;
  seriesLabel: string | undefined;
  /**
   * The point of the tooltip. It can either be:
   * - an array of objects if the identifier has no index.
   * - a single object if the identifier has index.
   */
  points: RadarTooltipPoint | RadarTooltipPoint[];
}

function isRadarItem(item: ItemInteractionData<ChartSeriesType>): item is RadarItemIdentifier {
  return item.type === 'radar';
}
export function useRadarSeriesTooltip(): null | UseRadarSeriesTooltipReturnValue {
  const { item } = React.useContext(InteractionContext);
  const series = useSeries();

  const { radiusAxis, radiusAxisIds } = usePolarContext();

  if (!item || !isRadarItem(item)) {
    return null;
  }

  const itemSeries = series.radar!.series[item.seriesId];

  const seriesLabel = getLabel(itemSeries.label, 'tooltip');

  if (item.dataIndex !== undefined) {
    const value = itemSeries.data[item.dataIndex];
    const formattedValue = (
      itemSeries.valueFormatter as CommonSeriesType<typeof value>['valueFormatter']
    )?.(value, { dataIndex: item.dataIndex });

    const label = radiusAxis[radiusAxisIds[item.dataIndex]].label;

    return {
      identifier: item,
      color: itemSeries.color,
      seriesLabel,
      points: {
        label,
        value,
        formattedValue,
      },
    };
  }

  const points = itemSeries.data.map((value, dataIndex) => {
    const formattedValue = (
      itemSeries.valueFormatter as CommonSeriesType<typeof value>['valueFormatter']
    )?.(value, { dataIndex });

    const label = radiusAxis[radiusAxisIds[dataIndex]].label;
    return {
      label,
      value,
      formattedValue,
    };
  });

  return {
    identifier: item,
    color: itemSeries.color,
    seriesLabel,
    points,
  };
}
