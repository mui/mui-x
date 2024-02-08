---
productId: x-date-pickers
title: React Time Field component
components: TimeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Time Field

<p class="description">The Time Field component lets the user select a time with the keyboard.</p>

## Basic usage

{{"demo": "BasicTimeField.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "TimeFieldValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Customize the time format

{{"demo": "CustomTimeFormat.js"}}

## Localization

You can find the documentation about localization in the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) pages.

## Validation

See the documentation page [validation documentation page](/x/react-date-pickers/validation/) for more details.
