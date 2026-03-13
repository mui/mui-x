import * as React from 'react';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { type RadarSeriesMarksProps } from './RadarSeriesPlot.types';
import {
  type RadarSeriesPlotClasses,
  useUtilityClasses as useDeprecatedUtilityClasses,
} from './radarSeriesPlotClasses';
import { useUtilityClasses } from '../radarClasses';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { type SeriesId } from '../../models/seriesType/common';
import type { HighlightItemIdentifierWithType } from '../../models';
import type { HighlightState } from '../../hooks/useItemHighlightState';

interface GetCirclePropsParams {
  seriesId: SeriesId;
  classes: RadarSeriesPlotClasses;
  getHighlightState: (item: HighlightItemIdentifierWithType<'radar'> | null) => HighlightState;
  point: { x: number; y: number };
  fillArea?: boolean;
  color: string;
}

export function getCircleProps(params: GetCirclePropsParams): React.SVGProps<SVGCircleElement> {
  const { getHighlightState, seriesId, classes, point, fillArea, color } = params;
  const highlightState = getHighlightState({ type: 'radar', seriesId });
  const isItemHighlighted = highlightState === 'highlighted';
  const isItemFaded = highlightState === 'faded';

  return {
    cx: point.x,
    cy: point.y,
    r: 3,
    fill: color,
    stroke: color,
    opacity: fillArea && isItemFaded ? 0.5 : 1,
    className: clsx(
      classes.mark,
      (isItemHighlighted && classes.highlighted) || (isItemFaded && classes.faded),
    ),
  };
}

function RadarSeriesMarks(props: RadarSeriesMarksProps) {
  const { seriesId, onItemClick, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  const newClasses = useUtilityClasses();
  const deprecatedClasses = useDeprecatedUtilityClasses(props.classes);
  const classes = {
    ...deprecatedClasses,
    area: `${newClasses.seriesArea} ${deprecatedClasses.area}`,
    mark: `${newClasses.seriesMark} ${deprecatedClasses.mark}`,
  };
  const getHighlightState = useItemHighlightStateGetter();

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, hideMark, fillArea, hidden }) => {
        if (hideMark || hidden) {
          return null;
        }

        return (
          <g key={id}>
            {points.map((point, index) => (
              <circle
                key={index}
                {...getCircleProps({
                  seriesId: id,
                  point,
                  color: point.color,
                  fillArea,
                  getHighlightState,
                  classes,
                })}
                pointerEvents={onItemClick ? undefined : 'none'}
                onClick={(event) =>
                  onItemClick?.(event, { type: 'radar', seriesId: id, dataIndex: index })
                }
                cursor={onItemClick ? 'pointer' : 'unset'}
                {...other}
              />
            ))}
          </g>
        );
      })}
    </React.Fragment>
  );
}

RadarSeriesMarks.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Callback fired when a mark is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesMarks };
