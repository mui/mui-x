---
productId: x-scheduler
title: Accessibility
githubLabel: 'scope: scheduler'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-scheduler'
---

# Accessibility

<p class="description">Learn how the Scheduler implements accessibility features and guidelines, including ARIA semantics, keyboard navigation, and localization of accessible labels.</p>

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en) (European Accessibility Act)

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what we aim to support.

## ARIA structure and semantics

The Scheduler uses WAI-ARIA grid and tree roles to expose its structure to assistive technologies.

### Week and Day views

The day-time grid is exposed as a `role="grid"` with three logical rows:

|     Row | `aria-rowindex` | Content                                                                                                                                                                                             |
| ------: | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  Header | `1`             | Day column headers — `role="columnheader"` with an `aria-label` containing the full weekday name and date (e.g., `"Monday 26"`)                                                                     |
| All-day | `2`             | All-day event cells — `role="gridcell"` with `aria-labelledby` pointing to the column header. The visible "All day" label is `aria-hidden="true"` and referenced via `aria-labelledby` on each cell |
|   Timed | `3`             | Per-column time cells                                                                                                                                                                               |

The grid also exposes `aria-colcount` for the number of visible days and `aria-colindex` on every cell.

The time axis (hour labels and grid lines) is `aria-hidden="true"` as it is decorative.

### Month view

The month grid uses the same `role="grid"` pattern with `aria-rowcount`, `aria-colcount`, `aria-rowindex`, and `aria-colindex`.
Each weekday header cell carries a `role="columnheader"`.

When `showWeekNumber` is enabled, the week-number labels are `aria-hidden="true"` but each day cell in that row references the week-number element via `aria-labelledby`, so screen readers can announce it.

### Mini calendar (side panel)

The mini calendar is exposed as a `role="grid"` with an `aria-label` (localized — default: `"Calendar"`).

The grid body is wrapped in a `role="rowgroup"` element. Day cells use `role="gridcell"` and carry:

- `aria-label` — the full formatted date string
- `aria-current="date"` — on today's date
- `aria-selected` — on the currently active (selected) date
- A roving `tabIndex` — `0` on the active cell, `-1` on all others

Weekday column headers carry a `role="columnheader"` with an `aria-label` containing the full weekday name (e.g., `"Sunday"`).

### Events

Each event element has an `aria-labelledby` that composes the day column header ID and the event's own title element ID, so a screen reader announces the day context alongside the event title.

Multi-day events are rendered once as the main (visible) element and additionally as invisible placeholder elements in the spanned cells. The placeholder elements carry `aria-hidden="true"` so assistive technologies see only one announcement per event.

The resource color indicator inside an event uses `role="img"` with an `aria-label` describing the resource (e.g., `"Resource: Sport"`). When no resource is assigned the label falls back to the localized `noResourceAriaLabel` value.

Recurring event icons are `aria-hidden="true"` as they are decorative.

### Agenda view

Each day group in the agenda carries `aria-labelledby` pointing to its day header cell. The day header cell itself has an `aria-label` composed of the weekday name and day-of-month (e.g., `"Monday 26"`).

### Main calendar region

The main calendar view area is rendered as a `<section>` element with `aria-label="Calendar content"`, providing a named landmark region that assistive technology users can navigate to directly.

## Keyboard interactions

:::info
The key assignments in the table below apply to Windows and Linux users.

On macOS replace <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>.
:::

### Resources sidebar

The Resources sidebar exposes a `role="tree"` following the [WAI-ARIA Tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

|                               Keys | Description                                                              |
| ---------------------------------: | :----------------------------------------------------------------------- |
|    <kbd class="key">Arrow Up</kbd> | Moves focus to the previous tree item                                    |
|  <kbd class="key">Arrow Down</kbd> | Moves focus to the next tree item                                        |
| <kbd class="key">Arrow Right</kbd> | Expands a collapsed parent resource node                                 |
|  <kbd class="key">Arrow Left</kbd> | Collapses an expanded parent resource node, or moves focus to its parent |
|       <kbd class="key">Space</kbd> | Toggles the visibility of the focused resource (checks or unchecks it)   |

### Menus and popovers

|                          Keys | Description                                                             |
| ----------------------------: | :---------------------------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Closes the View Switcher menu, Preferences menu, or More Events popover |
|  <kbd class="key">Enter</kbd> | Activates (opens) a focused event in the More Events popover            |
|  <kbd class="key">Space</kbd> | Activates (opens) a focused event in the More Events popover            |

## Live region announcements

The current date range label in the header toolbar is wrapped in an `aria-live="polite"` region.
When a user navigates to the previous or next time span (e.g., clicking **Previous week**), the updated date range is announced automatically by screen readers without requiring focus to move.

## Event dialog

The Event Dialog is a non-modal dialog (`aria-modal="false"`) that floats next to the event that opened it.

- It is announced by screen readers via `aria-labelledby` pointing to the dialog title.
- The Close button carries a localized `aria-label` (default: `"Close"`).
- The event title input is labeled with a localized `aria-label` (default: `"Event title"`).
- The color picker group has an `aria-label` (default: `"Event color"`), and each individual color option button is labeled (e.g., `"Select green as event color"`).
- The Recurrence tab panel uses `role="tabpanel"` with `aria-labelledby` pointing to its tab.
- The recurring scope confirmation dialog radio group has an `aria-label` (default: `"Editing recurring events scope"`).

## More Events popover

When a month cell has more events than can be displayed, a **"X more"** button opens a popover listing all events for that day.

- The popover header element carries an `aria-label` with the full formatted date (e.g., `"Monday, May 26"`).
- Each event inside the popover uses `aria-labelledby` that composes the popover header ID and the event title element ID, so screen readers announce the day context alongside the event title.
- Event items have `role="button"` with `tabIndex="0"`, and can be activated with <kbd class="key">Enter</kbd> or <kbd class="key">Space</kbd>.

## Preferences menu

The Preferences menu button exposes `aria-haspopup="true"`, `aria-expanded`, and `aria-controls`.
Inside the menu:

- Toggle items (e.g., **Show weekends**, **Show week number**) use `role="menuitemcheckbox"` with `aria-checked`.
- Time format options use `role="menuitemradio"` with `aria-checked`.

## Localization of ARIA labels

All user-facing accessible labels are provided through the `localeText` prop and can be customized.
The following keys are specifically relevant to accessibility:

```ts
{
  // Event dialog
  closeButtonAriaLabel: 'Close',
  eventTitleAriaLabel: 'Event title',
  colorPickerLabel: 'Event color',
  radioGroupAriaLabel: 'Editing recurring events scope',

  // Events
  noResourceAriaLabel: 'No specific resource',
  resourceAriaLabel: (resourceName) => `Resource: ${resourceName}`,
  hiddenEvents: (count) => `${count} more..`,

  // Month view
  weekNumberAriaLabel: (weekNumber) => `Week ${weekNumber}`,

  // Mini calendar
  miniCalendarLabel: 'Calendar',
  miniCalendarGoToPreviousMonth: 'Show previous month in calendar',
  miniCalendarGoToNextMonth: 'Show next month in calendar',

  // Header toolbar
  previousTimeSpan: (timeSpan) => `Previous ${timeSpan}`,
  nextTimeSpan: (timeSpan) => `Next ${timeSpan}`,
  openSidePanel: 'Open side panel',
  closeSidePanel: 'Close side panel',
}
```

See the [localization page](/x/react-scheduler/localization/) for the full list of available keys and instructions on how to apply them.

## Known limitations

### No arrow key navigation within calendar grids

The Week, Day, and Month views expose full ARIA grid semantics (`role="grid"`, `aria-rowcount`, `aria-colcount`, `aria-rowindex`, `aria-colindex`) but do **not** currently implement arrow key navigation between grid cells. Keyboard users can Tab to interactive elements (events and buttons) but cannot use arrow keys to move focus between day cells.

This means the Scheduler does not yet fully conform to the [WAI-ARIA Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), which requires arrow key interaction.

### No arrow key navigation in the mini calendar

Similarly, the mini calendar in the side panel exposes `role="grid"` and a roving `tabIndex` on the active date, but arrow key navigation between day cells is not implemented.
