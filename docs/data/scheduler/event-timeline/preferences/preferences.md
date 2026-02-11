---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Preferences

<p class="description">Let your user customize the component to their needs.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Initialize the preferences

Use the `defaultPreferences` prop to initialize the preferences:

```tsx
const defaultPreferences = {
  ampm: false,
  showWeekends: false,
  isSidePanelOpen: false,
}

<EventTimelinePremium defaultPreferences={defaultPreferences} />;
```

Available properties:

- `ampm`: Whether the component should display the time in 12-hour format with AM/PM meridiem.

{{"demo": "DefaultPreferences.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the preferences using `preferences` and `onPreferencesChange` props:

```tsx
const [preferences, setPreferences] = React.useState<
  Partial<EventTimelinePremiumPreferences>
>({});

return (
  <EventTimelinePremium
    preferences={preferences}
    onPreferencesChange={setPreferences}
  />
);
```

:::
