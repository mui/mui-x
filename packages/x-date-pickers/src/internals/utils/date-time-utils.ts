import { DateOrTimeView, DateView, MuiPickersAdapter, TimeView } from '../../models';
import { getTimePickerFormatFromViews, isTimeView } from './time-utils';
import { getDatePickerFormatFromViews } from './date-utils';

export const getDateTimePickerFormatFromViews = (
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
    return getDatePickerFormatFromViews(utils, { views: dateViews, ...other }, false);
  }

  if (dateViews.length === 0) {
    return getTimePickerFormatFromViews(utils, { views: timeViews, ...other });
  }

  const timeFormat = getTimePickerFormatFromViews(utils, { views: timeViews, ...other });
  const dateFormat = getDatePickerFormatFromViews(utils, { views: dateViews, ...other }, false);

  return `${dateFormat} ${timeFormat}`;
};
