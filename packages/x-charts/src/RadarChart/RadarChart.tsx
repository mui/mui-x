import * as React from 'react';
import PropTypes from 'prop-types';
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
import { RadarTooltip } from './RadarTooltip';
import { RadarLabels } from './RadarLabels';
import { RadarPlot } from './RadarPlot/RadarPlot';

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

const RadarChart = React.forwardRef(function RadarChart(inProps: RadarChartProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadarChart' });

  const { radarChartContainerProps, overlayProps, radarGridProps, children } =
    useRadarChartProps(props);

  return (
    <ResponsiveRadarChartContainer ref={ref} {...radarChartContainerProps}>
      {/* 
                  <ChartsRadarHighlight />
                  {!props.loading && <RadarTooltip />} */}

      <RadarGrid {...radarGridProps} />
      <ChartsOverlay {...overlayProps} />
      <RadarAreaPlot />
      <RadarPlot />
      <ChartsLegend />
      <RadarLabels />
      <RadarTooltip />
      {children}
    </ResponsiveRadarChartContainer>
  );
});

RadarChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  radar: PropTypes.shape({
    divisionNumber: PropTypes.number,
    max: PropTypes.number,
    metrics: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(
        PropTypes.shape({
          max: PropTypes.number,
          min: PropTypes.number,
          name: PropTypes.string.isRequired,
        }),
      ),
    ]).isRequired,
    startAngle: PropTypes.number,
  }).isRequired,
  /**
   * The series to display in the radar chart.
   * An array of [[RadarSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { RadarChart };
