import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { type RadarSeriesPlotProps } from './RadarSeriesPlot.types';
import { useInteractionAllItemProps } from './useInteractionAllItemProps';
import { useUtilityClasses as useDeprecatedUtilityClasses } from './radarSeriesPlotClasses';
import { useUtilityClasses } from '../radarClasses';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { getPathProps } from './RadarSeriesArea';
import { getCircleProps } from './RadarSeriesMarks';
import { useRadarRotationIndex } from './useRadarRotationIndex';

function RadarSeriesPlot(props: RadarSeriesPlotProps) {
  const { seriesId: inSeriesId, classes: inClasses, onAreaClick, onMarkClick } = props;
  const seriesCoordinates = useRadarSeriesData(inSeriesId);
  const getRotationIndex = useRadarRotationIndex();

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const getHighlightState = useItemHighlightStateGetter();

  const newClasses = useUtilityClasses();
  const deprecatedClasses = useDeprecatedUtilityClasses(inClasses);
  const classes = {
    ...deprecatedClasses,
    area: `${newClasses.seriesArea} ${deprecatedClasses.area}`,
    mark: `${newClasses.seriesMark} ${deprecatedClasses.mark}`,
  };

  return (
    <g className={`${newClasses.seriesRoot} ${deprecatedClasses.root}`}>
      {seriesCoordinates?.map(
        ({ seriesId, points, color, hideMark, fillArea, hidden }, seriesIndex) => {
          if (hidden) {
            return null;
          }

          return (
            <g key={seriesId}>
              {
                <path
                  key={seriesId}
                  {...getPathProps({
                    seriesId,
                    points,
                    color,
                    fillArea,
                    getHighlightState,
                    classes,
                  })}
                  onClick={(event) =>
                    onAreaClick?.(event, {
                      type: 'radar',
                      seriesId,
                      dataIndex: getRotationIndex(event),
                    })
                  }
                  cursor={onAreaClick ? 'pointer' : 'unset'}
                  {...interactionProps[seriesIndex]}
                />
              }
              {!hideMark &&
                points.map((point, index) => (
                  <circle
                    key={index}
                    {...getCircleProps({
                      seriesId,
                      point,
                      color: point.color,
                      fillArea,
                      getHighlightState,
                      classes,
                    })}
                    onClick={(event) =>
                      onMarkClick?.(event, { type: 'radar', seriesId, dataIndex: index })
                    }
                    cursor={onMarkClick ? 'pointer' : 'unset'}
                  />
                ))}
            </g>
          );
        },
      )}
    </g>
  );
}

RadarSeriesPlot.propTypes = {
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
  onAreaClick: PropTypes.func,
  /**
   * Callback fired when a mark is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
   */
  onMarkClick: PropTypes.func,
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesPlot };
