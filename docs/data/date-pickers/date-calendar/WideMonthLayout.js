import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import { format, getDay } from 'date-fns';

function DayComponent(props) {
  const { day, outsideCurrentMonth, today } = props;

  const theme = useTheme();

  // Determine colors based on day properties
  let backgroundColor = theme.palette.primary.main;
  let borderColor = theme.palette.secondary.main;

  if (getDay(day) === 0) {
    // Friday in Jalali calendar
    backgroundColor = theme.palette.warning.main;
  }
  if (today) {
    borderColor = theme.palette.info.main;
  }
  if (outsideCurrentMonth) {
    backgroundColor = theme.palette.primary.light;
  }
  return (
    <Box
      sx={{
        position: 'relative',
        border: { xs: `1px solid ${borderColor}`, lg: `3px solid ${borderColor}` },
        backgroundColor,
        borderRadius: '15px',
        margin: { xs: '1px', lg: '5px' },
        textAlign: 'center',
        height: '20%',
        width: '15%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{
          borderBottom: `3px solid ${borderColor}`,
          borderRight: `3px solid ${borderColor}`,
          borderLeft: `3px solid ${borderColor}`,
          borderRadius: '12px',
          backgroundColor: 'white',
          color: outsideCurrentMonth ? 'gray' : 'black',
          height: '30%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {format(day, 'EEEE')}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: outsideCurrentMonth ? 'gray' : 'black',
            height: '30%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {format(day, 'd')}
        </Typography>
      </Box>
    </Box>
  );
}

export default function WideMonthLayout() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6}
        sx={{
          flexGrow: 1,
          width: '100%',
          maxHeight: 'none',
          overflow: 'visible',
          '& .MuiPickersSlideTransition-root': {
            flexGrow: 1,
            overflowX: 'visible',
          },
        }}
        slots={{
          day: DayComponent,
        }}
      />
    </LocalizationProvider>
  );
}
