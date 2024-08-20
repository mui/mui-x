---
productId: x-date-pickers
title: Date and Time Pickers - Custom slots and subcomponents
components: DateTimePickerTabs, PickersActionBar, DatePickerToolbar, TimePickerToolbar, DateTimePickerToolbar, PickersCalendarHeader, PickersRangeCalendarHeader, PickersShortcuts, DateRangePickerToolbar, MonthCalendar, YearCalendar, DateCalendar
---

# Custom slots and subcomponents

<p class="description">Learn how to override the default DOM structure of the Date and Time Pickers.</p>

:::info
The components that can be customized are listed under `slots` section in Date and Time Pickers [API Reference](/x/api/date-pickers/).
For example, available Date Picker slots can be found [here](/x/api/date-pickers/date-picker/#slots).
:::

## Overriding slot components

You can override the internal elements of the component (known as "slots") using the `slots` prop.

Use the `slotProps` prop if you need to pass additional props to a component slot.

As an example, you could override the `ActionBar` and pass additional props to the custom component as shown below:

```jsx
<DatePicker
  {...otherProps}
  slots={{
    // Override default <ActionBar /> with a custom one
    actionBar: CustomActionBar,
  }}
  slotProps={{
    // pass props `actions={['clear']}` to the actionBar slot
    actionBar: { actions: ['clear'] },
  }}
/>
```

To modify components position, have a look at the [custom layout](/x/react-date-pickers/custom-layout/) docs page.

### Recommended usage

:::success
Remember to pass a reference to the component instead of an inline render function and define it outside the main component.
This ensures that the component is not remounted on every update.
:::

The first two examples below are buggy because the toolbar will remount after each keystroke, leading to a loss of focus.

```jsx
// ❌ The `toolbar` slot is re-defined each time the parent component renders,
// causing the component to remount.
function MyApp() {
  return (
    <DatePicker
      slots={{
        toolbar: () => (
          <input value={name} onChange={(event) => setName(event.target.value)} />
        ),
      }}
    />
  );
}
```

```jsx
// ❌ The `toolbar` slot is re-defined each time `name` is updated,
// causing the component to remount.
function MyApp() {
  const [name, setName] = React.useState('');

  const CustomToolbar = React.useCallback(
    () => <input value={name} onChange={(event) => setName(event.target.value)} />,
    [name],
  );

  return <DatePicker slots={{ toolbar: CustomToolbar }} />;
}
```

```jsx
// ✅ The `toolbar` slot is defined only once, it will never remount.
const CustomToolbar = ({ name, setName }) => (
  <input value={name} onChange={(event) => setName(event.target.value)} />
);

function MyApp() {
  const [name, setName] = React.useState('');
  return (
    <DatePicker
      slots={{ toolbar: CustomToolbar }}
      slotProps={{ toolbar: { name, setName } }}
    />
  );
}
```

## Action bar

### Component props

The action bar is available on all picker components.
By default, it contains no action on desktop, and the actions **Cancel** and **Accept** on mobile.

You can override the actions displayed by passing the `actions` prop to the `actionBar` within `slotProps`, as shown here:

```jsx
<DatePicker
  slotProps={{
    // The actions will be the same between desktop and mobile
    actionBar: {
      actions: ['clear'],
    },
    // The actions will be different between desktop and mobile
    actionBar: ({ wrapperVariant }) => ({
      actions: wrapperVariant === 'desktop' ? [] : ['clear'],
    }),
  }}
/>
```

In the example below, the action bar contains only one button, which resets the selection to today's date:

{{"demo": "ActionBarComponentProps.js"}}

#### Available actions

The built-in `ActionBar` component supports four different actions:

| Action   | Behavior                                                               |
| :------- | :--------------------------------------------------------------------- |
| `accept` | Accept the current value and close the picker view                     |
| `cancel` | Reset to the last accepted date and close the picker view              |
| `clear`  | Reset to the empty value and close the picker view                     |
| `today`  | Reset to today's date (and time if relevant) and close the picker view |

### Component

If you need to customize the date picker beyond the options described above, you can provide a custom component.
This can be used in combination with `slotProps`.

In the example below, the actions are the same as in the section above, but they are rendered inside a menu:

{{"demo": "ActionBarComponent.js"}}

## Tabs

The tabs are available on all date time picker components.
It allows switching between date and time interfaces.

### Component props

You can override the icons displayed by passing props to the `tabs` within `slotProps`, as shown here:

```jsx
<DateTimePicker
  slotProps={{
    tabs: {
      dateIcon: <LightModeIcon />,
      timeIcon: <AcUnitIcon />,
    },
  }}
/>
```

By default, the tabs are `hidden` on desktop, and `visible` on mobile.
This behavior can be overridden by setting the `hidden` prop:

```jsx
<DateTimePicker
  slotProps={{
    tabs: {
      hidden: false,
    },
  }}
/>
```

### Component

If you need to customize the date time picker beyond the options described above, you can provide a custom component.
This can be used in combination with `slotProps`.

In the example below, the tabs are using different icons and have an additional component:

{{"demo": "Tabs.js"}}

## Toolbar

The toolbar is available on all date time picker components.
It displays the current values and allows to switch between different views.

### Component props

You can customize how the toolbar displays the current value with `toolbarFormat`.
By default, empty values are replaced by `__`.
This can be modified by using `toolbarPlaceholder` props.

By default, the toolbar is `hidden` on desktop, and `visible` on mobile.
This behavior can be overridden by setting the `hidden` prop:

```jsx
<DatePicker
  slotProps={{
    toolbar: {
      // Customize value display
      toolbarFormat: 'YYYY',
      // Change what is displayed given an empty value
      toolbarPlaceholder: '??',
      // Show the toolbar
      hidden: false,
    },
  }}
/>
```

### Component

Each component comes with its own toolbar (`DatePickerToolbar`, `TimePickerToolbar`, and `DateTimePickerToolbar`) that you can reuse and customize.

{{"demo": "ToolbarComponent.js"}}

## Calendar header

The calendar header is available on any component that renders a calendar to select a date or a range of dates.
It allows the user to navigate through months and to switch to the month and year views when available.

### Component props

You can pass props to the calendar header as shown below:

{{"demo": "CalendarHeaderComponentProps.js"}}

### Component

You can pass a custom component to replace the header, as shown below:

{{"demo": "CalendarHeaderComponent.js"}}

When used with a date range component,
you receive three additional props to let you handle scenarios where multiple months are rendered:

- `calendars`: The number of calendars rendered
- `month`: The month used for the header being rendered
- `monthIndex`: The index of the month used for the header being rendered

The demo below shows how to navigate the months two by two:

{{"demo": "CalendarHeaderComponentRange.js"}}

## Year button

This button allows users to change the selected year in the `year` view.

### Component props

You can pass props to the year button as shown below:

{{"demo": "YearButtonComponentProps.js"}}

### Component

You can pass a custom component to replace the year button, as shown below:

{{"demo": "YearButtonComponent.js"}}

## Month button

This button allows users to change the selected month in the `month` view.

:::success
You can learn more on how to enable the `month` view on the [`DateCalendar` doc page](/x/react-date-pickers/date-calendar/#views).
:::

### Component props

You can pass props to the month button as shown below:

{{"demo": "MonthButtonComponentProps.js"}}

### Component

You can pass a custom component to replace the month button, as shown below:

{{"demo": "MonthButtonComponent.js"}}

## Arrow switcher

The following slots let you customize how to render the buttons and icons for an arrow switcher: the component used
to navigate to the "Previous" and "Next" steps of the picker: `PreviousIconButton`, `NextIconButton`, `LeftArrowIcon`, `RightArrowIcon`.

### Component props

You can pass props to the icons and buttons as shown below:

{{"demo": "ArrowSwitcherComponentProps.js", "defaultCodeOpen": false}}

### Component

You can pass custom components to replace the icons, as shown below:

{{"demo": "ArrowSwitcherComponent.js", "defaultCodeOpen": false}}

## Shortcuts

You can add shortcuts to every Picker component.
For more information, check the [dedicated page](/x/react-date-pickers/shortcuts/).
