---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Preferences

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

<EventCalendar defaultPreferences={defaultPreferences} />;
```

Available properties:

- `ampm`: Whether the component should display the time in 12-hour format with AM/PM meridiem.
- `showWeekends`: Whether weekends are shown in the calendar.
- `showWeekNumber`: Whether the week number is shown in the calendar.
- `isSidePanelOpen`: Whether the side panel is open.
- `showEmptyDaysInAgenda`: Whether days with no event are shown in the agenda view.

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

The preferences menu lets the users change their preferences to customize the component to their needs.

You can customize which preferences are available in the preferences menu using the `preferencesMenuConfig` prop:

Available properties:

- `toggleAmpm`: Show/hide the menu item that toggles 12/24‑hour time format.
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
