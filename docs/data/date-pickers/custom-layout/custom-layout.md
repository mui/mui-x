---
product: date-pickers
title: Date and Time pickers - Custom layout
components: PickersActionBar, PickersLayout
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Custom layout

<p class="description">The Date and Time Pickers let you reorganize the layout</p>

## Default layout structure

By default, pickers are made of 4 sub elements present in the following order:

- The **toolbar** displaying the selected date. Can be enforced with `showToolbar` prop.
- The **content** displaying the current view. Can be a calendar, or a clock.
- The **tabs** allowing to switch between day and time views in Date Time Pickers.
- The **action bar** allowing some interactions. Can be added with [`componentsProps.actionBar`](/x/react-date-pickers/custom-components/#action-bar) prop.

By default the `content` and `tabs` are wrapped together in a `contentWrapper` to simplify the layout.

You can [customize those components](/x/react-date-pickers/custom-components/) individually by using `components` and `componentsProps`.

## Orientation

Toggling layout can be achieved by changing `orientation` prop value between `'portrait'` or `'landscape'`.

Here is a demonstration with the 3 main blocks outlined with color borders.

{{"demo": "LayoutBlocks.js", "hideToolbar": true, "bg": "inline"}}

## Layout structure

A `<PickersLayoutRoot />` wraps all the subcomponents to provide the structure.
By default it renders a `div` with `display: grid`.
Such that all subcomponents are placed in a 3 by 3 [CSS grid](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout).

```jsx
<PickersLayoutRoot>
  {toolbar}
  <PickersLayoutContentWrapper>
    {tabs}
    {content}
  </PickersLayoutContentWrapper>
  {actionBar}
</PickersLayoutRoot>
```

## CSS customization

To move an element, you can override its position in the layout with [`gridColumn`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [`gridRow`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row) properties.

In the next example, the action bar is replaced by a list and then placed on the left side of the content.
It's achieved by applying the `{ gridColumn: 1, gridRow: 2 }` style.

:::warning
If you are using custom components, you should pay attention to `className`.
To make CSS selectors work, you can either propagate `className` to the root element like in the demo, or use your own CSS class.
:::

{{"demo": "MovingActions.js"}}

## DOM customization

It's important to note that by modifying the layout with CSS, the new positions can lead to inconsistencies between the visual render and the DOM structure.
In the previous demonstration, the tab order is broken because the action bar appears before the calendar, whereas in the DOM the action bar is still after.

To modify the DOM structure, you can create a custom `Layout` wrapper.
Use the `usePickerLayout` hook to get the subcomponents React nodes.
Then you can fully customize the DOM structure.

```jsx
import {
  usePickerLayout,
  PickersLayoutRoot,
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';

const MyCustomLayout = (props) => {
  const { toolbar, tabs, content, actionBar } = usePickerLayout(props);

  // Put the action bar before the content
  return (
    <PickersLayoutRoot className={pickersLayoutClasses.root} ownerState={props}>
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
};
```

:::info
This slot can also be used to add additional information in the layout.
:::

Here is the complete example with a fix for the tabulation order and an external element added to the layout.
Notice the use of `pickersLayoutClasses`, `PickersLayoutRoot`, and `PickersLayoutContentWrapper` to avoid rewriting the default CSS.

{{"demo": "AddComponent.js", "defaultCodeOpen": false}}

### Mobile keyboard view

The previous versions of the mobile pickers had the ability to switch to a keyboard view inside the modal to edit directly with the input.

This feature has been removed in v6 in favor of standalone field components and future editable field inside the pickers.
But you can add back this feature using the `Layout` component slot:

{{"demo": "MobileKeyboardView.js", "defaultCodeOpen": false}}
