export type CommonChartsReferenceLineProps = {
  color?: string;
  lineWidth?: number;
  /**
   * The alighement if the label in the chart drawing area.
   * @default 'middle'
   */
  labelAlign?: 'start' | 'middle' | 'end';
  label?: string | string[];
  labelStyle?: string;
  /**
   * The id of the axis used for the reference value.
   * @default id the id of the first axis defined
   */
  axisId?: string;
};
