'use client';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { type AxisId } from '../models/axis';
import { useChartsLayerContainerRef } from '../hooks/useChartsLayerContainerRef';
import { useAxisHighlightValue } from './useAxisHighlightValue';
import { ChartsAxisHighlightValueItem } from './ChartsAxisHighlightValueItem';

export type ChartsAxisHighlightValuePosition = 'start' | 'end' | 'both' | 'none';

export interface ChartsAxisHighlightValueProps {
  /**
   * The axis direction.
   */
  axisDirection: 'x' | 'y';
  /**
   * The id of the axis.
   * If not provided, defaults to the first axis.
   */
  axisId?: AxisId;
  /**
   * The position of the label relative to the drawing area.
   * - `'start'`: at the beginning of the drawing area (top for x-axis, left for y-axis).
   * - `'end'`: at the end of the drawing area (bottom for x-axis, right for y-axis).
   * - `'both'`: at both positions.
   * - `'none'`: no label is displayed.
   * @default 'end'
   */
  labelPosition?: ChartsAxisHighlightValuePosition;
  /**
   * The value to display.
   * If not defined, tracks the axis highlight value from user interaction.
   */
  value?: number | Date | string | null;
  /**
   * A function to format the displayed value.
   * If not provided, uses the axis `valueFormatter`, or falls back to a default formatter.
   * @param {number | Date | string} value The value to format.
   * @returns {string} The formatted string.
   */
  valueFormatter?: (value: number | Date | string) => string;
}

/**
 * A component that displays the axis value at the edge of the drawing area,
 * aligned with the current axis highlight position.
 *
 * Renders as a portal into the ChartsLayerContainer, appearing as the last child.
 *
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisHighlightValue API](https://mui.com/x/api/charts/charts-axis-highlight-value/)
 */
function ChartsAxisHighlightValue(props: ChartsAxisHighlightValueProps) {
  const { axisDirection, axisId, labelPosition, value, valueFormatter } = props;
  const chartsLayerContainerRef = useChartsLayerContainerRef();

  const items = useAxisHighlightValue({
    axisDirection,
    axisId,
    labelPosition,
    value,
    valueFormatter,
  });

  if (items.length === 0) {
    return null;
  }

  const content = items.map((itemProps) => <ChartsAxisHighlightValueItem {...itemProps} />);

  if (!chartsLayerContainerRef.current) {
    return content;
  }

  return ReactDOM.createPortal(content, chartsLayerContainerRef.current);
}

ChartsAxisHighlightValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The axis direction.
   */
  axisDirection: PropTypes.oneOf(['x', 'y']).isRequired,
  /**
   * The id of the axis.
   * If not provided, defaults to the first axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The position of the label relative to the drawing area.
   * - `'start'`: at the beginning of the drawing area (top for x-axis, left for y-axis).
   * - `'end'`: at the end of the drawing area (bottom for x-axis, right for y-axis).
   * - `'both'`: at both positions.
   * - `'none'`: no label is displayed.
   * @default 'end'
   */
  labelPosition: PropTypes.oneOf(['both', 'end', 'none', 'start']),
  /**
   * The value to display.
   * If not defined, tracks the axis highlight value from user interaction.
   */
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
  /**
   * A function to format the displayed value.
   * If not provided, uses the axis `valueFormatter`, or falls back to a default formatter.
   * @param {number | Date | string} value The value to format.
   * @returns {string} The formatted string.
   */
  valueFormatter: PropTypes.func,
} as any;

export { ChartsAxisHighlightValue };
