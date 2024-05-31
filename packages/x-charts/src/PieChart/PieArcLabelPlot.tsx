import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import {
  ComputedPieRadius,
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
import { getLabel } from '../internals/getLabel';

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

  switch (arcLabel) {
    case 'label':
      return getLabel(item.label, 'arc');
    case 'value':
      return item.value?.toString();
    case 'formattedValue':
      return item.formattedValue;
    default:
      return arcLabel({
        ...item,
        label: getLabel(item.label, 'arc'),
      });
  }
}

export interface PieArcLabelPlotSlots {
  pieArcLabel?: React.JSXElementConstructor<PieArcLabelProps>;
}

export interface PieArcLabelPlotSlotProps {
  pieArcLabel?: Partial<PieArcLabelProps>;
}

export interface PieArcLabelPlotProps
  extends Pick<
      DefaultizedPieSeriesType,
      | 'data'
      | 'faded'
      | 'highlighted'
      | 'cornerRadius'
      | 'paddingAngle'
      | 'arcLabel'
      | 'arcLabelMinAngle'
      | 'id'
    >,
    ComputedPieRadius {
  /**
   * Override the arc attributes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded?: DefaultizedPieSeriesType['faded'];
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
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

function PieArcLabelPlot(props: PieArcLabelPlotProps) {
  const {
    arcLabel,
    arcLabelMinAngle = 0,
    arcLabelRadius,
    cornerRadius = 0,
    data,
    faded = { additionalRadius: -5 },
    highlighted,
    id,
    innerRadius,
    outerRadius,
    paddingAngle = 0,
    skipAnimation,
    slotProps,
    slots,
    ...other
  } = props;

  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    arcLabelRadius,
    cornerRadius,
    paddingAngle,
    id,
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
            arcLabelRadius: aLR,
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
              arcLabelRadius={aLR}
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

PieArcLabelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The label displayed into the arc.
   */
  arcLabel: PropTypes.oneOfType([
    PropTypes.oneOf(['formattedValue', 'label', 'value']),
    PropTypes.func,
  ]),
  /**
   * The minimal angle required to display the arc label.
   * @default 0
   */
  arcLabelMinAngle: PropTypes.number,
  /**
   * The radius between circle center and the arc label in px.
   * @default (innerRadius - outerRadius) / 2
   */
  arcLabelRadius: PropTypes.number,
  /**
   * The radius applied to arc corners (similar to border radius).
   * @default 0
   */
  cornerRadius: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      endAngle: PropTypes.number.isRequired,
      formattedValue: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      index: PropTypes.number.isRequired,
      label: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      padAngle: PropTypes.number.isRequired,
      startAngle: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  /**
   * Override the arc attributes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded: PropTypes.shape({
    additionalRadius: PropTypes.number,
    arcLabelRadius: PropTypes.number,
    color: PropTypes.string,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    paddingAngle: PropTypes.number,
  }),
  /**
   * Override the arc attributes when it is highlighted.
   */
  highlighted: PropTypes.shape({
    additionalRadius: PropTypes.number,
    arcLabelRadius: PropTypes.number,
    color: PropTypes.string,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    paddingAngle: PropTypes.number,
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The radius between circle center and the beginning of the arc.
   * @default 0
   */
  innerRadius: PropTypes.number,
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: PropTypes.number.isRequired,
  /**
   * The padding angle (deg) between two arcs.
   * @default 0
   */
  paddingAngle: PropTypes.number,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { PieArcLabelPlot };
