---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium
---

# Event Calendar - Preferences

<p class="description">Customize calendar preferences including time format, weekend visibility, and side panel state.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Initialize the preferences

Use the `defaultPreferences` prop to initialize the preferences:

```tsx
const defaultPreferences = {
  ampm: false,
  showWeekends: false,
  isSidePanelOpen: false,
}

<EventCalendar defaultPreferences={defaultPreferences} />;
```

Available properties:

- `ampm`: Whether the component displays time in 12-hour format with AM/PM.
- `showWeekends`: Whether the calendar shows weekends.
- `showWeekNumber`: Whether the calendar shows the week number.
- `isSidePanelOpen`: Whether the side panel is open.
- `showEmptyDaysInAgenda`: Whether the agenda view shows days with no events.

{{"demo": "DefaultPreferences.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the preferences using `preferences` and `onPreferencesChange` props:

```tsx
const [preferences, setPreferences] = React.useState<
  Partial<EventCalendarPreferences>
>({});

return (
  <EventCalendar preferences={preferences} onPreferencesChange={setPreferences} />
);
```

:::

## Preferences menu

The preferences menu lets users customize the component to their needs.

You can customize which preferences are available in the preferences menu using the `preferencesMenuConfig` prop:

Available properties:

- `toggleAmpm`: Show/hide the menu item that toggles 12/24‑hour time format.
- `toggleWeekStartsOn`: Show/hide the menu item that changes the first day of the week.
- `toggleWeekendVisibility`: Show/hide the menu item that toggles weekend visibility.
- `toggleWeekNumberVisibility`: Show/hide the menu item that toggles week number visibility.
- `toggleEmptyDaysInAgenda`: Show/hide the menu item that toggles the visibility of days with no event in the agenda view.

```ts
// hides the menu
preferencesMenuConfig={false}

// hides the menu item responsible for toggling the weekend visibility
// the other preferences remain visible
preferencesMenuConfig={{ toggleWeekendVisibility: false }}

// hides the menu items for toggling weekend and week number visibility
preferencesMenuConfig={{ toggleWeekendVisibility: false, toggleWeekNumberVisibility: false }}
```

{{"demo": "PreferencesMenu.js", "bg": "inline", "defaultCodeOpen": false}}
