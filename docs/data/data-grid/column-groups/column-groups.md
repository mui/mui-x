---
title: Data Grid - Column groups
---

# Data Grid - Column groups

<p class="description">Group your columns.</p>

Grouping columns allows you to have multiple levels of columns in your header and the ability, if needed, to 'open and close' column groups to show and hide additional columns.

## Define column grouping

You can define the column grouping structure by providing `columnGroupingModel` prop to the data grid.
This prop receives an array of column group.

A column group is defined by at least two variables:

- `groupId` a string used to identify the group
- `children` an array containing the children of the group

The children can contains two types of objects:

- leafs with type `{ field: string }`, which add the column with the corresponding `field` to this group.
- other column groups which allows you to have nested groups.

:::warning
A column can only be associated with one group.
:::

```jsx
/*
The grouping model of
- internal
    * id
- perso
    - naming
        * last name
        * first name
    * age
*/
columnGroupingModel={[
    {
        groupId: "internal",
        children: [{ field: "id" }]
    },
    {
        groupId: "perso",
        children: [
            {
                groupId: "naming",
                children: [
                    { field: "lastName" },
                    { field: "firstName" },
                ]
            },
            { field: "age" }
        ]
    }
]}
```

{{"demo": "BasicGroupingDemo.js", "bg": "inline"}}

## Customize column group

In addition to the `groupId`, and `children` properties which are mandatory, you can add extra properties to a column group object to customize it:

- `headerName`: the sting displayed instead of `groupId`.
- `description`: a longer string displayed in a tooltip.
- `renderHeaderGroup`: a function returning custom React component.

{{"demo": "CustomizationDemo.js", "bg": "inline"}}

## Column reordering [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

By default, column groups can not be divided when reordering columns.
This default behavior can be removed on specific group by setting `freeReordering: true` in the column group object.

In the example bellow the `Character` column group can be divided, but not other column groups

{{"demo": "BreakingGroupDemo.js", "disableAd": true, "bg": "inline"}}

## Manage group visibility 🚧

:::warning
This feature isn't implemented yet. It's coming.
:::

The column group should allow to switch between an extended/collapsed view which hide/show some columns

## Reordering groups 🚧[<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

:::warning
This feature isn't implemented yet. It's coming.
:::

Users could drag and drop group header to move all the group children at once

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
