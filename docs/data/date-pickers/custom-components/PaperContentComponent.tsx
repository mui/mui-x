import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  DateRange,
  DateRangePicker,
  StaticDateRangePicker,
} from '@mui/x-date-pickers-pro';
import {
  TextField,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Button,
} from '@mui/material';
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns';

const RangeShortcut = {
  thisWeek: 'THIS_WEEK',
  lastWeek: 'LAST_WEEK',
  last7Days: 'LAST_7_DAYS',
  currentMonth: 'CURRENT_MONTH',
  nextMonth: 'NEXT_MONTH',
  reset: 'RESET',
};

type RangeShortcutType = keyof typeof RangeShortcut;

const rangeShortcuts = [
  {
    range: RangeShortcut.thisWeek,
    label: 'This week',
  },
  {
    range: RangeShortcut.lastWeek,
    label: 'Last week',
  },
  {
    range: RangeShortcut.last7Days,
    label: 'Last 7 days',
  },
  {
    range: RangeShortcut.currentMonth,
    label: 'Current month',
  },
  {
    range: RangeShortcut.nextMonth,
    label: 'Next month',
  },
  {
    range: RangeShortcut.reset,
    label: 'Reset',
  },
];

const buildHandleRangeClick =
  (setValue: React.Dispatch<React.SetStateAction<DateRange<Date>>>) =>
  (range: RangeShortcutType) => {
    const today = new Date();
    switch (range) {
      case RangeShortcut.thisWeek:
        setValue([startOfWeek(today), endOfWeek(today)]);
        break;
      case RangeShortcut.lastWeek:
        setValue([addWeeks(startOfWeek(today), -1), addWeeks(endOfWeek(today), -1)]);
        break;
      case RangeShortcut.last7Days:
        setValue([addWeeks(today, -1), today]);
        break;
      case RangeShortcut.currentMonth:
        setValue([startOfMonth(today), endOfMonth(today)]);
        break;
      case RangeShortcut.nextMonth:
        setValue([
          addMonths(startOfMonth(today), 1),
          addMonths(endOfMonth(today), 1),
        ]);
        break;
      case RangeShortcut.reset:
        setValue([null, null]);
        break;
      default:
        break;
    }
  };

const RangeShortcutsPanel: React.FC<{
  setValue: React.Dispatch<React.SetStateAction<DateRange<Date>>>;
  children: React.ReactNode;
}> = ({ setValue, children }) => {
  const handleRangeClick = React.useCallback(
    (range: RangeShortcutType) => buildHandleRangeClick(setValue)(range),
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
                <ListItemButton
                  onClick={() => handleRangeClick(range as RangeShortcutType)}
                >
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

const StaticRangeShortcutsPanel: React.FC<{
  setValue: React.Dispatch<React.SetStateAction<DateRange<Date>>>;
  children: React.ReactNode;
}> = ({ setValue, children }) => {
  const handleRangeClick = React.useCallback(
    (range: RangeShortcutType) => buildHandleRangeClick(setValue)(range),
    [setValue],
  );
  return (
    <React.Fragment>
      <Box sx={{ m: 2 }}>
        <Typography variant="overline">Date range shortcuts</Typography>
        <Box display="flex" gap={2} my={2}>
          {rangeShortcuts.map(({ range, label }) => (
            <Button
              key={range}
              onClick={() => handleRangeClick(range as RangeShortcutType)}
              variant="text"
              color="inherit"
              size="small"
            >
              {label}
            </Button>
          ))}
        </Box>
        <Divider />
      </Box>
      {children}
    </React.Fragment>
  );
};

export default function PaperContentComponent() {
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
  const WrappedPaperContent = React.useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <RangeShortcutsPanel setValue={setValue}>{children}</RangeShortcutsPanel>
    ),
    [],
  );
  const WrappedStaticPaperContent = React.useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <StaticRangeShortcutsPanel setValue={setValue}>
        {children}
      </StaticRangeShortcutsPanel>
    ),
    [],
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={4} alignItems="center">
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
          components={{ PaperContent: WrappedPaperContent }}
          PaperProps={{ sx: { display: 'flex', flexDirection: 'row' } }}
        />
        <StaticDateRangePicker
          displayStaticWrapperAs="desktop"
          onChange={(newValue) => setValue(newValue)}
          value={value}
          renderInput={() => <div />}
          components={{ PaperContent: WrappedStaticPaperContent }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
