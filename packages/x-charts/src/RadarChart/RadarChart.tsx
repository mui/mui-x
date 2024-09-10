import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useRadarChartProps } from './useRadarChartProps';

import {
  ResponsiveRadarChartContainer,
  ResponsiveRadarChartContainerProps,
} from './ResponsiveRadarChartContainer';
import { RadarGrid } from './RadarGrid';
import { RadarAreaPlot } from './RadarAreaPlot';
import { ChartsLegend, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '../ChartsOverlay';
import { MakeOptional } from '../models/helpers';
import { RadarSeriesType } from '../models/seriesType/radar';

export interface RadarChartSlots extends ChartsLegendSlots, ChartsOverlaySlots {}
export interface RadarChartSlotProps extends ChartsLegendSlotProps, ChartsOverlaySlotProps {}

export interface RadarChartProps
  extends Omit<ResponsiveRadarChartContainerProps, 'series' | 'plugins' | 'zAxis'>,
    ChartsOverlayProps {
  /**
   * The series to display in the radar chart.
   * An array of [[RadarSeriesType]] objects.
   */
  series: MakeOptional<RadarSeriesType, 'type'>[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RadarChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RadarChartSlotProps;
  children?: React.ReactNode;
}

export const RadarChart = React.forwardRef(function RadarChart(inProps: RadarChartProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadarChart' });
  const { children } = useRadarChartProps(props);

  const { radarChartContainerProps, overlayProps } = useRadarChartProps(props);

  return (
    <ResponsiveRadarChartContainer ref={ref} {...radarChartContainerProps}>
      {/* 
      
      <ChartsRadarHighlight />
      
      {!props.loading && <ChartsRadarTooltip />} */}

      <RadarGrid />
      <ChartsOverlay {...overlayProps} />

      <RadarAreaPlot />
      <ChartsLegend />
      {children}
    </ResponsiveRadarChartContainer>
  );
});
