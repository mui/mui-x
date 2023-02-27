export type DateView = 'year' | 'month' | 'day';
export type ClockTimeView = 'hours' | 'minutes' | 'seconds';
export type TimeView = ClockTimeView | 'digital';
export type DateOrTimeView = DateView | TimeView;