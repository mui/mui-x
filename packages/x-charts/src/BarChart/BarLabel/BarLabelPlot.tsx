import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useUtilityClasses } from '../barClasses';
import { type BarLabelOwnerState, type BarLabelFunction, type BarLabelSlots, type BarLabelSlotProps } from './BarLabel.types';
import { BarLabel, type BarLabelProps } from './BarLabel';
import { useItemHighlightState } from '../../hooks/useItemHighlightState';
import { type AnimationData } from '../types';
import type { SeriesId } from '../../models/seriesType/common';
import { type BarSeriesType, type BarValueType } from '../../models/seriesType/bar';

interface BarLabelPlotProps {
  processedSeries: ProcessedBarLabelSeriesData;
  className: string;
  skipAnimation?: boolean;
  slotProps?: BarLabelSlotProps;
  slots?: BarLabelSlots;
}

export interface ProcessedBarLabelSeriesData {
  seriesId: SeriesId;
  data: ProcessedBarLabelData[];
  barLabel?: 'value' | BarLabelFunction;
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
  layout?: 'vertical' | 'horizontal';
  xOrigin: number;
  yOrigin: number;
}

export interface ProcessedBarLabelData extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: BarValueType | null;
  hidden: boolean;
}

interface BarLabelItemInnerProps {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: BarValueType | null;
  xOrigin: number;
  yOrigin: number;
  x: number;
  y: number;
  width: number;
  height: number;
  skipAnimation: boolean;
  layout: 'vertical' | 'horizontal';
  hidden: boolean;
  barLabel: 'value' | BarLabelFunction;
  barLabelPlacement: BarLabelProps['placement'];
  slotProps?: BarLabelSlotProps;
  slots?: BarLabelSlots;
}

function BarLabelItemInner(props: BarLabelItemInnerProps) {
  const {
    seriesId,
    color,
    dataIndex,
    barLabel,
    slots,
    slotProps,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    value,
    skipAnimation,
    layout,
    barLabelPlacement,
    hidden,
  } = props;

  const highlightState = useItemHighlightState({
    type: 'bar',
    seriesId,
    dataIndex,
  });
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  const ownerState: BarLabelOwnerState = {
    seriesId,
    color,
    isFaded,
    isHighlighted,
    dataIndex,
    skipAnimation,
    layout,
  };
  const classes = useUtilityClasses(ownerState);

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
      className: classes.label,
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
    },
    ownerState,
  });

  // Inline getBarLabel logic
  const formattedLabelText =
    barLabel === 'value'
      ? value ? value.toString() : null
      : barLabel({ seriesId, dataIndex, value }, { bar: { height, width } });

  if (!formattedLabelText) {
    return null;
  }

  return (
    <Component {...barLabelProps} {...barLabelOwnerState} hidden={hidden}>
      {formattedLabelText}
    </Component>
  );
}

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
  const { processedSeries, className, skipAnimation, ...other } = props;
  const { seriesId, data, layout, xOrigin, yOrigin } = processedSeries;

  const { barLabel } = processedSeries;

  if (!barLabel) {
    return null;
  }

  return (
    <g key={seriesId} className={className} data-series={seriesId}>
      {data.map(({ x, y, dataIndex, color, value, width, height, hidden }) => (
        <BarLabelItemInner
          key={dataIndex}
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          xOrigin={xOrigin}
          yOrigin={yOrigin}
          x={x}
          y={y}
          width={width}
          height={height}
          skipAnimation={skipAnimation ?? false}
          layout={layout ?? 'vertical'}
          hidden={hidden}
          barLabel={barLabel}
          barLabelPlacement={processedSeries.barLabelPlacement || 'center'}
          {...other}
        />
      ))}
    </g>
  );
}

export { BarLabelPlot };
