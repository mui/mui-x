import * as React from 'react';
import {
  BaseClockProps,
  TimeViewWithMeridiem,
  isTimeView,
  PickerSelectionState,
} from '@mui/x-date-pickers/internals';
import { DigitalClock, DigitalClockProps } from '@mui/x-date-pickers/DigitalClock';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeClock, TimeClockProps } from '@mui/x-date-pickers/TimeClock';
import { TimeView } from '@mui/x-date-pickers/models';
import type { TimeRangePickerProps } from '../TimeRangePicker/TimeRangePicker.types';
import { DateRange } from '../internals/models';
import { UseRangePositionProps } from '../internals/hooks/useRangePosition';

export type TimeRangeViewRendererProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends Omit<BaseClockProps<any, any>, 'value' | 'onChange'>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> &
  UseRangePositionProps & {
    value: DateRange<TDate>;
    onChange: (value: DateRange<TDate>, selectionState?: PickerSelectionState) => void;
    view: TView;
    onViewChange?: (view: TView) => void;
    views: readonly TView[];
  };

export const renderTimeRangeViewClock = <TDate extends unknown>({
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
  rangePosition,
  onRangePositionChange,
}: TimeRangeViewRendererProps<
  TDate,
  TimeView,
  Omit<TimeClockProps<TDate>, 'value' | 'onChange'> & Pick<TimeRangePickerProps<TDate>, 'timeSteps'>
>) => {
  const valueForCurrentView = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (newValue: TDate | null, selectionState?: PickerSelectionState) => {
    if (selectionState === 'finish' && rangePosition === 'start') {
      onRangePositionChange?.('end');
      onViewChange?.(views[0]);
    }

    onChange(
      rangePosition === 'start' ? [newValue, value[1]] : [value[0], newValue],
      rangePosition === 'start' ? 'partial' : selectionState,
    );
  };

  return (
    <TimeClock<TDate>
      view={view}
      onViewChange={onViewChange}
      focusedView={focusedView && isTimeView(focusedView) ? focusedView : null}
      onFocusedViewChange={onFocusedViewChange}
      views={views.filter(isTimeView)}
      value={valueForCurrentView}
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
    Pick<TimeRangePickerProps<TDate>, 'timeSteps'>
>) => {
  const valueForCurrentView = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (newValue: TDate | null, selectionState?: PickerSelectionState) => {
    if (selectionState === 'finish' && rangePosition === 'start') {
      onRangePositionChange?.('end');
      onViewChange?.(views[0]);
    }

    onChange(
      rangePosition === 'start' ? [newValue, value[1]] : [value[0], newValue],
      rangePosition === 'start' ? 'partial' : selectionState,
    );
  };

  return (
    <DigitalClock<TDate>
      view={view}
      onViewChange={onViewChange}
      focusedView={focusedView}
      onFocusedViewChange={onFocusedViewChange}
      views={views.filter(isTimeView)}
      value={valueForCurrentView}
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
  );
};

export const renderMultiSectionDigitalClockTimeRangeView = <TDate extends unknown>({
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
  TimeViewWithMeridiem,
  Omit<MultiSectionDigitalClockProps<TDate>, 'timeStep' | 'value' | 'defaultValue' | 'onChange'> &
    Pick<TimeRangePickerProps<TDate>, 'timeSteps'>
>) => {
  const valueForCurrentView = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (newValue: TDate | null, selectionState?: PickerSelectionState) => {
    if (selectionState === 'finish' && rangePosition === 'start') {
      onRangePositionChange?.('end');
      onViewChange?.(views[0]);
    }

    onChange(
      rangePosition === 'start' ? [newValue, value[1]] : [value[0], newValue],
      rangePosition === 'start' ? 'partial' : selectionState,
    );
  };

  return (
    <MultiSectionDigitalClock<TDate>
      view={view}
      onViewChange={onViewChange}
      focusedView={focusedView}
      onFocusedViewChange={onFocusedViewChange}
      views={views.filter(isTimeView)}
      value={valueForCurrentView}
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
      timeSteps={timeSteps}
      skipDisabled={skipDisabled}
      timezone={timezone}
    />
  );
};
