---
productId: x-date-pickers
title: React Time Range Field components
components: MultiInputTimeRangeField, SingleInputTimeRangeField
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers-pro'
---

# Time Range Field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The Time Range Field lets the user select a range of time with the keyboard.

## Basic usage

:::info
All the topics covered below are applicable to both `SingleInputTimeRangeField` and `MultiInputTimeRangeField` unless explicitly mentioned.
:::

You can render your Time Range Field with either one input using `SingleInputTimeRangeField`
or two inputs using `MultiInputTimeRangeField` as show below.

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';

export default function BasicTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputTimeRangeField', 'MultiInputTimeRangeField']}
      >
        <SingleInputTimeRangeField label="From - To" />
        <MultiInputTimeRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'From' : 'To',
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
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';

export default function TimeRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-17T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputTimeRangeField', 'SingleInputTimeRangeField']}
      >
        <SingleInputTimeRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
        />
        <SingleInputTimeRangeField
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
