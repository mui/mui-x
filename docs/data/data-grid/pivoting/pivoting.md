---
title: Data Grid - Pivoting
---

# Data Grid - Pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Rearrange rows and columns to view data from multiple perspectives.</p>

The Data Grid Premium's pivoting feature lets users transform the data in their grid by reorganizing rows and columns, creating dynamic cross-tabulations of data.
This makes it possible to analyze data from different angles and gain insights that would be difficult to see in the default grid view.

:::success
If you're new to pivoting, check out the [Understanding pivoting](/x/react-data-grid/pivoting-explained/) page to learn what pivoting is and how it works through interactive examples.
:::

## Quick start

Pivoting is enabled by default and can be accessed through the icon in the toolbar.
In the demo below, the pivot panel is already open and some pivoting parameters have been set.
Use the **Pivot** switch at the top of the panel to toggle pivoting off and on.
You can drag and drop existing columns in the **Rows**, **Columns**, and **Values** dropdown menus to change how the data is pivoted.

{{"demo": "GridPivotingQuickStart.js", "bg": "inline", "defaultCodeOpen": false}}

## Pivot model

The pivot model is a configuration object that defines rows, columns, and values of the pivot Grid:

```tsx
interface GridPivotModel {
  rows: Array<{
    field: string;
    hidden?: boolean;
  }>;
  columns: Array<{
    field: string;
    sort?: 'asc' | 'desc';
    hidden?: boolean;
  }>;
  values: Array<{
    field: string;
    aggFunc: string;
    hidden?: boolean;
  }>;
}
```

## Initialize pivoting

Use the `initialState` prop to initialize uncontrolled pivoting.
This is the recommended method unless you specifically need to control the state.
You can initialize the pivot model, toggle pivot panel visibility, and toggle the pivot mode as shown below:

```tsx
<DataGridPremium
  initialState={{ pivoting: { model: pivotModel, active: true, panelOpen: true } }}
/>
```

{{"demo": "GridPivotingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

## Controlled pivoting

For fully controlled pivoting state, you can use the following props:

- Pivot model:
  - `pivotModel`: Controls the current pivot configuration.
  - `onPivotModelChange`: Callback fired when the pivot model changes.
- Pivot mode toggle:
  - `pivotActive`: Controls whether pivot mode is active.
  - `onPivotActiveChange`: Callback fired when the pivot mode changes between active and inactive.
- Pivot panel:
  - `pivotPanelOpen`: Controls whether the pivot panel is open.
  - `onPivotPanelOpenChange`: Callback fired when the pivot panel is opened or closed.

{{"demo": "GridPivotingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Using fields in the pivot model multiple times

While this is not supported yet, we are working to bring this feature to the Data Grid.

Subscribe to [this issue](https://github.com/mui/mui-x/issues/17302) to get notified when it's available.

## Disable pivoting

To disable pivoting, set the `disablePivoting` prop to `true`:

```tsx
<DataGridPremium disablePivoting />
```

## Derived columns in pivot mode

In pivot mode, it's often useful to group data by a year or quarter.
The Data Grid automatically generates year and quarter columns for each **Date** column for this purpose.

For example, the sales dataset we've been using throughout the examples has a **Quarter** column.
But often in real-world datasets, each sale record would have a precise **Transaction Date** field, like in the following demo.

The **Transaction Date** column is represented by additional columns in pivot mode: **Transaction Date (Year)** and **Transaction Date (Quarter)**:

{{"demo": "GridPivotingFinancial.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom derived columns

Use the `getPivotDerivedColumns` prop to customize derived columns.
This prop is called for each original column and returns an array of derived columns, or `undefined` if no derived columns are needed.

{{"demo": "GridGetPivotDerivedColumns.js", "bg": "inline", "defaultCodeOpen": true}}

## Sticky column groups

Depending on the pivot mode, some column groups might exceed the width of the Data Grid viewport.
To improve the user experience, you can make these column groups "sticky" so that the column group labels remain visible while scrolling horizontally.

You can use the `sx` prop to apply the necessary styles:

```tsx
<DataGridPremium
  sx={{
    '& .MuiDataGrid-columnHeader--filledGroup': {
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        overflow: 'visible',
      },
      '& .MuiDataGrid-columnHeaderTitleContainerContent': {
        position: 'sticky',
        left: 8,
      },
    },
  }}
/>
```

{{"demo": "GridPivotingMovies.js", "bg": "inline", "defaultCodeOpen": false}}

## Advanced demo

{{"demo": "GridPivotingCommodities.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
