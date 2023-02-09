import * as React from 'react';
import { TimeClock, TimeClockProps } from '../TimeClock';
import { DateOrTimeView, TimeView } from '../internals';
import { DigitalClock, DigitalClockProps } from '../DigitalClock';
import { BaseClockProps } from '../internals/models/props/clock';

const isTimePickerView = (view: unknown): view is TimeView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export type TimeViewRendererProps<
  TView extends DateOrTimeView,
  TComponentProps extends BaseClockProps<any>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> & {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
};

export const renderTimeViewClock = <TDate extends unknown>({
  view,
  onViewChange,
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
}: TimeViewRendererProps<any, TimeClockProps<TDate>>) => (
  <TimeClock<TDate>
    view={view as TimeView}
    onViewChange={onViewChange}
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

export const renderTimeViewDigitalClock = <TDate extends unknown>({
  view,
  onViewChange,
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
  renderAsSelectThreshold,
  shouldRenderAsSelect,
  timeStep,
}: TimeViewRendererProps<any, DigitalClockProps<TDate>>) => (
  <DigitalClock<TDate>
    view={view as TimeView}
    onViewChange={onViewChange}
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
    sx={sx}
    autoFocus={autoFocus}
    disableIgnoringDatePartForTimeValidation={disableIgnoringDatePartForTimeValidation}
    renderAsSelectThreshold={renderAsSelectThreshold}
    shouldRenderAsSelect={shouldRenderAsSelect}
    timeStep={timeStep}
  />
);
