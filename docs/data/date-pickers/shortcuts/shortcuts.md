---
product: date-pickers
title: Date and Time pickers - Shortcuts
---

# Shortcuts

<p class="description">The date picker lets you add custom shortcuts.</p>

## Adding shortcuts

By default, pickers use the `PickersShortcuts` component to display shortcuts.
This component accepts a `shortcurs` prop as an array of `PickersShortcutsItem`.
Those items are made of two required attributes:

- `label`: The string displayed on the shortcut chip. This property must be unique.
- `getValue`: A function that returns the value associated to the shortcut.

You can use `componentsProps.shortcus` to customize this props. For example to add a shortcut to Christmas Day, you can do the following:

```jsx
<DatePicker
  componentsProps={{
    shortcuts: {
      shortcuts: [
        {
          label: 'Chrismas',
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

By default, the shortcuts are disabled if the returned value does not pass validation. Here is an example where `minDate` is set to the middle of the year.

{{"demo": "DisabledDatesShortcuts.js", "bg": "inline"}}

## Range shortcuts [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

Shortcuts on range pickers require `getValue` property to return an array with two values.

{{"demo": "BasicRangeShortcuts.js", "bg": "inline"}}

## Shortcuts parameters

The `getValue` receives some parameters in an object:

- `value`
- `view`
- `isValid`

:::info

Review message

My initial idea was to adapt the shortcut depending on:

- The current value. For example "next week"
- the validation parameters. Next available week-end

But it's not necessary the best way to do that. Maybe using slot callback would be more interesting, because this technic does nto allows to:

- modify shortcuts order
- remove/add shortcuts depending on the displayed view

:::
