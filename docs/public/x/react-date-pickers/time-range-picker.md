---
productId: x-date-pickers
title: React Time Range Picker component
components: TimeRangePicker, DesktopTimeRangePicker, MobileTimeRangePicker, DigitalClock, MultiSectionDigitalClock, TimeRangePickerTabs, TimeRangePickerToolbar
githubLabel: 'scope: TimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The Time Range Picker lets users select a range of time values.

## Basic usage

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';

export default function BasicTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeRangePicker']}>
        <TimeRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Component composition

The component is built using the `SingleInputTimeRangeField` for the keyboard editing and the `DigitalClock` for the view editing.

Check-out their documentation page for more information:

- [Time Range Field](/x/react-date-pickers/time-range-field/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';

export default function TimeRangePickerValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-17T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeRangePicker', 'TimeRangePicker']}>
        <DemoItem label="Uncontrolled picker" component="TimeRangePicker">
          <TimeRangePicker
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
          />
        </DemoItem>
        <DemoItem label="Controlled picker" component="TimeRangePicker">
          <TimeRangePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
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

## Available components

The component is available in three variants:

- The `DesktopTimeRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileTimeRangePicker` component which works best for touch devices and small screens.
  It renders the views inside a modal and and a field for keyboard editing.

- The `TimeRangePicker` component which renders `DesktopTimeRangePicker` or `MobileTimeRangePicker` depending on the device it runs on.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';

export default function ResponsiveTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimeRangePicker',
          'MobileTimeRangePicker',
          'DesktopTimeRangePicker',
        ]}
      >
        <DemoItem label="Desktop variant" component="DesktopTimeRangePicker">
          <DesktopTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant" component="MobileTimeRangePicker">
          <MobileTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant" component="TimeRangePicker">
          <TimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the `TimeRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component supports the `disabled`, `readOnly` and `name` props:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';

export default function FormPropsTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeRangePicker', 'TimeRangePicker']}>
        <TimeRangePicker label="disabled" disabled />
        <TimeRangePicker label="readOnly" readOnly />
        <TimeRangePicker label="name" name="startTimeRange" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::success
The `name` prop is not available when using the Time Range Picker with the Multi Input Time Range Field.
:::

## Customization

### Use a multi input field

You can pass the `MultiInputTimeRangeField` component to the Time Range Picker to use it for keyboard editing:

```tsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function MultiInputTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputTimeRangeField']}>
        <TimeRangePicker slots={{ field: MultiInputTimeRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info
You can find more information in a [dedicated documentation page section](/x/react-date-pickers/custom-field/#usage-inside-a-range-picker).
:::

### Change end time label

The below demo shows how to add a custom label on the end time view showing the selected time range duration.

It replaces the default `digitalClockItem` slot component with a different one calculating the duration of the range when selecting the end time.

```tsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  DigitalClockItem,
  DigitalClockItemProps,
} from '@mui/x-date-pickers/DigitalClock';
import { DateTime } from 'luxon';
import { DateRange, RangePosition } from '@mui/x-date-pickers-pro/models';

function CustomDigitalClockItem(
  props: DigitalClockItemProps & {
    rangePosition: RangePosition;
    selectedValue: DateRange<DateTime>;
  },
) {
  const { rangePosition, selectedValue, formattedValue, itemValue, ...other } =
    props;
  const selectedStartTime = selectedValue[0];
  if (selectedStartTime && selectedStartTime.isValid && rangePosition === 'end') {
    const timeDifference = itemValue.diff(selectedStartTime, ['minutes']);
    const timeDifferenceLabel =
      timeDifference.minutes < 60
        ? timeDifference.toHuman()
        : timeDifference.shiftTo('hours').toHuman();
    return (
      <DigitalClockItem {...other} sx={{ minWidth: 175 }}>
        {formattedValue} ({timeDifferenceLabel})
      </DigitalClockItem>
    );
  }
  return <DigitalClockItem {...other} sx={{ minWidth: 175 }} />;
}

export default function CustomizedBehaviorTimeRangePicker() {
  const [rangePosition, setRangePosition] = React.useState<RangePosition>('start');
  const [value, setValue] = React.useState<DateRange<DateTime>>([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <TimeRangePicker
          label="Event time"
          timeSteps={{ minutes: 15 }}
          value={value}
          onChange={setValue}
          minTime={rangePosition === 'end' && value[0] ? value[0] : undefined}
          rangePosition={rangePosition}
          skipDisabled
          onRangePositionChange={setRangePosition}
          thresholdToRenderTimeInASingleColumn={96}
          format="HH:mm"
          ampm={false}
          slots={{ digitalClockItem: CustomDigitalClockItem as any }}
          slotProps={{
            digitalClockItem: {
              rangePosition,
              selectedValue: value,
            } as unknown as DigitalClockItemProps,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Customize the field

You can find the documentation in the [Custom field page](/x/react-date-pickers/custom-field/).

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).
