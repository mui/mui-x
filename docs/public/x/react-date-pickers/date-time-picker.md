---
productId: x-date-pickers
title: React Date Time Picker component
components: DateTimePicker, DesktopDateTimePicker, MobileDateTimePicker, StaticDateTimePicker, DigitalClock, MultiSectionDigitalClock, TimeClock
githubLabel: 'scope: DateTimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Picker

The Date Time Picker component lets users select a date and time.

## Basic usage

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function BasicDateTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Basic date time picker" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Component composition

The component is built using the `DateTimeField` for the keyboard editing, the `DateCalendar` for the date view editing and `DigitalClock` for the time view editing.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-time-picker/#props).
Some [DateTimeField props](/x/api/date-pickers/date-time-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function DateTimePickerValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Uncontrolled picker"
          defaultValue={dayjs('2022-04-17T15:30')}
        />
        <DateTimePicker
          label="Controlled picker"
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

## Available components

The component is available in four variants:

- The `DesktopDateTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileDateTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and a field for keyboard editing.

- The `DateTimePicker` component which renders `DesktopDateTimePicker` or `MobileDateTimePicker` depending on the device it runs on.

- The `StaticDateTimePicker` component which renders without the popover/modal and field.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

export default function ResponsiveDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker',
          'MobileDateTimePicker',
          'DesktopDateTimePicker',
          'StaticDateTimePicker',
        ]}
      >
        <DemoItem label="Desktop variant">
          <DesktopDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <DateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the `DateTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function FormPropsDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
      >
        <DateTimePicker label="disabled" disabled />
        <DateTimePicker label="readOnly" readOnly />
        <DateTimePicker label="name" name="startDateTime" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Views

The component supports six views: `day`, `month`, `year`, `hours`, `minutes` and `seconds`.

By default, the `year`, `day`, `hours`, and `minutes` views are enabled.
Use the `views` prop to change this behavior:

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function DateTimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
      >
        <DemoItem
          label={'"year"", "month", "day", "hours", "minutes" and "seconds"'}
        >
          <DateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          />
        </DemoItem>
        <DemoItem label={'"day", "hours"'}>
          <DateTimePicker views={['day', 'hours']} />
        </DemoItem>
        <DemoItem label={'"year", "day", "hours", "minutes", "seconds"'}>
          <DateTimePicker views={['year', 'day', 'hours', 'minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the component renders the `day` view on mount.
Use the `openTo` prop to change this behavior:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function DateTimePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'MobileTimePicker']}>
        <DateTimePicker label={'"year"'} openTo="year" />
        <MobileTimePicker label={'"hours"'} openTo="hours" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow
(for example view the default behaviors, the `year` is only accessible when clicking on the toolbar).
:::

## Landscape orientation

By default, the Date Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

export default function StaticDateTimePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker orientation="landscape" />
    </LocalizationProvider>
  );
}

```

:::info
You can find more information about the layout customization in the [custom layout page](/x/react-date-pickers/custom-layout/).
:::

## Choose time view renderer

You can use the `viewRenderers` prop to change the view that is used for rendering a view.
You might be interested in using the [Time Clock](/x/react-date-pickers/time-clock/) instead of the [Digital Clock](/x/react-date-pickers/digital-clock/) or removing the time view rendering altogether in favor of only using the field to input the time.

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function DateTimePickerViewRenderers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="With Time Clock"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
        <DateTimePicker
          label="Without view renderers"
          viewRenderers={{
            hours: null,
            minutes: null,
            seconds: null,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
