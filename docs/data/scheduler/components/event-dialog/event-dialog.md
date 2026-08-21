---
productId: x-scheduler
title: React Scheduler - Event dialog component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium
---

# Scheduler - Event dialog

<p class="description">Compose the General tab of the event dialog with built-in and custom sections.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

The event dialog opens when the user clicks an event or creates a new one.
Its General tab is built from self-contained section components, and the `eventDialogGeneralTab` slot lets you replace the tab content with your own composition: reorder the built-in sections, omit some of them, and insert sections of your own that read and write the event draft.

:::info
The slot replaces the **entire** General tab content.
Render the built-in sections you want to keep — anything you leave out is gone, including the date, resource, color, and description editors.
:::

## Basic usage

The demo below inserts a custom "Priority" section between the built-in sections.
The custom field is written through `useEventDialogFormField()`, so it is part of the draft and is saved with the event.

{{"demo": "CustomGeneralTab.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
Define the slot component at **module scope**, never inline in a render.
An inline arrow function is a new component type on every render, so React unmounts and remounts every section on each keystroke during event creation — focus loss, caret jumps, and validators re-registering.
:::

## Anatomy

```tsx
import {
  EventDialogGeneralTabContent,
  DateTimeSection,
  ResourceAndColorSection,
  DescriptionSection,
  SectionFieldset,
  SectionHeaderTitle,
  useEventDialogFormField,
  useEventDialogOccurrence,
} from '@mui/x-scheduler/event-dialog';

function CustomGeneralTab() {
  return (
    <React.Fragment>
      <DateTimeSection />
      <ResourceAndColorSection />
      <DescriptionSection />
    </React.Fragment>
  );
}

<EventCalendar slots={{ eventDialogGeneralTab: CustomGeneralTab }} />;
```

### Event Dialog General Tab Content

`<EventDialogGeneralTabContent />` is the default composition: the date and time section, the resource and color section, and the description section, separated by dividers.
It is what renders when the slot is not provided, and you can render it from your own slot to append content after the built-in sections.

### Date Time Section

`<DateTimeSection />` edits the start and end date and time and the all-day switch.
It takes no props: it reads the edited occurrence and its form fields from context.

### Resource And Color Section

`<ResourceAndColorSection />` edits the resource the event belongs to and its color.
The resource picker follows the calendar's `eventCreation.canHaveMultipleResources` setting.

### Description Section

`<DescriptionSection />` edits the event description.

### Section Fieldset and Section Header Title

`<SectionFieldset />` and `<SectionHeaderTitle />` are the layout primitives the built-in sections are made of.
Use them around your own fields so custom sections get the same spacing, typography, and theme classes as the built-in ones.

Return a **fragment** from the slot: the tab content is a flex column with a gap, so wrapping your composition in a `<div>` collapses it into one flex item and loses the vertical spacing between sections.

## Custom fields

`useEventDialogFormField(key, options)` binds a component to one field of the event draft:

- `value` / `setValue` — read and write the field. A written field is part of the draft and is merged into the event on save.
- `defaultValue` — seeds the field when the event does not have it yet. An untouched default is not saved.
- `validate` — runs on save. Return the error message(s), or `null` when the value is valid. Async validators are supported.
- `error` / `errors` — the current validation message(s) for the field.

Keep **all draft state** in the form through this hook, never in component `useState`: the form store lives above the slot and survives a slot remount — component state does not.

A value written to a field is submitted even if the section that wrote it is later unmounted (only its validator is removed with it).

## Reading the edited occurrence

`useEventDialogOccurrence()` returns the occurrence the dialog is editing, for example to show data of the event that is not part of the form, or to derive labels.
It is constant for the lifetime of the editing session and throws when called outside the event dialog form.

## Validation

The demo below adds a "Meeting link" section whose validator blocks the save until the value is a valid link.

{{"demo": "CustomValidation.js", "bg": "inline", "defaultCodeOpen": false}}

## Reordering and omitting sections

Render the built-in sections in any order and leave out the ones you do not need:

{{"demo": "ReorderAndOmitSections.js", "bg": "inline", "defaultCodeOpen": false}}

### Omitting the resource section with a required resource

Omitting a section removes its editors, not the form contract.
With `shouldEventRequireResource` enabled, saving without a resource stays blocked even when the resource section is not rendered — the end user just has no visible field to fix it, and the following warning is logged in development:

```text
MUI X Scheduler: `shouldEventRequireResource` is enabled but no field of the event dialog validates the resource.
Saving without a resource is still blocked, but the end user has no visible field to fix it.
Render the resource section in the General tab, or register a validator for the "resourceIds" field.
```

If your custom tab replaces the built-in resource picker, register your own field for the `resourceIds` key so the requirement stays fixable.

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

The `occurrence` prop is always supplied by the scheduler and cannot be overridden through `slotProps`.

## Where the slot renders

- The slot is the General tab content of the event **editing surface**: it renders in the desktop dialog and in the narrow editing drawer of the compact views alike, so keep custom content responsive.
- The General tab panel is `hidden` while another tab is selected, not unmounted: fields keep their draft values and their validators keep running on save.
- Read-only events render a read-only summary instead of the editing form, so the slot does not render for them.
