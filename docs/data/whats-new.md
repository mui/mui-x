# ✨ What's new in MUI X v6? ✨

<p class="description">Discover the new features on the latest major version.</p>

:::info
🔥 Head over to the [v6 announcement blog post](https://mui.com/blog/mui-x-v6/) for a detailed overview of each new feature.
:::

## Data Grid

- [ApiRef available in the community version](/x/react-data-grid/api-object/)

  Manage pagination, scrolling, state, and other attributes through the Data Grid's API object—previously available only in commercial plans, now accessible to all.

- [Improved column menu](/x/react-data-grid/column-menu/)

  The v6 column menu now provides support for icons, menu groups, custom items and actions, and more.
  We've redesigned this sub-component to make it as extensible as possible.

- [Cell range selection](/x/react-data-grid/cell-selection/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

  Select a cell or group of cells like in an Excel sheet.
  Cell selection is a powerful and flexible way to select data in the Data Grid.
  It's also the base for bulk editing and clipboard importing (coming soon).

## Date and Time pickers

- [Fields: the new default input for pickers](/x/react-date-pickers/fields/).

  These rich text fields are specialized for date and time logic and offer quick navigation and isolated interaction within each section of a date value.

- [Improved layout customization](/x/react-date-pickers/custom-layout/)

  Combining the slots concept with the grid layout, you can now rearrange, extend, and customize most of the sub-components used in the Pickers UI.

- [Shortcuts for picking specific dates in a calendar](/x/react-date-pickers/shortcuts/)

  Add quick and customizable shortcuts for your users. Particularly useful for date ranges.
  Display them on the left, right, bottom, or top.

- [Edit date ranges with drag and drop](/x/react-date-pickers/date-range-calendar/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

  Editing a date range is even easier now with the new drag-and-drop interface. Change `start` and `end` dates at will.

## Installation instructions

Install the latest v6 now to enjoy the new features and overall improvements!

- [Data Grid](/x/react-data-grid/getting-started/#installation)
- [Date and Time Pickers](/x/react-date-pickers/getting-started/#installation)

## Migrating from v5?

<!-- #default-branch-switch -->

Migration guides are available for both the [Data Grid](/x/migration/migration-data-grid-v5/) and [Date Pickers](/x/migration/migration-pickers-v5/), with a complete list of the breaking changes and an expanding list of [codemods](https://github.com/mui/mui-x/blob/master/packages/x-codemod/README.md) to support your migrating experience.
