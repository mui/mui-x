import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { type RadarSeriesAreaProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';
import { useUtilityClasses, type RadarClasses } from '../radarClasses';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { useInteractionAllItemProps } from './useInteractionAllItemProps';
import type { SeriesId, HighlightItemIdentifierWithType } from '../../models/seriesType';
import type { HighlightState } from '../../hooks/useItemHighlightState';
import { useRadarRotationIndex } from './useRadarRotationIndex';

interface GetPathPropsParams {
  seriesId: SeriesId;
  classes: RadarClasses;
  getHighlightState: (item: HighlightItemIdentifierWithType<'radar'> | null) => HighlightState;
  points: { x: number; y: number }[];
  fillArea?: boolean;
  color: string;
}

export function getPathProps(params: GetPathPropsParams) {
  const { getHighlightState, seriesId, classes, points, fillArea, color } = params;
  const highlightState = getHighlightState({ type: 'radar', seriesId });
  const isItemHighlighted = highlightState === 'highlighted';
  const isItemFaded = highlightState === 'faded';

  return {
    d: getAreaPath(points),
    fill: fillArea ? color : 'transparent',
    stroke: color,
    className: classes.seriesArea,
    strokeOpacity: isItemFaded ? 0.5 : 1,
    fillOpacity: (isItemHighlighted && 0.4) || (isItemFaded && 0.1) || 0.2,
    strokeWidth: !fillArea && isItemHighlighted ? 2 : 1,
    'data-highlighted': isItemHighlighted || undefined,
    'data-faded': isItemFaded || undefined,
  };
}

function RadarSeriesArea(props: RadarSeriesAreaProps) {
  const { seriesId, onItemClick, classes: inClasses, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(seriesId);
  const getRotationIndex = useRadarRotationIndex();

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const getHighlightState = useItemHighlightStateGetter<'radar'>();

  const classes = useUtilityClasses(inClasses);
  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, color, fillArea, hidden }, seriesIndex) => {
        if (hidden) {
          return null;
        }

        return (
          <path
            key={id}
            {...getPathProps({
              seriesId: id,
              points,
              color,
              fillArea,
              getHighlightState,
              classes,
            })}
            onClick={(event) =>
              onItemClick?.(event, {
                type: 'radar',
                seriesId: id,
                dataIndex: getRotationIndex(event),
              })
            }
            cursor={onItemClick ? 'pointer' : 'unset'}
            {...interactionProps[seriesIndex]}
            {...other}
          />
        );
      })}
    </React.Fragment>
  );
}

RadarSeriesArea.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Callback fired when an area is clicked.
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

export { RadarSeriesArea };
