---
productId: x-date-pickers
title: React Date Time Range Field components
components: MultiInputDateTimeRangeField, SingleInputDateTimeRangeField
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers-pro'
---

# Date Time Range Field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The Date Time Range Field lets the user select a range of dates with an explicit starting and ending time with the keyboard.

## Basic usage

:::info
All the topics covered below are applicable to both `SingleInputDateTimeRangeField` and `MultiInputDateTimeRangeField` unless explicitly mentioned.
:::

You can render your Date Time Range Field with either one input using `SingleInputDateTimeRangeField`
or two inputs using `MultiInputDateTimeRangeField` as show below.

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function BasicDateTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'SingleInputDateTimeRangeField',
          'MultiInputDateTimeRangeField',
        ]}
      >
        <SingleInputDateTimeRangeField label="Check-in - Check-out" />
        <MultiInputDateTimeRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'Check-in' : 'Check-out',
            }),
          }}
        />
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
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function DateTimeRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-21T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'SingleInputDateTimeRangeField',
          'SingleInputDateTimeRangeField',
        ]}
      >
        <SingleInputDateTimeRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
        />
        <SingleInputDateTimeRangeField
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

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
