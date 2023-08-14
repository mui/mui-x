import * as React from 'react';
import Divider from '@mui/material/Divider';
import { resolveComponentProps } from '@mui/base/utils';
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
import type { DateTimePickerProps } from '../DateTimePicker/DateTimePicker.types';

export interface DateTimeViewRendererProps<TDate>
  extends Omit<
      DateCalendarProps<TDate> & MultiSectionDigitalClockProps<TDate>,
      | 'views'
      | 'openTo'
      | 'view'
      | 'onViewChange'
      | 'focusedView'
      | 'components'
      | 'componentsProps'
      | 'slots'
      | 'slotProps'
    >,
    Pick<DateTimePickerProps<TDate>, 'components' | 'componentsProps' | 'slots' | 'slotProps'> {
  view: DateOrTimeViewWithMeridiem;
  onViewChange?: (view: DateOrTimeViewWithMeridiem) => void;
  views: readonly DateOrTimeViewWithMeridiem[];
  focusedView: DateOrTimeViewWithMeridiem | null;
  timeViewsCount: number;
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
  timezone,
  disableIgnoringDatePartForTimeValidation,
  timeSteps,
  skipDisabled,
  timeViewsCount,
}: DateTimeViewRendererProps<TDate>) => {
  const isActionBarVisible = !!resolveComponentProps(
    slotProps?.actionBar ?? componentsProps?.actionBar,
    {} as any,
  )?.actions?.length;
  return (
    <React.Fragment>
      <DateTimeViewWrapper>
        <DateCalendar
          view={isDatePickerView(view) ? view : 'day'}
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
        {timeViewsCount > 0 && (
          <React.Fragment>
            <Divider orientation="vertical" />
            <MultiSectionDigitalClock
              view={isInternalTimeView(view) ? view : 'hours'}
              onViewChange={onViewChange}
              focusedView={focusedView && isInternalTimeView(focusedView) ? focusedView : null}
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
              timezone={timezone}
            />
          </React.Fragment>
        )}
      </DateTimeViewWrapper>
      {isActionBarVisible && <Divider />}
    </React.Fragment>
  );
};
