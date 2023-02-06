import * as React from 'react';
import { TimeClock, TimeClockProps, TimeView } from '../TimeClock';
import { DateOrTimeView } from '../internals';

const isTimePickerView = (view: unknown): view is TimeView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export interface TimeViewRendererProps<TDate, TView extends DateOrTimeView>
  extends Omit<TimeClockProps<TDate>, 'views' | 'openTo' | 'view' | 'onViewChange'> {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
}

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
}: TimeViewRendererProps<TDate, any>) => (
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
