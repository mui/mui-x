---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Preferences

<p class="description">Customize timeline preferences including the time format.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Initialize the preferences

Use the `defaultPreferences` prop to initialize the preferences:

```tsx
const defaultPreferences = {
  ampm: false,
}

<EventTimelinePremium defaultPreferences={defaultPreferences} />;
```

Available properties:

- `ampm`: Whether the component displays time in 12-hour format with AM/PM.
- `weekStartsOn`: The day the week starts on (`0` = Sunday, `1` = Monday, `6` = Saturday).

{{"demo": "DefaultPreferences.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the preferences using the `preferences` prop.
The Event Timeline has no built-in preferences UI, so changes are driven entirely from your own UI:

```tsx
const [preferences, setPreferences] = React.useState<
  Partial<EventTimelinePremiumPreferences>
>({ ampm: false });

return (
  <React.Fragment>
    <button
      onClick={() => setPreferences((prev) => ({ ...prev, ampm: !prev.ampm }))}
    >
      Toggle AM/PM
    </button>
    <EventTimelinePremium preferences={preferences} />
  </React.Fragment>
);
```

:::
