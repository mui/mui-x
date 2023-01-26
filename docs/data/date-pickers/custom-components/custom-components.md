---
product: date-pickers
title: Date and Time pickers - Custom components
components: DateTimePickerTabs
---

# Custom components

<p class="description">The date picker lets you customize sub-components.</p>

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

## Action bar

### Component props

The action bar is available on all picker components.
It is located at the bottom of the picker's views.
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
| -------- | ---------------------------------------------------------------------- |
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

## Arrow switcher

The following slots let you customize how to render the buttons and icons for an arrow switcher component—the component
to navigate to the "Previous" and "Next" steps of the picker: `PreviousIconButton`, `NextIconButton`, `LeftArrowIcon`, `RightArrowIcon`.

### Component props

You can pass props to the icons and buttons as shown below:

{{"demo": "ArrowSwitcherComponentProps.js", "defaultCodeOpen": false}}

### Component

You can pass custom components—to replace the icons, for example—as shown below:

{{"demo": "ArrowSwitcherComponent.js", "defaultCodeOpen": false}}
