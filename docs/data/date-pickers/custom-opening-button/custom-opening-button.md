---
productId: x-date-pickers
title: Date and Time Pickers - Custom opening button
---

# Custom opening button

<p class="description">The date picker lets you customize the button to open the views.</p>

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Set a custom opening icon

If you want to change the icon opening the picker without changing its behavior, you can use the `openPickerIcon` slot:

{{"component": "file://./demos/custom-opening-icon/index.ts"}}

You can also change the icon rendered based on the current status of the picker:

{{"component": "file://./demos/custom-opening-icon-conditional/index.ts"}}

## Pass props to the opening button

If you want to customize the opening button without redefining its whole behavior, you can use either:

- the `openPickerButton` slot to target the [`IconButton`](/material-ui/api/icon-button/) component.
- the `inputAdornment` slot to target the [`InputAdornment`](/material-ui/api/input-adornment/) component.

{{"component": "file://./demos/custom-props-opening-button/index.ts"}}

:::warning
If you want to track the opening of the picker, you should use the `onOpen` / `onClose` callbacks instead of modifying the opening button:

```tsx
<DatePicker onOpen={handleOpen} onClose={handleClose} />
```

:::

## Render the opening button at the start of the input

You can use the `openPickerButtonPosition` on the `field` slot to position the opening button at the start or the end of the input:

{{"component": "file://./demos/start-edge-opening-button/index.ts"}}

## Add an icon next to the opening button

If you want to add an icon next to the opening button, you can use the `inputAdornment` slot.
In the example below, the warning icon will be visible anytime the current value is invalid:

{{"component": "file://./demos/add-warning-icon-when-invalid/index.ts"}}

To add the same behavior to a picker that does not have an input adornment (for example, a Date Range Picker when used with a multi-input field),
you need to use the `textField` slot to add one:

{{"component": "file://./demos/add-warning-icon-when-invalid-range/index.ts"}}
