import { UseTransitionProps } from '@react-spring/web';
import { ValueWithHighlight } from './useTransformData';

export const defaultTransitionConfig: UseTransitionProps<ValueWithHighlight> = {
  keys: (item) => item.id,
  from: ({
    innerRadius,
    outerRadius,
    cornerRadius,
    startAngle,
    endAngle,
    paddingAngle,
    color,
    isFaded,
  }) => ({
    innerRadius,
    outerRadius: (innerRadius + outerRadius) / 2,
    cornerRadius,
    startAngle: (startAngle + endAngle) / 2,
    endAngle: (startAngle + endAngle) / 2,
    paddingAngle,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
  }),
  leave: ({ innerRadius, startAngle, endAngle }) => ({
    innerRadius,
    outerRadius: innerRadius,
    startAngle: (startAngle + endAngle) / 2,
    endAngle: (startAngle + endAngle) / 2,
  }),
  enter: ({ innerRadius, outerRadius, startAngle, endAngle }) => ({
    innerRadius,
    outerRadius,

    startAngle,
    endAngle,
  }),
  update: ({
    innerRadius,
    outerRadius,
    cornerRadius,
    startAngle,
    endAngle,
    paddingAngle,
    color,
    isFaded,
  }) => ({
    innerRadius,
    outerRadius,
    cornerRadius,
    startAngle,
    endAngle,
    paddingAngle,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
  }),
  config: {
    tension: 120,
    friction: 14,
    clamp: true,
  },
};

export const defaultLabelTransitionConfig: UseTransitionProps<ValueWithHighlight> = {
  keys: (item) => item.id,
  from: ({ innerRadius, outerRadius, cornerRadius, startAngle, endAngle, paddingAngle }) => ({
    innerRadius,
    outerRadius: (innerRadius + outerRadius) / 2,
    cornerRadius,
    startAngle: (startAngle + endAngle) / 2,
    endAngle: (startAngle + endAngle) / 2,
    paddingAngle,
    opacity: 0,
  }),
  leave: ({ innerRadius, startAngle, endAngle }) => ({
    innerRadius,
    outerRadius: innerRadius,
    startAngle: (startAngle + endAngle) / 2,
    endAngle: (startAngle + endAngle) / 2,
    opacity: 0,
  }),
  enter: ({ innerRadius, outerRadius, startAngle, endAngle }) => ({
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    opacity: 1,
  }),
  update: ({ innerRadius, outerRadius, cornerRadius, startAngle, endAngle, paddingAngle }) => ({
    innerRadius,
    outerRadius,
    cornerRadius,
    startAngle,
    endAngle,
    paddingAngle,
    opacity: 1,
  }),
  config: {
    tension: 120,
    friction: 14,
    clamp: true,
  },
};
