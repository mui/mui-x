---
productId: x-date-pickers
title: Date and Time Pickers - Custom subcomponents
components: DateTimePickerTabs
---

# Custom subcomponents

<p class="description">The date picker lets you customize subcomponents.</p>

:::info
The components that can be customized are listed under `slots` section in Date and Time Pickers [API Reference](/x/api/date-pickers/).
For example, available Date Picker slots can be found [here](/x/api/date-pickers/date-picker/#slots).
:::

## Overriding components

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
const CustomActionBar = ({ name, setName }) => (
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
It allows to switch between date and time interfaces.

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
By default empty values are replaced by `__`.
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

## Arrow switcher

The following slots let you customize how to render the buttons and icons for an arrow switcher component—the component
to navigate to the "Previous" and "Next" steps of the picker: `PreviousIconButton`, `NextIconButton`, `LeftArrowIcon`, `RightArrowIcon`.

### Component props

You can pass props to the icons and buttons as shown below:

{{"demo": "ArrowSwitcherComponentProps.js", "defaultCodeOpen": false}}

### Component

You can pass custom components—to replace the icons, for example—as shown below:

{{"demo": "ArrowSwitcherComponent.js", "defaultCodeOpen": false}}

## Popper

You can customize the popper that wraps the desktop picker views the same way you would customize the [Material UI Popper](/material-ui/react-popper/).

:::info
When the picker views have different heights, there might be a layout shift if there is not enough space in the viewport for one of the views **below** the input field. This is particularly noticeable if the selection of allowed years is very limited and there is a significant height difference between the views. You can refer to issues [#5490](https://github.com/mui/mui-x/issues/5490) and [#9288](https://github.com/mui/mui-x/issues/9288) for more examples.

You can avoid this by customizing the popper height. This will not produce any visual changes, as the popper that wraps the pickers is transparent.
:::

{{"demo": "PopperComponent.js", "defaultCodeOpen": true}}

## Shortcuts

You can add shortcuts to every pickers.
For more information, check the [dedicated page](/x/react-date-pickers/shortcuts/)
