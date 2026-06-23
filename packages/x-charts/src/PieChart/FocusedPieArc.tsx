'use client';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { usePieSeriesContext, usePieSeriesLayout } from '../hooks/usePieSeries';
import { PieArc, type PieArcProps } from './PieArc';
import { useUtilityClasses } from './pieClasses';
import { useItemHighlightState } from '../hooks/useItemHighlightState';
import { getModifiedArcProperties } from './dataTransform/getModifiedArcProperties';

function FocusedPieArc(
  props: Partial<
    Omit<
      PieArcProps,
      | 'startAngle'
      | 'endAngle'
      | 'seriesId'
      | 'dataIndex'
      | 'isFaded'
      | 'isHighlighted'
      | 'isFocused'
    >
  >,
) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();
  const pieSeriesLayout = usePieSeriesLayout();

  const highlightState = useItemHighlightState(focusedItem);
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';
  const pieSeries = usePieSeriesContext();

  const classes = useUtilityClasses();
  if (focusedItem === null || focusedItem.type !== 'pie' || !pieSeries) {
    return null;
  }

  const series = pieSeries?.series[focusedItem.seriesId];
  const { center, radius } = pieSeriesLayout[focusedItem.seriesId];

  if (!series || !center || !radius) {
    return null;
  }

  const item = series.data[focusedItem.dataIndex];

  if (!item || item.hidden) {
    return null;
  }

  const { arcLabelRadius, ...arcSizes } = getModifiedArcProperties(
    series,
    pieSeriesLayout[focusedItem.seriesId],
    isHighlighted,
    isFaded,
  );

  return (
    <PieArc
      transform={`translate(${pieSeriesLayout[series.id].center.x}, ${pieSeriesLayout[series.id].center.y})`}
      startAngle={item.startAngle}
      endAngle={item.endAngle}
      color="transparent"
      pointerEvents="none"
      skipInteraction
      skipAnimation
      stroke={(theme.vars ?? theme).palette.text.primary}
      seriesId={series.id}
      className={classes.focusIndicator}
      dataIndex={focusedItem.dataIndex}
      isFaded={false}
      isHighlighted={false}
      isFocused={false}
      strokeWidth={3}
      {...arcSizes}
      {...props}
    />
  );
}

FocusedPieArc.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  cornerRadius: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  paddingAngle: PropTypes.number,
  /**
   * If `true`, the animation is disabled.
   */
  skipAnimation: PropTypes.bool,
  /**
   * If `true`, the default event handlers are disabled.
   * Those are used, for example, to display a tooltip or highlight the arc on hover.
   */
  skipInteraction: PropTypes.bool,
} as any;

export { FocusedPieArc };
