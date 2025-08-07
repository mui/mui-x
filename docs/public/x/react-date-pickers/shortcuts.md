---
productId: x-date-pickers
title: Date and Time Pickers - Shortcuts
components: PickersShortcuts
---

# Shortcuts

The date picker lets you add custom shortcuts.

## Adding shortcuts

By default, pickers use the `PickersShortcuts` component to display shortcuts.
This component accepts a `shortcuts` prop as an array of `PickersShortcutsItem`.
Those items are made of two required attributes:

- `label`: The string displayed on the shortcut chip. This property must be unique.
- `getValue`: A function that returns the value associated to the shortcut.

You can use `slotProps.shortcuts` to customize this prop. For example to add a shortcut to Christmas Day, you can do the following:

```jsx
<DatePicker
  slotProps={{
    shortcuts: {
      items: [
        {
          label: 'Christmas',
          getValue: () => {
            return dayjs(new Date(2023, 11, 25));
          },
        },
      ],
    },
  }}
/>
```

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';

const getMonthWeekday = (
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
  // Helper to find the nth weekday in a given month.
  // For example, Find the 3rd Monday in January.
  const today = dayjs();
  const firstDayOfMonth = today.month(monthIndex).startOf('month');
  const weekDay = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const deltaToFirstValidWeekDayInMonth =
    (weekDay > weekdayIndex ? 7 : 0) + weekdayIndex - weekDay;
  return firstDayOfMonth.add(
    (dayRank - 1) * 7 + deltaToFirstValidWeekDayInMonth,
    'day',
  );
};

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "New Year's Day",
    getValue: () => {
      // (January 1)
      const today = dayjs();
      return today.month(0).date(1);
    },
  },
  {
    label: 'Birthday of MLK Jr.',
    getValue: () => {
      // (third Monday in January)
      return getMonthWeekday(0, 1, 3);
    },
  },
  {
    label: 'Independence Day',
    getValue: () => {
      // (July 4)
      const today = dayjs();
      return today.month(6).date(4);
    },
  },
  {
    label: 'Labor Day',
    getValue: () => {
      // (first Monday in September)
      return getMonthWeekday(8, 1, 1);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      // (December 25)
      const today = dayjs();
      return today.month(11).date(25);
    },
  },
];

export default function BasicShortcuts() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

## Disabled dates

By default, the shortcuts are disabled if the returned value does not pass validation.
Here is an example where `minDate` is set to the middle of the year.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';

const getMonthWeekday = (
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
  // Helper to find the nth weekday in a given month.
  // For example, Find the 3rd Monday in January.
  const today = dayjs();
  const firstDayOfMonth = today.month(monthIndex).startOf('month');
  const weekDay = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const deltaToFirstValidWeekDayInMonth =
    (weekDay > weekdayIndex ? 7 : 0) + weekdayIndex - weekDay;
  return firstDayOfMonth.add(
    (dayRank - 1) * 7 + deltaToFirstValidWeekDayInMonth,
    'day',
  );
};

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "New Year's Day",
    getValue: () => {
      // (January 1)
      const today = dayjs();
      return today.month(0).date(1);
    },
  },
  {
    label: 'Birthday of MLK Jr.',
    getValue: () => {
      // (third Monday in January)
      return getMonthWeekday(0, 1, 3);
    },
  },
  {
    label: 'Independence Day',
    getValue: () => {
      // (July 4)
      const today = dayjs();
      return today.month(6).date(4);
    },
  },
  {
    label: 'Labor Day',
    getValue: () => {
      // (first Monday in September)
      return getMonthWeekday(8, 1, 1);
    },
  },
  {
    label: 'Veterans Day',
    getValue: () => {
      // (November 11)
      const today = dayjs();
      return today.month(10).date(11);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'World AIDS Day',
    getValue: () => {
      // (December 1)
      const today = dayjs();
      return today.month(11).date(1);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      // (December 25)
      const today = dayjs();
      return today.month(11).date(25);
    },
  },
];

export default function DisabledDatesShortcuts() {
  const middleDate = dayjs(new Date().setMonth(6));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
        }}
        minDate={middleDate}
      />
    </LocalizationProvider>
  );
}

```

## Range shortcuts [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Shortcuts on range pickers require `getValue` property to return an array with two values.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/models';

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

export default function BasicRangeShortcuts() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

## Advanced shortcuts

### Use validation to get the value

The `getValue` methods receive a `isValid` helper function.
You can use it to test if a value is valid or not based on the [validation props](/x/react-date-pickers/validation/).

In the following demonstration, it is used to get the next available week and weekend.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/models';

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'Next Available Weekend',
    getValue: ({ isValid }) => {
      const today = dayjs();
      const nextSaturday =
        today.day() <= 6
          ? today.add(6 - today.day(), 'day')
          : today.add(7 + 6 - today.day(), 'day');

      let maxAttempts = 50;
      let solution: [Dayjs, Dayjs] = [nextSaturday, nextSaturday.add(1, 'day')];
      while (maxAttempts > 0 && !isValid(solution)) {
        solution = [solution[0].add(7, 'day'), solution[1].add(7, 'day')];
        maxAttempts -= 1;
      }

      return solution;
    },
  },
  {
    label: 'Next Available Week',
    getValue: ({ isValid }) => {
      const today = dayjs();
      const nextMonday =
        today.day() <= 1
          ? today.add(1 - today.day(), 'day')
          : today.add(7 + 1 - today.day(), 'day');

      let maxAttempts = 50;
      let solution: [Dayjs, Dayjs] = [nextMonday, nextMonday.add(4, 'day')];
      while (maxAttempts > 0 && !isValid(solution)) {
        solution = [solution[0].add(7, 'day'), solution[1].add(7, 'day')];
        maxAttempts -= 1;
      }

      return solution;
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

const shouldDisableDate = (date: Dayjs) => {
  const today = dayjs();

  if (today.isSame(date, 'month')) {
    return true;
  }
  const nextMonth = today.add(1, 'month').startOf('month');

  if (date.isSame(nextMonth, 'month')) {
    if (date.isSame(nextMonth, 'week')) {
      return true;
    }
    return [10, 11, 12, 16, 18, 29, 30].includes(date.date());
  }
  return false;
};

export default function AdvancedRangeShortcuts() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        shouldDisableDate={shouldDisableDate}
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

### Know which shortcut has been selected

The `onChange` callback receives the shortcut as a property of it's second argument.
You can use it to know, which shortcut has been chosen:

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import {
  PickersShortcutsItem,
  PickersShortcutsItemContext,
} from '@mui/x-date-pickers/PickersShortcuts';
import {
  DateValidationError,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers/models';

const getMonthWeekday = (
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
  // Helper to find for example the 3rd monday in Jun
  const today = dayjs();
  const firstDayOfMonth = today.month(monthIndex).startOf('month');
  const weekDay = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const deltaToFirstValidWeekDayInMonth =
    (weekDay > weekdayIndex ? 7 : 0) + weekdayIndex - weekDay;
  return firstDayOfMonth.add(
    (dayRank - 1) * 7 + deltaToFirstValidWeekDayInMonth,
    'day',
  );
};

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "New Year's Day",
    getValue: () => {
      // (January 1)
      const today = dayjs();
      return today.month(0).date(1);
    },
  },
  {
    label: 'Birthday of MLK Jr.',
    getValue: () => {
      // (third Monday in January)
      return getMonthWeekday(0, 1, 3);
    },
  },
  {
    label: 'Independence Day',
    getValue: () => {
      // (July 4)
      const today = dayjs();
      return today.month(6).date(4);
    },
  },
  {
    label: 'Labor Day',
    getValue: () => {
      // (first Monday in September)
      return getMonthWeekday(8, 1, 1);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      // (December 25)
      const today = dayjs();
      return today.month(11).date(25);
    },
  },
];

export default function OnChangeShortcutLabel() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [lastShortcutSelected, setLastShortcutSelected] = React.useState<
    PickersShortcutsItemContext | undefined
  >(undefined);

  const handleChange = (
    newValue: Dayjs | null,
    ctx: PickerChangeHandlerContext<DateValidationError>,
  ) => {
    setValue(newValue);
    setLastShortcutSelected(ctx.shortcut);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <StaticDatePicker
          value={value}
          onChange={handleChange}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
          }}
        />
        <Typography>
          Selected shortcut on last onChange call:{' '}
          {lastShortcutSelected === undefined ? 'none' : lastShortcutSelected.label}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}

```

## Behavior when selecting a shortcut

You can change the behavior when selecting a shortcut using the `changeImportance` property:

- `"accept"` (_default value_): fires `onChange`, fires `onAccept` and closes the picker.
- `"set"`: fires `onChange` but do not fire `onAccept` and does not close the picker.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { PickerChangeImportance } from '@mui/x-date-pickers/models';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const getMonthWeekday = (
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
  // Helper to find the nth weekday in a given month.
  // For example, Find the 3rd Monday in January.
  const today = dayjs();
  const firstDayOfMonth = today.month(monthIndex).startOf('month');
  const weekDay = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const deltaToFirstValidWeekDayInMonth =
    (weekDay > weekdayIndex ? 7 : 0) + weekdayIndex - weekDay;
  return firstDayOfMonth.add(
    (dayRank - 1) * 7 + deltaToFirstValidWeekDayInMonth,
    'day',
  );
};

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "New Year's Day",
    getValue: () => {
      // (January 1)
      const today = dayjs();
      return today.month(0).date(1);
    },
  },
  {
    label: 'Birthday of MLK Jr.',
    getValue: () => {
      // (third Monday in January)
      return getMonthWeekday(0, 1, 3);
    },
  },
  {
    label: 'Independence Day',
    getValue: () => {
      // (July 4)
      const today = dayjs();
      return today.month(6).date(4);
    },
  },
  {
    label: 'Labor Day',
    getValue: () => {
      // (first Monday in September)
      return getMonthWeekday(8, 1, 1);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      // (December 25)
      const today = dayjs();
      return today.month(11).date(25);
    },
  },
];

export default function ChangeImportance() {
  const [changeImportance, setChangeImportance] =
    React.useState<PickerChangeImportance>('accept');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3} sx={{ width: 300 }}>
        <ToggleButtonGroup
          value={changeImportance}
          exclusive
          fullWidth
          onChange={(event, newEventImportance) => {
            if (newEventImportance != null) {
              setChangeImportance(newEventImportance);
            }
          }}
        >
          <ToggleButton value="accept">accept</ToggleButton>
          <ToggleButton value="set">set</ToggleButton>
        </ToggleButtonGroup>
        <DatePicker
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
              changeImportance,
            },
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}

```

## Customization

Like other [layout subcomponents](/x/react-date-pickers/custom-layout/), the shortcuts can be customized.
Here is an example with horizontal shortcuts.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import {
  PickersShortcutsItem,
  PickersShortcutsProps,
} from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { useIsValidValue, usePickerContext } from '@mui/x-date-pickers/hooks';

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

function CustomRangeShortcuts(props: PickersShortcutsProps<DateRange<Dayjs>>) {
  const { items, changeImportance = 'accept' } = props;
  const isValid = useIsValidValue<DateRange<Dayjs>>();
  const { setValue } = usePickerContext<DateRange<Dayjs>>();

  if (items == null || items.length === 0) {
    return null;
  }

  const resolvedItems = items.map((item) => {
    const newValue = item.getValue({ isValid });

    return {
      label: item.label,
      onClick: () => {
        setValue(newValue, { changeImportance, shortcut: item });
      },
      disabled: !isValid(newValue),
    };
  });

  return (
    <Box
      sx={{
        gridRow: 1,
        gridColumn: 2,
      }}
    >
      <List
        dense
        sx={(theme) => ({
          display: 'flex',
          px: theme.spacing(4),
          '& .MuiListItem-root': {
            pt: 0,
            pl: 0,
            pr: theme.spacing(1),
          },
        })}
      >
        {resolvedItems.map((item) => {
          return (
            <ListItem key={item.label}>
              <Chip {...item} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Box>
  );
}

export default function CustomizedRangeShortcuts() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        slots={{
          shortcuts: CustomRangeShortcuts,
        }}
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
          toolbar: {
            hidden: true,
          },
          actionBar: {
            hidden: true,
          },
        }}
        calendars={2}
      />
    </LocalizationProvider>
  );
}

```

## RTL example

Like other customizations, shortcuts also respect the RTL direction setting.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import type {} from '@mui/x-date-pickers/themeAugmentation';

// Create rtl cache
const cacheRtl = createCache({
  key: 'picker-shortcuts-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

const getMonthWeekday = (
  monthIndex: number,
  weekdayIndex: number,
  dayRank: number,
) => {
  // Helper to find the nth weekday in a given month.
  // For example, Find the 3rd Monday in January.
  const today = dayjs();
  const firstDayOfMonth = today.month(monthIndex).startOf('month');
  const weekDay = firstDayOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const deltaToFirstValidWeekDayInMonth =
    (weekDay > weekdayIndex ? 7 : 0) + weekdayIndex - weekDay;
  return firstDayOfMonth.add(
    (dayRank - 1) * 7 + deltaToFirstValidWeekDayInMonth,
    'day',
  );
};

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "New Year's Day",
    getValue: () => {
      // (January 1)
      const today = dayjs();
      return today.month(0).date(1);
    },
  },
  {
    label: 'Birthday of MLK Jr.',
    getValue: () => {
      // (third Monday in January)
      return getMonthWeekday(0, 1, 3);
    },
  },
  {
    label: 'Independence Day',
    getValue: () => {
      // (July 4)
      const today = dayjs();
      return today.month(6).date(4);
    },
  },
  {
    label: 'Labor Day',
    getValue: () => {
      // (first Monday in September)
      return getMonthWeekday(8, 1, 1);
    },
  },
  {
    label: 'Thanksgiving Day',
    getValue: () => {
      // (fourth Thursday in November)
      return getMonthWeekday(10, 4, 4);
    },
  },
  {
    label: 'Christmas Day',
    getValue: () => {
      // (December 25)
      const today = dayjs();
      return today.month(11).date(25);
    },
  },
];

export default function RTLShortcuts() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme({}, existingTheme, {
        direction: 'rtl',
      }),
    [existingTheme],
  );
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker slotProps={{ shortcuts: { items: shortcutsItems } }} />
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

```
