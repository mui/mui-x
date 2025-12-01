export type TickFrequencyDefinition = {
  getTickNumber: (from: Date, to: Date) => number;
  isTick: (prev: Date, value: Date) => boolean;
  format: (d: Date) => string;
};

export type TicksFrequency =
  | 'years'
  | 'quarterly'
  | 'months'
  | 'biweekly'
  | 'weeks'
  | 'days'
  | 'hours';

export type TimeOrdinalTicks = (TickFrequencyDefinition | TicksFrequency)[];
