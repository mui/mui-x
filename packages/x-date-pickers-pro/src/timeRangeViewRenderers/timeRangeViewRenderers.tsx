import { BaseClockProps, TimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import { DigitalClockProps } from '@mui/x-date-pickers/DigitalClock';
import { TimeView } from '@mui/x-date-pickers/models';
import type { TimeRangePickerProps } from '../TimeRangePicker/TimeRangePicker.types';

export type TimeRangeViewRendererProps<
  TView extends TimeViewWithMeridiem,
  TComponentProps extends BaseClockProps<any, any>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> & {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
};

export const renderDigitalClockTimeRangeView = <TDate extends unknown>({
  view,
  onViewChange,
  focusedView,
  onFocusedViewChange,
  views,
  value,
  defaultValue,
  referenceDate,
  onChange,
  className,
  classes,
  disableFuture,
  disablePast,
  minTime,
  maxTime,
  shouldDisableTime,
  shouldDisableClock,
  minutesStep,
  ampm,
  components,
  componentsProps,
  slots,
  slotProps,
  readOnly,
  disabled,
  sx,
  autoFocus,
  disableIgnoringDatePartForTimeValidation,
  timeSteps,
  skipDisabled,
  timezone,
}: TimeRangeViewRendererProps<
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps<TDate>, 'timeStep'> & Pick<TimeRangePickerProps<TDate>, 'timeSteps'>
>) => {
  return <div>HELLO</div>;
};
