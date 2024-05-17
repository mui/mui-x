import * as React from 'react';
import PropTypes from 'prop-types';
import { useGaugeState } from './GaugeProvider';
import { ChartsText, ChartsTextProps } from '../ChartsText';

export interface GaugeFormatterParams {
  value: number | null;
  valueMin: number;
  valueMax: number;
}

export interface GaugeValueTextProps extends Omit<ChartsTextProps, 'text'> {
  text?: string | ((params: GaugeFormatterParams) => string | null);
}

function defaultFormatter({ value }: GaugeFormatterParams) {
  return value === null ? null : value.toLocaleString();
}
function GaugeValueText(props: GaugeValueTextProps) {
  const { text = defaultFormatter, className, ...other } = props;

  const { value, valueMin, valueMax, cx, cy } = useGaugeState();

  const formattedText = typeof text === 'function' ? text({ value, valueMin, valueMax }) : text;

  if (formattedText === null) {
    return null;
  }

  return (
    <g className={className}>
      <ChartsText
        x={cx}
        y={cy}
        text={formattedText}
        style={{ textAnchor: 'middle', dominantBaseline: 'central' }}
        {...other}
      />
    </g>
  );
}

GaugeValueText.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Height of a text line (in `em`).
   */
  lineHeight: PropTypes.number,
  /**
   * If `true`, the line width is computed.
   * @default false
   */
  needsComputation: PropTypes.bool,
  ownerState: PropTypes.any,
  /**
   * Style applied to text elements.
   */
  style: PropTypes.object,
  text: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
} as any;

export { GaugeValueText };
