import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesPlotProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';
import { useInteractionAllItemProps } from '../../hooks/useInteractionItemProps';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';

function RadarSeriesPlot(props: RadarSeriesPlotProps) {
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

RadarSeriesPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesPlot };
