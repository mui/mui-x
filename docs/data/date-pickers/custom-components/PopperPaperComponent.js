import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import {
  TextField,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns';

const RangeShortcutEnum = {
  thisWeek: 'THIS_WEEK',
  lastWeek: 'LAST_WEEK',
  last7Days: 'LAST_7_DAYS',
  currentMonth: 'CURRENT_MONTH',
  nextMonth: 'NEXT_MONTH',
  reset: 'RESET',
};

const rangeShortcuts = [
  {
    range: RangeShortcutEnum.thisWeek,
    label: 'This week',
  },
  {
    range: RangeShortcutEnum.lastWeek,
    label: 'Last week',
  },
  {
    range: RangeShortcutEnum.last7Days,
    label: 'Last 7 days',
  },
  {
    range: RangeShortcutEnum.currentMonth,
    label: 'Current month',
  },
  {
    range: RangeShortcutEnum.nextMonth,
    label: 'Next month',
  },
  {
    range: RangeShortcutEnum.reset,
    label: 'Reset',
  },
];

const RangeShortcutsPanel = ({ setValue, children }) => {
  const handleRangeClick = React.useCallback(
    (range) => {
      const today = new Date();
      switch (range) {
        case RangeShortcutEnum.thisWeek:
          setValue([startOfWeek(today), endOfWeek(today)]);
          break;
        case RangeShortcutEnum.lastWeek:
          setValue([
            addWeeks(startOfWeek(today), -1),
            addWeeks(endOfWeek(today), -1),
          ]);
          break;
        case RangeShortcutEnum.last7Days:
          setValue([addWeeks(today, -1), today]);
          break;
        case RangeShortcutEnum.currentMonth:
          setValue([startOfMonth(today), endOfMonth(today)]);
          break;
        case RangeShortcutEnum.nextMonth:
          setValue([
            addMonths(startOfMonth(today), 1),
            addMonths(endOfMonth(today), 1),
          ]);
          break;
        case RangeShortcutEnum.reset:
          setValue([null, null]);
          break;
        default:
          break;
      }
    },
    [setValue],
  );
  return (
    <React.Fragment>
      <Box sx={{ m: 2 }} display="flex" gap={2}>
        <div>
          <Typography variant="overline">Date range shortcuts</Typography>
          <List>
            {rangeShortcuts.map(({ range, label }) => (
              <ListItem key={range} disablePadding>
                <ListItemButton onClick={() => handleRangeClick(range)}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
        <Divider orientation="vertical" />
      </Box>
      {children}
    </React.Fragment>
  );
};

export default function PopperPaperComponent() {
  const [value, setValue] = React.useState([null, null]);
  const WrappedPopperPaper = React.useCallback(
    ({ children }) => (
      <RangeShortcutsPanel setValue={setValue}>{children}</RangeShortcutsPanel>
    ),
    [setValue],
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
        components={{
          PopperPaper: WrappedPopperPaper,
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'row',
          },
        }}
      />
    </LocalizationProvider>
  );
}
