---
productId: x-date-pickers
title: React Digital Clock component
components: DigitalClock, MultiSectionDigitalClock
githubLabel: 'scope: TimePicker'
packageName: '@mui/x-date-pickers'
---

# Digital Clock

The Digital Clock lets the user select a time without any input or popper / modal.

## Description

There are two component versions for different cases. The `DigitalClock` handles selection of a single time instance in one step, just like a `select` component. The `MultiSectionDigitalClock` allows selecting time using separate sections for separate views.

The `DigitalClock` is more appropriate when there is a limited number of time options needed, while the `MultiSectionDigitalClock` is suited for cases when a more granular time selection is needed.

## Basic usage

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockBasic() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="Digital clock">
          <DigitalClock />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock />
        </DemoItem>
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
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'DigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoContainer components={['DigitalClock', 'DigitalClock']}>
          <DemoItem label="Uncontrolled digital clock">
            <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
          </DemoItem>
          <DemoItem label="Controlled digital clock">
            <DigitalClock
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoItem>
        </DemoContainer>
        <DemoContainer
          components={['MultiSectionDigitalClock', 'MultiSectionDigitalClock']}
        >
          <DemoItem label="Uncontrolled multi section digital clock">
            <MultiSectionDigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
          </DemoItem>
          <DemoItem label="Controlled multi section digital clock">
            <MultiSectionDigitalClock
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoItem>
        </DemoContainer>
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

The components can be disabled or read-only.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'DigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoContainer components={['DigitalClock', 'DigitalClock']}>
          <DemoItem label="Digital clock disabled">
            <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} disabled />
          </DemoItem>
          <DemoItem label="Digital clock readOnly">
            <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} readOnly />
          </DemoItem>
        </DemoContainer>
        <DemoContainer
          components={['MultiSectionDigitalClock', 'MultiSectionDigitalClock']}
        >
          <DemoItem label="Multi section digital clock disabled">
            <MultiSectionDigitalClock
              defaultValue={dayjs('2022-04-17T15:30')}
              disabled
            />
          </DemoItem>
          <DemoItem label="Multi section digital clock readOnly">
            <MultiSectionDigitalClock
              defaultValue={dayjs('2022-04-17T15:30')}
              readOnly
            />
          </DemoItem>
        </DemoContainer>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Views

The `MultiSectionDigitalClock` component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <MultiSectionDigitalClock views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <MultiSectionDigitalClock views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <MultiSectionDigitalClock views={['minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## 12h/24h format

The components use the hour format of the locale's time setting, that is the 12-hour or 24-hour format.

You can force a specific format using the `ampm` prop.

You can find more information about 12h/24h format in the [Date localization page](/x/react-date-pickers/adapters-locale/#meridiem-12h-24h-format).

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockAmPm() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'DigitalClock',
          'DigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoItem>
          <Typography variant="body2">
            Locale default behavior (enabled for enUS)
          </Typography>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
            </DemoItem>
            <DemoItem>
              <MultiSectionDigitalClock defaultValue={dayjs('2022-04-17T15:30')} />
            </DemoItem>
          </DemoContainer>
        </DemoItem>
        <DemoItem>
          <Typography variant="body2">AM PM enabled</Typography>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} ampm />
            </DemoItem>
            <DemoItem>
              <MultiSectionDigitalClock
                defaultValue={dayjs('2022-04-17T15:30')}
                ampm
              />
            </DemoItem>
          </DemoContainer>
        </DemoItem>
        <DemoItem>
          <Typography variant="body2">AM PM disabled</Typography>
          <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
            <DemoItem>
              <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} ampm={false} />
            </DemoItem>
            <DemoItem>
              <MultiSectionDigitalClock
                defaultValue={dayjs('2022-04-17T15:30')}
                ampm={false}
              />
            </DemoItem>
          </DemoContainer>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Time steps

By default, the components list the time options in the following way:

- `DigitalClock` in `30` minutes intervals;
- `MultiSectionDigitalClock` component in `5` unit (`minutes` or `seconds`) intervals;

You can set the desired interval using the `timeStep` and `timeSteps` props.
The prop accepts:

- The `DigitalClock` component accepts a `number` value `timeStep` prop;
- The `MultiSectionDigitalClock` component accepts a `timeSteps` prop with `number` values for `hours`, `minutes`, or `seconds` units;

```tsx
import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockTimeStep() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="Digital clock">
          <DigitalClock timeStep={60} />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock
            timeSteps={{ hours: 2, minutes: 15, seconds: 10 }}
            views={['hours', 'minutes', 'seconds']}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Skip rendering disabled options

With the `skipDisabled` prop, the components don't render options that are not available to the user (for example through `minTime`, `maxTime`, `shouldDisabledTime` etc.).

The following example combines these properties to customize which options are rendered.

- The first component does not show options before `9:00` (the value of `minTime`).
- The second one shows options between `09:00` and `13:20` thanks to `shouldDisableTime`.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeView } from '@mui/x-date-pickers/models';

const shouldDisableTime = (date: Dayjs, view: TimeView) => {
  const hour = date.hour();
  if (view === 'hours') {
    return hour < 9 || hour > 13;
  }
  if (view === 'minutes') {
    const minute = date.minute();
    return minute > 20 && hour === 13;
  }
  return false;
};

export default function DigitalClockSkipDisabled() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DigitalClock', 'MultiSectionDigitalClock']}>
        <DemoItem label="Digital clock">
          <DigitalClock
            skipDisabled
            minTime={dayjs('2022-04-17T09:00')}
            timeStep={60}
          />
        </DemoItem>
        <DemoItem label="Multi section digital clock">
          <MultiSectionDigitalClock
            skipDisabled
            shouldDisableTime={shouldDisableTime}
            ampm={false}
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
