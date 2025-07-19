import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { useTheme } from '@mui/material/styles';
import { format, isWeekend } from 'date-fns';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

function DayComponent(props: PickersDayProps) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { day, outsideCurrentMonth, today } = props;

  const theme = useTheme();

  // Determine colors based on day properties
  let backgroundColor = theme.palette.primary.main;
  let borderColor = theme.palette.info.main;

  if (isWeekend(day)) {
    backgroundColor = theme.palette.error.light;
  }
  if (today) {
    borderColor = theme.palette.info.main;
  }
  if (outsideCurrentMonth) {
    backgroundColor = theme.palette.primary.light;
    borderColor = theme.palette.info.light;
  }
  return (
    <Box
      sx={{
        position: 'relative',
        border: { xs: `0.5px solid ${borderColor}`, lg: `1px solid ${borderColor}` },
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
          borderBottom: `1px solid ${borderColor}`,
          borderRight: `1px solid ${borderColor}`,
          borderLeft: `1px solid ${borderColor}`,
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
      <Button onClick={handleClick}>
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
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={`day ${format(day, 'yyyy/MM/dd')} clicked`}
        anchorOrigin={{  vertical: 'bottom', horizontal: 'center'}}
      />
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
          height: '520px',
          maxHeight: 'none',
          overflow: 'visible',
          '& .MuiDayCalendar-header': {
            display: 'none',
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
