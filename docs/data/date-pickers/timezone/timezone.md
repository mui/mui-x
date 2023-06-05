---
product: date-pickers
title: Date and Time pickers - UTC and timezones
components: LocalizationProvider
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# UTC and timezones

<p class="description">Date and Time Pickers support UTC and timezones.</p>

:::warning
UTC and timezone support is an ongoing topic.

Only `AdapterDayjs`, `AdapterLuxon` and `AdapterMoment` are currently compatible with UTC dates and timezones.
:::

## Overview

By default, the components will always use the timezone of your `value` / `defaultValue` prop:

{{"demo": "BasicValueProp.js", "defaultCodeOpen": false}}

You can use the `timezone` prop to explicitly define the timezone in which the value should be rendered:

{{"demo": "BasicTimezoneProp.js"}}

This will be needed you have no `value` or `defaultValue` to pass to your component and to deduct your timezone from or you don't want to render the value in its original timezone.

## Supported timezones

|            Timezone | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|             `"UTC"` | Will use the [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time)                                                                                                                                                                                                                                                                                                            |
|         `"default"` | Will use the default timezone of your date library, this value can be set using<br/>- [`dayjs.tz.setDefault`](https://day.js.org/docs/en/timezone/set-default-timezone) on dayjs<br/>- [`Settings.defaultZone`](https://moment.github.io/luxon/#/zones?id=changing-the-default-zone) on luxon<br/>- [`moment.tz.setDefault`](https://momentjs.com/timezone/docs/#/using-timezones/default-timezone/) on moment |
|          `"system"` | Will use the system's local timezone                                                                                                                                                                                                                                                                                                                                                                           |
| IANA standard zones | Example: `"Europe/Paris"`, `"America/New_York"`<br/>[List of all the IANA zones](https://timezonedb.com/time-zones)                                                                                                                                                                                                                                                                                            |
|        Fixed offset | Example: `"UTC+7"`<br/>**Only available with Luxon**                                                                                                                                                                                                                                                                                                                                                           |

{{"demo": "TimezonePlayground.js", "defaultCodeOpen": false}}

## Usage with Day.js

### Day.js and UTC

To be able to use UTC, you have to enable the `utc` plugin:

```tsx
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

dayjs.extend(utc);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker defaultValue={dayjs.utc('2022-04-17T15:30')} />
    </LocalizationProvider>
  );
}
```

{{"demo": "DayjsUTC.js", "defaultCodeOpen": false}}

### Day.js and timezones

To be able to use timezones, you have to enable both the `utc` and the `timezone` plugin:

```tsx
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker defaultValue={dayjs.tz('2022-04-17T15:30')} />
    </LocalizationProvider>
  );
}
```

{{"demo": "DayjsTimezone.js", "defaultCodeOpen": false}}

:::info
You can check out the documentation of the [dayjs timezone plugin](https://day.js.org/docs/en/timezone/timezone) for more details on how to manipulate the timezones.
:::

## Usage with Luxon

### Luxon and UTC

```tsx
import { DateTime } from 'luxon';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateTimePicker defaultValue={DateTime.utc(2022, 4, 17, 15, 30)} />
    </LocalizationProvider>
  );
}
```

{{"demo": "LuxonUTC.js", "defaultCodeOpen": false}}

### Luxon and timezone

```tsx
import { DateTime } from 'luxon';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

Settings.defaultZone = 'America/New_York';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateTimePicker defaultValue={DateTime.fromISO('2022-04-17T15:30')} />
    </LocalizationProvider>
  );
}
```

{{"demo": "LuxonTimezone.js", "defaultCodeOpen": false}}

:::info
You can check out the documentation of the [timezone on Luxon](https://moment.github.io/luxon/#/zones) for more details on how to manipulate the timezones.
:::

## Usage with Moment

### Moment and UTC

```tsx
import moment from 'moment';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker defaultValue={moment.utc('2022-04-17T15:30')} />
    </LocalizationProvider>
  );
}
```

{{"demo": "MomentUTC.js", "defaultCodeOpen": false}}

### Moment and timezone

To be able to use timezones, you have to pass the default export from `moment-timezone` to the `dateLibInstance` prop of `LocalizationProvider`:

```tsx
import moment from 'moment-timezone';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

moment.tz.setDefault('America/New_York');

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment}>
      <DateTimePicker defaultValue={moment('2022-04-17T15:30')} />
    </LocalizationProvider>
  );
}
```

{{"demo": "MomentTimezone.js", "defaultCodeOpen": false}}

:::info
You can check out the documentation of [Moment timezone](https://momentjs.com/timezone/) for more details on how to manipulate the timezones.
:::

## More advanced examples

:::info
The following examples are all built using `dayjs`.
You can achieve the exact same behavior using `luxon` or `moment`,
please refer to the sections above to know how to pass a UTC date or a date in a specific timezone to your component.
:::

### Store UTC dates but display in system's timezone

The demo belows shows how to store dates in UTC while displaying using the system timezone.

{{"demo": "StoreUTCButDisplaySystemTimezone.js",  "defaultCodeOpen": false}}

### Store UTC dates but display in another timezone

The demo belows shows how to store dates in UTC while displaying them using the system timezone.

{{"demo": "StoreUTCButDisplayOtherTimezone.js",  "defaultCodeOpen": false}}
