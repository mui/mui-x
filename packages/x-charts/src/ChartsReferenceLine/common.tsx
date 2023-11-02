import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import {
  referenceLineClasses,
  ChartsReferenceLineClasses,
  getChartsReferenceLineUtilityClass,
} from './chartsReferenceLineClasses';
import { ChartsTextStyle } from '../internals/components/ChartsText';

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
   * Additional space between the label and the reference line in px.
   * @default 5
   */
  spacing?: number;
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId?: string;
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

export function getReferenceLineClasses(classes?: Partial<ChartsReferenceLineClasses>) {
  return composeClasses(
    {
      root: ['root'],
      line: ['line'],
      label: ['label'],
    },
    getChartsReferenceLineUtilityClass,
    classes,
  );
}

export const ReferenceLineRoot = styled('g')(({ theme }) => ({
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
