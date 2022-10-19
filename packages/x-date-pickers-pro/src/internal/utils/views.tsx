import * as React from 'react';
import { DateRangeCalendar, DateRangeCalendarProps } from '../../DateRangeCalendar';

export const renderDateRangeView = <TDate extends unknown>(
  props: DateRangeCalendarProps<TDate>,
) => <DateRangeCalendar {...props} />;
