---
product: date-pickers
title: Date and Time pickers - Shortcuts
components: PickersShortcuts
---

# Shortcuts

<p class="description">The date picker lets you add custom shortcuts.</p>

## Adding shortcuts

By default, pickers use the `PickersShortcuts` component to display shortcuts.
This component accepts a `shortcuts` prop as an array of `PickersShortcutsItem`.
Those items are made of two required attributes:

- `label`: The string displayed on the shortcut chip. This property must be unique.
- `getValue`: A function that returns the value associated to the shortcut.

You can use `slotProps.shortcuts` to customize this prop. For example to add a shortcut to Christmas Day, you can do the following:

```jsx
<DatePicker
  componentsProps={{
    shortcuts: {
      items: [
        {
          label: 'Christmas',
          getValue: () => {
            return dayjs(new Date(2023, 11, 25));
          },
        },
      ],
    },
  }}
/>
```

{{"demo": "BasicShortcuts.js", "bg": "inline"}}

## Disabled dates

By default, the shortcuts are disabled if the returned value does not pass validation.
Here is an example where `minDate` is set to the middle of the year.

{{"demo": "DisabledDatesShortcuts.js", "bg": "inline"}}

## Range shortcuts [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

Shortcuts on range pickers require `getValue` property to return an array with two values.

{{"demo": "BasicRangeShortcuts.js", "bg": "inline"}}

## Advanced shortcuts

The `getValue` methods receive a `isValid` helper function.
You can use it to test if a value is valid or not based on the [validation props](/x/react-date-pickers/validation/).

In the following demonstration, it is used to get the next available week and weekend.

{{"demo": "AdvancedRangeShortcuts.js", "bg": "inline"}}

## Customization

Like other [layout's subcomponent](/x/react-date-pickers/custom-layout/), the shortcuts can be customized.
Here is an example with horizontal shortcuts.

{{"demo": "CustomizedRangeShortcuts.js", "bg": "inline"}}
