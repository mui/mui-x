import { Position } from '../models/position';

export type ChartsLegendPosition = {
  /**
   * The position of the legend in relation to the chart.
   * This property is only passed to the Chart components, e.g. `ScatterChart`, and not the slots themselves.
   * If customization is needed, simply use the composition pattern.
   */
  position?: Position;
};
