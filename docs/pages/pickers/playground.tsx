import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/internal/models';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
// eslint-disable-next-line no-restricted-imports
import { isDatePickerView } from '@mui/x-date-pickers/internals/utils/date-utils';
// eslint-disable-next-line no-restricted-imports
import { isTimeView } from '@mui/x-date-pickers/internals/utils/time-utils';

function RadioGroupControl({
  label,
  value,
  onChange,
  helperText,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  helperText?: string;
}) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value === '' ? undefined : event.target.value === 'true');
    },
    [onChange],
  );
  return (
    <FormControl>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup aria-labelledby={id} value={value ?? ''} onChange={handleChange} row>
        <FormControlLabel value={''} control={<Radio />} label="undefined" />
        <FormControlLabel value control={<Radio />} label="true" />
        <FormControlLabel value={false} control={<Radio />} label="false" />
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

function BooleanRadioGroupControl({
  label,
  value,
  onChange,
  helperText,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helperText?: string;
}) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value === 'true');
    },
    [onChange],
  );
  return (
    <FormControl>
      <FormLabel id={id}>{label}</FormLabel>
      <RadioGroup aria-labelledby={id} value={value} onChange={handleChange} row>
        <FormControlLabel value control={<Radio />} label="true" />
        <FormControlLabel value={false} control={<Radio />} label="false" />
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

type ViewsMap = Record<DateOrTimeView, boolean>;

const DEFAULT_VIEWS_MAP: ViewsMap = {
  year: true,
  month: false,
  day: true,
  hours: true,
  minutes: true,
  seconds: false,
};

interface ComponentFamily {
  name: string;
  component: React.ElementType;
  props: Record<string, any>;
}

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

export default function App() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [rangeValue, setRangeValue] = React.useState<DateRange<Dayjs>>([null, null]);
  const [isToolbarHidden, setIsToolbarHidden] = React.useState<boolean | undefined>();
  const [isTabsHidden, setIsTabsHidden] = React.useState<boolean | undefined>();
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const [showDaysOutsideCurrentMonth, setShowDaysOutsideCurrentMonth] =
    React.useState<boolean>(false);
  const [displayWeekNumber, setDisplayWeekNumber] = React.useState<boolean>(false);
  const [fixed6Weeks, setFixed6Weeks] = React.useState<boolean>(false);
  const [disableDayMargin, setDisableDayMargin] = React.useState<boolean>(false);
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false);
  const [isStaticDesktopMode, setIsStaticDesktopMode] = React.useState<boolean>(false);
  const [ampm, setAmpm] = React.useState<boolean | undefined>();
  const [ampmInClock, setAmpmInClock] = React.useState<boolean | undefined>();
  const [singleCalendar, setSingleCalendar] = React.useState<boolean>(false);
  const [customActions, setCustomActions] = React.useState<boolean>(false);
  const [displayShortcuts, setDisplayShortcuts] = React.useState<boolean>(false);
  const [views, setViews] = React.useState(DEFAULT_VIEWS_MAP);
  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setViews((currentViews) => ({
      ...currentViews,
      [event.target.name]: event.target.checked,
    }));
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      }),
    [isDarkMode],
  );

  const availableViews = React.useMemo(
    () =>
      Object.entries(views).reduce((acc, [view, available]) => {
        if (available) {
          acc.push(view as DateOrTimeView);
        }
        return acc;
      }, [] as DateOrTimeView[]),
    [views],
  );
  const dateViews = React.useMemo(() => availableViews.filter(isDatePickerView), [availableViews]);
  const timeViews = React.useMemo(() => availableViews.filter(isTimeView), [availableViews]);

  const commonProps = React.useMemo<DateTimePickerProps<Dayjs>>(
    () => ({
      orientation: isLandscape ? 'landscape' : 'portrait',
      showDaysOutsideCurrentMonth,
      slotProps: {
        ...(isToolbarHidden !== undefined && {
          toolbar: {
            hidden: isToolbarHidden,
          },
        }),
        ...(isTabsHidden !== undefined && {
          tabs: {
            hidden: isTabsHidden,
          },
        }),
        ...(!!customActions && {
          actionBar: {
            actions: ['clear', 'today', 'cancel', 'accept'],
          },
        }),
        day: {
          disableMargin: disableDayMargin,
        },
      },
      displayWeekNumber,
      fixedWeekNumber: fixed6Weeks ? 6 : undefined,
      ampm: ampm !== undefined ? ampm : undefined,
      ampmInClock: ampmInClock !== undefined ? ampmInClock : undefined,
    }),
    [
      ampm,
      ampmInClock,
      customActions,
      disableDayMargin,
      displayWeekNumber,
      fixed6Weeks,
      isLandscape,
      isTabsHidden,
      isToolbarHidden,
      showDaysOutsideCurrentMonth,
    ],
  );

  const datePickerProps = React.useMemo(
    () => ({
      ...commonProps,
      views: dateViews,
    }),
    [commonProps, dateViews],
  );

  const timePickerProps = React.useMemo(
    () => ({
      ...commonProps,
      views: timeViews,
    }),
    [commonProps, timeViews],
  );

  const DATE_PICKERS: ComponentFamily[] = React.useMemo(
    () => [
      {
        name: 'DesktopDatePicker',
        component: DesktopDatePicker,
        props: datePickerProps,
      },
      {
        name: 'MobileDatePicker',
        component: MobileDatePicker,
        props: datePickerProps,
      },
      {
        name: 'StaticDatePicker',
        component: StaticDatePicker,
        props: datePickerProps,
      },
    ],
    [datePickerProps],
  );

  const TIME_PICKERS: ComponentFamily[] = React.useMemo(
    () => [
      {
        name: 'DesktopTimePicker',
        component: DesktopTimePicker,
        props: timePickerProps,
      },
      {
        name: 'MobileTimePicker',
        component: MobileTimePicker,
        props: timePickerProps,
      },
      {
        name: 'StaticTimePicker',
        component: StaticTimePicker,
        props: timePickerProps,
      },
    ],
    [timePickerProps],
  );

  const DATE_TIME_PICKERS: ComponentFamily[] = React.useMemo(
    () => [
      {
        name: 'DesktopDateTimePicker',
        component: DesktopDateTimePicker,
        props: commonProps,
      },
      {
        name: 'MobileDateTimePicker',
        component: MobileDateTimePicker,
        props: commonProps,
      },
      {
        name: 'StaticDateTimePicker',
        component: StaticDateTimePicker,
        props: commonProps,
      },
    ],
    [commonProps],
  );

  const DATE_RANGE_PICKERS: ComponentFamily[] = React.useMemo(
    () => [
      {
        name: 'DesktopDateRangePicker',
        component: DesktopDateRangePicker,
        props: commonProps,
      },
      {
        name: 'MobileDateRangePicker',
        component: MobileDateRangePicker,
        props: commonProps,
      },
      {
        name: 'StaticDateRangePicker',
        component: StaticDateRangePicker,
        props: commonProps,
      },
    ],
    [commonProps],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            height: '100%',
            minHeight: '100vh',
            backgroundColor: isDarkMode ? 'rgb(10, 25, 41)' : undefined,
            color: isDarkMode ? 'rgb(255, 255, 255)' : undefined,
            padding: 2,
          }}
        >
          <Box display="flex" flexDirection="row" gap={2}>
            <Box display="flex" gap={2} flexDirection="column">
              <Box display="flex" flexWrap="wrap" gap={2}>
                <BooleanRadioGroupControl
                  label="Dark mode?"
                  value={isDarkMode}
                  onChange={setIsDarkMode}
                />
                <BooleanRadioGroupControl
                  label="Landscape orientation"
                  value={isLandscape}
                  onChange={setIsLandscape}
                />
                <BooleanRadioGroupControl
                  label="Static desktop mode"
                  value={isStaticDesktopMode}
                  onChange={setIsStaticDesktopMode}
                  helperText="Only for Static pickers"
                />
              </Box>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <RadioGroupControl
                  label="Toolbar hidden"
                  value={isToolbarHidden}
                  onChange={setIsToolbarHidden}
                />
                <RadioGroupControl
                  label="Tabs hidden"
                  value={isTabsHidden}
                  onChange={setIsTabsHidden}
                  helperText="Only for Date Time pickers"
                />
                <BooleanRadioGroupControl
                  label="Show days outside current month"
                  value={showDaysOutsideCurrentMonth}
                  onChange={setShowDaysOutsideCurrentMonth}
                />
                <BooleanRadioGroupControl
                  label="Display week number"
                  value={displayWeekNumber}
                  onChange={setDisplayWeekNumber}
                />
                <BooleanRadioGroupControl
                  label="Fixed 6 weeks"
                  value={fixed6Weeks}
                  onChange={setFixed6Weeks}
                />
                <BooleanRadioGroupControl
                  label="Disable day margin"
                  value={disableDayMargin}
                  onChange={setDisableDayMargin}
                  helperText="Does not affect range pickers"
                />
                <RadioGroupControl label="AM/PM" value={ampm} onChange={setAmpm} />
                <RadioGroupControl
                  label="ampmInClock"
                  value={ampmInClock}
                  onChange={setAmpmInClock}
                />
                <BooleanRadioGroupControl
                  label="Single calendar"
                  value={singleCalendar}
                  onChange={setSingleCalendar}
                  helperText="Only for range pickers"
                />
                <BooleanRadioGroupControl
                  label="Custom actions"
                  value={customActions}
                  onChange={setCustomActions}
                />
                <BooleanRadioGroupControl
                  label="Display shortcuts"
                  value={displayShortcuts}
                  onChange={setDisplayShortcuts}
                  helperText="Only for range pickers"
                />
              </Box>
            </Box>
            <FormControl
              component="fieldset"
              variant="standard"
              sx={{
                minWidth: 115,
              }}
            >
              <FormLabel component="legend">Available views</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox name="year" checked={views.year} onChange={handleChange} />}
                  label="year"
                />
                <FormControlLabel
                  control={<Checkbox name="month" checked={views.month} onChange={handleChange} />}
                  label="month"
                />
                <FormControlLabel
                  control={<Checkbox name="day" checked={views.day} onChange={handleChange} />}
                  label="day"
                />
                <FormControlLabel
                  control={<Checkbox name="hours" checked={views.hours} onChange={handleChange} />}
                  label="hours"
                />
                <FormControlLabel
                  control={
                    <Checkbox name="minutes" checked={views.minutes} onChange={handleChange} />
                  }
                  label="minutes"
                />
                <FormControlLabel
                  control={
                    <Checkbox name="seconds" checked={views.seconds} onChange={handleChange} />
                  }
                  label="seconds"
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Stack spacing={2} direction="row" mt={3} flexWrap="wrap">
            <DemoContainer
              components={['DesktopDatePicker', 'MobileDatePicker', 'StaticDatePicker']}
            >
              {DATE_PICKERS.map(({ name, component: Component, props }) => (
                <Component label={name} key={name} value={value} onChange={setValue} {...props} />
              ))}
            </DemoContainer>
            <DemoContainer
              components={['DesktopTimePicker', 'MobileTimePicker', 'StaticTimePicker']}
            >
              {TIME_PICKERS.map(({ name, component: Component, props }) => (
                <Component label={name} key={name} value={value} onChange={setValue} {...props} />
              ))}
            </DemoContainer>
            <DemoContainer
              components={['DesktopDateTimePicker', 'MobileDateTimePicker', 'StaticDateTimePicker']}
            >
              {DATE_TIME_PICKERS.map(({ name, component: Component, props }) => (
                <Component
                  label={name}
                  key={name}
                  value={value}
                  onChange={setValue}
                  views={availableViews}
                  {...props}
                />
              ))}
            </DemoContainer>
          </Stack>
          <Stack spacing={2} direction="row" mt={3} flexWrap="wrap">
            <DemoContainer
              components={[
                'DesktopDateRangePicker',
                'MobileDateRangePicker',
                'StaticDateRangePicker',
              ]}
            >
              {DATE_RANGE_PICKERS.map(({ name, component: Component, props }) => (
                <DemoItem key={name} label={name} component={name}>
                  <Component
                    label={name}
                    value={rangeValue}
                    onChange={setRangeValue}
                    calendars={singleCalendar ? 1 : undefined}
                    {...props}
                    slotProps={{
                      ...props.slotProps,
                      ...(displayShortcuts && {
                        shortcuts: {
                          items: shortcutsItems,
                        },
                      }),
                    }}
                  />
                </DemoItem>
              ))}
            </DemoContainer>
          </Stack>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
