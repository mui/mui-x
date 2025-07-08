# Data Grid - Column groups

<p class="description">Group your columns.</p>

Grouping columns allows you to have a multi-level hierarchy of columns in your header.

## Define column groups

You can define column groups with the `columnGroupingModel` prop.
This prop receives an array of column groups.

A column group is defined by at least two properties:

- `groupId`: a string used to identify the group
- `children`: an array containing the children of the group

The `children` attribute can contain two types of objects:

- leafs with type `{ field: string }`, which add the column with the corresponding `field` to this group.
- other column groups which allows you to have nested groups.

:::warning
A column can only be associated with one group.
:::

```jsx
<DataGrid
  columnGroupingModel={[
    {
      groupId: 'internal data',
      children: [{ field: 'id' }],
    },
    {
      groupId: 'character',
      children: [
        {
          groupId: 'naming',
          children: [{ field: 'lastName' }, { field: 'firstName' }],
        },
        { field: 'age' },
      ],
    },
  ]}
/>
```

{{"demo": "BasicGroupingDemo.js", "bg": "inline"}}

## Customize column group

In addition to the required `groupId` and `children`, you can use the following optional properties to customize a column group:

- `headerName`: the string displayed as the column's name (instead of `groupId`).
- `description`: a text for the tooltip.
- `headerClassName`: a CSS class for styling customization.
- `renderHeaderGroup`: a function returning custom React component.

{{"demo": "CustomizationDemo.js", "bg": "inline"}}

## Group header height

By default, column group headers are the same height as [column headers](/x/react-data-grid/column-header/#header-height). This will be the default 56 pixels or a custom value set with the `columnHeaderHeight` prop.

The `columnGroupHeaderHeight` prop can be used to size column group headers independently of column headers.

{{"demo": "GroupHeaderHeight.js", "bg": "inline"}}

## Column reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

By default, the columns that are part of a group cannot be dragged to outside their group.
You can customize this behavior on specific groups by setting `freeReordering: true` in a column group object.

In the example below, the `Full name` column group can be divided, but not other column groups.

{{"demo": "BreakingGroupDemo.js", "disableAd": true, "bg": "inline"}}

## Collapsible column groups

The demo below uses [`renderHeaderGroup`](/x/react-data-grid/column-groups/#customize-column-group) to add a button to collapse/expand the column group.

{{"demo": "CollapsibleColumnGroups.js", "bg": "inline"}}

## Manage group visibility 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/6651) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to expand and collapse grouped columns to toggle their visibility.

## Column group ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/9448) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to drag and drop grouped headers to move all grouped children at once (which is [already possible for normal columns](/x/react-data-grid/column-ordering/)).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
