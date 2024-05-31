---
productId: x-date-pickers
title: Date and Time Pickers - Custom views
components: PickersCalendarHeader, PickersRangeCalendarHeader, PickersMonth
---

# Custom views

<p class="description">Learn how to override the default DOM structure of the views.</p>

## Calendar header

The calendar header is available on any component that renders a calendar to select a date or a range of dates.
It allows the user to navigate through months and to switch to the month and year views when available.

### Component props

You can pass props to the calendar header as shown below:

{{"demo": "CalendarHeaderComponentProps.js", "defaultCodeOpen": false}}

### Component

You can pass custom components to replace the header, as shown below:

{{"demo": "CalendarHeaderComponent.js", "defaultCodeOpen": false}}

When used with a date range component,
you receive three additional props to let you handle scenarios where multiple months are rendered:

- `calendars`: The number of calendars rendered
- `month`: The month used for the header being rendered
- `monthIndex`: The index of the month used for the header being rendered

The demo below shows how to navigate the months two by two:

{{"demo": "CalendarHeaderComponentRange.js", "defaultCodeOpen": false}}

## Month button

### Component props

You can pass props to the month button as shown below:

{{"demo": "MonthButtonComponentProps.js"}}

### Component

You can pass custom components to replace the month button, as shown below:

{{"demo": "MonthButtonComponent.js"}}
