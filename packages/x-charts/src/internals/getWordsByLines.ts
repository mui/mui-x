import { getStringSize } from './domUtils';

export type ChartsTextBaseline =
  | 'hanging'
  | 'central'
  | 'auto'
  | 'text-after-edge'
  | 'text-before-edge';

export type ChartsTextAnchor = 'start' | 'middle' | 'end';

export interface ChartsTextStyle extends React.CSSProperties {
  angle?: number;
  /**
   * The text baseline
   * @default 'central'
   */
  dominantBaseline?: ChartsTextBaseline;
  /**
   * The text anchor
   * @default 'middle'
   */
  textAnchor?: ChartsTextAnchor;
}

export interface GetWordsByLinesParams {
  /**
   * Text displayed.
   */
  text: string;
  /**
   * Props applied to text elements.
   */
  props?: { style?: React.CSSProperties };
  /**
   * If `true`, the line width is computed.
   * @default false
   */
  needsComputation?: boolean;
}

export function getWordsByLines({ props, needsComputation, text }: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({
    text: subText,
    ...(needsComputation ? getStringSize(subText, props) : { width: 0, height: 0 }),
  }));
}
