import type * as React from 'react';
import { type RadarSeriesPlotClasses } from './radarSeriesPlotClasses';
import { type RadarItemIdentifier } from '../../models/seriesType/radar';

export interface RadarSeriesAreaClasses extends RadarSeriesPlotClasses {}

export interface RadarSeriesMarksClasses extends RadarSeriesPlotClasses {}

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
   * Callback fired when an area is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
   */
  onAreaClick?: RadarSeriesAreaProps['onItemClick'];
  /**
   * Callback fired when a mark is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
   */
  onMarkClick?: RadarSeriesMarksProps['onItemClick'];
}

type RadarClickIdentifier = Required<RadarItemIdentifier>;

export interface RadarSeriesMarksProps
  extends CommonRadarSeriesPlotProps, React.SVGAttributes<SVGCircleElement> {
  /**
   * Callback fired when a mark is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    radarItemIdentifier: RadarClickIdentifier,
  ) => void;
}

export interface RadarSeriesAreaProps
  extends CommonRadarSeriesPlotProps, React.SVGAttributes<SVGPathElement> {
  /**
   * Callback fired when an area is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    radarItemIdentifier: RadarClickIdentifier,
  ) => void;
}
