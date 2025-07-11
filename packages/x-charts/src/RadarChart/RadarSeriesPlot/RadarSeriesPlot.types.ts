import * as React from 'react';
import { RadarSeriesPlotClasses } from './radarSeriesPlotClasses';
import { RadarItemIdentifier } from '../../models/seriesType/radar';

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

export interface RadarSeriesPlotProps extends CommonRadarSeriesPlotProps {
  /**
    * Callback fired when an area element is clicked.
    */
  onAreaClick?: RadarSeriesAreaProps['onItemClick'];
  /**
   * Callback fired when a line element is clicked.
   */
  onMarkClick?: RadarSeriesMarksProps['onItemClick'];
}

export interface RadarSeriesMarksProps
  extends CommonRadarSeriesPlotProps,
  React.SVGAttributes<SVGCircleElement> {
  /**
     * Callback fired when a mark is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The line item identifier.
     */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    radarItemIdentifier: Required<RadarItemIdentifier>,
  ) => void;
}

export interface RadarSeriesAreaProps
  extends CommonRadarSeriesPlotProps,
  React.SVGAttributes<SVGPathElement> {
  /**
   * Callback fired when an area is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The line item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    radarItemIdentifier: Omit<RadarItemIdentifier, 'dataIndex'>,
  ) => void;
}
