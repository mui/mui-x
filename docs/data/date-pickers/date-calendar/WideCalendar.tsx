import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { format, isToday, isSameMonth } from 'date-fns';

interface CustomPickerDayProps extends PickersDayProps {
  today: boolean;
  outsideCurrentMonth: boolean;
  children?: React.ReactNode;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'today' && prop !== 'outsideCurrentMonth' && prop !== 'children',
})<CustomPickerDayProps>(() => ({})) as React.ComponentType<CustomPickerDayProps>;

function Day(
  props: PickersDayProps & {
    children?: React.ReactNode;
  },
) {
  const { day, outsideCurrentMonth, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{
        px: 2.5,
        position: 'relative',
        borderRadius: '15px',
        margin: { xs: '1px', lg: '5px' },
        textAlign: 'center',
        height: '20%',
        width: '15%',
        display: 'flex',
        flexDirection: 'column',
      }}
      disableMargin
      selected={false}
      today={isToday(day)}
      outsideCurrentMonth={outsideCurrentMonth}
    >
      ...children
    </CustomPickersDay>
  );
}

export default function WideCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            width: '23%',
          },
          '& .MuiPickersSlideTransition-root': {
            flexGrow: 1,
            overflowX: 'visible',
          },
        }}
        slots={{ day: Day }}
        slotProps={{
          day: (ownerState) =>
            ({
              children: () => {
                const today = isToday(ownerState.day);
                return (
                  <div>
                    <Typography
                      sx={{
                        color: today ? 'black' : 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {format(ownerState.day, 'd')}
                    </Typography>
                    <Button>
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: today ? 'red' : 'blue',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSameMonth(ownerState.day, new Date()) ? '' : 'Actions'}
                        </Typography>
                      </Box>
                    </Button>
                  </div>
                );
              },
            }) as any,
        }}
      />
    </LocalizationProvider>
  );
}
