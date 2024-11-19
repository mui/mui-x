import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { ItemInteractionData } from '../internals/plugins/models';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import { DefaultChartsItemTooltipContent } from './DefaultChartsItemTooltipContent';
import { useCartesianContext } from '../context/CartesianProvider';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useColorProcessor } from '../context/PluginProvider/useColorProcessor';
import { useSeries } from '../hooks/useSeries';

export interface ChartsItemContentProps<T extends ChartSeriesType> {
  /**
   * The data used to identify the triggered item.
   */
  itemData: ItemInteractionData<T>;
  /**
   * The series linked to the triggered item.
   */
  series: ChartSeriesDefaultized<T>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: ChartsTooltipClasses;
  /**
   * Get the color of the item with index `dataIndex`.
   * @param {number} dataIndex The data index of the item.
   * @returns {string} The color to display.
   */
  getColor: (dataIndex: number) => string;
  sx?: SxProps<Theme>;
}

export interface ChartsItemTooltipContentProps<T extends ChartSeriesType> {
  itemData: ItemInteractionData<T>;
  content?: React.ElementType<ChartsItemContentProps<T>>;
  contentProps?: Partial<ChartsItemContentProps<T>>;
  sx?: SxProps<Theme>;
  classes: ChartsItemContentProps<T>['classes'];
}

/**
 * @ignore - internal component.
 */
function ChartsItemTooltipContent<T extends ChartSeriesType>(
  props: ChartsItemTooltipContentProps<T>,
) {
  const { content, itemData, sx, classes, contentProps } = props;

  const series = useSeries()[itemData.type]!.series[itemData.seriesId] as ChartSeriesDefaultized<T>;

  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);
  const colorProcessors = useColorProcessor();

  const xAxisId = (series as any).xAxisId ?? xAxisIds[0];
  const yAxisId = (series as any).yAxisId ?? yAxisIds[0];
  const zAxisId = (series as any).zAxisId ?? zAxisIds[0];

  const getColor =
    colorProcessors[series.type]?.(
      series as any,
      xAxisId && xAxis[xAxisId],
      yAxisId && yAxis[yAxisId],
      zAxisId && zAxis[zAxisId],
    ) ?? (() => '');

  const Content = content ?? DefaultChartsItemTooltipContent;
  const chartTooltipContentProps = useSlotProps({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      itemData,
      series,
      sx,
      classes,
      getColor,
    },
    ownerState: {},
  });
  return <Content {...chartTooltipContentProps} />;
}

export { ChartsItemTooltipContent };
