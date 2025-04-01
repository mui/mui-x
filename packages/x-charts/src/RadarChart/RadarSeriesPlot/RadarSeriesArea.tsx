import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesAreaProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';
import { useUtilityClasses } from './radarSeriesPlotClasses';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { useInteractionAllItemProps } from '../../hooks/useInteractionItemProps';

function RadarSeriesArea(props: RadarSeriesAreaProps) {
  const { seriesId, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(seriesId);

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  const classes = useUtilityClasses(props.classes);
  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, color, fillArea }, seriesIndex) => {
        const isItemHighlighted = isHighlighted({ seriesId: id });
        const isItemFaded = !isItemHighlighted && isFaded({ seriesId: id });

        return (
          <path
            key={id}
            d={getAreaPath(points)}
            {...interactionProps[seriesIndex]}
            fill={fillArea ? color : 'transparent'}
            stroke={color}
            className={
              (isItemHighlighted && classes.highlighted) ||
              (isItemFaded && classes.faded) ||
              undefined
            }
            strokeOpacity={isItemFaded ? 0.5 : 1}
            fillOpacity={(isItemHighlighted && 0.4) || (isItemFaded && 0.1) || 0.2}
            strokeWidth={!fillArea && isItemHighlighted ? 2 : 1}
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
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesArea };
