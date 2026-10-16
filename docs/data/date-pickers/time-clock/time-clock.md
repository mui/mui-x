---
productId: x-date-pickers
title: React Time Clock component
components: TimeClock
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
---

# Time Clock

<p class="description">The Time Clock component lets the user select a time without any input or popper / modal.</p>

## Basic usage

{{"component": "file://./demos/basic-time-clock/index.ts"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"component": "file://./demos/time-clock-value/index.ts"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Form props

The component can be disabled or read-only.

{{"component": "file://./demos/time-clock-form-props/index.ts"}}

## Views

The component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"component": "file://./demos/time-clock-views/index.ts"}}

## 12h/24h format

The component uses the hour format of the locale's time setting, that is the 12-hour or 24-hour format.

You can force a specific format using the `ampm` prop.

You can find more information about 12h/24h format in the [Date localization page](/x/react-date-pickers/adapters-locale/#meridiem-12h-24h-format).

{{"component": "file://./demos/time-clock-am-pm/index.ts"}}

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
