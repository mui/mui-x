---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Dependencies

<p class="description">Link events so that one can't start or finish before another, and let the Event Timeline reschedule the linked events when their predecessors move.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

A dependency links two events: the predecessor (`source`) and the successor (`target`).
The Event Timeline draws each dependency as an arrow, and moves the successor later when a change to the predecessor would break the dependency.

{{"demo": "DependenciesOverview.js", "bg": "inline", "defaultCodeOpen": false}}

## Enable dependencies

Pass the `dependencies` feature to the `features` prop, and the dependencies to the `dependencies` prop.
The `dependencies` prop is controlled: update it from `onDependenciesChange` to keep the dependencies created, edited, or deleted in the Event Timeline.

```tsx
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { dependenciesFeature } from '@mui/x-scheduler-premium/dependencies';

const features = { dependencies: dependenciesFeature };

function App() {
  const [dependencies, setDependencies] = React.useState(initialDependencies);

  return (
    <EventTimelinePremium
      features={features}
      dependencies={dependencies}
      onDependenciesChange={setDependencies}
      // ...other props
    />
  );
}
```

:::info
The features are read once, when the Event Timeline mounts.
Define the `features` object outside of the component, or memoize it.
:::

Without the feature, the `dependencies` prop is ignored.
With it, any value, even an empty array, enables the arrows and the creation of dependencies.

## Dependency model

```ts
const dependency = {
  id: 'd1',
  source: 'design', // The id of the predecessor event
  target: 'build', // The id of the successor event
  type: 'FinishToStart',
  lag: 2, // Optional, defaults to 0
  lagUnit: 'hour', // Optional, defaults to 'day'
};
```

The `type` sets which edge of each event the dependency constrains:

| Type             | The successor can't…                    |
| :--------------- | :-------------------------------------- |
| `FinishToStart`  | start before the predecessor finishes.  |
| `StartToStart`   | start before the predecessor starts.    |
| `FinishToFinish` | finish before the predecessor finishes. |
| `StartToFinish`  | finish before the predecessor starts.   |

## Create dependencies

Hover an event to show a terminal on each of its edges.
Drag from a terminal and drop it on another event to create a dependency:

- Dropping it on a terminal links the two edges: from the end of an event to the start of another creates a `FinishToStart` dependency.
- Dropping it on the event itself links to its start.

Press <kbd class="key">Escape</kbd>, or drop it on an empty area, to cancel.

{{"demo": "DependencyCreation.js", "bg": "inline"}}

If the new dependency is already broken, the successor moves to respect it, as described in [Auto-scheduling](#auto-scheduling).

## Edit and delete dependencies

Click an arrow to select it, then:

- Double-click it, or right-click it and pick **Edit dependency**, to change its type and lag.
- Press <kbd class="key">Delete</kbd> or <kbd class="key">Backspace</kbd>, or click the × at its end, to delete it.

{{"demo": "DependencyEditing.js", "bg": "inline"}}

When the Event Timeline is `readOnly`, the dialog shows the dependency without letting you edit it, and dependencies can't be created or deleted.

Deleting an event also deletes its dependencies, in the same `onDependenciesChange` call.

## Auto-scheduling

When an event moves or is resized, the Event Timeline moves its successors later as needed to respect their dependencies, and carries the change through the whole chain.
The moved events keep their duration, and every moved event is reported in the same `onEventsChange` call.

{{"demo": "AutoScheduling.js", "bg": "inline", "defaultCodeOpen": false}}

The scheduling only ever pushes events later:

- Moving a predecessor earlier doesn't pull its successors back.
- Moving a successor earlier than its dependencies allow places it at the earliest allowed date instead.
- A dependency that is already broken in your data stays broken until one of its events moves.

:::warning
Read-only events never move.
A change that would need to move a read-only event isn't applied, and a message explains why.
:::

An all-day successor moves by whole days and stays all-day.

## Lag

The `lag` adds a wait between the two edges of a dependency.
It must be a whole number of 0 or more, in the unit set by `lagUnit`: `'minute'`, `'hour'`, `'day'` (default), or `'week'`.

{{"demo": "DependencyLag.js", "bg": "inline", "defaultCodeOpen": false}}

Days and weeks keep the time of day, even across a daylight saving time change.
The lag is applied in the successor's timezone.

An all-day successor can only wait whole days, so a lag in minutes or hours is rounded down to whole days.
The dependency dialog shows how the lag applies in that case.

## Rejected dependencies

The Event Timeline doesn't create a dependency that:

- links an event to itself, or closes a cycle between events
- has the same type, predecessor, and successor as an existing dependency
- involves a recurring event
- would need to move a read-only event

A message explains why the dependency wasn't created.

{{"demo": "DependencyRejections.js", "bg": "inline", "defaultCodeOpen": false}}

In the demo above, try linking **Testing** to **Wireframes**, linking **Wireframes** to **Mockups** a second time, or linking **Mockups** to **Review (read-only)**.

## Limitations

- Dependencies on recurring events are ignored: they don't render and don't move events.
- A negative lag (a lead) isn't supported: it's ignored, with a warning in development.
- Events that aren't loaded yet, with [lazy loading](/x/react-scheduler/event-timeline/lazy-loading/), don't move.

## Accessibility

The arrows are hidden from assistive technologies.
Instead, each successor describes the dependencies it waits on, for example "Cannot start until Design finishes.", through `aria-describedby`.

Dependencies can't be created, selected, or edited with the keyboard yet.
