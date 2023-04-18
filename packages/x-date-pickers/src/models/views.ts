export type DateView = 'year' | 'month' | 'day';

export type TimeView =
  | 'hours'
  | 'minutes'
  | 'seconds'
  // The `meridiem` view is used only internally and only on `MultiSectionDigitalClock` component.
  // It should not be passed in externally. We add it in case the picker is in `ampm` mode.
  | 'meridiem';

export type DateOrTimeView = DateView | TimeView;
