export type TicksFrequencyDefinition = {
  getTickNumber: (from: Date, to: Date) => number;
  isTick: (prev: Date, value: Date) => boolean;
  format: (d: Date) => string;
};

export type TicksFrequency =
  | 'years'
  | 'quarters'
  | 'months'
  | 'biweekly'
  | 'weeks'
  | 'days'
  | 'hours';

export type TimeOrdinalTicks = (TicksFrequencyDefinition | TicksFrequency)[];
