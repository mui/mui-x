import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { AxisInteractionData } from '../context/InteractionProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import { DefaultChartsAxisTooltipContent } from './DefaultChartsAxisTooltipContent';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useColorProcessor } from '../context/PluginProvider/useColorProcessor';
import { isCartesianSeriesType } from '../internals/isCartesian';
import { useSeries } from '../hooks/useSeries';

type ChartSeriesDefaultizedWithColorGetter = ChartSeriesDefaultized<ChartSeriesType> & {
  getColor: (dataIndex: number) => string;
};

export type ChartsAxisContentProps = {
  /**
   * Data identifying the triggered axis.
   */
  axisData: AxisInteractionData;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeriesDefaultizedWithColorGetter[];
  /**
   * The properties of the triggered axis.
   */
  axis: AxisDefaultized;
  /**
   * The index of the data item triggered.
   */
  dataIndex?: null | number;
  /**
   * The value associated to the current mouse position.
   */
  axisValue: string | number | Date | null;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: ChartsTooltipClasses;
  sx?: SxProps<Theme>;
};

/**
 * @ignore - internal component.
 */
function ChartsAxisTooltipContent(props: {
  axisData: AxisInteractionData;
  content?: React.ElementType<ChartsAxisContentProps>;
  contentProps?: Partial<ChartsAxisContentProps>;
  sx?: SxProps<Theme>;
  classes: ChartsAxisContentProps['classes'];
}) {
  const { content, contentProps, axisData, sx, classes } = props;

  const isXaxis = (axisData.x && axisData.x.index) !== undefined;

  const dataIndex = isXaxis ? axisData.x && axisData.x.index : axisData.y && axisData.y.index;
  const axisValue = isXaxis ? axisData.x && axisData.x.value : axisData.y && axisData.y.value;

  const { xAxisIds, xAxis, yAxisIds, yAxis } = useCartesianContext();
  const { zAxisIds, zAxis } = React.useContext(ZAxisContext);
  const series = useSeries();

  const colorProcessors = useColorProcessor();

  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];

  const relevantSeries = React.useMemo(() => {
    const rep: any[] = [];
    Object.keys(series)
      .filter(isCartesianSeriesType)
      .forEach((seriesType) => {
        series[seriesType]!.seriesOrder.forEach((seriesId) => {
          const item = series[seriesType]!.series[seriesId];

          const providedXAxisId = item.xAxisId ?? item.xAxisKey;
          const providedYAxisId = item.yAxisId ?? item.yAxisKey;

          const axisKey = isXaxis ? providedXAxisId : providedYAxisId;

          if (axisKey === undefined || axisKey === USED_AXIS_ID) {
            const seriesToAdd = series[seriesType]!.series[seriesId];

            const xAxisId = providedXAxisId ?? xAxisIds[0];
            const yAxisId = providedYAxisId ?? yAxisIds[0];
            const zAxisId =
              (seriesToAdd as any).zAxisId ?? (seriesToAdd as any).zAxisKey ?? zAxisIds[0];

            const getColor =
              colorProcessors[seriesType]?.(
                seriesToAdd as any,
                xAxis[xAxisId],
                yAxis[yAxisId],
                zAxisId && zAxis[zAxisId],
              ) ?? (() => '');

            rep.push({ ...seriesToAdd, getColor });
          }
        });
      });
    return rep;
  }, [
    USED_AXIS_ID,
    colorProcessors,
    isXaxis,
    series,
    xAxis,
    xAxisIds,
    yAxis,
    yAxisIds,
    zAxis,
    zAxisIds,
  ]);

  const relevantAxis = React.useMemo(() => {
    return isXaxis ? xAxis[USED_AXIS_ID] : yAxis[USED_AXIS_ID];
  }, [USED_AXIS_ID, isXaxis, xAxis, yAxis]);

  const Content = content ?? DefaultChartsAxisTooltipContent;
  const chartTooltipContentProps = useSlotProps({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      axisData,
      series: relevantSeries,
      axis: relevantAxis,
      dataIndex,
      axisValue,
      sx,
      classes,
    },
    ownerState: {},
  });
  return <Content {...chartTooltipContentProps} />;
}

export { ChartsAxisTooltipContent };
