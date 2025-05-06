import * as React from 'react';
import { RadarSeriesPlotClasses } from './radarSeriesPlotClasses';

interface CommonRadarSeriesPlotProps {
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarSeriesPlotClasses>;
}

export interface RadarSeriesPlotProps extends CommonRadarSeriesPlotProps {}

export interface RadarSeriesMarksProps
  extends CommonRadarSeriesPlotProps,
    React.SVGAttributes<SVGCircleElement> {}

export interface RadarSeriesAreaProps
  extends CommonRadarSeriesPlotProps,
    React.SVGAttributes<SVGPathElement> {}
