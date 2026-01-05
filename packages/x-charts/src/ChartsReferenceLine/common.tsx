import { styled } from '@mui/material/styles';
import {
  referenceLineClasses,
  type ChartsReferenceLineClasses,
} from './chartsReferenceLineClasses';
import { type ChartsTextStyle } from '../ChartsText';
import { type AxisId } from '../models/axis';

export const DEFAULT_SPACING = 5;
export const DEFAULT_SPACING_MIDDLE_OTHER_AXIS = 0;

export type CommonChartsReferenceLineProps = {
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign?: 'start' | 'middle' | 'end';
  /**
   * The label to display along the reference line.
   */
  label?: string;
  /**
   * Additional space around the label in px.
   * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
   * @default { x: 0, y: 5 } on a horizontal line and { x: 5, y: 0 } on a vertical line.
   */
  spacing?: number | { x?: number; y?: number };
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId?: AxisId;
  /**
   * The style applied to the label.
   */
  labelStyle?: ChartsTextStyle;
  /**
   * The style applied to the line.
   */
  lineStyle?: React.CSSProperties;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsReferenceLineClasses>;
};

export const ReferenceLineRoot = styled('g', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
  [`& .${referenceLineClasses.line}`]: {
    fill: 'none',
    stroke: (theme.vars || theme).palette.text.primary,
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
    pointerEvents: 'none',
  },
  [`& .${referenceLineClasses.label}`]: {
    fill: (theme.vars || theme).palette.text.primary,
    stroke: 'none',
    pointerEvents: 'none',
    fontSize: 12,
    ...theme.typography.body1,
  },
}));
