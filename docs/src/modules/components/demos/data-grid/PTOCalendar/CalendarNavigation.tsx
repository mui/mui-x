import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { ToolbarButton } from '@mui/x-data-grid';

function ButtonField(props: any) {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const valueStr = format(pickerContext.value, pickerContext.fieldFormat);

  return (
    <ToolbarButton
      {...forwardedProps}
      ref={handleRef}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      render={
        <Button variant="outlined" size="small">
          {pickerContext.label ?? valueStr}
        </Button>
      }
    />
  );
}
function CalendarNavigation() {
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
    <Box sx={{ display: 'flex', gap: 1 }}>
      <ToolbarButton
        onClick={() => handleDateChange(new Date())}
        render={
          <Button variant="outlined" size="small">
            Today
          </Button>
        }
      />
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
                '& .MuiPickersCalendarNavigation-root': {
                  marginTop: '8px',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
      <Box sx={{ display: 'flex' }}>
        <ToolbarButton size="small" onClick={handlePreviousMonth}>
          <ChevronLeft />
        </ToolbarButton>
        <ToolbarButton size="small" onClick={handleNextMonth}>
          <ChevronRight />
        </ToolbarButton>
      </Box>
    </Box>
  );
}

export { CalendarNavigation };
