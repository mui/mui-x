---
productId: x-date-pickers
title: Date and Time Pickers - UTC and timezones
components: LocalizationProvider
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# UTC and timezones

<p class="description">Date and Time Pickers support UTC and timezones.</p>

:::warning
UTC and timezones support is an ongoing effort.

Only `AdapterDayjs`, `AdapterLuxon` and `AdapterMoment` are currently compatible with UTC dates and timezones.
:::

## Overview

By default, the components will always use the timezone of your `value` / `defaultValue` prop:

{{"demo": "BasicValueProp.js", "defaultCodeOpen": false}}

You can use the `timezone` prop to explicitly define the timezone in which the value should be rendered:

{{"demo": "BasicTimezoneProp.js"}}

This will be needed if the component has no `value` or `defaultValue` to deduct the timezone from it or if you don't want to render the value in its original timezone.

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

Before using the UTC dates with Day.js, you have to enable the `utc` plugin:

```tsx
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
```

:::info
**How to create a UTC date with Day.js?**

To create a UTC date, use the `dayjs.utc` method

```tsx
const date = dayjs.utc('2022-04-17T15:30');
```

You can check out the documentation of the [UTC on Day.js](https://day.js.org/docs/en/plugin/utc) for more details.
:::

You can then pass your UTC date to your picker:

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

Before using the timezone with Day.js, you have to enable both the `utc` and `timezone` plugins:

```tsx
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
```

:::info
**How to create a date in a specific timezone with Day.js?**

If your whole application is using dates from the same timezone, set the default zone to your timezone name:

```tsx
import { dayjs } from 'dayjs';

dayjs.tz.setDefault('America/New_York');

const date = dayjs.tz('2022-04-17T15:30');
```

If you only want to use dates with this timezone on some parts of your application, pass the timezone as the 2nd parameter of the `dayjs.tz` method:

```tsx
import { dayjs } from 'dayjs';

const date = dayjs.tz('2022-04-17T15:30', 'America/New_York');
```

You can check out the documentation of the [timezone on Day.js](https://day.js.org/docs/en/timezone/timezone) for more details.
:::

You can then pass your date in the wanted timezone to your picker:

```tsx
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        defaultValue={dayjs.tz('2022-04-17T15:30', 'America/New_York')}
      />
    </LocalizationProvider>
  );
}
```

{{"demo": "DayjsTimezone.js", "defaultCodeOpen": false}}

:::info
Please check out the documentation of the [dayjs timezone plugin](https://day.js.org/docs/en/timezone/timezone) for more details on how to manipulate the timezones.
:::

## Usage with Luxon

### Luxon and UTC

:::info
**How to create a UTC date with Luxon?**

If your whole application is using UTC dates, set the default zone to `"UTC"`:

```tsx
import { DateTime, Settings } from 'luxon';

Settings.defaultZone = 'UTC';

const date1 = DateTime.fromISO('2022-04-17T15:30');
const date2 = DateTime.fromSQL('2022-04-17 15:30:00');
```

If you only want to use UTC dates on some parts of your application, create a UTC date using `DateTime.utc` or with the `zone` parameter of Luxon methods:

```tsx
import { DateTime } from 'luxon';

const date1 = DateTime.utc(2022, 4, 17, 15, 30);
const date2 = DateTime.fromISO('2022-04-17T15:30', { zone: 'UTC' });
const date3 = DateTime.fromSQL('2022-04-17 15:30:00', { zone: 'UTC' });
```

Please check out the documentation of the [UTC and timezones on Luxon](https://moment.github.io/luxon/#/zones) for more details.
:::

You can then pass your UTC date to your picker:

```tsx
import { DateTime } from 'luxon';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateTimePicker
        defaultValue={DateTime.fromISO('2022-04-17T15:30', { zone: 'UTC' })}
      />
    </LocalizationProvider>
  );
}
```

{{"demo": "LuxonUTC.js", "defaultCodeOpen": false}}

### Luxon and timezone

:::info
**How to create a date in a specific timezone with Luxon?**

If your whole application is using dates from the same timezone, set the default zone to your timezone name:

```tsx
import { DateTime, Settings } from 'luxon';

Settings.defaultZone = 'America/New_York';

const date1 = DateTime.fromISO('2022-04-17T15:30');
const date2 = DateTime.fromSQL('2022-04-17 15:30:00');
```

If you only want to use dates with this timezone on some parts of your application, create a date in this timezone using the `zone` parameter of Luxon methods:

```tsx
import { DateTime } from 'luxon';

const date1 = DateTime.fromISO('2022-04-17T15:30', { zone: 'America/New_York' });
const date2 = DateTime.fromSQL('2022-04-17 15:30:00', { zone: 'America/New_York' });
```

Please check out the documentation of the [UTC and timezones on Luxon](https://moment.github.io/luxon/#/zones) for more details.
:::

You can then pass your date in the wanted timezone to your picker:

```tsx
import { DateTime } from 'luxon';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateTimePicker
        defaultValue={DateTime.fromISO('2022-04-17T15:30', {
          zone: 'America/New_York',
        })}
      />
    </LocalizationProvider>
  );
}
```

{{"demo": "LuxonTimezone.js", "defaultCodeOpen": false}}

:::info
Please check out the documentation of the [UTC and timezones on Luxon](https://moment.github.io/luxon/#/zones) for more details on how to manipulate the timezones.
:::

## Usage with Moment

### Moment and UTC

:::info
**How to create a UTC date with Moment?**

To create a UTC date, use the `dayjs.utc` method

```tsx
const date = moment.utc('2022-04-17T15:30');
```

Please check out the documentation of the [UTC on Moment](https://momentjs.com/docs/#/parsing/utc/) for more details.
:::

You can then pass your UTC date to your picker:

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

Before using the timezone with Moment, you have to pass the default export from `moment-timezone` to the `dateLibInstance` prop of `LocalizationProvider`:

```tsx
import moment from 'moment-timezone';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

<LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment}>
  {children}
</LocalizationProvider>;
```

:::info
**How to create a date in a specific timezone with Moment?**

If your whole application is using dates from the same timezone, set the default zone to your timezone name:

```tsx
import moment from 'moment-timezone';

moment.tz.setDefault('America/New_York');

const date = moment('2022-04-17T15:30');
```

If you only want to use dates with this timezone on some parts of your application, create a date using the `moment.tz` method:

```tsx
import moment from 'moment-timezone';

const date = moment.tz('2022-04-17T15:30', 'America/New_York');
```

Please check out the documentation of the [timezone on Moment](https://momentjs.com/timezone/) for more details.
:::

You can then pass your date in the wanted timezone to your picker:

```tsx
import moment from 'moment-timezone';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment}>
      <DateTimePicker
        defaultValue={moment.tz('2022-04-17T15:30', 'America/New_York')}
      />
    </LocalizationProvider>
  );
}
```

{{"demo": "MomentTimezone.js", "defaultCodeOpen": false}}

## More advanced examples

:::info
The following examples are all built using `dayjs`.
You can achieve the exact same behavior using `luxon` or `moment`,
please refer to the sections above to know how to pass a UTC date or a date in a specific timezone to your component.
:::

### Store UTC dates but display in system's timezone

The demo below shows how to store dates in UTC while displaying using the system timezone.

{{"demo": "StoreUTCButDisplaySystemTimezone.js",  "defaultCodeOpen": false}}

### Store UTC dates but display in another timezone

The demo below shows how to store dates in UTC while displaying using the `Pacific/Honolulu` timezone.

{{"demo": "StoreUTCButDisplayOtherTimezone.js",  "defaultCodeOpen": false}}
