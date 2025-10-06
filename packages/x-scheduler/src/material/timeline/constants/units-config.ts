import { TimelineView } from '../../../primitives/models';

export const TIME_UNITS_COUNT = 3;
export const DAYS_UNIT_COUNT = 21;
export const WEEKS_UNIT_COUNT = 8;
export const MONTHS_UNIT_COUNT = 12;
export const YEARS_UNIT_COUNT = 4;

type UnitType = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export const UNIT: Record<TimelineView, UnitType> = {
  time: 'hours',
  days: 'days',
  weeks: 'weeks',
  months: 'months',
  years: 'years',
};
