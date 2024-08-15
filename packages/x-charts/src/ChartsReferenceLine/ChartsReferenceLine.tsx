import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXReferenceLine, ChartsXReferenceLineProps } from './ChartsXReferenceLine';
import { ChartsYReferenceLine, ChartsYReferenceLineProps } from './ChartsYReferenceLine';
import { XOR } from '../internals/ts-generic';

type ChartsReferenceLineProps<TValue extends string | number | Date = string | number | Date> = XOR<
  ChartsXReferenceLineProps<TValue>,
  ChartsYReferenceLineProps<TValue>
>;

function ChartsReferenceLine(props: ChartsReferenceLineProps) {
  const { x, y } = props;
  if (x !== undefined && y !== undefined) {
    throw new Error('MUI X: The ChartsReferenceLine cannot have both `x` and `y` props set.');
  }

  if (x === undefined && y === undefined) {
    throw new Error('MUI X: The ChartsReferenceLine should have a value in `x` or `y` prop.');
  }

  if (x !== undefined) {
    return <ChartsXReferenceLine {...props} />;
  }
  return <ChartsYReferenceLine {...props} />;
}

ChartsReferenceLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The label to display along the reference line.
   */
  label: PropTypes.string,
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign: PropTypes.oneOf(['end', 'middle', 'start']),
  /**
   * The style applied to the label.
   */
  labelStyle: PropTypes.object,
  /**
   * The style applied to the line.
   */
  lineStyle: PropTypes.object,
  /**
   * Additional space around the label in px.
   * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
   * @default 5
   */
  spacing: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ]),
  /**
   * The x value associated with the reference line.
   * If defined the reference line will be vertical.
   */
  x: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
  /**
   * The y value associated with the reference line.
   * If defined the reference line will be horizontal.
   */
  y: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
} as any;

export { ChartsReferenceLine };
