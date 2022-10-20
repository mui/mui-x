import { CalendarPickerView } from '../models/views';

export const isYearOnlyView = (
  views: readonly CalendarPickerView[],
): views is ReadonlyArray<'year'> => views.length === 1 && views[0] === 'year';

export const isYearAndMonthViews = (
  views: readonly CalendarPickerView[],
): views is ReadonlyArray<'month' | 'year'> =>
  views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;
