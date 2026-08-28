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

## Timeline dependency arrows (#22855, #22856, #22858)

Finish-to-Start dependencies on the timeline. The dataset covers every route shape: a straight arrow on the same lane, an elbow across rows that turns right before its target to avoid crossing other events, a short arrow between adjacent events, and S routes for successors starting before their predecessor ends. Drag or resize an event to see its arrows follow. Hover an event and drag the terminal on its end edge onto another event to create a dependency — dropping on a duplicate link or on one that would close a cycle (for example, reversing an existing dependency) is rejected with a transient toast, and dropping on empty space cancels the gesture. Click an arrow to select it, then delete it with its button or the Delete/Backspace keys; Escape or clicking away deselects. `Handoff` belongs to two resources: its dependencies draw one arrow per pair of row appearances, each terminal drags from its own row, and selecting any of its arrows reveals a delete button on each. The feature has no public API yet, so the demo feeds the internal store parameters.

{{"demo": "TimelineDependencyArrows.js", "bg": "inline", "defaultCodeOpen": false}}

## Timeline auto-scheduling (#22857, #22858)

The Finish-to-Start auto-scheduling engine. Moving or resizing an event pushes its violated successors forward on the drop, transitively, as one atomic change — and only when the relationship is actually broken: dragging `Plan` slightly to the right lands inside `Build`'s slack and moves nothing, dragging it well past `Build`'s start pushes the whole chain. Moving a predecessor earlier never pulls its successors back. Dropping a successor onto or before its predecessor snaps it forward to the first valid position: a drop cannot leave a violated arrow — what can move is moved, and a change that would need to move a read-only event is rejected with a transient toast. Violations already present in the data are left as-is. The `Design` diamond reconverges on `Integrate`, which settles once behind the later of its two branches. `Audit` is read-only: dropping `Setup` onto it is rejected with a transient toast, since the constraint could not be restored. The all-day pair shifts by whole days and stays all-day. Dragging a terminal to close a cycle (for example `Deploy` onto `Plan`) is rejected with a transient toast. The feature has no public API yet, so the demo feeds the internal store parameters.

{{"demo": "TimelineAutoScheduling.js", "bg": "inline", "defaultCodeOpen": false}}

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
