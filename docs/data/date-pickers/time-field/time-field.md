---
title: React Time Field component
---

# Time field

<p class="description">The time field let the user select a time with the keyboard.</p>

:::warning
This component is unstable.
We might do some breaking change on its props to have the best component possible by the time of the stable release.
:::

## Basic usage

{{"demo": "BasicTimeField.js"}}

## Uncontrolled vs. Controlled

The component can be controlled or uncontrolled

{{"demo": "TimeFieldValue.js"}}

## Customize the time format

{{"demo": "CustomTimeFormat.js"}}

## Localization

Use the `LocalizationProvider` to change the date-library locale used in the date field.

See the [localization documentation page](/react-date-pickers/localization/) for more details.

## Validation

See the documentation page [validation documentation page](/react-date-pickers/validation/) for more details.
