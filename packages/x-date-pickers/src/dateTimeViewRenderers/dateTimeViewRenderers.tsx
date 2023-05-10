import * as React from 'react';
import Divider from '@mui/material/Divider';
import { DateCalendar, DateCalendarProps } from '../DateCalendar';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
  multiSectionDigitalClockSectionClasses,
} from '../MultiSectionDigitalClock';
import { DateTimeViewWrapper } from '../internals/components/DateTimeViewWrapper';
import { isInternalTimeView } from '../internals/utils/time-utils';
import { isDatePickerView } from '../internals/utils/date-utils';

export interface DateTimeViewRendererProps<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends Omit<
    DateCalendarProps<TDate> & MultiSectionDigitalClockProps<TDate>,
    'views' | 'openTo' | 'view' | 'onViewChange' | 'focusedView'
  > {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
  focusedView: TView | null;
}

export const renderDesktopDateTimeView = <TDate extends unknown>({
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
  minTime,
  maxDate,
  maxTime,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  shouldDisableTime,
  shouldDisableClock,
  reduceAnimations,
  minutesStep,
  ampm,
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
  disableIgnoringDatePartForTimeValidation,
  timeSteps,
  skipDisabled,
}: DateTimeViewRendererProps<TDate, any>) => {
  return (
    <React.Fragment>
      <Divider />
      <DateTimeViewWrapper>
        <DateCalendar
          view={isDatePickerView(view) ? view : 'day'}
          onViewChange={onViewChange}
          views={views.filter(isDatePickerView)}
          focusedView={isDatePickerView(focusedView) ? focusedView : null}
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
        <Divider orientation="vertical" />
        <MultiSectionDigitalClock
          view={isInternalTimeView(view) ? view : 'hours'}
          onViewChange={onViewChange}
          focusedView={isInternalTimeView(focusedView) ? focusedView : null}
          onFocusedViewChange={onFocusedViewChange}
          views={views.filter(isInternalTimeView)}
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
          sx={{
            borderBottom: 0,
            width: 'auto',
            [`.${multiSectionDigitalClockSectionClasses.root}`]: {
              maxHeight: '100%',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          }}
          autoFocus={autoFocus}
          disableIgnoringDatePartForTimeValidation={disableIgnoringDatePartForTimeValidation}
          timeSteps={timeSteps}
          skipDisabled={skipDisabled}
        />
      </DateTimeViewWrapper>
      <Divider />
    </React.Fragment>
  );
};
