import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesPlotProps } from './RadarSeriesPlot.types';
import { useInteractionAllItemProps } from '../../hooks/useInteractionItemProps';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { useUtilityClasses } from './radarSeriesPlotClasses';
import { getPathProps } from './RadarSeriesArea';
import { getCircleProps } from './RadarSeriesMarks';

function RadarSeriesPlot(props: RadarSeriesPlotProps) {
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  const classes = useUtilityClasses(props.classes);

  return (
    <g className={classes.root}>
      {seriesCoordinates?.map(({ seriesId, points, color, hideMark, fillArea }, seriesIndex) => {
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
                  isFaded,
                  isHighlighted,
                  classes,
                })}
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
                    color,
                    fillArea,
                    isFaded,
                    isHighlighted,
                    classes,
                  })}
                />
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
