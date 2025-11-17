import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { usePickerAdapter } from '@mui/x-date-pickers/hooks';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props) {
  const adapter = usePickerAdapter();
  const {
    currentMonth,
    onMonthChange,
    format = `${adapter.formats.month} ${adapter.formats.year}`,
  } = props;

  const selectNextMonth = () => onMonthChange(adapter.addMonths(currentMonth, 1));
  const selectNextYear = () => onMonthChange(adapter.addYears(currentMonth, 1));
  const selectPreviousMonth = () =>
    onMonthChange(adapter.addMonths(currentMonth, -1));
  const selectPreviousYear = () => onMonthChange(adapter.addYears(currentMonth, -1));

  return (
    <CustomCalendarHeaderRoot>
      <Stack spacing={1} direction="row">
        <IconButton onClick={selectPreviousYear} title="Previous year">
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton onClick={selectPreviousMonth} title="Previous month">
          <ChevronLeft />
        </IconButton>
      </Stack>
      <Typography variant="body2">
        {adapter.formatByString(currentMonth, format)}
      </Typography>
      <Stack spacing={1} direction="row">
        <IconButton onClick={selectNextMonth} title="Next month">
          <ChevronRight />
        </IconButton>
        <IconButton onClick={selectNextYear} title="Next year">
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Stack>
    </CustomCalendarHeaderRoot>
  );
}

export default function UsePickerAdapter() {
  return (
    <Stack spacing={2} direction="row" flexWrap="wrap">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateCalendar']}>
          <DemoItem label="AdapterDayjs" alignItems="center">
            <DateCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DemoContainer components={['DateCalendar']}>
          <DemoItem label="AdapterDateFns" alignItems="center">
            <DateCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </Stack>
  );
}
