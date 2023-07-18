---
productId: x-date-pickers
title: React Date Fields components
components: DateField, TimeField, DateTimeField, MultiInputDateRangeField, SingleInputDateRangeField, MultiInputTimeRangeField, SingleInputTimeRangeField, MultiInputDateTimeRangeField, SingleInputDateTimeRangeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Fields component

<p class="description">The field components let the user input date and time values with a keyboard and refined keyboard navigation.</p>

## Introduction

The fields are React components that let you enter a date or time with the keyboard, without using any popover or modal UI.
They provide refined navigation through arrow keys and support advanced behaviors like localization and validation.

### Fields to edit a single element

{{"demo": "SingleDateFieldExamples.js", "defaultCodeOpen": false}}

### Fields to edit a range [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

All fields to edit a range are available in a single input version and in a multi input version.

{{"demo": "DateRangeFieldExamples.js", "defaultCodeOpen": false}}

## Advanced

### What is a section?

In the field components, the date is divided into several sections, each one responsible for the edition of a date token.
For example, if the format passed to the field is `MM/DD/YYYY`, the field will create 3 sections:

- A `month` section for the token `MM`
- A `day` section for the token `DD`
- A `year` section for the token `YYYY`

Those sections are independent, pressing <kbd class="key">ArrowUp</kbd> while focusing the `day` section will add one day to the date, but it will never change the month or the year.

### Control the selected sections

Use the `selectedSections` and `onSelectedSectionsChange` props to control which sections are currently being selected.

This prop accepts the following formats:

1. If a number is provided, the section at this index will be selected.
2. If `"all"` is provided, all the sections will be selected.
3. If an object with a `startIndex` and `endIndex` fields are provided, the sections between those two indexes will be selected.
4. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
5. If `null` is provided, no section will be selected

:::warning
You need to make sure the input is focused before imperatively updating the selected sections.
:::

{{"demo": "ControlledSelectedSections.js", "defaultCodeOpen": false }}

#### Usage with multi input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

For multi input range fields, you just have to make sure that the right input is focused before updating the selected section(s).
Otherwise, the section(s) might be selected on the wrong input.

{{"demo": "ControlledSelectedSectionsMultiInputRangeField.js", "defaultCodeOpen": false }}

#### Usage with single input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

For single input range fields, you won't be able to use the section name to select a single section because each section is present both in the start and in the end date.
Instead, you can pass the index of the section using the `unstableFieldRef` prop to access the full list of sections:

:::warning
The `unstableFieldRef` is not stable yet. More specifically, the shape of the `section` object might be modified in the near future.
Please only use it if needed.
:::

{{"demo": "ControlledSelectedSectionsSingleInputRangeField.js", "defaultCodeOpen": false }}
