export type DateRange<TDate> = [TDate | null, TDate | null];
export type NonEmptyDateRange<TDate> = [TDate, TDate];

export type RangePosition = 'start' | 'end';

export interface RangePositionProps {
  rangePosition: RangePosition;
  onRangePositionChange: (newPosition: RangePosition) => void;
}
