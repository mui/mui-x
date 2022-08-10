---
title: React Date Field component
---

# Date field

<p class="description">The date field let the user select a date with the keyboard.</p>

## Basic usage

{{"demo": "BasicDateField.js"}}

## Customize the input props

{{"demo": "CustomInputDateField.js"}}

## Customize the date management props

{{"demo": "CustomDateManagementDateField.js"}}

## When is `onChange` called

The `DateField` component has an internal state to update the visible date.
It will only call the `onChange` callback when the modified date is valid.

In the demo below, you can see that the component reacts to an external date update (when pressing "Set to today").
And that when debouncing the state (for instance if you have a server side persistence) do not affect the rendering of the field.

{{"demo": "DebouncedDateField.js"}}

## Headless usage

### With browser input

{{"demo": "CustomUIDateFieldBrowserInput.js", "defaultCodeOpen": false }}

### With `@mui/joy/TextField`

{{"demo": "CustomUIDateFieldJoy.js", "defaultCodeOpen": false }}
