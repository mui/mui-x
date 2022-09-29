---
title: React Date Field component
---

# Date field

<p class="description">The date field let the user select a date with the keyboard.</p>

:::warning
This component is unstable.
We might do some breaking change on its props to have the best component possible by the time of the stable release.
:::

## Basic usage

{{"demo": "BasicDateField.js"}}

## Uncontrolled vs. Controlled

The component can be controlled or uncontrolled

{{"demo": "DateFieldValue.js"}}

## Customize the date format

{{"demo": "CustomTimeFormat.js"}}

## Localization

Use the `LocalizationProvider` to change the date-library locale used in the time field.

See the [localization documentation page](/react-date-pickers/localization/) for more details.

## Validation

See the documentation page [validation documentation page](/react-date-pickers/validation/) for more details.
