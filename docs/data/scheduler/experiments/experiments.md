---
productId: x-scheduler
title: Scheduler visual regression tests
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: StandaloneCompactDayViewPremium, StandaloneCompactThreeDayViewPremium, StandaloneCompactWeekViewPremium
---

# Experiments

<p class="description">Visual regression test pages for the Scheduler components.</p>

## Recurring event durations

{{"demo": "RecurringEventDurations.js", "bg": "inline", "defaultCodeOpen": false}}

## Timeline dependency arrows (#22855, #22856, #22858, #23394)

Dependencies of the four types on the timeline, on a release day dataset where every arrow shape appears once: a short arrow between adjacent events, a straight arrow along a row, elbows across rows, the wraps of a Start-to-Start (`API design` → `Test plan`) and of Finish-to-Finish links (`UI` → `Guide`), the backward S of a violated Finish-to-Start (`Testing` → `Notes`) and the mirrored S of a Start-to-Finish link (`Deploy` → `On-call shift`). Drag or resize an event to see its arrows follow. Hover an event to reveal a terminal on each edge, and drag one onto another event to create a dependency: the dragged edge and the dropped edge define the type. Dropping on the event body targets its start edge; while the gesture hovers a target, its terminals show and the one the drop would land on is highlighted. A duplicate of the same type or a link that would close a cycle is rejected with a transient toast, and dropping on empty space cancels the gesture. Click an arrow to select it, then delete it with its button or the Delete/Backspace keys; Escape or clicking away deselects. `Sync` belongs to three resources: its dependency draws one arrow per row appearance, each terminal drags from its own row, and selecting any of its arrows reveals a delete button on each. The feature has no public API yet, so the demo feeds the internal store parameters.

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
