import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import {
  DatePicker,
  LocalizationProvider,
  usePickerContext,
  useSplitFieldProps,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCalendarContext } from './CalendarContext';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

function ButtonField(props: any) {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const valueStr = format(pickerContext.value, pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      ref={handleRef}
      sx={{
        px: 3,
        borderColor: '#000000',
        borderRadius: 2,
        whiteSpace: 'nowrap',
        textTransform: 'none',
        color: '#000000',
        height: '40px',
        backgroundColor: '#ffffff',
        fontWeight: 'bold',
        boxShadow: 'none',
      }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}
function CalendarHeader() {
  const theme = useTheme();
  const {
    currentDate,
    isDatePickerOpen,
    dateConstraints,
    setIsDatePickerOpen,
    handlePreviousMonth,
    handleNextMonth,
    handleDateChange,
  } = useCalendarContext();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      sx={{
        bgcolor: 'grey.80',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        pb: 2,
        ...theme.applyStyles('dark', {
          bgcolor: '#141A1F',
        }),
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Time Off Calendar
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleDateChange(new Date(2025, 4, 1))}
          sx={{
            px: 3,
            borderColor: '#000000',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            textTransform: 'none',
            color: '#000000',
            height: '40px',
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
            boxShadow: 'none',
          }}
        >
          Today
        </Button>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            open={isDatePickerOpen}
            onOpen={() => setIsDatePickerOpen(true)}
            onClose={() => setIsDatePickerOpen(false)}
            minDate={dateConstraints.minDate}
            maxDate={dateConstraints.maxDate}
            views={['month', 'year']}
            slots={{ field: ButtonField }}
            slotProps={{
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    borderRadius: '12px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                  '& .MuiPickersCalendarHeader-root': {
                    marginTop: '8px',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        <Box sx={{ display: 'flex', ml: -1 }}>
          <IconButton
            onClick={handlePreviousMonth}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNextMonth}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </Stack>
  );
}

export { CalendarHeader };
