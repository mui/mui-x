import { ChartsRotationAxisProps } from '../../models/axis';

export interface MetricConfig {
  /**
   * The name of the metric.
   */
  name: string;
  /**
   * The minimum value of the domain.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  max?: number;
}

export type RadarLabelFormatterContext = { location: 'tick' | 'tooltip' };

export interface RadarConfig extends Pick<ChartsRotationAxisProps, 'labelGap'> {
  /**
   * The metrics shown by radar.
   */
  metrics: string[] | MetricConfig[];
  /**
   * The default max value for radius axes.
   * It will be overridden if `metrics` contains a `max` property.
   */
  max?: number;
  /**
   * The starting angle of the rotation axis (in degrees)
   * @default 0
   */
  startAngle?: number;
  /**
   * Format metric names according to their placement.
   * @param {string} name The metric name.
   * @param {RadarLabelFormatterContext} context Indicates where the label will be used.
   * @returns {string} The label to display.
   */
  labelFormatter?: (name: string, context: RadarLabelFormatterContext) => string;
}
