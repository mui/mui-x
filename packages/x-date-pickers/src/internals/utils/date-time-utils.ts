import { DateOrTimeView, DateView, MuiPickersAdapter, TimeView } from '../../models';
import { resolveTimeFormat, isTimeView, isInternalTimeView } from './time-utils';
import { resolveDateFormat } from './date-utils';
import { DateOrTimeViewWithMeridiem } from '../models';

export const resolveDateTimeFormat = (
  utils: MuiPickersAdapter<any>,
  { views, format, ...other }: { format?: string; views: readonly DateOrTimeView[]; ampm: boolean },
) => {
  if (format) {
    return format;
  }

  const dateViews: DateView[] = [];
  const timeViews: TimeView[] = [];

  views.forEach((view) => {
    if (isTimeView(view)) {
      timeViews.push(view as TimeView);
    } else {
      dateViews.push(view as DateView);
    }
  });

  if (timeViews.length === 0) {
    return resolveDateFormat(utils, { views: dateViews, ...other }, false);
  }

  if (dateViews.length === 0) {
    return resolveTimeFormat(utils, { views: timeViews, ...other });
  }

  const timeFormat = resolveTimeFormat(utils, { views: timeViews, ...other });
  const dateFormat = resolveDateFormat(utils, { views: dateViews, ...other }, false);

  return `${dateFormat} ${timeFormat}`;
};

export const resolveViews = (
  ampm: boolean,
  views: readonly DateOrTimeView[],
  shouldUseSingleColumn: boolean,
): DateOrTimeViewWithMeridiem[] => {
  if (shouldUseSingleColumn) {
    return views.filter((view) => !isInternalTimeView(view) || view === 'hours');
  }
  return (ampm ? [...views, 'meridiem'] : views) as DateOrTimeViewWithMeridiem[];
};
