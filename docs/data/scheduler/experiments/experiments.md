---
productId: x-scheduler
title: Scheduler visual regression tests
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: StandaloneCompactDayView, StandaloneCompactThreeDayView, StandaloneCompactWeekView
---

# Experiments

<p class="description">Visual regression test pages for the Scheduler components.</p>

## Recurring event durations

{{"demo": "RecurringEventDurations.js", "bg": "inline", "defaultCodeOpen": false}}

## Timeline dependency arrows (#22855)

Finish-to-Start dependencies rendered as arrows on the timeline. The dataset covers every route shape: a straight arrow on the same lane, an elbow across rows that turns right before its target to avoid crossing other events, a short arrow between adjacent events, and S routes for successors starting before their predecessor ends. Drag or resize an event to see its arrows follow. The feature has no public API yet, so the demo feeds the internal store parameters.

{{"demo": "TimelineDependencyArrows.js", "bg": "inline", "defaultCodeOpen": false}}

## Month view multi-day overflow

### Continuation after overflow (#22735)

A multi-day event pushed into "+N more" should collapse to a lower free row and render as
one continuous bar once it runs alone, with a continuation arrow.

{{"demo": "MonthViewOverflowContinuation.js", "bg": "inline", "defaultCodeOpen": false}}

### Overflow persists when no row frees up

An overflow event that can never collapse should stay counted in "+N more" on every day it
crosses, not vanish after its first day.

{{"demo": "MonthViewOverflowPersist.js", "bg": "inline", "defaultCodeOpen": false}}

### Overflow button behind spanning bars

Two all-day events fill the visible rows; a new event on Jul 9 forces a "+N more" button
on a row a multi-day bar runs across. The button must stay visible and the bar must resurface
after it, not vanish for the rest of the week.

{{"demo": "MonthViewOverflowButtonOverlap.js", "bg": "inline", "defaultCodeOpen": false}}

## Compact (touch) views

Touch-optimized day/time-grid views for narrow widths, rendered here at a phone-like width.
Each view shows a fixed number of days and uses the touch event variant (title only, no time).

### Compact day view (1 day)

{{"demo": "CompactDayView.js", "bg": "inline", "defaultCodeOpen": false}}

### Compact three-day view (3 days)

{{"demo": "CompactThreeDayView.js", "bg": "inline", "defaultCodeOpen": false}}

### Compact week view (7 days)

{{"demo": "CompactWeekView.js", "bg": "inline", "defaultCodeOpen": false}}
