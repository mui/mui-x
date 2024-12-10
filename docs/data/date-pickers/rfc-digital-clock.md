---
productId: x-date-pickers
title: DX - Digital Clock
---

# Digital Clock

<p class="description">This page describes how people can use time views with Material UI and how they can build custom time views.</p>

## Multi section - without meridiem

### Without Material UI

The user can use the `<DigitalClock.HourOptions />` and `<DigitalClock.MinuteOptions />` components to list all the time options with one column per section:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HourOptions>
    {({ hours }) =>
      hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
    }
  </DigitalClock.HourOptions>
  <DigitalClock.MinuteOptions>
    {({ minutes }) =>
      minutes.map((minute) => (
        <DigitalClock.Option value={minute} key={minute.toString()} />
      ))
    }
  </DigitalClock.MinuteOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section - with meridiem

### Without Material UI

The user can use the `<DigitalClock.MeridiemOptions />` component to add a column to edit this section.
It should be used in combination with the `<DigitalClock.HoursWithMeridiemOptions />` component:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HoursWithMeridiemOptions>
    {({ hours }) =>
      hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
    }
  </DigitalClock.HoursWithMeridiemOptions>
  <DigitalClock.MinuteOptions>
    {({ minutes }) =>
      minutes.map((minute) => (
        <DigitalClock.Option value={minute} key={minute.toString()} />
      ))
    }
  </DigitalClock.MinuteOptions>
  <DigitalClock.MeridiemOptions>
    {({ meridiems }) =>
      meridiems.map((meridiem) => (
        <DigitalClock.Option value={meridiem} key={meridiem.toString()} />
      ))
    }
  </DigitalClock.MeridiemOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section - auto meridiem

### Without Material UI

The user can use the `useIs12HourCycleInCurrentLocale()` hook to know if the meridiem should be enabled based on the current locale and build the UI accordingly:

```tsx
function App(props) {
  const defaultAmpm = useIs12HourCycleInCurrentLocale();

  const { ampm = defaultAmpm, ...other } = props;

  return (
    <DigitalClock.Root {...other}>
      {ampm ? (
        <DigitalClock.HoursWithMeridiemOptions>
          {({ hours }) =>
            hours.map((hour) => (
              <DigitalClock.Option value={hour} key={hour.toString()} />
            ))
          }
        </DigitalClock.HoursWithMeridiemOptions>
      ) : (
        <DigitalClock.Hours>
          {({ hours }) =>
            hours.map((hour) => (
              <DigitalClock.Option value={hour} key={hour.toString()} />
            ))
          }
        </DigitalClock.Hours>
      )}
      <DigitalClock.MinuteOptions>
        {({ minutes }) =>
          minutes.map((minute) => (
            <DigitalClock.Option value={minute} key={minute.toString()} />
          ))
        }
      </DigitalClock.MinuteOptions>
      {ampm && (
        <DigitalClock.MeridiemOptions>
          {({ meridiems }) =>
            meridiems.map((meridiem) => (
              <DigitalClock.Option value={meridiem} key={meridiem.toString()} />
            ))
          }
        </DigitalClock.MeridiemOptions>
      )}
    </DigitalClock.Root>
  );
}
```

### With Material UI

TODO

## Multi section - with seconds

### Without Material UI

The user can use the `<DigitalClock.SecondOptions />` component to add a column to edit this section:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HourOptions>
    {({ hours }) =>
      hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
    }
  </DigitalClock.HourOptions>
  <DigitalClock.MinuteOptions>
    {({ minutes }) =>
      minutes.map((minute) => (
        <DigitalClock.Option value={minute} key={minute.toString()} />
      ))
    }
  </DigitalClock.MinuteOptions>
  <DigitalClock.SecondOptions>
    {({ seconds }) =>
      seconds.map((second) => (
        <DigitalClock.Option value={second} key={second.toString()} />
      ))
    }
  </DigitalClock.SecondOptions>
  <DigitalClock.MeridiemOptions>
    {({ meridiems }) =>
      meridiems.map((meridiem) => (
        <DigitalClock.Option value={meridiem} key={meridiem.toString()} />
      ))
    }
  </DigitalClock.MeridiemOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section - custom steps

### Without Material UI

The `<DigitalClock.Hours />`, `<DigitalClock.HoursWithMeridiem />`, `<DigitalClock.Minutes />` and `<DigitalClock.Seconds />` components take a `step` prop that allow to customize the step between two consecutive options.
By default, the step is of `1` for the hours and 5 for the minutes and seconds:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HourOptions>
    {({ hours }) =>
      hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
    }
  </DigitalClock.HourOptions>
  <DigitalClock.MinuteOptions step={15}>
    {({ minutes }) =>
      minutes.map((minute) => (
        <DigitalClock.Option value={minute} key={minute.toString()} />
      ))
    }
  </DigitalClock.MinuteOptions>
</DigitalClock.Root>
```

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HourOptions>
    {({ hours }) =>
      hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
    }
  </DigitalClock.HourOptions>
  <DigitalClock.MinuteOptions step={1}>
    {({ minutes }) =>
      minutes.map((minute) => (
        <DigitalClock.Option value={minute} key={minute.toString()} />
      ))
    }
  </DigitalClock.MinuteOptions>
  <DigitalClock.MinuteOptions step={10}>
    {({ minutes }) =>
      minutes.map((minute) => (
        <DigitalClock.Option value={minute} key={minute.toString()} />
      ))
    }
  </DigitalClock.MinuteOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section - custom format

### Without Material UI

By default, the `<DigitalClock.Option />` uses a default format provided by its parent (for example `<DigitalClock.MinuteOptions />`).
The user can override this format using the `format` prop:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HourOptions>
    {({ hours }) =>
      hours.map((hour) => (
        <DigitalClock.Option
          value={hour}
          key={hour.toString()}
          format="H" // Removes the trailing zero
        />
      ))
    }
  </DigitalClock.HourOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Single section

### Without Material UI

The user can use the `<DigitalClock.Options />` component to manually list options:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.Options>
    <DigitalClock.Option value={dayjs('2025-01-01T15:30')} />
    <DigitalClock.Option value={dayjs('2025-01-01T17:30')} />
    <DigitalClock.Option value={dayjs('2025-01-01T20:30')} />
  </DigitalClock.Options>
</DigitalClock.Root>
```

### With Material UI

TODO

## Anatomy of `DigitalClock.*`

### `DigitalClock.Root`

Top level component that wraps the other components.

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- **Value props**: `value`, `defaultValue`, `referenceDate`, `onChange`, `onError` and `timezone`.

  Same typing and behavior as today.

- **Validation props**: `maxTime`, `minTime`, `disableFuture`, `disablePast`, `shouldDisableTime`.

  Same typing and behavior as today.

- **Form props**: `disabled`, `readOnly`.

  Same typing and behavior as today.

- `autoFocus`: `boolean`

:::success
All the props that the picker can pass to the calendar (validation props, value props, etc...) are read both from the props and from `usePickerContext` so that the calendar can be used inside a picker built with composition.

That way, users only have to pass the props specific to the calendar to the `DigitalClock.*` components:

```tsx
<Picker.Root manager={manager} {...props} disablePast>
  <PickerField.Root>{/** See the field documentation */}</PickerField.Root>
  <Popover.Backdrop />
  <Popover.Positioner>
    <Popover.Popup>
      <DigitalClock.Root className="digital-clock-root">
        {/** See demo above */}
      </DigitalClock.Root>
    </Popover.Popup>
  </Popover.Positioner>
</Picker.Root>
```

:::

### `DigitalClock.Options`

Renders a list of options.

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

TODO

### `DigitalClock.HourOptions`

Renders a list of options to select the hours of the current value.

It expects a function as its children, which receives the list of hours as a parameter:

```tsx
<DigitalClock.HourOptions>
  {({ hours }) =>
    hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
  }
</DigitalClock.HourOptions>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { hours: PickerValidDate[] }) => React.ReactNode`

- `skipInvalid`: `boolean`, default: `false`
  If `true`, the invalid options are not rendered

### `DigitalClock.HoursWithMeridiemOptions`

Renders a list of options to select the hours of the current value.
The options will only be hours inside the same meridiem as the one currently selected, this component needs to be used in combination with `<DigitalClock.MeridiemOptions />`.

It expects a function as its children, which receives the list of hours as a parameter:

```tsx
<DigitalClock.HoursWithMeridiemOptions>
  {({ hours }) =>
    hours.map((hour) => <DigitalClock.Option value={hour} key={hour.toString()} />)
  }
</DigitalClock.HoursWithMeridiemOptions>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { hours: PickerValidDate[] }) => React.ReactNode`

- `skipInvalid`: `boolean`, default: `false`
  If `true`, the invalid options are not rendered

### `DigitalClock.MeridiemOptions`

Renders a list of options to select the meridiem of the current value.

It expects a function as its children, which receives the list of meridiems as a parameter:

```tsx
<DigitalClock.MeridiemOptions>
  {({ meridiems }) =>
    meridiems.map((meridiem) => (
      <DigitalClock.Option value={meridiem} key={meridiem.toString()} />
    ))
  }
</DigitalClock.MeridiemOptions>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { meridiems: PickerValidDate[] }) => React.ReactNode`

- `skipInvalid`: `boolean`, default: `false`
  If `true`, the invalid options are not rendered

### `DigitalClock.MinuteOptions`

Renders a list of options to select the minutes of the current value.

It expects a function as its children, which receives the list of minutes as a parameter:

```tsx
<DigitalClock.MinuteOptions>
  {({ minutes }) =>
    minutes.map((minute) => (
      <DigitalClock.Option value={minute} key={minute.toString()} />
    ))
  }
</DigitalClock.MinuteOptions>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { hours: PickerValidDate[] }) => React.ReactNode`

- `skipInvalid`: `boolean`, default: `false`
  If `true`, the invalid options are not rendered

### `DigitalClock.SecondOptions`

Renders a list of options to select the seconds of the current value.

It expects a function as its children, which receives the list of seconds as a parameter:

```tsx
<DigitalClock.SecondOptions>
  {({ seconds }) =>
    seconds.map((second) => (
      <DigitalClock.Option value={second} key={second.toString()} />
    ))
  }
</DigitalClock.SecondOptions>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { seconds: PickerValidDate[] }) => React.ReactNode`

- `skipInvalid`: `boolean`, default: `false`
  If `true`, the invalid options are not rendered

### `DigitalClock.Option`

Renders the button for a single option

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` **required**

- `format`: `string`, default: provided by the parent
