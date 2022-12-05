import { DateView } from '../models/views';

export const isYearOnlyView = (views: readonly DateView[]): views is ReadonlyArray<'year'> =>
  views.length === 1 && views[0] === 'year';

export const isYearAndMonthViews = (
  views: readonly DateView[],
): views is ReadonlyArray<'month' | 'year'> =>
  views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;
