---
product: date-pickers
title: Date and Time pickers - Custom components
---

# Custom components

<p class="description">The date picker let the user select a date.</p>

## Overriding components

You can override the internal elements of the component (known as "slots") using the `components` prop.

Use the `componentsProps` prop if you need to pass additional props to a component slot.

As an example, you could override the action bar and pass additional props as below.

```jsx
<DatePicker
  {...otherProps}
  components={{
    ActionBar: CustomActionBar,
  }}
  componentsProps={{
    actionBar: ['clear'],
  }}
/>
```

:::info
The casing is different between the `components` (ActionBar) and `componentsProps` (actionBar) props.
:::

## Action bar

### Component props

The action bar is available on all the pickers component and is located at the bottom of the picker's views.
By default, it contains no action on desktop and the action _Cancel_ and _Accept_ on mobile.

You can override the action displayed using the `actions` prop passed to this component.

```jsx
<DatePicker
  componentsProps={{
    actionBar: {
      // The actions will be the same between desktop and mobile
      actions: ['clear'],

      // The actions will be different between desktop and mobile
      actions: (variant) => (variant === 'desktop' ? [] : ['clear']),
    },
  }}
/>
```

In the example below, the action bar contains only one button to reset to today's date:

{{"demo": "ActionBarComponentProps.js"}}

#### Available actions

The build-in `ActionBar` component supports 4 different actions:

| Action   | Behavior                                                               |
| -------- | ---------------------------------------------------------------------- |
| `accept` | Accept the current value and close the picker view                     |
| `cancel` | Resets to the last accepted date and close the picker view             |
| `clear`  | Resets to the empty value and close the picker view                    |
| `today`  | Reset to today's date (and time if relevant) and close the picker view |

### Component

If the customization above are not flexible enough, you can provide a custom component.
This can be used in combination with `componentsProps`.

In the example below, the actions are the same as in the section above, but they are rendered inside a menu:

{{"demo": "ActionBarComponent.js"}}
