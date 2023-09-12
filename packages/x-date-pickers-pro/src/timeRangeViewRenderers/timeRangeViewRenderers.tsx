import * as React from 'react';
import {
  BaseClockProps,
  TimeViewWithMeridiem,
  isTimeView,
  PickerSelectionState,
} from '@mui/x-date-pickers/internals';
import { DigitalClock, DigitalClockProps } from '@mui/x-date-pickers/DigitalClock';
import Stack from '@mui/material/Stack';
import { TimeView } from '@mui/x-date-pickers/models';
import type { TimeRangePickerProps } from '../TimeRangePicker/TimeRangePicker.types';
import { DateRange } from '../internals/models';
import { UseRangePositionProps } from '../internals/hooks/useRangePosition';

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
  rangePosition,
  onRangePositionChange,
}: TimeRangeViewRendererProps<
  TDate,
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps<TDate>, 'timeStep' | 'value' | 'defaultValue' | 'onChange'> &
    Pick<TimeRangePickerProps<TDate>, 'timeSteps'> &
    UseRangePositionProps & {
      value: DateRange<TDate>;
      onChange: (value: DateRange<TDate>, selectionState?: PickerSelectionState) => void;
    }
>) => {
  const viewValue = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (newValue: TDate | null, selectionState?: PickerSelectionState) => {
    if (rangePosition === 'start') {
      onRangePositionChange?.('end');
    }

    onChange(
      rangePosition === 'start' ? [newValue, value[1]] : [value[0], newValue],
      rangePosition === 'start' ? 'partial' : selectionState,
    );
  };

  return (
    <Stack>
      <DigitalClock<TDate>
        view={view}
        onViewChange={onViewChange}
        focusedView={focusedView}
        onFocusedViewChange={onFocusedViewChange}
        views={views.filter(isTimeView)}
        value={viewValue}
        referenceDate={referenceDate}
        onChange={handleChange}
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
