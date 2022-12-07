---
product: date-pickers
title: Date and Time pickers - Custom layout
---

# Custom layout

<p class="description">The date picker lets you reorganize its layout</p>

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

The layout is structured as follows:

A `<PickersViewLayoutRoot />` wraps all the sub-components to provide the structure.
By default it renders a `div` with `display: grid`.
Such that all sub-components take place into a 3 by 3 [CSS grid](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout).

Subcomponents are wrapped inside layout helper, responsible for placing it into the grid.
Here is an overview of the structure.

```jsx
<PickersViewLayoutRoot>
  {toolbar}
  <PickersViewLayoutContentWrapper>
    {tabs}
    {content}
  </PickersViewLayoutContentWrapper>
  {actionBar}
</PickersViewLayoutRoot>
```

## CSS customization

To move an element—the easiest way is to override it's wrapper position with [`gridColumn`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [`gridRow`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row) properties.

In the next example, the action bar is replaced by a list, and placed at the left of the component.
Placing at the right is achieved by applying `{ gridColumn: 1, gridRow: 2 }` style to it.

{{"demo": "MovingActions.js"}}

## DOM customization

In the demonstration above, the layout is modified thanks to CSS.
Such modification can lead to inconsistencies between the visual aspect, and the DOM structure.
In the previous demonstration, the tab order is broken, because the action bar appears before the calendar whereas in the DOM the action bar is still after the calendar.

To modify the DOM structure, you can create your own `Layout` component.
To simplify the job, use the `usePickerLayout` hook which takes Layout's props as an input and returns React nodes.
Then you can fully customize the DOM structure.

```jsx
const { usePickerLayout } from '@mui/x-date-pickers/PickersViewLayout';

const MyCustomLayout = (props) => {
  const { toolbar, tabs, content, actionBar} = usePickerLayout(props);

  // Put the action bar before the content
  return <div>
    {toolbar}
    {actionBar}
    {content}
  </div>
}
```

This slot can also be used to add additional information in the layout.

Here is the previous demonstration with a fix for the tabulation order and logo added into the layout.
Notice the use of `pickersViewLayoutClasses`, `PickersViewLayoutRoot`, and `PickersViewLayoutContentWrapper` to avoid having to rewrite the default CSS.

{{"demo": "AddComponent.js", "defaultCodeOpen": false}}
