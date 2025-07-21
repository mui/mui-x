import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { format } from 'date-fns';
import Button from '@mui/material/Button';

function DayComponent(props: PickersDayProps) {
  const { day, outsideCurrentMonth, today } = props;

  let color = 'black';
  if (outsideCurrentMonth) {
    color='gray'
  } else if(today){
    color='blue'
  }

  return (
    <Box
      sx={{
        position: 'relative',
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
          color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {format(day, 'd')}
      </Typography>
      <Button >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='body2'
            sx={{
              color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {outsideCurrentMonth?'':'Actions'}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}

export default function WideMonthLayout() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6}
        views={['day']}
        reduceAnimations
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '520px',
          maxHeight: 'none',
          overflow: 'visible',
          '& .MuiDayCalendar-weekDayLabel': {
            width: "23%",
          },
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
