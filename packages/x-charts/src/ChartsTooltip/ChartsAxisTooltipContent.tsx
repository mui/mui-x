import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { AxisInteractionData } from '../context/InteractionProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import { DefaultChartsAxisTooltipContent } from './DefaultChartsAxisTooltipContent';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useColorProcessor } from '../hooks/useColor';
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
          const axisKey = isXaxis ? item.xAxisKey : item.yAxisKey;
          if (axisKey === undefined || axisKey === USED_AXIS_ID) {
            const seriesToAdd = series[seriesType]!.series[seriesId];

            const zAxisKey = (seriesToAdd as any).zAxisKey ?? zAxisIds[0];

            const getColor =
              colorProcessors[seriesType]?.(
                seriesToAdd as any,
                xAxis[seriesToAdd.xAxisKey ?? xAxisIds[0]],
                yAxis[seriesToAdd.yAxisKey ?? yAxisIds[0]],
                zAxisKey && zAxis[zAxisKey],
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

ChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  axisData: PropTypes.shape({
    x: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
        .isRequired,
    }),
    y: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
        .isRequired,
    }),
  }).isRequired,
  classes: PropTypes.object.isRequired,
  content: PropTypes.elementType,
  contentProps: PropTypes.shape({
    axis: PropTypes.object,
    axisData: PropTypes.shape({
      x: PropTypes.shape({
        index: PropTypes.number,
        value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
          .isRequired,
      }),
      y: PropTypes.shape({
        index: PropTypes.number,
        value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
          .isRequired,
      }),
    }),
    axisValue: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number,
      PropTypes.string,
    ]),
    classes: PropTypes.object,
    dataIndex: PropTypes.number,
    series: PropTypes.arrayOf(PropTypes.object),
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
      PropTypes.func,
      PropTypes.object,
    ]),
  }),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsAxisTooltipContent };
