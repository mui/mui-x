---
title: React Date Field component
---

# Date field

<p class="description">The date time field lets the user select a date and a time with the keyboard.</p>

:::warning
This component is unstable.
We might do some breaking change on its props to have the best component possible by the time of the stable release.
:::

## Basic usage

{{"demo": "BasicDateTimeField.js"}}

## Uncontrolled vs. Controlled

The component can be controlled or uncontrolled

{{"demo": "DateTimeFieldValue.js"}}

## Customize the date time format

{{"demo": "CustomDateTimeFormat.js"}}

## Localization

Use the `LocalizationProvider` to change the date-library locale used in the date time field.

See the [localization documentation page](/react-date-pickers/localization/) for more details.

## Validation

See the documentation page [validation documentation page](/react-date-pickers/validation/) for more details.
