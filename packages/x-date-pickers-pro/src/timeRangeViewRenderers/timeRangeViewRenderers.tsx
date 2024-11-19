import * as React from 'react';
import {
  BaseClockProps,
  TimeViewWithMeridiem,
  isTimeView,
  PickerSelectionState,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { DigitalClock, DigitalClockProps } from '@mui/x-date-pickers/DigitalClock';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeClock, TimeClockProps } from '@mui/x-date-pickers/TimeClock';
import { PickerValidDate, TimeView } from '@mui/x-date-pickers/models';
import type { TimeRangePickerProps } from '../TimeRangePicker/TimeRangePicker.types';
import { UseRangePositionProps } from '../internals/hooks/useRangePosition';

export type TimeRangeViewRendererProps<
  TView extends TimeViewWithMeridiem,
  TComponentProps extends Omit<BaseClockProps<any>, 'value' | 'onChange'>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> &
  UseRangePositionProps & {
    value: PickerRangeValue;
    onChange: (value: PickerRangeValue, selectionState?: PickerSelectionState) => void;
    view: TView;
    onViewChange?: (view: TView) => void;
    views: readonly TView[];
  };

export const renderTimeRangeViewClock = ({
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
  minutesStep,
  ampm,
  ampmInClock,
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
  TimeView,
  Omit<TimeClockProps<TimeView>, 'value' | 'defaultValue' | 'onChange'> &
    Pick<TimeRangePickerProps, 'timeSteps'>
>) => {
  const valueForCurrentView = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (
    newValue: PickerValidDate | null,
    selectionState?: PickerSelectionState,
  ) => {
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
    <TimeClock
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
      minutesStep={minutesStep}
      ampm={ampm}
      ampmInClock={ampmInClock}
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

export const renderDigitalClockTimeRangeView = ({
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
  minutesStep,
  ampm,
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
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps, 'timeStep' | 'value' | 'defaultValue' | 'onChange'> &
    Pick<TimeRangePickerProps, 'timeSteps'>
>) => {
  const valueForCurrentView = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (
    newValue: PickerValidDate | null,
    selectionState?: PickerSelectionState,
  ) => {
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
    <DigitalClock
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
      minutesStep={minutesStep}
      ampm={ampm}
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

export const renderMultiSectionDigitalClockTimeRangeView = ({
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
  minutesStep,
  ampm,
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
  TimeViewWithMeridiem,
  Omit<MultiSectionDigitalClockProps, 'timeStep' | 'value' | 'defaultValue' | 'onChange'> &
    Pick<TimeRangePickerProps, 'timeSteps'>
>) => {
  const valueForCurrentView = rangePosition === 'start' ? value[0] : value[1];

  const handleChange = (
    newValue: PickerValidDate | null,
    selectionState?: PickerSelectionState,
  ) => {
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
    <MultiSectionDigitalClock
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
      minutesStep={minutesStep}
      ampm={ampm}
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
