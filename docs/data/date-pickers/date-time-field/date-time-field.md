---
productId: x-date-pickers
title: React Date Field component
components: DateTimeField
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers'
---

# Date Time Field

<p class="description">The Date Time Field component lets users select a date and a time with the keyboard.</p>

## Basic usage

{{"component": "file://./demos/basic-date-time-field/index.ts"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"component": "file://./demos/date-time-field-value/index.ts"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

### Customize the date time format

{{"component": "file://./demos/custom-date-time-format/index.ts"}}

:::info
See [Date format and localization—Custom formats](/x/react-date-pickers/adapters-locale/#custom-formats) for more details.
:::

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
