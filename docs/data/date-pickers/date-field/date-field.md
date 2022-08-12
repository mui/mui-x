---
title: React Date Field component
---

# Date field

<p class="description">The date field let the user select a date with the keyboard.</p>

:::warning
This component is in a very early stage.
It should not be used in a production setup.
:::

## Basic usage

{{"demo": "BasicDateField.js"}}

## Uncontrolled vs. Controlled

The component can be controlled or uncontrolled

{{"demo": "DateFieldValue.js"}}

## Customize the input props

{{"demo": "CustomInputProps.js"}}

## Customize the date format

{{"demo": "CustomDateFormat.js"}}

## Localization

{{"demo": "LocalizedDateField.js"}}

## Date validation

The `DateField` component supports all the date validation props described in the _validation page_

_TODO: Add link to the future standalone validation doc page_

_TODO: Add time validation examples when supported_

{{"demo": "DateFieldValidation.js"}}

## When is `onChange` called

The `DateField` component has an internal state to update the visible date.
It will only call the `onChange` callback when the modified date is valid.

In the demo below, you can see that the component reacts to an external date update (when pressing "Set to today").
And that when debouncing the state (for instance if you have a server side persistence) do not affect the rendering of the field.

{{"demo": "DebouncedDateField.js"}}

## Headless usage

{{"demo": "CustomUIDateField.js", "defaultCodeOpen": false }}
