---
title: React Fields components
---

# Fields

<p class="description">The fields components let the user select a date / date range with the keyboard.</p>

:::warning
These components are unstable.
We might do some breaking change on their props to have the best components possible by the time of the stable release.
:::

## Introduction

The fields are React components that lets you enter a date with the keyboard, without any modal or drop down UI.

:::info
We are currently building new picker components based on those fields.
:::

### Fields to edit a single date

{{"demo": "SingleDateFieldExamples.js", "defaultCodeOpen": false}}

### Fields to edit a date range

{{"demo": "DateRangeFieldExamples.js", "defaultCodeOpen": false}}

## Form props

The standard form attributes (`disabled`, `readOnly`, `required`) are supported.

{{"demo": "FormProps.js"}}

## When is `onChange` called?

The field components have an internal state to update the visible value.

It will only call the `onChange` callback when all the sections of the modified date are filled.

### On simple fields

On a single date field (`DateField` / `DateTimeField` / `TimeField`),
`onChange` will be called if all the sections are filled.

In the example below, `onChange` will not be fired until the date is fully completed:

{{"demo": "LifeCycleDateFieldEmpty.js", "defaultCodeOpen": false}}

### On range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

On a date range field (`SingleInputDateRangeField` / `MultiInputDateRangeField`),
`onChange` will be called if all the sections of the date you modified are filled,
even if some sections of the other date are not filled.

In the demo below, changing the value of a start date section will fire `onChange` even if the end date is empty.
But changing the value of an end date section will not fire `onChange` until the end date is fully completed:

{{"demo": "LifeCycleDateRangeField.js", "defaultCodeOpen": false}}

## Advanced

### Control the selected sections

Use the `selectedSections` and `onSelectedSectionsChange` props to control which sections are currently being selected.

This prop accept four formats:

1. If a number is provided, the section at this index will be selected.
2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
4. If `null` is provided, no section will be selected

:::warning
You need to make sure the input is focused before imperatively updating the selected sections.
:::

{{"demo": "ControlledSelectedSections.js", "defaultCodeOpen": false }}

:::warning
For range fields, you will not be able to use the string format since each section is present twice.
We will add new apis in the future to better support this use case.
:::

### Headless usage

{{"demo": "CustomUIDateField.js", "defaultCodeOpen": false }}
