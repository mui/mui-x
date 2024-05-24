import {
  DateOrTimeView,
  DateView,
  MuiPickersAdapter,
  PickerValidDate,
  TimeStepOptions,
  TimeView,
} from '../../models';
import { resolveTimeFormat, isTimeView, isInternalTimeView } from './time-utils';
import { resolveDateFormat } from './date-utils';
import { DateOrTimeViewWithMeridiem } from '../models';
import { DesktopOnlyTimePickerProps } from '../models/props/clock';
import { DefaultizedProps } from '../models/helpers';

export const resolveDateTimeFormat = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  {
    views,
    format,
    ...other
  }: { format?: string; views: readonly DateOrTimeViewWithMeridiem[]; ampm: boolean },
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

interface DefaultizedTimeViewsProps<TDate extends PickerValidDate, TView = DateOrTimeView>
  extends DefaultizedProps<DesktopOnlyTimePickerProps<TDate>, 'ampm'> {
  views: readonly TView[];
}

interface DefaultizedTimeViewsResponse<
  TDate extends PickerValidDate,
  TView = DateOrTimeViewWithMeridiem,
> extends Required<
    Pick<
      DefaultizedTimeViewsProps<TDate, TView>,
      'thresholdToRenderTimeInASingleColumn' | 'timeSteps' | 'views'
    >
  > {
  shouldRenderTimeInASingleColumn: boolean;
}

export function resolveTimeViewsResponse<
  TDate extends PickerValidDate,
  InTView extends DateOrTimeView = DateOrTimeView,
  OutTView extends DateOrTimeViewWithMeridiem = DateOrTimeViewWithMeridiem,
>({
  thresholdToRenderTimeInASingleColumn: inThreshold,
  ampm,
  timeSteps: inTimeSteps,
  views,
}: DefaultizedTimeViewsProps<TDate, InTView>): DefaultizedTimeViewsResponse<TDate, OutTView> {
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
