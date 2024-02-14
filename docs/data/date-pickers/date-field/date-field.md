---
productId: x-date-pickers
title: React Date Field component
components: DateField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Date Field

<p class="description">The Date Field component lets users select a date with the keyboard.</p>

## Basic usage

{{"demo": "BasicDateField.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateFieldValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

### Customize the date format

{{"demo": "CustomDateFormat.js"}}

:::info
See [Date format and localization—Custom formats](/x/react-date-pickers/adapters-locale/#custom-formats) for more details.
:::

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
