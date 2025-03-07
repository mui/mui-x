import * as React from 'react';

interface CommonRadarSeriesPlotProps {
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId?: string;
}

export interface RadarSeriesPlotProps extends CommonRadarSeriesPlotProps {}

export interface RadarSeriesMarksProps
  extends CommonRadarSeriesPlotProps,
    React.SVGAttributes<SVGCircleElement> {}

export interface RadarSeriesAreaProps
  extends CommonRadarSeriesPlotProps,
    React.SVGAttributes<SVGPathElement> {}
