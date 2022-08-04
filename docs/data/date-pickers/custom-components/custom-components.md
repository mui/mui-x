---
product: date-pickers
title: Date and Time pickers - Custom components
---

# Custom components

<p class="description">The date picker lets users select a date from a menu.</p>

## Overriding components

You can override the internal elements of the component (known as "slots") using the `components` prop.

Use the `componentsProps` prop if you need to pass additional props to a component slot.

As an example, you could override the `ActionBar` and pass additional props to the custom component as shown below:

```jsx
<DatePicker
  {...otherProps}
  components={{
    // Override default <ActionBar /> with a custom one
    ActionBar: CustomActionBar,
  }}
  componentsProps={{
    // pass props `actions={['clear']}` to the actionBar slot
    actionBar: { actions: ['clear'] },
  }}
/>
```

:::warning
The `components` prop uses Pascal case (`ActionBar`), while `componentsProps` uses camel case (`actionBar`).
:::

## Action bar

### Component props

The action bar is available on all picker components.
It is located at the bottom of the picker's views.
By default, it contains no action on desktop, and the actions **Cancel** and **Accept** on mobile.

You can override the action displayed by passing the `actions` prop to the `actionBar` within `componentsProps`, as shown here:

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
This can be used in combination with `componentsProps`.

In the example below, the actions are the same as in the section above, but they are rendered inside a menu:

{{"demo": "ActionBarComponent.js"}}
