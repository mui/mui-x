import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesPlotProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';
import { useInteractionAllItemProps } from '../../hooks/useInteractionItemProps';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { useUtilityClasses } from './radarSeriesPlotClasses';

function RadarSeriesPlot(props: RadarSeriesPlotProps) {
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  const classes = useUtilityClasses(props.classes);

  return (
    <g className={classes.root}>
      {seriesCoordinates?.map(({ seriesId, points, color, showMark }, seriesIndex) => {
        const isItemHighlighted = isHighlighted({ seriesId });
        const isItemFaded = !isItemHighlighted && isFaded({ seriesId });

        return (
          <g key={seriesId}>
            {
              <path
                key={seriesId}
                d={getAreaPath(points)}
                {...interactionProps[seriesIndex]}
                className={
                  (isItemHighlighted && classes.highlighted) ||
                  (isItemFaded && classes.faded) ||
                  undefined
                }
                fill={color}
                stroke={color}
                filter={isItemHighlighted ? 'brightness(120%)' : undefined}
                strokeOpacity={isItemFaded ? 0.5 : 1}
                fillOpacity={isItemFaded ? 0.1 : 0.4}
              />
            }
            {showMark &&
              points.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r={5} fill={color} stroke={color} />
              ))}
          </g>
        );
      })}
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
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesPlot };
