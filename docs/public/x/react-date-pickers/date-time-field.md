---
productId: x-date-pickers
title: React Date Field component
components: DateTimeField
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers'
---

# Date Time Field

The Date Time Field component lets users select a date and a time with the keyboard.

## Basic usage

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function BasicDateTimeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeField']}>
        <DateTimeField label="Basic date time field" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function DateTimeFieldValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeField', 'DateTimeField']}>
        <DateTimeField
          label="Uncontrolled field"
          defaultValue={dayjs('2022-04-17T15:30')}
        />
        <DateTimeField
          label="Controlled field"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

### Customize the date time format

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function CustomDateTimeFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimeField', 'DateTimeField', 'DateTimeField']}
      >
        <DateTimeField
          label="Format with meridiem"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="L hh:mm a"
        />
        <DateTimeField
          label="Format without meridiem"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="L HH:mm"
        />
        <DateTimeField
          label="Localized format with full letter month"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="LLL"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info
See [Date format and localization—Custom formats](/x/react-date-pickers/adapters-locale/#custom-formats) for more details.
:::

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
