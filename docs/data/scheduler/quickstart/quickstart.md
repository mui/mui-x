---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Quickstart

<p class="description">Install the MUI X Scheduler package to start building React calendars and event timelines.</p>

## Installation

Install the Scheduler package that best suits your needs—Community or Premium:

{{"component": "modules/components/SchedulerInstallationInstructions.js"}}

### Peer dependencies

#### Material UI

The Scheduler packages have peer dependencies on `@mui/material` and `@mui/icons-material`.
If you're not already using them, install them now:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @mui/icons-material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled
```

</codeblock>

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Rendering an Event Calendar

### Import the component

Import the Event Calendar component that corresponds to the version you're using, along with the `SchedulerEvent` type:

```js
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { SchedulerEvent } from '@mui/x-scheduler/models';
```

### Define events

Each event in the Event Calendar is an object with properties that define when it occurs and what it displays.

The code snippet below defines three events with `id`, `title`, `start`, and `end` properties:

```ts
const events: SchedulerEvent[] = [
  {
    id: 1,
    title: 'Team Meeting',
    start: '2024-01-15T10:00:00',
    end: '2024-01-15T11:00:00',
  },
  {
    id: 2,
    title: 'Project Review',
    start: '2024-01-16T14:00:00',
    end: '2024-01-16T15:30:00',
  },
  {
    id: 3,
    title: 'Client Call',
    start: '2024-01-17T09:00:00',
    end: '2024-01-17T10:00:00',
  },
];
```

### Render the component

With the component imported and events defined, you're now ready to render the Event Calendar as shown below:

{{"demo": "RenderEventCalendar.js", "defaultCodeOpen": true, "bg": "inline"}}

## Rendering an Event Timeline

### Import the component

Import the `EventTimelinePremium` component along with the `SchedulerEvent` and `SchedulerResource` types:

```js
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
```

### Define events and resources

Each event in the Event Timeline is an object with properties that define when it occurs and what it displays.

The code snippet below defines three events with `id`, `title`, `start`, and `end` properties:

```ts
const events: SchedulerEvent[] = [
  {
    id: 1,
    title: 'Project Kickoff',
    start: '2024-01-15T09:00:00',
    end: '2024-01-15T17:00:00',
    resource: 'team-a',
  },
  {
    id: 2,
    title: 'Development Phase',
    start: '2024-01-16T09:00:00',
    end: '2024-01-19T17:00:00',
    resource: 'team-b',
  },
];
```

Each event passed to the Event Timeline component needs a resource that represents the entities (people, rooms, equipment) it's assigned to:

```ts
const resources: SchedulerResource[] = [
  { id: 'team-a', title: 'Team A' },
  { id: 'team-b', title: 'Team B' },
];
```

### Render the component

With the component imported and events and resources defined, you're now ready to render the Event Timeline as shown below:

{{"demo": "RenderEventTimelinePremium.js", "defaultCodeOpen": true, "bg": "inline"}}

## TypeScript

### Theme augmentation

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// Premium users: add `-premium` suffix to package name
import type {} from '@mui/x-scheduler/theme-augmentation';

const theme = createTheme({
  components: {
    MuiEventCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: 'lightblue',
        },
      },
    },
  },
});
```

## API

- [EventCalendar](/x/api/scheduler/event-calendar/)
- [EventCalendarPremium](/x/api/scheduler/event-calendar-premium/)
- [EventTimelinePremium](/x/api/scheduler/event-timeline-premium/)

## Using this documentation

### Feature availability

:::info
MUI X is **open core**—Community components are MIT-licensed, while more advanced features require a Pro or Premium commercial license.
The Scheduler's advanced features are only available with a Premium license.
See [Licensing](/x/introduction/licensing/) for details.
:::

Throughout the documentation, Premium-only features are denoted with the [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') icon.

All documentation for Community components and features also applies to their Premium counterparts.
