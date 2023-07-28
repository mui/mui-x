import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
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
import {
  StaticDateTimePicker,
  StaticDateTimePickerProps,
} from '@mui/x-date-pickers/StaticDateTimePicker';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/internals/models';
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

type ComponentFamily = 'date' | 'time' | 'date-time' | 'date-range';

const componentFamilies: { family: ComponentFamily; label: string }[] = [
  { family: 'date', label: 'Date' },
  { family: 'time', label: 'Time' },
  { family: 'date-time', label: 'Date Time' },
  { family: 'date-range', label: 'Date Range' },
];

interface ComponentFamilySet {
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

function ViewSwitcher({
  showDateViews,
  showTimeViews,
  views,
  handleViewsChange,
}: {
  showDateViews: boolean;
  showTimeViews: boolean;
  views: ViewsMap;
  handleViewsChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}) {
  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel id="views-label" component="legend">
        Available views
      </FormLabel>
      <FormGroup
        row
        aria-labelledby="views-label"
        sx={{
          columnGap: 1.5,
          [`& .${formControlLabelClasses.root}`]: {
            marginRight: 0,
          },
        }}
      >
        {showDateViews && (
          <React.Fragment>
            <FormControlLabel
              control={<Checkbox name="year" checked={views.year} onChange={handleViewsChange} />}
              label="year"
            />
            <FormControlLabel
              control={<Checkbox name="month" checked={views.month} onChange={handleViewsChange} />}
              label="month"
            />
            <FormControlLabel
              control={<Checkbox name="day" checked={views.day} onChange={handleViewsChange} />}
              label="day"
            />
          </React.Fragment>
        )}
        {showTimeViews && (
          <React.Fragment>
            <FormControlLabel
              control={<Checkbox name="hours" checked={views.hours} onChange={handleViewsChange} />}
              label="hours"
            />
            <FormControlLabel
              control={
                <Checkbox name="minutes" checked={views.minutes} onChange={handleViewsChange} />
              }
              label="minutes"
            />
            <FormControlLabel
              control={
                <Checkbox name="seconds" checked={views.seconds} onChange={handleViewsChange} />
              }
              label="seconds"
            />
          </React.Fragment>
        )}
      </FormGroup>
    </FormControl>
  );
}

export default function PickersPlayground() {
  const [isToolbarHidden, setIsToolbarHidden] = React.useState<boolean | undefined>();
  const [isTabsHidden, setIsTabsHidden] = React.useState<boolean | undefined>();
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
  const [selectedPickers, setSelectedPickers] = React.useState<ComponentFamily>('date');

  const handleViewsChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setViews((currentViews) => ({
      ...currentViews,
      [event.target.name]: event.target.checked,
    }));
  }, []);

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

  const commonProps = React.useMemo<StaticDateTimePickerProps<Dayjs>>(
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
      displayStaticWrapperAs: isStaticDesktopMode ? 'desktop' : 'mobile',
    }),
    [
      ampm,
      ampmInClock,
      customActions,
      disableDayMargin,
      displayWeekNumber,
      fixed6Weeks,
      isLandscape,
      isStaticDesktopMode,
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

  const DATE_PICKERS: ComponentFamilySet[] = React.useMemo(
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

  const TIME_PICKERS: ComponentFamilySet[] = React.useMemo(
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

  const DATE_TIME_PICKERS: ComponentFamilySet[] = React.useMemo(
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

  const DATE_RANGE_PICKERS: ComponentFamilySet[] = React.useMemo(
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
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            bgcolor: 'action.hover',
            padding: 2,
            mx: {
              xs: 2,
              sm: 0,
            },
            flexGrow: 1,
            width: {
              xs: '100%',
              sm: 312,
            },
          }}
        >
          <BooleanRadioGroupControl
            label="Static desktop mode"
            value={isStaticDesktopMode}
            onChange={setIsStaticDesktopMode}
          />
          <RadioGroupControl
            label="Toolbar hidden"
            value={isToolbarHidden}
            onChange={setIsToolbarHidden}
          />
          {selectedPickers === 'date-time' && (
            <RadioGroupControl
              label="Tabs hidden"
              value={isTabsHidden}
              onChange={setIsTabsHidden}
            />
          )}
          <BooleanRadioGroupControl
            label="Show days outside current month"
            value={showDaysOutsideCurrentMonth}
            onChange={setShowDaysOutsideCurrentMonth}
          />
          <BooleanRadioGroupControl
            label="Fixed 6 weeks"
            value={fixed6Weeks}
            onChange={setFixed6Weeks}
          />
          <BooleanRadioGroupControl
            label="Display week number"
            value={displayWeekNumber}
            onChange={setDisplayWeekNumber}
          />
          {selectedPickers !== 'date-range' && (
            <BooleanRadioGroupControl
              label="Disable day margin"
              value={disableDayMargin}
              onChange={setDisableDayMargin}
            />
          )}
          {(selectedPickers === 'time' || selectedPickers === 'date-time') && (
            <React.Fragment>
              <RadioGroupControl label="AM/PM" value={ampm} onChange={setAmpm} />
              <RadioGroupControl
                label="ampmInClock"
                value={ampmInClock}
                onChange={setAmpmInClock}
              />
            </React.Fragment>
          )}
          {selectedPickers === 'date-range' && (
            <React.Fragment>
              <BooleanRadioGroupControl
                label="Single calendar"
                value={singleCalendar}
                onChange={setSingleCalendar}
              />
              <BooleanRadioGroupControl
                label="Display shortcuts"
                value={displayShortcuts}
                onChange={setDisplayShortcuts}
              />
            </React.Fragment>
          )}
          <BooleanRadioGroupControl
            label="Custom actions"
            value={customActions}
            onChange={setCustomActions}
          />
          <BooleanRadioGroupControl
            label="Landscape orientation"
            value={isLandscape}
            onChange={setIsLandscape}
          />
          {selectedPickers !== 'date-range' && (
            <ViewSwitcher
              showDateViews={selectedPickers === 'date' || selectedPickers === 'date-time'}
              showTimeViews={selectedPickers === 'time' || selectedPickers === 'date-time'}
              views={views}
              handleViewsChange={handleViewsChange}
            />
          )}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
            margin: '0 auto',
            padding: 2,
            overflowX: 'auto',
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="selected-component-family-label">Selected components</InputLabel>
            <Select
              labelId="selected-component-family-label"
              id="selected-component-family"
              value={selectedPickers}
              onChange={(event) => setSelectedPickers(event.target.value as ComponentFamily)}
              label="Selected components"
            >
              {componentFamilies.map((componentFamily) => (
                <MenuItem key={componentFamily.family} value={componentFamily.family}>
                  {componentFamily.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack spacing={2} direction="row" flexWrap="wrap">
            {selectedPickers === 'date' && (
              <DemoContainer
                components={['DesktopDatePicker', 'MobileDatePicker', 'StaticDatePicker']}
              >
                {DATE_PICKERS.map(({ name, component: Component, props }) => (
                  <Component label={name} key={name} {...props} />
                ))}
              </DemoContainer>
            )}
            {selectedPickers === 'time' && (
              <DemoContainer
                components={['DesktopTimePicker', 'MobileTimePicker', 'StaticTimePicker']}
              >
                {TIME_PICKERS.map(({ name, component: Component, props }) => (
                  <Component label={name} key={name} {...props} />
                ))}
              </DemoContainer>
            )}
            {selectedPickers === 'date-time' && (
              <DemoContainer
                components={[
                  'DesktopDateTimePicker',
                  'MobileDateTimePicker',
                  'StaticDateTimePicker',
                ]}
              >
                {DATE_TIME_PICKERS.map(({ name, component: Component, props }) => (
                  <Component label={name} key={name} views={availableViews} {...props} />
                ))}
              </DemoContainer>
            )}
            {selectedPickers === 'date-range' && (
              <DemoContainer
                components={[
                  'DesktopDateRangePicker',
                  'MobileDateRangePicker',
                  'StaticDateRangePicker',
                ]}
              >
                {DATE_RANGE_PICKERS.map(({ name, component: Component, props }) => (
                  <Component
                    key={name}
                    label={name}
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
                ))}
              </DemoContainer>
            )}
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
