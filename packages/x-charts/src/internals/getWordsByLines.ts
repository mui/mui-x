import type * as React from 'react';
import { getStringSize } from './domUtils';

export type ChartsTextBaseline =
  | 'hanging'
  | 'central'
  | 'auto'
  | 'text-after-edge'
  | 'text-before-edge';

export type ChartsTextAnchor = 'start' | 'middle' | 'end';

export interface ChartsTextStyle extends Omit<React.CSSProperties, 'dominantBaseline'> {
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
