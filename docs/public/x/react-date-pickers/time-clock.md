---
productId: x-date-pickers
title: React Time Clock component
components: TimeClock
githubLabel: 'scope: TimePicker'
packageName: '@mui/x-date-pickers'
---

# Time Clock

The Time Clock component lets the user select a time without any input or popper / modal.

## Basic usage

```tsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function BasicTimeClock() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeClock />
    </LocalizationProvider>
  );
}

```

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock']}>
        <DemoItem label="Uncontrolled clock">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Controlled clock">
          <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
        </DemoItem>
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

## Form props

The component can be disabled or read-only.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock']}>
        <DemoItem label="disabled">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} disabled />
        </DemoItem>
        <DemoItem label="readOnly">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} readOnly />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Views

The component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock', 'TimeClock']}>
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <TimeClock views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <TimeClock views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <TimeClock views={['minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## 12h/24h format

The component uses the hour format of the locale's time setting, that is the 12-hour or 24-hour format.

You can force a specific format using the `ampm` prop.

You can find more information about 12h/24h format in the [Date localization page](/x/react-date-pickers/adapters-locale/#meridiem-12h-24h-format).

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockAmPm() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock', 'TimeClock']}>
        <DemoItem label="Locale default behavior (enabled for enUS)">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="AM PM enabled">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} ampm />
        </DemoItem>
        <DemoItem label="AM PM disabled">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} ampm={false} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
