import * as React from 'react';
import { TimeClock, TimeClockProps } from '@mui/x-date-pickers/TimeClock';
import { TimeView } from '@mui/x-date-pickers/models';
import { DigitalClock, DigitalClockProps } from '@mui/x-date-pickers/DigitalClock';
import { BaseClockProps } from '@mui/x-date-pickers/internals/models/props/clock';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { isTimeView } from '@mui/x-date-pickers/internals/utils/time-utils';
import { TimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker/TimePicker.types';
import { PickerSelectionState } from '@mui/x-date-pickers/internals';
import { UseRangePositionProps } from '../internal/hooks/useRangePosition';
import { DateRange } from '../internal/models';

export type TimeViewRendererProps<
  TDate extends unknown,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends BaseClockProps<any, any>,
> = Omit<
  TComponentProps,
  'views' | 'openTo' | 'view' | 'onViewChange' | 'value' | 'defaultValue' | 'onChange'
> &
  UseRangePositionProps & {
    view: TView;
    onViewChange?: (view: TView) => void;
    views: readonly TView[];
    value?: DateRange<TDate>;
    defaultValue?: DateRange<TDate>;
    onChange?: (value: DateRange<TDate>, selectionState?: PickerSelectionState) => void;
  };

export const renderTimeViewClock = <TDate extends unknown>({
  view,
  onViewChange,
  focusedView,
  onFocusedViewChange,
  views,
  value,
  defaultValue,
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
  ampmInClock,
  components,
  componentsProps,
  slots,
  slotProps,
  readOnly,
  disabled,
  sx,
  autoFocus,
  showViewSwitcher,
  disableIgnoringDatePartForTimeValidation,
  timezone,
}: TimeViewRendererProps<TDate, TimeView, TimeClockProps<TDate, TimeView>>) => (
  <TimeClock<TDate>
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView && isTimeView(focusedView) ? focusedView : null}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimeView)}
    value={value}
    defaultValue={defaultValue}
    onChange={onChange}
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
    ampmInClock={ampmInClock}
    components={components}
    componentsProps={componentsProps}
    slots={slots}
    slotProps={slotProps}
    readOnly={readOnly}
    disabled={disabled}
    sx={sx}
    autoFocus={autoFocus}
    showViewSwitcher={showViewSwitcher}
    disableIgnoringDatePartForTimeValidation={disableIgnoringDatePartForTimeValidation}
    timezone={timezone}
  />
);

export const renderDigitalClockTimeView = <TDate extends unknown>({
  view,
  onViewChange,
  focusedView,
  onFocusedViewChange,
  views,
  value,
  defaultValue,
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
}: TimeViewRendererProps<
  TDate,
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps<TDate>, 'timeStep'> & Pick<TimePickerProps<TDate>, 'timeSteps'>
>) => (
  <DigitalClock<TDate>
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimeView)}
    value={value}
    defaultValue={defaultValue}
    onChange={onChange}
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
);

export const renderMultiSectionDigitalClockTimeRangeView = <TDate extends unknown>({
  view,
  onViewChange,
  focusedView,
  onFocusedViewChange,
  views,
  value,
  defaultValue,
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
  defaultRangePosition,
  onRangePositionChange,
}: TimeViewRendererProps<TDate, TimeViewWithMeridiem, MultiSectionDigitalClockProps<TDate>>) => {
  const currentValue = (rangePosition === 'start' ? value?.[0] : value?.[1]) ?? null;
  const currentDefaultValue =
    (rangePosition === 'start' ? defaultValue?.[0] : defaultValue?.[1]) ?? null;
  const handleOnChange = (newValue: TDate | null, selectionState?: PickerSelectionState) => {
    if (!onChange) {
      return;
    }
    if (rangePosition === 'start') {
      onChange([newValue, value?.[1] ?? null], selectionState);
    } else {
      onChange([value?.[0] ?? null, newValue], selectionState);
    }
  };
  return (
    <MultiSectionDigitalClock<TDate>
      view={view}
      onViewChange={onViewChange}
      focusedView={focusedView}
      onFocusedViewChange={onFocusedViewChange}
      views={views.filter(isTimeView)}
      value={currentValue}
      defaultValue={currentDefaultValue}
      onChange={handleOnChange}
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
      timeSteps={timeSteps}
      skipDisabled={skipDisabled}
      timezone={timezone}
    />
  );
};
