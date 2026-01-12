import type { ChartsXAxisProps, ChartsYAxisProps, ScaleName, ComputedAxis } from '../models/axis';
import type { OrdinalTimeTicks } from '../models/timeTicks';

export type ChartsAxisTicksProps<Direction extends 'x' | 'y' = 'x' | 'y'> = Omit<
  Direction extends 'x' ? ChartsXAxisProps : ChartsYAxisProps,
  'axis'
> & {
  direction: Direction;
  axis: ComputedAxis<ScaleName, any, Direction extends 'x' ? ChartsXAxisProps : ChartsYAxisProps>;
  axisLabelHeight: number;
  ordinalTimeTicks: OrdinalTimeTicks;
};
