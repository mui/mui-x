'use client';
import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import { BarLabel, barClasses } from '@mui/x-charts/BarChart';
import type { BarLabelSlotProps, BarLabelSlots } from '@mui/x-charts/BarChart';
import { useItemHighlightState } from '@mui/x-charts/hooks';
import type { RangeBarSeriesType } from '../../models';
import type { ProcessedRangeBarData, ProcessedRangeBarSeriesData } from './types';
import { getRangeBarLabel } from './getRangeBarLabel';

interface RangeBarLabelPlotProps {
  processedSeries: ProcessedRangeBarSeriesData;
  className: string;
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation: boolean;
  slots?: BarLabelSlots;
  slotProps?: BarLabelSlotProps;
}

/**
 * @ignore - internal component.
 */
export function RangeBarLabelPlot(props: RangeBarLabelPlotProps) {
  const { processedSeries, className, skipAnimation, slots, slotProps } = props;
  const { seriesId, data, layout, barLabel, barLabelPlacement } = processedSeries;

  if (!barLabel) {
    return null;
  }

  return (
    <g className={className} data-series={seriesId}>
      {data.map((item) => (
        <RangeBarLabelItem
          key={item.dataIndex}
          item={item}
          layout={layout ?? 'vertical'}
          barLabel={barLabel}
          barLabelPlacement={barLabelPlacement ?? 'center'}
          skipAnimation={skipAnimation}
          slots={slots}
          slotProps={slotProps}
        />
      ))}
    </g>
  );
}

interface RangeBarLabelItemProps {
  item: ProcessedRangeBarData;
  layout: 'vertical' | 'horizontal';
  barLabel: NonNullable<RangeBarSeriesType['barLabel']>;
  barLabelPlacement: NonNullable<RangeBarSeriesType['barLabelPlacement']>;
  skipAnimation: boolean;
  slots?: BarLabelSlots;
  slotProps?: BarLabelSlotProps;
}

function RangeBarLabelItem(props: RangeBarLabelItemProps) {
  const { item, layout, barLabel, barLabelPlacement, skipAnimation, slots, slotProps } = props;
  const { seriesId, dataIndex, color, value, x, y, width, height, hidden, startCoordinate } = item;

  const highlightState = useItemHighlightState({ type: 'rangeBar', seriesId, dataIndex });
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  // The bar label positions itself relative to an origin.
  // With the `outside` placement, the origin is the start of the range so that the label is placed after its end.
  // With the `center` placement, the origin is the center of the bar, from which range bars grow when animated.
  const isVertical = layout === 'vertical';
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const xOrigin = barLabelPlacement === 'outside' && !isVertical ? startCoordinate : centerX;
  const yOrigin = barLabelPlacement === 'outside' && isVertical ? startCoordinate : centerY;

  const ownerState = {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    skipAnimation,
    layout,
  };

  const Component = slots?.barLabel ?? BarLabel;

  const { ownerState: barLabelOwnerState, ...barLabelProps } = useSlotProps({
    elementType: Component,
    externalSlotProps: slotProps?.barLabel,
    additionalProps: {
      xOrigin,
      yOrigin,
      x,
      y,
      width,
      height,
      placement: barLabelPlacement,
      className: clsx(barClasses.label, !skipAnimation && barClasses.labelAnimate),
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
    },
    ownerState,
  });

  const formattedLabelText = getRangeBarLabel({
    barLabel,
    value,
    dataIndex,
    seriesId,
    height,
    width,
  });

  if (!formattedLabelText) {
    return null;
  }

  return (
    <Component {...barLabelProps} {...barLabelOwnerState} hidden={hidden}>
      {formattedLabelText}
    </Component>
  );
}
