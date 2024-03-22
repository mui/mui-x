---
productId: x-date-pickers
title: React Digital Clock component
components: DigitalClock, MultiSectionDigitalClock
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
---

# Digital Clock

<p class="description">The Digital Clock lets the user select a time without any input or popper / modal.</p>

## Description

There are two component versions for different cases. The `DigitalClock` handles selection of a single time instance in one step, just like a `select` component. The `MultiSectionDigitalClock` allows selecting time using separate sections for separate views.

The `DigitalClock` is more appropriate when there is a limited number of time options needed, while the `MultiSectionDigitalClock` is suited for cases when a more granular time selection is needed.

## Basic usage

{{"demo": "DigitalClockBasic.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DigitalClockValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Form props

The components can be disabled or read-only.

{{"demo": "DigitalClockFormProps.js"}}

## Views

The `MultiSectionDigitalClock` component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"demo": "DigitalClockViews.js"}}

## 12h/24h format

The components use the hour format of the locale's time setting, that is the 12-hour or 24-hour format.

You can force a specific format using the `ampm` prop.

You can find more information about 12h/24h format in the [Date localization page](/x/react-date-pickers/adapters-locale/#meridiem-12h-24h-format).

{{"demo": "DigitalClockAmPm.js"}}

## Time steps

By default, the components list the time options in the following way:

- `DigitalClock` in `30` minutes intervals;
- `MultiSectionDigitalClock` component in `5` unit (`minutes` or `seconds`) intervals;

You can set the desired interval using the `timeStep` and `timeSteps` props.
The prop accepts:

- The `DigitalClock` component accepts a `number` value `timeStep` prop;
- The `MultiSectionDigitalClock` component accepts a `timeSteps` prop with `number` values for `hours`, `minutes`, or `seconds` units;

{{"demo": "DigitalClockTimeStep.js"}}

## Skip rendering disabled options

With the `skipDisabled` prop, the components don't render options that are not available to the user (for example through `minTime`, `maxTime`, `shouldDisabledTime` etc.).

The following example combines these properties to customize which options are rendered.

- The first component does not show options before `9:00` (the value of `minTime`).
- The second one shows options between `09:00` and `13:20` thanks to `shouldDisableTime`.

{{"demo": "DigitalClockSkipDisabled.js"}}

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
