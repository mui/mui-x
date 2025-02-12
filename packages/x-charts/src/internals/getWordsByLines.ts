import { getStringSize } from './domUtils';

export type ChartsTextBaseline = 'hanging' | 'central' | 'auto';

export interface ChartsTextStyle extends React.CSSProperties {
  angle?: number;
  /**
   * The text baseline
   * @default 'central'
   */
  dominantBaseline?: ChartsTextBaseline;
}

export interface GetWordsByLinesParams {
  className?: string;
  measuringElement: SVGElement;
  /**
   * Text displayed.
   */
  text: string;
  /**
   * Style applied to text elements.
   */
  style?: ChartsTextStyle;
  /**
   * If `true`, the line width is computed.
   * @default false
   */
  needsComputation?: boolean;
}

export function getWordsByLines({
  className,
  style,
  needsComputation,
  text,
  measuringElement,
}: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({
    text: subText,
    ...(needsComputation
      ? getStringSize(subText, { className, style, measuringElement })
      : { width: 0, height: 0 }),
  }));
}
