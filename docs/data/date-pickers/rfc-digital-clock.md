---
productId: x-date-pickers
title: DX - Digital Clock
---

# Digital Clock

<p class="description">This page describes how people can use time views with Material UI and how they can build custom time views.</p>

## Usage with single section

### Without Material UI

The user can use the `<DigitalClock.ContentForSingleSection />` component to list all the time options in a flat list:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.ContentForSingleSection>
    {({ items }) =>
      items.map((item) => <DigitalClock.Item value={item} key={item.toString()} />)
    }
  </DigitalClock.ContentForSingleSection>
</DigitalClock.Root>
```

### With Material UI

TODO

## Usage with multi section

### Without Material UI

The user can use the `<DigitalClock.ContentForMultiSection />` component to list all the time options with one column per view:

```tsx
<DigitalClock.Root value={value} onChange={setValue}>
  <DigitalClock.ContentForMultiSection>
    <DigitalClock.HoursList>
      {(hours) =>
        hours.map((hour) => <DigitalClock.Item value={hour} key={hour.toString()} />)
      }
    </DigitalClock.HoursList>
    <DigitalClock.MinutesList>
      {(minutes) =>
        minutes.map((minute) => (
          <DigitalClock.Item value={minute} key={minute.toString()} />
        ))
      }
    </DigitalClock.MinutesList>
    <DigitalClock.SecondsList>
      {(seconds) =>
        seconds.map((second) => (
          <DigitalClock.Item value={second} key={second.toString()} />
        ))
      }
    </DigitalClock.SecondsList>
    <DigitalClock.MeridiemList>
      {(meridiems) =>
        meridiems.map((meridiem) => (
          <DigitalClock.Item value={meridiem} key={meridiem.toString()} />
        ))
      }
    </DigitalClock.MeridiemList>
  </DigitalClock.ContentForMultiSection>
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

- `ampm`: `boolean`, default: `utils.is12HourCycleInCurrentLocale()`

:::success
All the props that the picker can pass to the calendar (validation props, value props, etc...) are read both from the props and from `usePickerContext` so that the calendar can be used inside a picker built with composition.

That way, users only have to pass the props specific to the calendar to the `DigitalClock.*` components:

```tsx
<Picker.Root manager={manager} {...props} disablePast>
  <PickerField.Root>{/** See the field documentation */}</PickerField.Root>
  <Popover.Backdrop />
  <Popover.Positioner>
    <Popover.Popup>
      <DigitalClock.Root>
        TODO FIX
        <Calendar.Days.Root fixedWeekNumber={6}>
          {/** See demo above */}
        </Calendar.Days.Root>
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
