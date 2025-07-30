---
productId: x-date-pickers
title: React Time Picker component
components: TimePicker, DesktopTimePicker, MobileTimePicker, StaticTimePicker, DigitalClock, MultiSectionDigitalClock, TimeClock
githubLabel: 'scope: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/time-pickers
---

# Time Picker

The Time Picker component lets the user select a time.

## Basic usage

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function BasicTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label="Basic time picker" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Component composition

The component is built using the `TimeField` for the keyboard editing, the `DigitalClock` for the desktop view editing, and the `TimeClock` for the mobile view editing.

Check-out their documentation page for more information:

- [Time Field](/x/react-date-pickers/time-field/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)
- [Time Clock](/x/react-date-pickers/time-clock/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/time-picker/#props).
Some [TimeField props](/x/api/date-pickers/time-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function TimePickerValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker']}>
        <TimePicker
          label="Uncontrolled picker"
          defaultValue={dayjs('2022-04-17T15:30')}
        />
        <TimePicker
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

- The `DesktopTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and a field for keyboard editing.

- The `TimePicker` component which renders `DesktopTimePicker` or `MobileTimePicker` depending on the device it runs on.

- The `StaticTimePicker` component which renders without the popover/modal and field.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

export default function ResponsiveTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimePicker',
          'MobileTimePicker',
          'DesktopTimePicker',
          'StaticTimePicker',
        ]}
      >
        <DemoItem label="Desktop variant">
          <DesktopTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <TimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the `TimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function FormPropsTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker', 'TimePicker']}>
        <TimePicker label="disabled" disabled />
        <TimePicker label="readOnly" readOnly />
        <TimePicker label="name" name="startTime" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Views

The component supports three views: `hours`, `minutes` and `seconds`.

By default, the `hours` and `minutes` views are enabled.
Use the `views` prop to change this behavior:

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function TimePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker', 'TimePicker']}>
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <TimePicker views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <TimePicker views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <TimePicker views={['minutes', 'seconds']} format="mm:ss" />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the `MobileTimePicker` component renders the `hours` view on mount.
Use the `openTo` prop to change this behavior:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function TimePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MobileTimePicker', 'MobileTimePicker']}>
        <MobileTimePicker label={'"minutes"'} openTo="minutes" />
        <MobileTimePicker
          label={'"seconds"'}
          openTo="seconds"
          views={['minutes', 'seconds']}
          format="mm:ss"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow.
:::

## Landscape orientation

By default, the Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

export default function StaticTimePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker orientation="landscape" />
    </LocalizationProvider>
  );
}

```

:::info
You can find more information about the layout customization in the [custom layout page](/x/react-date-pickers/custom-layout/).
:::

## Choose time view renderer

You can use the `viewRenderers` prop to change the view that is used for rendering a view.
You might be interested in using the [Time Clock](/x/react-date-pickers/time-clock/) instead of the [Digital Clock](/x/react-date-pickers/digital-clock/) on desktop as well as mobile.

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function TimePickerViewRenderers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker
          label="With Time Clock"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
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
