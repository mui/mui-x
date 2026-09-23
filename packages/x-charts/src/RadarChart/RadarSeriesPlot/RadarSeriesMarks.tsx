import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import type { RadarSeriesMarksProps } from './RadarSeriesPlot.types';
import { useUtilityClasses } from '../radarClasses';
import type { RadarClasses } from '../radarClasses';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { useInteractionAllItemProps } from './useInteractionAllItemProps';
import type { SeriesId } from '../../models/seriesType/common';
import type { HighlightItemIdentifierWithType } from '../../models';
import type { HighlightState } from '../../hooks/useItemHighlightState';
import {
  RADAR_ACTIVATION_PRIORITY,
  useRegisterRadarItemActivation,
} from './useRegisterRadarItemActivation';

interface GetCirclePropsParams {
  seriesId: SeriesId;
  classes: RadarClasses;
  getHighlightState: (item: HighlightItemIdentifierWithType<'radar'> | null) => HighlightState;
  point: { x: number; y: number };
  fillArea?: boolean;
  color: string;
}

export function getCircleProps(params: GetCirclePropsParams) {
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
    className: classes.seriesMark,
    'data-highlighted': isItemHighlighted || undefined,
    'data-faded': isItemFaded || undefined,
  };
}

function RadarSeriesMarks(props: RadarSeriesMarksProps) {
  const { seriesId, onItemClick, classes: inClasses, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  const classes = useUtilityClasses(inClasses);
  const getHighlightState = useItemHighlightStateGetter();
  // Clickable marks cover the area, so they report the series the same way it does. The index
  // still comes from the rotation axis, which is why the identifier stays series-level.
  const interactionProps = useInteractionAllItemProps(seriesCoordinates);

  useRegisterRadarItemActivation(seriesId, onItemClick, RADAR_ACTIVATION_PRIORITY.mark);

  return (
    <React.Fragment>
      {seriesCoordinates?.map(
        ({ seriesId: id, points, hideMark, fillArea, hidden }, seriesIndex) => {
          if (hideMark || hidden) {
            return null;
          }

          return (
            <g key={id} data-series={id}>
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
                  {...interactionProps[seriesIndex]}
                  {...other}
                />
              ))}
            </g>
          );
        },
      )}
    </React.Fragment>
  );
}

RadarSeriesMarks.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * Callback fired when a mark is clicked.
   * @param {ChartsActivationEvent<SVGElement>} event The event source of the callback.
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
