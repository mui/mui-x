---
productId: x-date-pickers
title: DX - Digital Clock
---

# Digital Clock

<p class="description">This page describes how people can use time views with Material UI and how they can build custom time views.</p>

## Single section

### Without Material UI

The user can use the `<DigitalClock.Options />` component to list all the time options in a flat list:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.Options>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={item} key={option.toString()} />
      ))
    }
  </DigitalClock.Options>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section (no meridiem)

### Without Material UI

The user can use the `<DigitalClock.HoursOptions />`, `<DigitalClock.MinutesOptions />` and `<DigitalClock.SecondsOptions />` components to list all the time options with one column per view:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HoursOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.HoursOptions>
  <DigitalClock.MinutesOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.MinutesOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section (meridiem)

### Without Material UI

The user can use the `<DigitalClock.MeridiemOptions />` component to add a column to edit this section.
It should be used in combination with the `<DigitalClock.HoursWithMeridiemOptions />` component:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HoursWithMeridiemOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.HoursWithMeridiemOptions>
  <DigitalClock.MinutesOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.MinutesOptions>
  <DigitalClock.MeridiemOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.MeridiemOptions>
</DigitalClock.Root>
```

### With Material UI

TODO

## Multi section (seconds)

### Without Material UI

The user can use the `<DigitalClock.SecondsOptions />` component to add a column to edit this section:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.HoursOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.HoursOptions>
  <DigitalClock.MinutesOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.MinutesOptions>
  <DigitalClock.SecondsOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.SecondsOptions>
  <DigitalClock.MeridiemOptions>
    {({ options }) =>
      options.map((option) => (
        <DigitalClock.Option value={option} key={option.toString()} />
      ))
    }
  </DigitalClock.MeridiemOptions>
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

- **Validation props**: `maxTime`, `minTime`, `disableFuture`, `disablePast`, `shouldDisableTime`, `timeSteps`.

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

### `DigitalClock.ContentForSingleSection`

#### Props

TODO

### `DigitalClock.ContentForMultiSection`

#### Props

TODO

### `DigitalClock.Item`

#### Props

TODO
