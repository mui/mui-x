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

## Column reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

By default, the columns that are part of a group cannot be dragged to outside their group.
You can customize this behavior on specific groups by setting `freeReordering: true` in a column group object.

In the example below, the `Full name` column group can be divided, but not other column groups.

{{"demo": "BreakingGroupDemo.js", "disableAd": true, "bg": "inline"}}

## Manage group visibility 🚧

The column group should allow to switch between an extended/collapsed view which hide/show some columns.

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #6651](https://github.com/mui/mui-x/issues/6651) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::

## Column group ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

Users could drag and drop group header to move all the group children at once, [like they can already do it with normal columns](/x/react-data-grid/column-ordering/).

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #9448](https://github.com/mui/mui-x/issues/9448) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
