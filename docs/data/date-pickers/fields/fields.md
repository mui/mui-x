---
product: date-pickers
title: React Fields components
components: DateField, TimeField, DateTimeField, MultiInputDateRangeField, SingleInputDateRangeField, MultiInputTimeRangeField, MultiInputDateTimeRangeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Fields

<p class="description">The field components let the user input date and time values with a keyboard and refined keyboard navigation.</p>

:::warning
These components are unstable.
They might receive breaking changes on their props to have the best components possible by the time of the stable release.
:::

## Introduction

The fields are React components that let you enter a date or time with the keyboard, without using any modal or dropdown UI.
They provide refined navigation through arrow keys and support advanced behaviors like localization and validation.

:::warning
The field components requires an adapter imported from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`.

```diff
-import AdapterDayjs from '@date-io/dayjs';
+import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
```

:::

### Fields to edit a single element

{{"demo": "SingleDateFieldExamples.js", "defaultCodeOpen": false}}

### Fields to edit a range [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

All fields to edit a range are available in a single input version and in a multi input version.

:::info
The single input version of the Time Range Field and the Date Time Range Field will soon be available.
:::

{{"demo": "DateRangeFieldExamples.js", "defaultCodeOpen": false}}

### Usage with the pickers

The picker components (`DatePicker`, `DestkopDatePicker`, `MobileDatePicker`, `DateTimePicker`, ...) do not use the field components yet.

New pickers using them will be released in a few months.

## Form props

The standard form attributes (`disabled`, `readOnly`) are supported by all the field components:

{{"demo": "FormProps.js", "defaultCodeOpen": false}}

## Advanced

### When is `onChange` called?

The field components have an internal state to update the visible value.

It will only call the `onChange` callback when all the sections of the modified date are filled.

#### On single element fields

On a single date field (`DateField` / `DateTimeField` / `TimeField`),
`onChange` will be called if all the sections are filled.

In the example below, `onChange` will not be fired until the date is fully completed:

{{"demo": "LifeCycleDateFieldEmpty.js", "defaultCodeOpen": false}}

#### On range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

On a date range field (`SingleInputDateRangeField` / `MultiInputDateRangeField`),
`onChange` will be called if all the sections of the date you modified are filled,
even if some sections of the other date are not filled.

In the demo below, changing the value of a start date section will fire `onChange` even if the end date is empty.
But changing the value of an end date section will not fire `onChange` until the end date is fully completed:

{{"demo": "LifeCycleDateRangeField.js", "defaultCodeOpen": false}}

#### Only update when the value is valid

The `onChange` callback received a 2nd parameter containing the validation error associated to the current value.
If you only want to update your state when the value is valid, you can ignore any `onChange` call with a non-null `validationError`.

In the example below, `onChange` will only be fired if the date is valid and its year is 2022:

{{"demo": "LifeCycleIgnoreInvalidValue.js"}}

### Control the selected sections

Use the `selectedSections` and `onSelectedSectionsChange` props to control which sections are currently being selected.

This prop accepts four formats:

1. If a number is provided, the section at this index will be selected.
2. If an object with a `startIndex` and `endIndex` fields are provided, the sections between those two indexes will be selected.
3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
4. If `null` is provided, no section will be selected

:::warning
You need to make sure the input is focused before imperatively updating the selected sections.
:::

{{"demo": "ControlledSelectedSections.js", "defaultCodeOpen": false }}

:::warning
For range fields, you can't use the string format since each section is present twice.
We will add new apis in the future to better support this use case.
:::
