---
productId: x-date-pickers
title: Date and Time Pickers - Shortcuts
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
  slotProps={{
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

### Use validation to get the value

The `getValue` methods receive a `isValid` helper function.
You can use it to test if a value is valid or not based on the [validation props](/x/react-date-pickers/validation/).

In the following demonstration, it is used to get the next available week and weekend.

{{"demo": "AdvancedRangeShortcuts.js", "bg": "inline"}}

### Know which shortcut has been selected

The `onChange` callback receives the shortcut as a property of it's second argument.
You can use it to know, which shortcut has been chosen:

{{"demo": "OnChangeShortcutLabel.js", "bg": "inline"}}

## Behavior when selecting a shortcut

You can change the behavior when selecting a shortcut using the `changeImportance` property:

- `"accept"` (_default value_): fires `onChange`, fires `onAccept` and closes the picker.
- `"set"`: fires `onChange` but do not fire `onAccept` and does not close the picker.

{{"demo": "ChangeImportance.js", "bg": "inline"}}

## Customization

Like other [layout's subcomponent](/x/react-date-pickers/custom-layout/), the shortcuts can be customized.
Here is an example with horizontal shortcuts.

{{"demo": "CustomizedRangeShortcuts.js", "bg": "inline"}}
