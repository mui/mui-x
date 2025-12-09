---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Timeline

<p class="description">The Timeline component lets users manage events in a timeline layout.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Basic example

{{"demo": "BasicTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

## Customization

### Initialize / control the preferences

You can customize the Timeline by providing the `defaultPreferences` prop.

Available properties:

- `ampm`: Sets the initial time format. `true` uses 12-hour (AM/PM), `false` uses 24-hour. Defaults to `true`.

:::success
You can also control the preferences using `preferences` and `onPreferencesChange` props:

```tsx
const [preferences, setPreferences] = React.useState<
  TimelinePreferences | undefined
>(undefined);

return <Timeline preferences={preferences} onPreferencesChange={setPreferences} />;
```
