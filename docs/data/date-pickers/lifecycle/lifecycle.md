---
product: date-pickers
title: Components lifecycle
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Components lifecycle

<p class="description">This page explains when callbacks like `onChange`, `onAccept`, `onOpen` or `onClose` are called.</p>

## When is `onChange` called on fields?

:::info
The information below are applicable on standalone fields (when rendering `<DateField />`),
but also on pickers for the field editing (when rendering `<DatePicker />` and using the input to edit the value).
:::

The field components have an internal state to update the visible value.

It will only call the `onChange` callback when:

- the user fills one section of an empty input. The value equals `Invalid date`.
- the user completes all sections of an input. The value reflects the input.
- the user cleans one section of a completed input. The value equals `Invalid date`.
- the user cleans all sections of an input. The value equals `null`.

In the example below, `onChange` will be called when any of the conditions are triggered:

{{"demo": "LifeCycleDateFieldEmpty.js", "defaultCodeOpen": false}}

## When is `onChange` called on range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

On range fields (`SingleInputDateRangeField` / `MultiInputDateRangeField` / ... ),
`onChange` will be called if the date you are modifying is matching one of the condition above,
even if the other date does not.

In the example below, changing the value of the start date section will call `onChange` even if the end date is empty or partially filled.

{{"demo": "LifeCycleDateRangeField.js", "defaultCodeOpen": false}}

## When is `onChange` called on views ?

## Only update when the value is valid

The `onChange` callback received a 2nd parameter containing the validation error associated to the current value.
If you only want to update your state when the value is valid, you can ignore any `onChange` call with a non-null `validationError`.

In the example below, `onChange` will only be called if the date is valid and its year is 2022:

{{"demo": "LifeCycleIgnoreInvalidValue.js"}}
