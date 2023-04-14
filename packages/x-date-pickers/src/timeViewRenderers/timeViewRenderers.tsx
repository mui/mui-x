import * as React from 'react';
import { TimeClock, TimeClockProps } from '../TimeClock';
import { DigitalClock, DigitalClockProps } from '../DigitalClock';
import { BaseClockProps } from '../internals/models/props/clock';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
} from '../MultiSectionDigitalClock';
import { TimeView } from '../models';

const isTimePickerView = (view: TimeView): boolean =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export type TimeViewRendererProps<
  TView extends unknown,
  TComponentProps extends BaseClockProps<any>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> & {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
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
}: TimeViewRendererProps<TimeView, TimeClockProps<TDate>>) => (
  <TimeClock<TDate>
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimePickerView)}
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
}: TimeViewRendererProps<TimeView, DigitalClockProps<TDate>>) => (
  <DigitalClock<TDate>
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimePickerView)}
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
    sx={[{ padding: '4px 0' }, ...(Array.isArray(sx) ? sx : [sx])]}
    autoFocus={autoFocus}
    disableIgnoringDatePartForTimeValidation={disableIgnoringDatePartForTimeValidation}
    timeSteps={timeSteps}
  />
);

export const renderMultiSectionDigitalClockTimeView = <TDate extends unknown>({
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
}: TimeViewRendererProps<TimeView, MultiSectionDigitalClockProps<TDate>>) => (
  <MultiSectionDigitalClock<TDate>
    view={view}
    onViewChange={onViewChange}
    focusedView={focusedView}
    onFocusedViewChange={onFocusedViewChange}
    views={views.filter(isTimePickerView)}
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
    sx={[{ padding: '4px 0' }, ...(Array.isArray(sx) ? sx : [sx])]}
    autoFocus={autoFocus}
    disableIgnoringDatePartForTimeValidation={disableIgnoringDatePartForTimeValidation}
    timeSteps={timeSteps}
  />
);
