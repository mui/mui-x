---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Quickstart

<p class="description">Install the MUI X Scheduler package and start building your React scheduling components.</p>

:::warning
This package is not published on npm yet.
:::

## Installation

Install the Scheduler package that best suits your needs—Community, or Premium:

{{"component": "modules/components/SchedulerInstallationInstructions.js"}}

### Peer dependencies

#### Material UI

The Scheduler packages have a peer dependency on `@mui/material`.
If you're not already using it, install it now:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
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
import { EventCalendarPremium } from '@mui/x-scheduler/event-calendar-premium';
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
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
  },
  {
    id: 2,
    title: 'Project Review',
    start: new Date(2024, 0, 16, 14, 0),
    end: new Date(2024, 0, 16, 15, 30),
  },
  {
    id: 3,
    title: 'Client Call',
    start: new Date(2024, 0, 17, 9, 0),
    end: new Date(2024, 0, 17, 10, 0),
  },
];
```

### Render the component

With the component imported, and events defined, you're now ready to render the render the Event Timeline as shown below:

{{"demo": "RenderEventCalendar.js", "defaultCodeOpen": true, "bg": "inline"}}

## Rendering an Event Timeline

### Import the component

Import the `<EventTimelinePremium />` component along with the `SchedulerEvent` and `SchedulerResource` types:

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
    start: new Date(2024, 0, 15, 9, 0),
    end: new Date(2024, 0, 15, 17, 0),
    resource: 'team-a',
  },
  {
    id: 2,
    title: 'Development Phase',
    start: new Date(2024, 0, 16, 9, 0),
    end: new Date(2024, 0, 19, 17, 0),
    resource: 'team-b',
  },
];
```

The event passed to the Event Timeline component need to have a resource that represents the entities (people, rooms, equipment) that it is are assigned to:

```ts
const resources: SchedulerResource[] = [
  { id: 'team-a', title: 'Team A' },
  { id: 'team-b', title: 'Team B' },
];
```

### Render the component

With the component imported, and events and resources defined, you're now ready to render the render the Event Timeline as shown below:

{{"demo": "RenderEventTimelinePremium.js", "defaultCodeOpen": true, "bg": "inline"}}

## TypeScript

### Theme augmentation

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// Premium users: add `-premium` suffix to package name
import type {} from '@mui/x-scheduler/themeAugmentation';

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

TODO: Uncomment once available

<!-- - [EventCalendar](/x/api/scheduler/event-calendar/)
 - [EventCalendarPremium](/x/api/scheduler/event-calendar-premium/)
- [EventTimelinePremium](/x/api/scheduler/event-timeline-premium/) -->

## Using this documentation

### Feature availability

:::info
MUI X is **open core**—Community components are MIT-licensed, while more advanced features require a Pro or Premium commercial license.
See [Licensing](/x/introduction/licensing/) for details.
:::

Throughout the documentation, Pro- and Premium-only features are denoted with the [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') and [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') icons, respectively.

All documentation for Community components and features also applies to their Pro and Premium counterparts.
