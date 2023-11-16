import * as React from 'react';
import Divider from '@mui/material/Divider';
import { resolveComponentProps } from '@mui/base/utils';
import { DateCalendar, DateCalendarProps } from '../DateCalendar';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MultiSectionDigitalClockProps,
  multiSectionDigitalClockSectionClasses,
} from '../MultiSectionDigitalClock';
import { DateTimeViewWrapper } from '../internals/components/DateTimeViewWrapper';
import { isInternalTimeView } from '../internals/utils/time-utils';
import { isDatePickerView } from '../internals/utils/date-utils';
import type { DateTimePickerProps } from '../DateTimePicker/DateTimePicker.types';
import {
  renderDigitalClockTimeView,
  renderMultiSectionDigitalClockTimeView,
} from '../timeViewRenderers';
import { digitalClockClasses } from '../DigitalClock';
import { VIEW_HEIGHT } from '../internals/constants/dimensions';

export interface DateTimeViewRendererProps<TDate>
  extends Omit<
      DateCalendarProps<TDate> & MultiSectionDigitalClockProps<TDate>,
      'views' | 'openTo' | 'view' | 'onViewChange' | 'focusedView' | 'slots' | 'slotProps'
    >,
    Pick<DateTimePickerProps<TDate>, 'slots' | 'slotProps'> {
  view: DateOrTimeViewWithMeridiem;
  onViewChange?: (view: DateOrTimeViewWithMeridiem) => void;
  views: readonly DateOrTimeViewWithMeridiem[];
  focusedView: DateOrTimeViewWithMeridiem | null;
  timeViewsCount: number;
  shouldRenderTimeInASingleColumn: boolean;
}

export const renderDesktopDateTimeView = <TDate extends unknown>({
  view,
  onViewChange,
  views,
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
  minTime,
  maxDate,
  maxTime,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  shouldDisableTime,
  reduceAnimations,
  minutesStep,
  ampm,
  onMonthChange,
  monthsPerRow,
  onYearChange,
  yearsPerRow,
  defaultCalendarMonth,
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
  shouldRenderTimeInASingleColumn,
}: DateTimeViewRendererProps<TDate>) => {
  const isActionBarVisible = !!resolveComponentProps(slotProps?.actionBar, {} as any)?.actions
    ?.length;
  const commonTimeProps = {
    view: isInternalTimeView(view) ? view : 'hours',
    onViewChange,
    focusedView: focusedView && isInternalTimeView(focusedView) ? focusedView : null,
    onFocusedViewChange,
    views: views.filter(isInternalTimeView),
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
    autoFocus,
    disableIgnoringDatePartForTimeValidation,
    timeSteps,
    skipDisabled,
    timezone,
  };
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
          referenceDate={referenceDate}
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
            {shouldRenderTimeInASingleColumn
              ? renderDigitalClockTimeView({
                  ...commonTimeProps,
                  view: 'hours',
                  views: ['hours'],
                  focusedView: focusedView && isInternalTimeView(focusedView) ? 'hours' : null,
                  sx: {
                    width: 'auto',
                    [`&.${digitalClockClasses.root}`]: {
                      maxHeight: VIEW_HEIGHT,
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                  },
                })
              : renderMultiSectionDigitalClockTimeView({
                  ...commonTimeProps,
                  view: isInternalTimeView(view) ? view : 'hours',
                  views: views.filter(isInternalTimeView),
                  focusedView: focusedView && isInternalTimeView(focusedView) ? focusedView : null,
                  sx: {
                    borderBottom: 0,
                    width: 'auto',
                    [`.${multiSectionDigitalClockSectionClasses.root}`]: {
                      maxHeight: '100%',
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                  },
                })}
          </React.Fragment>
        )}
      </DateTimeViewWrapper>
      {isActionBarVisible && <Divider />}
    </React.Fragment>
  );
};
