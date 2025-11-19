import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useForkRef from '@mui/utils/useForkRef';
import { format } from 'date-fns';
import { ToolbarButton } from '@mui/x-data-grid-premium';
import { useCalendarContext } from './CalendarContext';
import { CalendarSearch } from './CalendarSearch';

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
      <CalendarSearch />
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
          views={['month']}
          slots={{ field: ButtonField }}
        />
      </LocalizationProvider>
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Previous month">
          <ToolbarButton size="small" onClick={handlePreviousMonth}>
            <ChevronLeft />
          </ToolbarButton>
        </Tooltip>
        <Tooltip title="Next month">
          <ToolbarButton size="small" onClick={handleNextMonth}>
            <ChevronRight />
          </ToolbarButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export { CalendarNavigation };
