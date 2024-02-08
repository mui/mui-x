---
productId: x-date-pickers
title: React Date Time Range Field components
components: MultiInputDateTimeRangeField, SingleInputDateTimeRangeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers-pro'
---

# Date Time Range Field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Date Time Range Field lets the user select a range of dates with an explicit starting and ending time with the keyboard.</p>

## Basic usage

:::info
All the topics covered below are applicable to both `SingleInputDateTimeRangeField` and `MultiInputDateTimeRangeField` unless explicitly mentioned.
:::

You can render your Date Time Range Field with either one input using `SingleInputDateTimeRangeField`
or two inputs using `MultiInputDateTimeRangeField` as show below.

{{"demo": "BasicDateTimeRangeField.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateTimeRangeFieldValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
