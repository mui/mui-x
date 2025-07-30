---
productId: x-date-pickers
title: React Date Time Range Picker component
components: DateTimeRangePicker, DesktopDateTimeRangePicker, MobileDateTimeRangePicker, DateRangeCalendar, DateRangePickerDay, DigitalClock, MultiSectionDigitalClock, DateTimeRangePickerTabs, DateTimeRangePickerToolbar
githubLabel: 'scope: DateTimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The Date Time Range Picker lets the user select a range of dates with an explicit starting and ending time.

## Basic usage

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function BasicDateTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeRangePicker']}>
        <DateTimeRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Component composition

The component is built using the `SingleInputDateTimeRangeField` for the keyboard editing, the `DateRangeCalendar` for the date view editing and `DigitalClock` for the time view editing.

Check-out their documentation page for more information:

- [Date Time Range Field](/x/react-date-pickers/date-time-range-field/)
- [Date Range Calendar](/x/react-date-pickers/date-range-calendar/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-time-range-picker/#props).
Some [SingleInputDateTimeRangeField props](/x/api/date-pickers/single-input-date-time-range-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function DateTimeRangePickerValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-21T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeRangePicker', 'DateTimeRangePicker']}>
        <DemoItem label="Uncontrolled picker" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Controlled picker" component="DateTimeRangePicker">
          <DateTimeRangePicker
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

- The `DesktopDateTimeRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileDateTimeRangePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values with the keyboard in the field.

- The `DateTimeRangePicker` component which renders `DesktopDateTimeRangePicker` or `MobileDateTimeRangePicker` depending on the device it runs on.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import { DesktopDateTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopDateTimeRangePicker';

export default function ResponsiveDateTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimeRangePicker',
          'MobileDateTimeRangePicker',
          'DesktopDateTimeRangePicker',
        ]}
      >
        <DemoItem label="Desktop variant" component="DesktopDateTimeRangePicker">
          <DesktopDateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant" component="MobileDateTimeRangePicker">
          <MobileDateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the `DateTimeRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component supports the `disabled`, `readOnly` and `name` form props:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function FormPropsDateTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimeRangePicker',
          'DateTimeRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DateTimeRangePicker label="disabled" disabled />
        <DateTimeRangePicker label="readOnly" readOnly />
        <DateTimeRangePicker label="name" name="startDateTimeRange" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendars` prop.

:::info
This prop will be ignored on the mobile picker.
:::

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function DateTimeRangePickerCalendarProp() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimeRangePicker',
          'DateTimeRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DemoItem label="1 calendar" component="DateTimeRangePicker">
          <DateTimeRangePicker calendars={1} />
        </DemoItem>
        <DemoItem label="2 calendars" component="DateTimeRangePicker">
          <DateTimeRangePicker calendars={2} />
        </DemoItem>
        <DemoItem label="3 calendars" component="DateTimeRangePicker">
          <DateTimeRangePicker calendars={3} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Use a multi input field

You can pass the `MultiInputDateTimeRangeField` component to the Date Time Range Picker to use it for keyboard editing:

```tsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function MultiInputDateTimeRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputDateTimeRangeField']}>
        <DateTimeRangePicker slots={{ field: MultiInputDateTimeRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info
You can find more information in a [dedicated documentation page section](/x/react-date-pickers/custom-field/#usage-inside-a-range-picker).
:::

### Customize the field

You can find the documentation in the [Custom field page](/x/react-date-pickers/custom-field/).

### Change view renderer

You can pass a different view renderer to the Date Time Range Picker to customize the views.

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from '@mui/x-date-pickers/timeViewRenderers';

export default function DateTimeRangePickerViewRenderer() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeRangePicker', 'DateTimeRangePicker']}>
        <DemoItem label="With digital clock" component="DateTimeRangePicker">
          <DateTimeRangePicker
            views={['day', 'hours']}
            timeSteps={{ minutes: 20 }}
            viewRenderers={{ hours: renderDigitalClockTimeView }}
          />
        </DemoItem>
        <DemoItem label="With analog clock" component="DateTimeRangePicker">
          <DateTimeRangePicker
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
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
