---
productId: x-date-pickers
title: React Time Range Field components
components: MultiInputTimeRangeField, SingleInputTimeRangeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers-pro'
---

# Time Range Field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Time Range Field lets the user select a range of time with the keyboard.</p>

## Basic usage

:::info
All the topics covered below are applicable to both `SingleInputTimeRangeField` and `MultiInputTimeRangeField` unless explicitly mentioned.
:::

You can render your Time Range Field with either one input using `SingleInputTimeRangeField`
or two inputs using `MultiInputTimeRangeField` as show below.

{{"demo": "BasicTimeRangeField.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "TimeRangeFieldValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
