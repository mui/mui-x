---
productId: x-date-pickers
title: React Date Range Field components
components: MultiInputDateRangeField, SingleInputDateRangeField
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers-pro'
---

# Date Range Field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The Date Range Field lets the user select a date range with the keyboard.

## Basic usage

You can render your Date Range Field with either one input using `SingleInputDateRangeField`
or two inputs using `MultiInputDateRangeField` as show below.

:::info
All the topics covered below are applicable to both `SingleInputDateRangeField` and `MultiInputDateRangeField` unless explicitly mentioned.
:::

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function BasicDateRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputDateRangeField', 'MultiInputDateRangeField']}
      >
        <SingleInputDateRangeField label="Departure - Return" />
        <MultiInputDateRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'Departure' : 'Return',
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DateRange } from '@mui/x-date-pickers-pro/models';

export default function DateRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-17'),
    dayjs('2022-04-21'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputDateRangeField', 'SingleInputDateRangeField']}
      >
        <SingleInputDateRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
        />
        <SingleInputDateRangeField
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
