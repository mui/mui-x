import useId from '@mui/utils/useId';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import type { RadarChartProps } from './RadarChart';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { ChartsOnAxisClickHandlerProps } from '../ChartsOnAxisClickHandler';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsTooltipProps } from '../ChartsTooltip';
import { ResponsiveRadarChartContainerProps } from './ResponsiveRadarChartContainer';

/**
 * A helper function that extracts RadarChartProps from the input props
 * and returns an object with props for the children components of RadarChart.
 *
 * @param props The input props for RadarChart
 * @returns An object with props for the children components of RadarChart
 */
export const useRadarChartProps = (props: RadarChartProps) => {
  const {
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    tooltip,
    onAxisClick,
    onAreaClick,
    onRadarClick,
    onMarkClick,
    axisHighlight,
    disableRadarItemHighlight,
    legend,
    grid,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    radar,
    ...other
  } = props;


  const radarChartContainerProps: ResponsiveRadarChartContainerProps = {
    ...other,
    series: series.map((s) => ({
      disableHighlight: !!disableRadarItemHighlight,
      // type: 'radar' as const,
      ...s,
    })),
    width,
    height,
    margin,
    colors,
    sx,
    // highlightedItem,
    // onHighlightChange,
    // disableAxisListener:
    //   tooltip?.trigger !== 'axis' &&
    //   axisHighlight?.x === 'none' &&
    //   axisHighlight?.y === 'none' &&
    //   !onAxisClick,
    radar,
    className,
  };

  // const axisClickHandlerProps: ChartsOnAxisClickHandlerProps = {
  //   onAxisClick,
  // };

  // const gridProps: ChartsGridProps = {
  //   vertical: grid?.vertical,
  //   horizontal: grid?.horizontal,
  // };

  // const clipPathGroupProps = {
  //   clipPath: `url(#${clipPathId})`,
  // };

  // const clipPathProps: ChartsClipPathProps = {
  //   id: clipPathId,
  // };

  // const areaPlotProps: AreaPlotProps = {
  //   slots,
  //   slotProps,
  //   onItemClick: onAreaClick,
  //   skipAnimation,
  // };

  // const RadarPlotProps: RadarPlotProps = {
  //   slots,
  //   slotProps,
  //   onItemClick: onRadarClick,
  //   skipAnimation,
  // };

  // const markPlotProps: MarkPlotProps = {
  //   slots,
  //   slotProps,
  //   onItemClick: onMarkClick,
  //   skipAnimation,
  // };

  // const overlayProps: ChartsOverlayProps = {
  //   slots,
  //   slotProps,
  //   loading,
  // };

  // const axisHighlightProps: ChartsAxisHighlightProps = {
  //   x: 'Radar' as const,
  //   ...axisHighlight,
  // };

  // const legendProps: ChartsLegendProps = {
  //   ...legend,
  //   slots,
  //   slotProps,
  // };

  return {
    radarChartContainerProps,
    children,
  };
};
