---
title: React Fields components
---

# Fields

<p class="description">The fields components let the user select a date / date range with the keyboard.</p>

:::warning
These components are in a very early stage.
They should not be used in a production setup.
:::

## Customize the input props

All the field components supports the input props

{{"demo": "CustomInputProps.js"}}

## When is `onChange` called

The `DateField` component has an internal state to update the visible date.
It will only call the `onChange` callback when the modified date is valid.

In the demo below, you can see that the component reacts to an external date update (when pressing "Set to today").
And that when debouncing the state (for instance if you have a server side persistence) do not affect the rendering of the field.

{{"demo": "DebouncedDateField.js", "defaultCodeOpen": false}}

## Advanced

### Control the selected sections

Use the `selectedSections` and `onSelectedSectionsChange` props to control which sections are currently being selected.

This prop accept four formats:

1. If a number is provided, the section at this index will be selected.
2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
4. If `null` is provided, no section will be selected

:::warning
You need to make sure the input is focused before imperatively updating the selected sections.
:::

{{"demo": "ControlledSelectedSections.js", "defaultCodeOpen": false }}
