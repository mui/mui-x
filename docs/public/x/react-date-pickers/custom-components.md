---
productId: x-date-pickers
title: Date and Time Pickers - Custom slots and subcomponents
components: DateTimePickerTabs, PickersActionBar, DatePickerToolbar, TimePickerToolbar, DateTimePickerToolbar, PickerDay2, DateRangePickerDay2, PickersCalendarHeader, PickersRangeCalendarHeader, PickersShortcuts, DateRangePickerToolbar, MonthCalendar, YearCalendar, DateCalendar
---

# Custom slots and subcomponents

Learn how to override parts of the Date and Time Pickers.

:::info
The components that can be customized are listed under `slots` section in Date and Time Pickers [API Reference](/x/api/date-pickers/).
For example, check [available Date Picker slots](/x/api/date-pickers/date-picker/#slots).
:::

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Action bar

### Component props

The action bar is available on all picker components.
By default, it contains no action on desktop, and the actions **Cancel** and **Accept** on mobile.

You can override the actions displayed by passing the `actions` prop to the `actionBar` within `slotProps`, as shown here:

```jsx
<DatePicker
  slotProps={{
    // The actions will be the same between desktop and mobile
    actionBar: {
      actions: ['clear'],
    },
    // The actions will be different between desktop and mobile
    actionBar: ({ variant }) => ({
      actions: variant === 'desktop' ? [] : ['clear'],
    }),
  }}
/>
```

In the example below, the action bar contains only one button, which resets the selection to today's date:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function ActionBarComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slotProps={{
          actionBar: {
            actions: ['today'],
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

#### Available actions

The built-in `<PickersActionBar />` component supports the following different actions:

| Action         | Behavior                                                                         |
| :------------- | :------------------------------------------------------------------------------- |
| `accept`       | Accept the current value and close the picker view.                              |
| `cancel`       | Reset to the last accepted date and close the picker view.                       |
| `clear`        | Reset to the empty value and close the picker view.                              |
| `next`         | Go to the next step in the value picking process.                                |
| `nextOrAccept` | Shows the `accept` or `next` action depending on the value picking process step. |
| `today`        | Reset to today's date (and time if relevant) and close the picker view.          |

### Component

If you need to customize the date picker beyond the options described above, you can provide a custom component.
This can be used in combination with `slotProps`.

In the example below, the actions are the same as in the section above, but they are rendered inside a menu:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import useId from '@mui/utils/useId';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';

function CustomActionBar(props: PickersActionBarProps) {
  const { actions, className } = props;
  const translations = usePickerTranslations();
  const {
    clearValue,
    setValueToToday,
    acceptValueChanges,
    cancelValueChanges,
    goToNextStep,
    hasNextStep,
  } = usePickerContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = useId();

  if (actions == null || actions.length === 0) {
    return null;
  }

  const menuItems = actions?.map((actionType) => {
    switch (actionType) {
      case 'clear':
        return (
          <MenuItem
            onClick={() => {
              clearValue();
              setAnchorEl(null);
            }}
            key={actionType}
          >
            {translations.clearButtonLabel}
          </MenuItem>
        );
      case 'cancel':
        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              cancelValueChanges();
            }}
            key={actionType}
          >
            {translations.cancelButtonLabel}
          </MenuItem>
        );
      case 'accept':
        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              acceptValueChanges();
            }}
            key={actionType}
          >
            {translations.okButtonLabel}
          </MenuItem>
        );
      case 'today':
        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setValueToToday();
            }}
            key={actionType}
          >
            {translations.todayButtonLabel}
          </MenuItem>
        );
      case 'next':
        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              goToNextStep();
            }}
            key={actionType}
          >
            {translations.nextStepButtonLabel}
          </MenuItem>
        );

      case 'nextOrAccept':
        if (hasNextStep) {
          return (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                goToNextStep();
              }}
              key={actionType}
            >
              {translations.nextStepButtonLabel}
            </MenuItem>
          );
        }

        return (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              acceptValueChanges();
            }}
            key={actionType}
          >
            {translations.okButtonLabel}
          </MenuItem>
        );
      default:
        return null;
    }
  });

  return (
    <DialogActions className={className}>
      <Button
        id={`picker-actions-${id}`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Actions
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': `picker-actions-${id}`,
        }}
      >
        {menuItems}
      </Menu>
    </DialogActions>
  );
}

export default function ActionBarComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{
          actionBar: CustomActionBar,
        }}
        slotProps={{
          actionBar: {
            actions: ['today'],
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

## Tabs

The tabs are available on all date time picker components.
It allows switching between date and time interfaces.

### Component props

You can override the icons displayed by passing props to the `tabs` within `slotProps`, as shown here:

```jsx
<DateTimePicker
  slotProps={{
    tabs: {
      dateIcon: <LightModeIcon />,
      timeIcon: <AcUnitIcon />,
    },
  }}
/>
```

By default, the tabs are `hidden` on desktop, and `visible` on mobile.
This behavior can be overridden by setting the `hidden` prop:

```jsx
<DateTimePicker
  slotProps={{
    tabs: {
      hidden: false,
    },
  }}
/>
```

### Component

If you need to customize the date time picker beyond the options described above, you can provide a custom component.
This can be used in combination with `slotProps`.

In the example below, the tabs are using different icons and have an additional component:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import {
  DateTimePickerTabs,
  DateTimePickerTabsProps,
} from '@mui/x-date-pickers/DateTimePicker';
import LightModeIcon from '@mui/icons-material/LightMode';
import AcUnitIcon from '@mui/icons-material/AcUnit';

function CustomTabs(props: DateTimePickerTabsProps) {
  return (
    <React.Fragment>
      <DateTimePickerTabs {...props} />
      <Box sx={{ backgroundColor: 'blueviolet', height: 5 }} />
    </React.Fragment>
  );
}

export default function Tabs() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{ tabs: CustomTabs }}
        slotProps={{
          tabs: {
            hidden: false,
            dateIcon: <LightModeIcon />,
            timeIcon: <AcUnitIcon />,
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

## Toolbar

The toolbar is available on all date time picker components.
It displays the current values and allows to switch between different views.

### Component props

You can customize how the toolbar displays the current value with `toolbarFormat`.
By default, empty values are replaced by `__`.
This can be modified by using `toolbarPlaceholder` props.

By default, the toolbar is `hidden` on desktop, and `visible` on mobile.
This behavior can be overridden by setting the `hidden` prop:

```jsx
<DatePicker
  slotProps={{
    toolbar: {
      // Customize value display
      toolbarFormat: 'YYYY',
      // Change what is displayed given an empty value
      toolbarPlaceholder: '??',
      // Show the toolbar
      hidden: false,
    },
  }}
/>
```

### Component

Each component comes with its own toolbar (`DatePickerToolbar`, `TimePickerToolbar`, and `DateTimePickerToolbar`) that you can reuse and customize.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
} from '@mui/x-date-pickers/DatePicker';

function CustomToolbar(props: DatePickerToolbarProps) {
  return (
    <Box
      // Pass the className to the root element to get correct layout
      className={props.className}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <DatePickerToolbar {...props} />
      <RocketLaunchIcon fontSize="large" sx={{ m: 5 }} />
    </Box>
  );
}

export default function ToolbarComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            toolbarFormat: 'YYYY',
            toolbarPlaceholder: '??',
          },
          actionBar: {
            actions: ['clear'],
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

## Calendar header

The calendar header is available on any component that renders a calendar to select a date or a range of dates.
It allows the user to navigate through months and to switch to the month and year views when available.

### Component props

You can pass props to the calendar header as shown below:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function CalendarHeaderComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          slotProps={{ calendarHeader: { sx: { border: '1px red solid' } } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Component

You can pass a custom component to replace the header, as shown below:

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersCalendarHeaderProps } from '@mui/x-date-pickers/PickersCalendarHeader';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props: PickersCalendarHeaderProps) {
  const { currentMonth, onMonthChange } = props;

  const selectNextMonth = () => onMonthChange(currentMonth.add(1, 'month'));
  const selectNextYear = () => onMonthChange(currentMonth.add(1, 'year'));
  const selectPreviousMonth = () => onMonthChange(currentMonth.subtract(1, 'month'));
  const selectPreviousYear = () => onMonthChange(currentMonth.subtract(1, 'year'));

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
      <Typography variant="body2">{currentMonth.format('MMMM YYYY')}</Typography>
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

export default function CalendarHeaderComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

When used with a date range component,
you receive three additional props to let you handle scenarios where multiple months are rendered:

- `calendars`: The number of calendars rendered
- `month`: The month used for the header being rendered
- `monthIndex`: The index of the month used for the header being rendered

The demo below shows how to navigate the months two by two:

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { PickersRangeCalendarHeaderProps } from '@mui/x-date-pickers-pro/PickersRangeCalendarHeader';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props: PickersRangeCalendarHeaderProps) {
  const { currentMonth, onMonthChange, month, calendars, monthIndex } = props;

  const selectNextMonth = () => onMonthChange(currentMonth.add(calendars, 'month'));
  const selectPreviousMonth = () =>
    onMonthChange(currentMonth.subtract(calendars, 'month'));

  return (
    <CustomCalendarHeaderRoot>
      <IconButton
        onClick={selectPreviousMonth}
        sx={[
          monthIndex === 0
            ? {
                visibility: null,
              }
            : {
                visibility: 'hidden',
              },
        ]}
        title={`Previous ${calendars} month${calendars === 1 ? '' : 's'}`}
      >
        <ChevronLeft />
      </IconButton>
      <Typography>{month.format('MMMM YYYY')}</Typography>
      <IconButton
        onClick={selectNextMonth}
        sx={[
          monthIndex === calendars - 1
            ? {
                visibility: null,
              }
            : {
                visibility: 'hidden',
              },
        ]}
        title={`Next ${calendars} month${calendars === 1 ? '' : 's'}`}
      >
        <ChevronRight />
      </IconButton>
    </CustomCalendarHeaderRoot>
  );
}

export default function CalendarHeaderComponentRange() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangeCalendar']}>
        <DateRangeCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Year button

This button allows users to change the selected year in the `year` view.

### Component props

You can pass props to the year button as shown below:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function YearButtonComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          openTo="year"
          slotProps={{
            yearButton: {
              sx: {
                color: '#1565c0',
                borderRadius: '2px',
                borderColor: '#2196f3',
                border: '1px solid',
                backgroundColor: '#90caf9',
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Component

You can pass a custom component to replace the year button, as shown below:

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const CustomYearButton = styled('button')({
  height: 36,
  width: 72,
});

export default function YearButtonComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar slots={{ yearButton: CustomYearButton }} openTo="year" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Day

:::info
The examples below use the new components, which might need further changes on your side to adjust to the new structure.

Be sure to check that any custom styling configuration is compatible with the new structure.
:::

The `day` slot allows users to change the selected day in the calendar.

You can use the `<PickerDay2 />` and `<DateRangePickerDay2 />` components to replace the day slot with a simplified DOM structure reduced to a single element.

The `::before` pseudo element is used to create the highlighting effect on the days within the selected range.

The `::after` pseudo element is used to create the previewing effect on hover.

This new structure provides a better theming and customization experience.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickerDay2 } from '@mui/x-date-pickers/PickerDay2';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';

export default function PickerDay2Demo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <StaticDatePicker
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          slots={{ day: PickerDay2 }}
        />
        <StaticDateRangePicker
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          slots={{ day: DateRangePickerDay2 }}
        />
      </Box>
    </LocalizationProvider>
  );
}

```

Use the `--PickerDay-horizontalMargin` and `--PickerDay-size` CSS variables to easily customize the dimensions and spacing of the day slot.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickerDay2, pickerDay2Classes } from '@mui/x-date-pickers/PickerDay2';

export default function PickerDay2DemoCSSVars() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <StaticDatePicker
          sx={{
            [`& .${pickerDay2Classes.root}`]: {
              '--PickerDay-horizontalMargin': '8px',
              '--PickerDay-size': '24px',
            },
          }}
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          slots={{ day: PickerDay2 }}
        />
      </Box>
    </LocalizationProvider>
  );
}

```

Customize the look and feel by creating a custom theme with `styleOverrides`.

```tsx
import * as React from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';
import { getDensePickerTheme } from './getDensePickerTheme';

export default function PickerDay2DemoCustomTheme() {
  const currentTheme = useTheme();
  const theme = createTheme(getDensePickerTheme(currentTheme.palette.mode));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <ThemeProvider theme={theme}>
          <StaticDateRangePicker
            slotProps={{
              actionBar: {
                actions: ['accept', 'cancel'],
              },
            }}
            slots={{ day: DateRangePickerDay2 }}
          />
        </ThemeProvider>
      </Box>
    </LocalizationProvider>
  );
}

```

## Month button

This button allows users to change the selected month in the `month` view.

:::success
You can learn more on how to enable the `month` view on the [`DateCalendar` doc page](/x/react-date-pickers/date-calendar/#views).
:::

### Component props

You can pass props to the month button as shown below:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function MonthButtonComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          slotProps={{
            monthButton: {
              sx: {
                color: '#1565c0',
                borderRadius: '2px',
                borderColor: '#2196f3',
                border: '1px solid',
                backgroundColor: '#90caf9',
              },
            },
          }}
          views={['month', 'day']}
          openTo="month"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Component

You can pass a custom component to replace the month button, as shown below:

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const CustomMonthButton = styled('button')({
  height: 36,
  width: 72,
});

export default function MonthButtonComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar
          slots={{ monthButton: CustomMonthButton }}
          views={['month', 'day']}
          openTo="month"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Arrow switcher

The following slots let you customize how to render the buttons and icons for an arrow switcher: the component used
to navigate to the "Previous" and "Next" steps of the picker: `PreviousIconButton`, `NextIconButton`, `LeftArrowIcon`, `RightArrowIcon`.

### Component props

You can pass props to the icons and buttons as shown below:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeClock, TimeClockSlotProps } from '@mui/x-date-pickers/TimeClock';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const slotProps: TimeClockSlotProps = {
  leftArrowIcon: { fontSize: 'large' },
  rightArrowIcon: { fontSize: 'large' },
  previousIconButton: {
    size: 'medium',
  },
  nextIconButton: {
    size: 'medium',
  },
};

type CurrentComponent = 'date' | 'time' | 'dateRange';

export default function ArrowSwitcherComponentProps() {
  const [currentComponent, setCurrentComponent] =
    React.useState<CurrentComponent>('date');

  const handleCurrentComponentChange = (
    event: React.MouseEvent<HTMLElement>,
    nextCurrentComponent: CurrentComponent | null,
  ) => {
    if (nextCurrentComponent !== null) {
      setCurrentComponent(nextCurrentComponent);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: '100%' }} alignItems="center">
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={currentComponent}
          onChange={handleCurrentComponentChange}
          exclusive
        >
          <ToggleButton value={'date'}>date</ToggleButton>
          <ToggleButton value={'time'}>time</ToggleButton>
          <ToggleButton value={'dateRange'}>date range</ToggleButton>
        </ToggleButtonGroup>
        {currentComponent === 'date' && (
          <DateCalendar defaultValue={dayjs('2022-04-17')} slotProps={slotProps} />
        )}
        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              defaultValue={dayjs('2022-04-17T15:30')}
              slotProps={slotProps}
              showViewSwitcher
            />
          </Box>
        )}
        {currentComponent === 'dateRange' && (
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
            slotProps={slotProps}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}

```

### Component

You can pass custom components to replace the icons, as shown below:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeClock, TimeClockProps } from '@mui/x-date-pickers/TimeClock';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

const slots: TimeClockProps<any>['slots'] = {
  leftArrowIcon: ArrowLeft,
  rightArrowIcon: ArrowRight,
};

type CurrentComponent = 'date' | 'time' | 'dateRange';

export default function ArrowSwitcherComponent() {
  const [currentComponent, setCurrentComponent] =
    React.useState<CurrentComponent>('date');

  const handleCurrentComponentChange = (
    event: React.MouseEvent<HTMLElement>,
    nextCurrentComponent: CurrentComponent | null,
  ) => {
    if (nextCurrentComponent !== null) {
      setCurrentComponent(nextCurrentComponent);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: '100%' }} alignItems="center">
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={currentComponent}
          onChange={handleCurrentComponentChange}
          exclusive
        >
          <ToggleButton value={'date'}>date</ToggleButton>
          <ToggleButton value={'time'}>time</ToggleButton>
          <ToggleButton value={'dateRange'}>date range</ToggleButton>
        </ToggleButtonGroup>
        {currentComponent === 'date' && (
          <DateCalendar defaultValue={dayjs('2022-04-17')} slots={slots} />
        )}
        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <TimeClock
              defaultValue={dayjs('2022-04-17T15:30')}
              slots={slots}
              showViewSwitcher
            />
          </Box>
        )}
        {currentComponent === 'dateRange' && (
          <DateRangeCalendar
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
            slots={slots}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}

```

## Access date adapter

In case you are building a custom component that needs to work with multiple date libraries, you can access the date adapter instance by using the `usePickerAdapter` hook.
This hook returns the date adapter instance used by the picker, which you can use to format dates, parse strings, and perform other date-related operations.

:::success
If your application uses a single date library, prefer using the date library directly in your components to avoid unnecessary complexity and possible breaking changes.
:::

```tsx
import * as React from 'react';
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
import { PickersCalendarHeaderProps } from '@mui/x-date-pickers/PickersCalendarHeader';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { usePickerAdapter } from '@mui/x-date-pickers/hooks';

const CustomCalendarHeaderRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});

function CustomCalendarHeader(props: PickersCalendarHeaderProps) {
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

```

## Shortcuts

You can add shortcuts to every Picker component.
For more information, check the [dedicated page](/x/react-date-pickers/shortcuts/).
