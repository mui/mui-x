import * as React from 'react';
import { DateOrTimeViewWithMeridiem, isDatePickerView } from '@mui/x-date-pickers/internals';
import { DateRangeCalendar, DateRangeCalendarProps } from '../DateRangeCalendar';

export interface DateRangeViewRendererProps<TView extends DateOrTimeViewWithMeridiem>
  extends Omit<
    DateRangeCalendarProps,
    'views' | 'onRangePositionChange' | 'rangePosition' | 'defaultRangePosition'
  > {
  views: readonly TView[];
}

/**
 * We don't pass all the props down to `DateRangeCalendar`,
 * because otherwise some unwanted props would be passed to the HTML element.
 */
export const renderDateRangeViewCalendar = ({
  views,
  view,
  onViewChange,
  focusedView,
  onFocusedViewChange,
  value,
  defaultValue,
  referenceDate,
  onChange,
  className,
  classes,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  shouldDisableDate,
  reduceAnimations,
  onMonthChange,
  calendars,
  currentMonthCalendarPosition,
  slots,
  slotProps,
  loading,
  renderLoading,
  disableHighlightToday,
  readOnly,
  disabled,
  showDaysOutsideCurrentMonth,
  dayOfWeekFormatter,
  disableAutoMonthSwitching,
  sx,
  autoFocus,
  fixedWeekNumber,
  disableDragEditing,
  displayWeekNumber,
  timezone,
  availableRangePositions,
  daySlot,
}: DateRangeViewRendererProps<'day'>) => (
  <DateRangeCalendar
    view={view}
    views={views}
    onViewChange={onViewChange}
    focusedView={focusedView && isDatePickerView(focusedView) ? focusedView : null}
    onFocusedViewChange={onFocusedViewChange}
    value={value}
    defaultValue={defaultValue}
    referenceDate={referenceDate}
    onChange={onChange}
    className={className}
    classes={classes}
    disableFuture={disableFuture}
    disablePast={disablePast}
    minDate={minDate}
    maxDate={maxDate}
    shouldDisableDate={shouldDisableDate}
    reduceAnimations={reduceAnimations}
    onMonthChange={onMonthChange}
    calendars={calendars}
    currentMonthCalendarPosition={currentMonthCalendarPosition}
    slots={slots}
    slotProps={slotProps}
    loading={loading}
    renderLoading={renderLoading}
    disableHighlightToday={disableHighlightToday}
    readOnly={readOnly}
    disabled={disabled}
    showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
    dayOfWeekFormatter={dayOfWeekFormatter}
    disableAutoMonthSwitching={disableAutoMonthSwitching}
    sx={sx}
    autoFocus={autoFocus}
    fixedWeekNumber={fixedWeekNumber}
    disableDragEditing={disableDragEditing}
    displayWeekNumber={displayWeekNumber}
    timezone={timezone}
    availableRangePositions={availableRangePositions}
    daySlot={daySlot}
  />
);
