---
productId: x-date-pickers
title: Date and Time Pickers - Custom opening button
---

# Custom opening button

<p class="description">The date picker lets you customize the button to open the views.</p>

## Set a custom opening icon

If you want to change the icon opening the picker without changing its behavior, you can use the `openPickerIcon` slot:

{{"demo": "CustomOpeningIcon.js"}}

You can also change the icon rendered based on the current status of the picker:

{{"demo": "CustomOpeningIconConditional.js"}}

## Pass props to the opening button

If you want to customize the opening button without redefining its whole behavior, you can use either:

- the `openPickerButton` slot to target the [`IconButton`](/material-ui/api/icon-button/) component.
- the `inputAdornment` slot to target the [`InputAdornment`](/material-ui/api/input-adornment/) component.

{{"demo": "CustomPropsOpeningButton.js"}}

:::warning
If you want to track the opening of the picker, you should use the `onOpen` / `onClose` callbacks instead of modifying the opening button:

```tsx
<DatePicker onOpen={handleOpen} onClose={handleClose} />
```

:::

## Add an icon next to the opening button

If you want to add an icon next to the opening button, you can use the `inputAdornment` slot.
In the example below, the warning icon will be visible anytime the current value is invalid:

{{"demo": "AddWarningIconWhenInvalid.js"}}

To add the same behavior to a picker that do not have an input adornment (e.g: Date Range Picker),
you need to use the `textField` slot to add one:

{{"demo": "AddWarningIconWhenInvalidRange.js"}}
