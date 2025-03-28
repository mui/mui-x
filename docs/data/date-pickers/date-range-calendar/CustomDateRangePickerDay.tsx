import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import {
  DateRangePickerDay as MuiDateRangePickerDay,
  DateRangePickerDayProps,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { DemoContainer } from '../_shared/DemoContainer';

const DateRangePickerDay = styled(MuiDateRangePickerDay)(({ theme }) => ({
  variants: [
    {
      props: ({ isHighlighting, outsideCurrentMonth }) =>
        !outsideCurrentMonth && isHighlighting,
      style: {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    },
    {
      props: ({ isStartOfHighlighting }) => isStartOfHighlighting,
      style: {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
      },
    },
    {
      props: ({ isEndOfHighlighting }) => isEndOfHighlighting,
      style: {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
      },
    },
  ],
})) as React.ComponentType<DateRangePickerDayProps>;

export default function CustomDateRangePickerDay() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar']}>
        <DateRangeCalendar
          defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
          slots={{ day: DateRangePickerDay }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
