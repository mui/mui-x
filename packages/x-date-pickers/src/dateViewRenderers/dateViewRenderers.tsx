import * as React from 'react';
import { DateCalendar, DateCalendarProps } from '../DateCalendar';
import { DateView } from '../models';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { isDatePickerView } from '../internals/utils/date-utils';

export interface DateViewRendererProps<TDate, TView extends DateOrTimeViewWithMeridiem>
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
  timezone,
}: DateViewRendererProps<TDate, DateView>) => (
  <DateCalendar
    view={view}
    onViewChange={onViewChange}
    views={views.filter(isDatePickerView)}
    focusedView={focusedView && isDatePickerView(focusedView) ? focusedView : null}
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
    timezone={timezone}
  />
);
