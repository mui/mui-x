import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import {
  DateRangePickerDay as MuiDateRangePickerDay,
  DateRangePickerDayProps,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Dayjs } from 'dayjs';

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
) as React.ComponentType<DateRangePickerDayProps<Dayjs>>;

export default function CustomDateRangePickerDay() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);

  const renderWeekPickerDay = (
    date: Dayjs,
    dateRangePickerDayProps: DateRangePickerDayProps<Dayjs>,
  ) => {
    return <DateRangePickerDay {...dateRangePickerDayProps} />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        displayStaticWrapperAs="desktop"
        label="date range"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderDay={renderWeekPickerDay}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
}
