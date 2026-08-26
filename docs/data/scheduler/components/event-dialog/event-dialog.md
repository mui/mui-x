---
productId: x-scheduler
title: React Scheduler - Event dialog component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium, EventTimelinePremium, StandaloneAgendaView, StandaloneAgendaViewPremium, StandaloneDayView, StandaloneDayViewPremium, StandaloneWeekView, StandaloneWeekViewPremium, StandaloneMonthView, StandaloneMonthViewPremium
---

# Scheduler - Event dialog

<p class="description">Compose the General tab of the event dialog with built-in and custom sections.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

:::info
The building blocks on this page are imported from `@mui/x-scheduler/event-dialog`, also when the dialog belongs to a premium component. Add `@mui/x-scheduler` to your dependencies when importing them in a premium-only app.
:::

The event dialog opens when the user clicks an event or creates a new one.
Its General tab is built from self-contained section components, and the `eventDialogGeneralTab` slot lets you replace the tab content with your own composition: reorder the built-in sections, omit some of them, and insert sections of your own that read and write the event draft.

:::info
The slot replaces the **entire** General tab content.
Render the built-in sections you want to keep — anything you leave out is gone, including the date, resource, color, and description editors.
:::

## Basic usage

The demo below inserts a custom "Priority" section between the built-in sections.
The custom field is bound through `useEventDialogFormField()`: once the user edits it, the value is part of the draft and is saved with the event.

{{"demo": "CustomGeneralTab.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
Define the slot component at **module scope**, never inline in a render.
An inline arrow function is a new component type on every render of the component that owns the calendar, so each of those renders unmounts and remounts every section — focus loss, caret jumps, and validators re-registering.
:::

## Anatomy

```tsx
import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  EventDialogDateTimeSection,
  EventDialogResourceAndColorSection,
  EventDialogDescriptionSection,
} from '@mui/x-scheduler/event-dialog';

function CustomGeneralTab() {
  return (
    <React.Fragment>
      <EventDialogDateTimeSection />
      <EventDialogResourceAndColorSection />
      <EventDialogDescriptionSection />
    </React.Fragment>
  );
}

<EventCalendar slots={{ eventDialogGeneralTab: CustomGeneralTab }} />;
```

### Event dialog general tab content

`<EventDialogGeneralTabContent />` is the default composition: the date and time section, the resource and color section, and the description section, separated by dividers.
It is what renders when the slot is not provided, and you can render it from your own slot to append content after the built-in sections.

### Event dialog date time section

`<EventDialogDateTimeSection />` edits the start and end date and time and the all-day switch.
It takes no props: it reads its form fields from context.

### Event dialog resource and color section

`<EventDialogResourceAndColorSection />` edits the resource the event belongs to and its color.
When creating an event, the resource picker follows the calendar's `eventCreation.canHaveMultipleResources` setting; when the setting is not provided, the mode is inferred from the events data (multi-select by default).
When editing an existing event, the shape of its `resource` decides instead: an array gets a multi-select picker and a single id a single-select one — the setting is only the fallback for an event without a resource.

### Event dialog description section

`<EventDialogDescriptionSection />` edits the event description.

### Event dialog section fieldset and section header title

`<EventDialogSectionFieldset />` and `<EventDialogSectionHeaderTitle />` are the layout primitives the date and time and the resource and color sections are made of (the description section is a bare text field).
Use them around your own fields so custom sections get the same spacing, typography, and theme classes as the built-in ones.

Return a **fragment** from the slot: the tab content is a flex column with a gap, so wrapping your composition in a `<div>` collapses it into one flex item and loses the vertical spacing between sections.

## Custom fields

`useEventDialogFormField(key, parameters)` binds a component to one field of the event draft:

- `value` / `setValue` — read and write the field. A written field is part of the draft and is merged into the event on save.
- `defaultValue` — seeds the field when the event does not have it yet. An untouched default is not saved.
- `validate` — runs on save. Return the error message(s), or `null` when the value is valid. Async validators are supported.
- `error` / `errors` — the current validation message(s) for the field.
- `readOnly` — whether the event property backing a built-in key is read-only (a getter without a setter in `eventModelStructure`); always `false` for custom keys. Mirror it on your input.

Keep **all draft state** in the form through this hook, never in component `useState`: the form store lives above the slot and survives a slot remount — component state does not.

A value written to a field is submitted even if the section that wrote it is later unmounted (only its validator is removed with it).
There is no way to remove a key from the draft: writing `undefined` into a field that is part of the draft submits the removal of the stored property; writing it into a key absent from the draft is a no-op.

When binding a built-in key, match its value shape (`EventDialogBuiltInFormValues`): the dates are `yyyy-MM-dd` strings, the times `HH:mm` strings, `resourceIds` is always an array, and `color: null` inherits from the resource or the calendar's default event color.

## Reading the edited occurrence

`useEventDialogOccurrence()` returns the occurrence the dialog is editing, for example to show data of the event that is not part of the form, or to derive labels.
It is constant for the lifetime of the editing session and throws when called outside the event dialog form.

## Validation

The demo below adds a "Meeting link" section: its validator lets an empty value through, but blocks the save when a provided value does not start with `http://` or `https://`.

{{"demo": "CustomValidation.js", "bg": "inline", "defaultCodeOpen": false}}

## Reordering and omitting sections

Render the built-in sections in any order and leave out the ones you do not need:

{{"demo": "ReorderAndOmitSections.js", "bg": "inline", "defaultCodeOpen": false}}

### Omitting the resource section with a required resource

Omitting a section removes its editors, not the form contract.
With `shouldEventRequireResource` enabled, saving without a resource stays blocked even when the resource section is not rendered — the end user just has no visible field to fix it. In development, a warning is logged on the first save attempt made while no validator is registered for the field.

If your custom tab replaces the built-in resource picker, bind your field to the `resourceIds` key, register a `validate` callback for it (the development warning checks for a registered validator, so binding the field alone does not silence it), and render its `error` so the requirement stays fixable.

The date range works the same way: an invalid, unparseable, or inverted range blocks the save even without the date and time section, with an equivalent development warning. A replacement for that section should register a validator for the four date and time keys and render their errors.

## Typing custom slot props

Pass extra props to the slot through `slotProps.eventDialogGeneralTab` and type them by augmenting the `EventDialogGeneralTabPropsOverrides` interface:

```tsx
declare module '@mui/x-scheduler/models' {
  interface EventDialogGeneralTabPropsOverrides {
    highlightColor?: string;
  }
}

<EventCalendar
  slots={{ eventDialogGeneralTab: CustomGeneralTab }}
  slotProps={{ eventDialogGeneralTab: { highlightColor: 'red' } }}
/>;
```

## Where the slot renders

- The slot is the General tab content of the event **editing surface**: it renders in the desktop dialog and in the narrow editing drawer of the compact views alike, so keep custom content responsive.
- The General tab panel is `hidden` while another tab is selected, not unmounted: fields keep their draft values and their validators keep running on save.
- Read-only events render a read-only summary instead of the editing form, so the slot does not render for them.
