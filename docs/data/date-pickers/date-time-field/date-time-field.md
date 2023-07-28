---
productId: x-date-pickers
title: React Date Field component
components: DateTimeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Date Time Field

<p class="description">The Date Time Field component lets the user select a date and a time with the keyboard.</p>

## Basic usage

{{"demo": "BasicDateTimeField.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateTimeFieldValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Customize the date time format

{{"demo": "CustomDateTimeFormat.js"}}

## Localization

Use the `LocalizationProvider` to change the date-library locale used in the date time field.
See the [localization documentation page](/x/react-date-pickers/localization/) for more details.

## Validation

See the documentation page [validation documentation page](/x/react-date-pickers/validation/) for more details.
