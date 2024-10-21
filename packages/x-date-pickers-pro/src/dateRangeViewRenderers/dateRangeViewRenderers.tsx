import * as React from 'react';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DateRangeCalendar, DateRangeCalendarProps } from '../DateRangeCalendar';

export interface DateRangeViewRendererProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends Omit<DateRangeCalendarProps<TDate>, 'views'> {
  views: readonly TView[];
}

/**
 * We don't pass all the props down to `DateRangeCalendar`,
 * because otherwise some unwanted props would be passed to the HTML element.
 */
export const renderDateRangeViewCalendar = <TDate extends PickerValidDate>({
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
  rangePosition,
  defaultRangePosition,
  onRangePositionChange,
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
  views,
  view,
  onViewChange,
}: DateRangeViewRendererProps<TDate, 'day'>) => (
  <DateRangeCalendar
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
    rangePosition={rangePosition}
    defaultRangePosition={defaultRangePosition}
    onRangePositionChange={onRangePositionChange}
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
    view={view}
    views={views}
    onViewChange={onViewChange}
  />
);
