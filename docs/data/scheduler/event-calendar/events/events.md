---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Event Calendar

<p class="description">Define events for your Event Calendar.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

## All day events

You can use the `allDay` property on your event model to define it as all-day:

```ts
const event = {
  // ...other even properties
  allDay: true,
};
```

{{"demo": "AllDay.js", "bg": "inline", "defaultCodeOpen": false}}

### Color

The Event Calendar supports several color palettes, the following demo shows one event for each palette:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
Event colors can also be defined at on the resources or at the component levels.
The effective color resolves in the following order:

1. The `color` assigned to the event

```tsx
<EventCalendar events={[{ id: '1', title: 'Event 1', color: 'pink' }]} />
```

2. The `eventColor` assigned to the event's resource

```tsx
<EventCalendar resources={[{ id: '1', title: 'Resource 1', eventColor: 'pink' }]} />
```

3. The `eventColor` assigned to the Event Calendar

```tsx
<EventCalendar eventColor="pink" />
```

4. The default color palette, `"teal"`

:::
