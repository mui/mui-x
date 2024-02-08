import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  PickersArrowSwitcher,
  useLocaleText,
  useNextMonthDisabled,
  usePreviousMonthDisabled,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { PickersRangeCalendarHeaderProps } from './PickersRangeCalendarHeader.types';

type PickersRangeCalendarHeaderComponent = (<TDate extends PickerValidDate>(
  props: PickersRangeCalendarHeaderProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersRangeCalendarHeaderContentSingleCalendar = styled(PickersCalendarHeader, {
  name: 'PickersRangeCalendarHeader',
  slot: 'ContentSingleCalendar',
})({}) as typeof PickersCalendarHeader;

const PickersRangeCalendarHeaderContentMultipleCalendars = styled(PickersArrowSwitcher, {
  name: 'PickersRangeCalendarHeader',
  slot: 'ContentMultipleCalendars',
})({
  padding: '12px 16px 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const PickersRangeCalendarHeader = React.forwardRef(function PickersRangeCalendarHeader<
  TDate extends PickerValidDate,
>(inProps: PickersRangeCalendarHeaderProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersRangeCalendarHeader' });
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();

  const { calendars, changeMonth, month, monthIndex, ...other } = props;
  const {
    format,
    slots,
    slotProps,
    currentMonth,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    timezone,
  } = props;

  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, {
    disableFuture,
    maxDate,
    timezone,
  });

  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, {
    disablePast,
    minDate,
    timezone,
  });

  if (calendars === 1) {
    return <PickersRangeCalendarHeaderContentSingleCalendar {...other} ref={ref} />;
  }

  const selectPreviousMonth = () => changeMonth(utils.addMonths(currentMonth, -1));

  const selectNextMonth = () => changeMonth(utils.addMonths(currentMonth, 1));

  return (
    <PickersRangeCalendarHeaderContentMultipleCalendars
      ref={ref}
      onGoToPrevious={selectPreviousMonth}
      onGoToNext={selectNextMonth}
      isPreviousHidden={monthIndex !== 0}
      isPreviousDisabled={isPreviousMonthDisabled}
      previousLabel={localeText.previousMonth}
      isNextHidden={monthIndex !== calendars - 1}
      isNextDisabled={isNextMonthDisabled}
      nextLabel={localeText.nextMonth}
      slots={slots}
      slotProps={slotProps}
    >
      {utils.formatByString(month, format ?? `${utils.formats.month} ${utils.formats.year}`)}
    </PickersRangeCalendarHeaderContentMultipleCalendars>
  );
}) as PickersRangeCalendarHeaderComponent;
