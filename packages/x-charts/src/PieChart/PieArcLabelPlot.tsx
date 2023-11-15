import * as React from 'react';
import { useTransition } from '@react-spring/web';
import {
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
  PieSeriesType,
} from '../models/seriesType/pie';
import { defaultLabelTransitionConfig } from './dataTransform/transition';
import {
  AnimatedObject,
  ValueWithHighlight,
  useTransformData,
} from './dataTransform/useTransformData';
import { PieArcLabel, PieArcLabelProps } from './PieArcLabel';
import { DefaultizedProps } from '../models/helpers';

const RATIO = 180 / Math.PI;

function getItemLabel(
  arcLabel: PieSeriesType['arcLabel'],
  arcLabelMinAngle: number,
  item: DefaultizedPieValueType,
) {
  if (!arcLabel) {
    return null;
  }
  const angle = (item.endAngle - item.startAngle) * RATIO;
  if (angle < arcLabelMinAngle) {
    return null;
  }

  if (typeof arcLabel === 'string') {
    return item[arcLabel]?.toString();
  }

  return arcLabel(item);
}

export interface PieArcLabelPlotSlots {
  pieArcLabel?: React.JSXElementConstructor<PieArcLabelProps>;
}

export interface PieArcLabelPlotSlotProps {
  pieArcLabel?: Partial<PieArcLabelProps>;
}

export interface PieArcLabelPlotProps
  extends DefaultizedProps<
    Pick<
      DefaultizedPieSeriesType,
      | 'data'
      | 'faded'
      | 'highlighted'
      | 'innerRadius'
      | 'outerRadius'
      | 'cornerRadius'
      | 'paddingAngle'
      | 'arcLabel'
      | 'arcLabelMinAngle'
      | 'id'
      | 'highlightScope'
    >,
    'outerRadius'
  > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PieArcLabelPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PieArcLabelPlotSlotProps;
  /**
   * If `true`, animations are skiped.
   * @default false
   */
  skipAnimation?: boolean;
}

export function PieArcLabelPlot(props: PieArcLabelPlotProps) {
  const {
    slots,
    slotProps,
    innerRadius = 0,
    outerRadius,
    cornerRadius = 0,
    paddingAngle = 0,
    id,
    highlightScope,
    highlighted,
    faded = { additionalRadius: -5 },
    data,
    arcLabel,
    arcLabelMinAngle = 0,
    skipAnimation,
    ...other
  } = props;

  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlightScope,
    highlighted,
    faded,
    data,
  });
  const transition = useTransition<ValueWithHighlight, AnimatedObject>(transformedData, {
    ...defaultLabelTransitionConfig,
    immediate: skipAnimation,
  });

  if (data.length === 0) {
    return null;
  }

  const ArcLabel = slots?.pieArcLabel ?? PieArcLabel;

  return (
    <g {...other}>
      {transition(
        (
          {
            startAngle,
            endAngle,
            paddingAngle: pA,
            innerRadius: iR,
            outerRadius: oR,
            cornerRadius: cR,
            ...style
          },
          item,
        ) => {
          return (
            <ArcLabel
              startAngle={startAngle}
              endAngle={endAngle}
              paddingAngle={pA}
              innerRadius={iR}
              outerRadius={oR}
              cornerRadius={cR}
              style={style}
              id={id}
              color={item.color}
              isFaded={item.isFaded}
              isHighlighted={item.isHighlighted}
              formattedArcLabel={getItemLabel(arcLabel, arcLabelMinAngle, item)}
              {...slotProps?.pieArcLabel}
            />
          );
        },
      )}
    </g>
  );
}
