import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
  (setValue: React.Dispatch<React.SetStateAction<DateRange<Dayjs>>>) =>
  (range: RangeShortcutType) => {
    const today = dayjs();
    switch (range) {
      case RangeShortcut.thisWeek:
        setValue([today.startOf('week'), today.endOf('week')]);
        break;
      case RangeShortcut.lastWeek:
        setValue([
          today.startOf('week').subtract(1, 'week'),
          today.endOf('week').subtract(1, 'week'),
        ]);
        break;
      case RangeShortcut.last7Days:
        setValue([today.subtract(1, 'week'), today]);
        break;
      case RangeShortcut.currentMonth:
        setValue([today.startOf('month'), today.endOf('month')]);
        break;
      case RangeShortcut.nextMonth:
        setValue([
          today.startOf('month').add(1, 'month'),
          today.endOf('month').add(1, 'month'),
        ]);
        break;
      case RangeShortcut.reset:
        setValue([null, null]);
        break;
      default:
        break;
    }
  };

interface RangeShortcutsPanelProps {
  setValue?: React.Dispatch<React.SetStateAction<DateRange<Dayjs>>>;
  children: React.ReactNode;
}

function RangeShortcutsPanel({ setValue, children }: RangeShortcutsPanelProps) {
  const handleRangeClick = React.useCallback(
    (range: RangeShortcutType) => setValue && buildHandleRangeClick(setValue)(range),
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
}

interface StaticRangeShortcutsPanelProps {
  setValue?: React.Dispatch<React.SetStateAction<DateRange<Dayjs>>>;
  children: React.ReactNode;
}

function StaticRangeShortcutsPanel({
  setValue,
  children,
  ...other
}: StaticRangeShortcutsPanelProps) {
  const handleRangeClick = React.useCallback(
    (range: RangeShortcutType) => setValue && buildHandleRangeClick(setValue)(range),
    [setValue],
  );
  return (
    <React.Fragment>
      <Box {...other}>
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
}

export default function PaperContentComponent() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          components={{ PaperContent: RangeShortcutsPanel }}
          PaperProps={{ sx: { display: 'flex', flexDirection: 'row' } }}
          componentsProps={{ paperContent: { setValue } }}
        />
        <StaticDateRangePicker
          displayStaticWrapperAs="desktop"
          onChange={(newValue) => setValue(newValue)}
          value={value}
          renderInput={() => <div />}
          components={{ PaperContent: StaticRangeShortcutsPanel }}
          componentsProps={{ paperContent: { sx: { m: 2 }, setValue } }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
