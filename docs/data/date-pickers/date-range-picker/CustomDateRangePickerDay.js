import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Unstable_StaticNextDateRangePicker as StaticNextDateRangePicker } from '@mui/x-date-pickers-pro/StaticNextDateRangePicker';
import { DateRangePickerDay as MuiDateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';

const DateRangePickerDay = styled(MuiDateRangePickerDay)(
  ({
    theme,
    isHighlighting,
    isStartOfHighlighting,
    isEndOfHighlighting,
    outsideCurrentMonth,
  }) => ({
    ...(!outsideCurrentMonth &&
      isHighlighting && {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
    ...(isStartOfHighlighting && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    }),
    ...(isEndOfHighlighting && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
  }),
);

export default function CustomDateRangePickerDay() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticNextDateRangePicker
        displayStaticWrapperAs="desktop"
        defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
        components={{ Day: DateRangePickerDay }}
      />
    </LocalizationProvider>
  );
}
