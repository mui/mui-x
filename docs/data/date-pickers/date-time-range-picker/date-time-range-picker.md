---
productId: x-date-pickers
title: React Date Time Range Picker component
components: DateTimeRangePicker, DesktopDateTimeRangePicker, MobileDateTimeRangePicker, StaticDateTimeRangePicker, DateRangeCalendar, DateRangePickerDay, DigitalClock, MultiSectionDigitalClock
githubLabel: 'component: DateTimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Date Time Range Picker let the user select a range of dates with an explicit starting and ending time.</p>

## Basic usage

{{"demo": "BasicDateTimeRangePicker.js"}}

## Component composition

The component is built using the `MultiInputDateTimeRangeField` for the keyboard editing, the `DateRangeCalendar` for the date view editing and `DigitalClock` for the time view editing.
All the documented props of those two components can also be passed to the Date Range Picker component.

Check-out their documentation page for more information:

- [Date Time Range Field](/x/react-date-pickers/date-time-range-field/)
- [Date Range Calendar](/x/react-date-pickers/date-range-calendar/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)
