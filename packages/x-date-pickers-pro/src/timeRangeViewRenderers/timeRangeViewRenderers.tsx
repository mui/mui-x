import * as React from 'react';
import { BaseClockProps, TimeViewWithMeridiem, isTimeView } from '@mui/x-date-pickers/internals';
import { DigitalClock, DigitalClockProps } from '@mui/x-date-pickers/DigitalClock';
import Stack from '@mui/material/Stack';
import { TimeView } from '@mui/x-date-pickers/models';
import type { TimeRangePickerProps } from '../TimeRangePicker/TimeRangePicker.types';
import { DateRange } from '../internals/models';

export type TimeRangeViewRendererProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends Omit<BaseClockProps<any, any>, 'value' | 'onChange'>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> & {
  value: DateRange<TDate>;
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
  TDate,
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps<TDate>, 'timeStep' | 'value' | 'defaultValue' | 'onChange'> &
    Pick<TimeRangePickerProps<TDate>, 'timeSteps'> & {
      value: DateRange<TDate>;
      onChange: (value: DateRange<TDate>) => void;
    }
>) => {
  return (
    <Stack>
      <DigitalClock<TDate>
        view={view}
        onViewChange={onViewChange}
        focusedView={focusedView}
        onFocusedViewChange={onFocusedViewChange}
        views={views.filter(isTimeView)}
        value={value[0]}
        referenceDate={referenceDate}
        onChange={(newValue) => onChange?.([newValue, value[1]])}
        className={className}
        classes={classes}
        disableFuture={disableFuture}
        disablePast={disablePast}
        minTime={minTime}
        maxTime={maxTime}
        shouldDisableTime={shouldDisableTime}
        shouldDisableClock={shouldDisableClock}
        minutesStep={minutesStep}
        ampm={ampm}
        components={components}
        componentsProps={componentsProps}
        slots={slots}
        slotProps={slotProps}
        readOnly={readOnly}
        disabled={disabled}
        sx={sx}
        autoFocus={autoFocus}
        disableIgnoringDatePartForTimeValidation={disableIgnoringDatePartForTimeValidation}
        timeStep={timeSteps?.minutes}
        skipDisabled={skipDisabled}
        timezone={timezone}
      />
    </Stack>
  );
};
