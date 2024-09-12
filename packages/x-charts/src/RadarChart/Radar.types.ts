export interface MetricConfig {
  /**
   * The name of the metric.
   */
  name: string;
  /**
   * The minimal value of the domain.
   * @default 0
   */
  min?: number;
  /**
   * The maximal value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  max?: number;
}

export interface RadarConfig {
  /**
   * The different metrics shown by radar.
   */
  metrics: string[] | MetricConfig[];
  /**
   * The angle of the first axis (in deg)
   * @default 0
   */
  startAngle?: number;
}
