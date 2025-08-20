import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { format } from 'date-fns';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'isToday' && prop !== 'outsideCurrentMonth' && prop !== 'children',
})(({ theme, isToday, outsideCurrentMonth, day }) => ({
  borderRadius: 0,
  ...(isToday && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(outsideCurrentMonth && {
    backgroundColor: theme.palette.primary.light,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.light,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.primary.dark,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

function Day(props) {
  const { day, outsideCurrentMonth, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isToday={day.isToday()}
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
        displayWeekNumber
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
          day: () => ({
            position: 'relative',
            borderRadius: '15px',
            margin: { xs: '1px', lg: '5px' },
            textAlign: 'center',
            height: '20%',
            width: '15%',
            display: 'flex',
            flexDirection: 'column',
            children: (day, today, outsideCurrentMonth, theme) => {
              return (
                <div>
                  <Typography
                    sx={{
                      color: today
                        ? theme.palette.primary.contrastText
                        : theme.palette.primary.main,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {format(day, 'd')}
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
                          color: today
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.main,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {outsideCurrentMonth ? '' : 'Actions'}
                      </Typography>
                    </Box>
                  </Button>
                </div>
              );
            },
          }),
        }}
      />
    </LocalizationProvider>
  );
}
