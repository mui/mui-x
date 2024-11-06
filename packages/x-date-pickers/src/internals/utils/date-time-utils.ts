import { DefaultizedProps } from '@mui/x-internals/types';
import {
  DateOrTimeView,
  DateView,
  MuiPickersAdapter,
  TimeStepOptions,
  TimeView,
} from '../../models';
import { resolveTimeFormat, isTimeView, isInternalTimeView } from './time-utils';
import { isDatePickerView, resolveDateFormat } from './date-utils';
import { DateOrTimeViewWithMeridiem } from '../models';
import { DesktopOnlyTimePickerProps } from '../models/props/time';

export const resolveDateTimeFormat = (
  utils: MuiPickersAdapter,
  {
    views,
    format,
    ...other
  }: {
    format?: string;
    views: readonly DateOrTimeViewWithMeridiem[];
    ampm: boolean;
  },
  ignoreDateResolving?: boolean,
) => {
  if (format) {
    return format;
  }

  const dateViews: DateView[] = [];
  const timeViews: TimeView[] = [];

  views.forEach((view) => {
    if (isTimeView(view)) {
      timeViews.push(view as TimeView);
    } else if (isDatePickerView(view)) {
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
  const dateFormat = ignoreDateResolving
    ? utils.formats.keyboardDate
    : resolveDateFormat(utils, { views: dateViews, ...other }, false);

  return `${dateFormat} ${timeFormat}`;
};

const resolveViews = <TView extends DateOrTimeViewWithMeridiem = DateOrTimeViewWithMeridiem>(
  ampm: boolean,
  views: readonly DateOrTimeView[],
  shouldUseSingleColumn: boolean,
): TView[] => {
  if (shouldUseSingleColumn) {
    return views.filter((view) => !isInternalTimeView(view) || view === 'hours') as TView[];
  }
  return (ampm ? [...views, 'meridiem'] : views) as TView[];
};

const resolveShouldRenderTimeInASingleColumn = (timeSteps: TimeStepOptions, threshold: number) =>
  (24 * 60) / ((timeSteps.hours ?? 1) * (timeSteps.minutes ?? 5)) <= threshold;

interface DefaultizedTimeViewsProps<TView = DateOrTimeView>
  extends DefaultizedProps<DesktopOnlyTimePickerProps, 'ampm'> {
  views: readonly TView[];
}

interface DefaultizedTimeViewsResponse<TView = DateOrTimeViewWithMeridiem>
  extends Required<
    Pick<
      DefaultizedTimeViewsProps<TView>,
      'thresholdToRenderTimeInASingleColumn' | 'timeSteps' | 'views'
    >
  > {
  shouldRenderTimeInASingleColumn: boolean;
}

export function resolveTimeViewsResponse<
  InTView extends DateOrTimeView = DateOrTimeView,
  OutTView extends DateOrTimeViewWithMeridiem = DateOrTimeViewWithMeridiem,
>({
  thresholdToRenderTimeInASingleColumn: inThreshold,
  ampm,
  timeSteps: inTimeSteps,
  views,
}: DefaultizedTimeViewsProps<InTView>): DefaultizedTimeViewsResponse<OutTView> {
  const thresholdToRenderTimeInASingleColumn = inThreshold ?? 24;
  const timeSteps = { hours: 1, minutes: 5, seconds: 5, ...inTimeSteps };
  const shouldRenderTimeInASingleColumn = resolveShouldRenderTimeInASingleColumn(
    timeSteps,
    thresholdToRenderTimeInASingleColumn,
  );
  return {
    thresholdToRenderTimeInASingleColumn,
    timeSteps,
    shouldRenderTimeInASingleColumn,
    views: resolveViews(ampm, views, shouldRenderTimeInASingleColumn),
  };
}
