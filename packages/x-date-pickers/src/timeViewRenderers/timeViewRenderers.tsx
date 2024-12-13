import * as React from 'react';
import { TimeClock, TimeClockProps } from '../TimeClock';
import { TimeView } from '../models';
import { DigitalClock, DigitalClockProps } from '../DigitalClock';
import { BaseClockProps } from '../internals/models/props/time';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
} from '../MultiSectionDigitalClock';
import { isTimeView } from '../internals/utils/time-utils';
import { TimeViewWithMeridiem } from '../internals/models';
import type { TimePickerProps } from '../TimePicker/TimePicker.types';

export type TimeViewRendererProps<
  TView extends TimeViewWithMeridiem,
  TComponentProps extends BaseClockProps<TView>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> & {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
};

export const renderTimeViewClock = ({
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
}: TimeViewRendererProps<TimeView, TimeClockProps<TimeView>>) => (
  <TimeClock
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView && isTimeView(focusedView) ? focusedView : null}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimeView)}
    value={value}
    defaultValue={defaultValue}
    referenceDate={referenceDate}
    onChange={onChange}
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

export const renderDigitalClockTimeView = ({
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
}: TimeViewRendererProps<
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps, 'timeStep'> & Pick<TimePickerProps, 'timeSteps'>
>) => (
  <DigitalClock
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimeView)}
    value={value}
    defaultValue={defaultValue}
    referenceDate={referenceDate}
    onChange={onChange}
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

export const renderMultiSectionDigitalClockTimeView = ({
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
}: TimeViewRendererProps<TimeViewWithMeridiem, MultiSectionDigitalClockProps>) => (
  <MultiSectionDigitalClock
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimeView)}
    value={value}
    defaultValue={defaultValue}
    referenceDate={referenceDate}
    onChange={onChange}
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
