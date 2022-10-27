---
title: Localized dates
---

# Localized dates

<p class="description">Use localized format to render your dates.</p>

## Getting started

The Date and Time Pickers allow you to override the locale used to format the dates.
By default, each library uses the `en-US` locale.

## Set a custom locale

### With `dayjs`

For `dayjs`, you have to import the locale and then pass its name to `LocalizationProvider`:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationDayjs.js"}}

### With `date-fns`

For `date-fns`, you have to import the locale and pass it to `LocalizationProvider`:

```tsx
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import de from 'date-fns/locale/de';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationDateFns.js"}}

### With `luxon`

For `luxon`, you have to pass the locale name to `LocalizationProvider`:

```tsx
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

<LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationLuxon.js"}}

### With `moment`

For `moment`, you have to import the locale and then pass its name to `LocalizationProvider`:

```tsx
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';

<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationMoment.js"}}

:::warning
Some of `moment` methods do not support scoped local.
To have a correct localization, you will have to manually update the global local before updating it in `LocalizationProvider`.

```tsx
function App({ children }) {
  const [locale, setLocale] = React.useState('en-us');

  if (moment.locale() !== locale) {
    moment.locale(locale);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <Stack>
        <Button onClick={() => setLocale('de')}>Switch to German</Button>
        {children}
      </Stack>
    </LocalizationProvider>
  );
}
```

:::

## AM / PM or 24 hours time

All the time and datetime components support both AM / PM and 24 hours formats.
The default format will respect your local, but you can override this behavior using the `ampm` prop:

{{"demo": "AmPMCustomization.js"}}
