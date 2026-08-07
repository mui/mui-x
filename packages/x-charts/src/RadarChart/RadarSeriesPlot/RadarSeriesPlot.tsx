import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRadarSeriesData } from './useRadarSeriesData';
import type { RadarSeriesPlotProps } from './RadarSeriesPlot.types';
import { useInteractionAllItemProps } from './useInteractionAllItemProps';
import { useUtilityClasses } from '../radarClasses';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { getPathProps } from './RadarSeriesArea';
import { getCircleProps } from './RadarSeriesMarks';
import { useRadarRotationIndex } from './useRadarRotationIndex';
import { useChartsContext } from '../../context/ChartsProvider/useChartsContext';
import type { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import type { SeriesId } from '../../models/seriesType';

function RadarSeriesPlot(props: RadarSeriesPlotProps) {
  const { seriesId: inSeriesId, className, classes: inClasses, onAreaClick, onMarkClick } = props;
  const seriesCoordinates = useRadarSeriesData(inSeriesId);
  const getRotationIndex = useRadarRotationIndex();

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const { instance } = useChartsContext<[UseChartInteractionSignature]>();
  const getHighlightState = useItemHighlightStateGetter();

  /**
   * The radar area only knows its series, so the pointer item is resolved from the angle. Also
   * bound to `pointerdown`, because a touch tap may never produce a `pointermove`.
   */
  const handlePointerItem = (seriesId: SeriesId) => (event: React.PointerEvent<SVGPathElement>) => {
    instance.setHoveredItem?.({
      type: 'radar',
      seriesId,
      dataIndex: getRotationIndex(event),
    });
  };

  const classes = useUtilityClasses(inClasses);

  return (
    <g className={clsx(classes.seriesRoot, className)}>
      {seriesCoordinates?.map(
        ({ seriesId, points, color, hideMark, fillArea, hidden }, seriesIndex) => {
          if (hidden) {
            return null;
          }

          return (
            <g key={seriesId} data-series={seriesId}>
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
                  onPointerMove={handlePointerItem(seriesId)}
                  onPointerDown={handlePointerItem(seriesId)}
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
                    onPointerMove={() =>
                      instance.setHoveredItem?.({ type: 'radar', seriesId, dataIndex: index })
                    }
                    onPointerDown={() =>
                      instance.setHoveredItem?.({ type: 'radar', seriesId, dataIndex: index })
                    }
                  />
                ))}
            </g>
          );
        },
      )}
    </g>
  );
}

RadarSeriesPlot.propTypes /* remove-proptypes */ = {
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
