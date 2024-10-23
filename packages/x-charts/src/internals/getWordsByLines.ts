import { getStringSize } from './domUtils';

export type ChartsTextBaseline = 'hanging' | 'central' | 'auto';

export interface ChartsTextStyle extends Omit<React.CSSProperties, 'fontSize'> {
  angle?: number;
  /**
   * The text baseline
   * @default 'central'
   */
  dominantBaseline?: ChartsTextBaseline;
  fontSize?: number;
}

export interface GetWordsByLinesParams {
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

export function getWordsByLines({ style, needsComputation, text }: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({
    text: subText,
    ...(needsComputation ? getStringSize(subText, style) : { width: 0, height: 0 }),
  }));
}
