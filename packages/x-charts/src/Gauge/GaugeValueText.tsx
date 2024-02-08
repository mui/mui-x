import * as React from 'react';
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
  return value === null ? 'NaN' : value.toLocaleString();
}
export function GaugeValueText(props: GaugeValueTextProps) {
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
