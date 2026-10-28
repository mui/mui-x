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

## Create, edit, and delete dependencies

Users create a dependency by dragging from the edge of an event to another event, and edit or delete it from its arrow.
Every change is reported through `onDependenciesChange`.

{{"demo": "DependencyEditing.js", "bg": "inline", "defaultCodeOpen": false}}

If a new or edited dependency is broken, the successor moves to respect it, as described in [Auto-scheduling](#auto-scheduling).

Deleting an event also deletes its dependencies, in the same `onDependenciesChange` call.

When the Event Timeline is [read-only](/x/react-scheduler/event-timeline/editing/#read-only), users can't create, edit, or delete dependencies.

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

- Dependencies on recurring events are ignored: they don't render and don't move events.
- A negative lag (a lead) isn't supported.
  A negative or fractional lag, or an unknown `lagUnit`, is ignored: the dependency applies with no lag, and a warning is logged in development.
- With [lazy loading](/x/react-scheduler/event-timeline/lazy-loading/), a dependency only applies once both of its events are loaded: until then it has no arrow and doesn't move either event.
