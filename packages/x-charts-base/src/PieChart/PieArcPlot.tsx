'use client';
import {
  type DefaultizedPieSeriesType,
  type ComputedPieRadius,
  type PieItemIdentifier,
  type DefaultizedPieValueType,
} from '@mui/x-charts';
import { useFocusedItem } from '@mui/x-charts/hooks/useFocusedItem';
import { useTransformData } from '@mui/x-charts/PieChart/dataTransform/useTransformData';
import * as React from 'react';
import { PieArc } from './PieArc';

export interface PieArcPlotProps
  extends Pick<
      DefaultizedPieSeriesType,
      'data' | 'faded' | 'highlighted' | 'cornerRadius' | 'paddingAngle' | 'id'
    >,
    Pick<React.ComponentProps<'g'>, 'transform'>,
    ComputedPieRadius {
  /**
   * Override the arc attributes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded?: DefaultizedPieSeriesType['faded'];
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    pieItemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType,
  ) => void;
}

function PieArcPlot(props: PieArcPlotProps) {
  const {
    innerRadius = 0,
    outerRadius,
    cornerRadius = 0,
    paddingAngle = 0,
    id,
    highlighted,
    faded = { additionalRadius: -5 },
    data,
    onItemClick,
    ...other
  } = props;

  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlighted,
    faded,
    data,
  });

  const { dataIndex, seriesId, seriesType } = useFocusedItem() ?? {};
  const focusedItem =
    dataIndex !== undefined && seriesId === id && seriesType === 'pie'
      ? transformedData[dataIndex]
      : null;

  if (data.length === 0) {
    return null;
  }

  return (
    <g {...other}>
      {transformedData.map((item, index) => (
        <PieArc
          key={item.dataIndex}
          startAngle={item.startAngle}
          endAngle={item.endAngle}
          paddingAngle={item.paddingAngle}
          innerRadius={item.innerRadius}
          outerRadius={item.outerRadius}
          cornerRadius={item.cornerRadius}
          id={id}
          color={item.color}
          stroke={'var(--PieChart-arc-stroke, transparent)'}
          dataIndex={index}
          isFaded={item.isFaded}
          isHighlighted={item.isHighlighted}
          isFocused={item.isFocused}
          onClick={
            onItemClick &&
            ((event) => {
              onItemClick(event, { type: 'pie', seriesId: id, dataIndex: index }, item);
            })
          }
        />
      ))}
      {/* Render the focus indicator last, so it can align nicely over all arcs */}
      {focusedItem && (
        <PieArc
          startAngle={focusedItem.startAngle}
          endAngle={focusedItem.endAngle}
          paddingAngle={focusedItem.paddingAngle}
          innerRadius={focusedItem.innerRadius}
          color="transparent"
          pointerEvents="none"
          skipInteraction
          outerRadius={focusedItem.outerRadius}
          cornerRadius={focusedItem.cornerRadius}
          stroke={'var(--FocusIndicator-color, blue)'}
          id={id}
          className={'PieArc-focusIndicator'}
          dataIndex={focusedItem.dataIndex}
          isFaded={false}
          isHighlighted={false}
          isFocused={false}
          strokeWidth={3}
        />
      )}
    </g>
  );
}

export { PieArcPlot };
