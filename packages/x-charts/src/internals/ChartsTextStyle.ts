export type ChartsTextBaseline = 'hanging' | 'central' | 'auto';

export interface ChartsTextStyle extends React.CSSProperties {
  angle?: number;
  /**
   * The text baseline
   * @default 'central'
   */
  dominantBaseline?: ChartsTextBaseline;
}
