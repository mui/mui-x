---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Dependencies

<p class="description">Link events so that one can't start or finish before another, and let the Event Timeline reschedule the linked events when their predecessors move.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

A dependency links two events: the predecessor (`source`) and the successor (`target`).
The Event Timeline draws each dependency as an arrow.
A dependency is broken when the successor starts or finishes earlier than its type allows: the Event Timeline then moves the successor later to respect it.

{{"demo": "DependenciesOverview.js", "bg": "inline", "defaultCodeOpen": false}}

## Enable dependencies

Pass the `dependencies` feature to the `features` prop.
You can then control the dependencies using the `dependencies` and `onDependenciesChange` props, to keep the dependencies created, edited, or deleted in the Event Timeline:

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

Without the feature, the `dependencies` prop is ignored.
With it, any `dependencies` value (even an empty array) shows the arrows and lets users create dependencies.

:::info
The features are read once, when the Event Timeline mounts.
Define the `features` object outside of the component, or memoize it.
:::

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

The `type` is required and sets which edge of each event the dependency constrains.
The four types are the ones of the precedence diagramming method used by project scheduling tools:

| Type                  | The successor can't…                    |
| :-------------------- | :-------------------------------------- |
| `FinishToStart` (FS)  | start before the predecessor finishes.  |
| `StartToStart` (SS)   | start before the predecessor starts.    |
| `FinishToFinish` (FF) | finish before the predecessor finishes. |
| `StartToFinish` (SF)  | finish before the predecessor starts.   |

The `lag` and `lagUnit` add a wait to the dependency, as described in [Lag](#lag).

## Auto-scheduling

When an event moves or is resized, the Event Timeline moves its successors later as needed to respect their dependencies, and carries the change through the whole chain.
The moved successors keep their duration, and every moved event is reported in the same `onEventsChange` call.

{{"demo": "AutoScheduling.js", "bg": "inline", "defaultCodeOpen": false}}

In the demo above, drag **Design** later: the free days between the events absorb the move first, and each event only moves once Design reaches it.

Auto-scheduling never moves an event earlier than where you placed it, and never pulls successors back:

- Moving a predecessor earlier leaves its successors where they are.
- Moving a successor earlier than its dependencies allow places it at the earliest allowed date instead.
- A dependency that is already broken in your data stays broken until the successor moves, or the predecessor moves later.
- An [all-day](/x/react-scheduler/event-timeline/events/#all-day) successor moves by whole days and stays all-day.

:::warning
Read-only events never move.
A change that would need to move a read-only event isn't applied, and a message explains why.
This applies to every change on this page: moving or resizing an event, and creating or editing a dependency.
:::

## Lag

The `lag` is a minimum wait between the edges that the dependency links.
For example, a `FinishToStart` dependency with a `lag` of 2 means that the successor can't start until 2 days after the predecessor finishes.

The `lag` must be a whole number of 0 or more, in the unit set by `lagUnit`: `'minute'`, `'hour'`, `'day'` (default), or `'week'`.

{{"demo": "DependencyLag.js", "bg": "inline", "defaultCodeOpen": false}}

Days and weeks keep the time of day, even across a daylight saving time change.
The lag is applied in the successor's [timezone](/x/react-scheduler/timezone/).

Minutes and hours count elapsed time.
An all-day successor can only wait whole days, so a lag in minutes or hours is rounded down to whole days, and a lag shorter than a day adds no wait.
The dependency dialog shows how the lag applies in that case.

## Create dependencies

Hover an event to show its terminals: a handle on each of its edges.
Drag from a terminal and drop it on another event to create a dependency:

- Dropping it on one of the other event's terminals links those two edges: from the end of an event to the start of another creates a `FinishToStart` dependency.
- Dropping it on the event itself links to its start.

Press <kbd class="key">Escape</kbd>, or drop it on an empty area or on the same event, to cancel.

{{"demo": "DependencyCreation.js", "bg": "inline", "defaultCodeOpen": false}}

If the new dependency is already broken, the successor moves to respect it, as described in [Auto-scheduling](#auto-scheduling).
The same happens when you edit a dependency so that it requires the successor to be later than before, for example by increasing its lag.

## Edit and delete dependencies

Click an arrow to select it, and press <kbd class="key">Escape</kbd> to deselect it.

To edit a dependency's type and lag, double-click its arrow, or right-click it and pick **Edit dependency**.

To delete a dependency, select it and do one of the following:

- Press <kbd class="key">Delete</kbd> or <kbd class="key">Backspace</kbd>.
- Click the **×** button at the end of its arrow.
- Pick **Delete** in the right-click menu or in the dialog.

{{"demo": "DependencyEditing.js", "bg": "inline", "defaultCodeOpen": false}}

An edit that duplicates another dependency, or that would need to move a read-only event, isn't applied, and the dialog explains why.

When the Event Timeline is [read-only](/x/react-scheduler/event-timeline/editing/#read-only), the terminals and the **×** button are hidden, and the right-click menu offers **Show details** instead: the dialog shows the dependency without letting you edit it.

Deleting an event also deletes its dependencies, in the same `onDependenciesChange` call.

## Rejected dependencies

The Event Timeline doesn't create a dependency that:

- closes a cycle between events
- has the same type, predecessor, and successor as an existing dependency: the existing one is selected instead
- involves a [recurring event](/x/react-scheduler/recurring-events/)
- would need to move a read-only event

A message explains why the dependency wasn't created.

{{"demo": "DependencyRejections.js", "bg": "inline", "defaultCodeOpen": false}}

In the demo above, try linking **Testing** to **Wireframes**, linking the end of **Wireframes** to the start of **Mockups** a second time, or linking **Mockups** to **Review**, which is read-only.

## Known limitations

- Recurring events have no terminals, and dependencies on them are ignored: they don't render and don't move events.
- A negative lag (a lead) isn't supported.
  A negative or fractional lag, or an unknown `lagUnit`, is ignored: the dependency applies with no lag, and a warning is logged in development.
- With [lazy loading](/x/react-scheduler/event-timeline/lazy-loading/), a dependency only applies once both of its events are loaded: until then it has no arrow and doesn't move either event.

## Accessibility

The arrows are hidden from assistive technologies.
Instead, each successor describes the dependencies it waits on, for example "Cannot start until Design finishes.", through `aria-describedby`.

Dependencies can't be created, selected, or edited with the keyboard yet.
