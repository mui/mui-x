import * as React from 'react';
import { DateCalendar, DateCalendarProps } from '../DateCalendar';
import { DateOrTimeView, DateView } from '../internals';

const isDatePickerView = (view: unknown): view is DateView =>
  view === 'year' || view === 'month' || view === 'day';

export interface DateViewRendererProps<TDate, TView extends DateOrTimeView>
  extends Omit<
    DateCalendarProps<TDate>,
    'views' | 'openTo' | 'view' | 'onViewChange' | 'focusedView'
  > {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
  focusedView: TView | null;
}

export const renderDateViewCalendar = <TDate extends unknown>({
  view,
  onViewChange,
  views,
  focusedView,
  onFocusedViewChange,
  value,
  defaultValue,
  onChange,
  className,
  classes,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  reduceAnimations,
  onMonthChange,
  monthsPerRow,
  onYearChange,
  yearsPerRow,
  defaultCalendarMonth,
  components,
  componentsProps,
  slots,
  slotProps,
  loading,
  renderLoading,
  disableHighlightToday,
  readOnly,
  disabled,
  showDaysOutsideCurrentMonth,
  dayOfWeekFormatter,
  sx,
  autoFocus,
  fixedWeekNumber,
  displayWeekNumber,
}: DateViewRendererProps<TDate, any>) => (
  <DateCalendar
    view={view as DateView}
    onViewChange={onViewChange}
    views={views.filter(isDatePickerView)}
    focusedView={focusedView as DateView | null}
    onFocusedViewChange={onFocusedViewChange}
    value={value}
    defaultValue={defaultValue}
    onChange={onChange}
    className={className}
    classes={classes}
    disableFuture={disableFuture}
    disablePast={disablePast}
    minDate={minDate}
    maxDate={maxDate}
    shouldDisableDate={shouldDisableDate}
    shouldDisableMonth={shouldDisableMonth}
    shouldDisableYear={shouldDisableYear}
    reduceAnimations={reduceAnimations}
    onMonthChange={onMonthChange}
    monthsPerRow={monthsPerRow}
    onYearChange={onYearChange}
    yearsPerRow={yearsPerRow}
    defaultCalendarMonth={defaultCalendarMonth}
    components={components}
    componentsProps={componentsProps}
    slots={slots}
    slotProps={slotProps}
    loading={loading}
    renderLoading={renderLoading}
    disableHighlightToday={disableHighlightToday}
    readOnly={readOnly}
    disabled={disabled}
    showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
    dayOfWeekFormatter={dayOfWeekFormatter}
    sx={sx}
    autoFocus={autoFocus}
    fixedWeekNumber={fixedWeekNumber}
    displayWeekNumber={displayWeekNumber}
  />
);
