# Data Grid - Custom slots and subcomponents

<p class="description">Learn how to override parts of the grid.</p>

## Interacting with the Data Grid

The grid exposes two hooks to help you access the Data Grid data while overriding component slots.

They can be used as below:

- `useGridApiContext`: returns the `apiRef` object (more details on the [API object page](/x/react-data-grid/api-object/#inside-the-data-grid)).
- `useGridSelector`: returns the result of a selector on the current state (more details on the [State page](/x/react-data-grid/state/#access-the-state)).

```tsx
function CustomPagination() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      count={pageCount}
      page={paginationModel.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
```

## Component slots

:::success

- See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
- See [`GridSlotsComponent`](/x/api/data-grid/data-grid/#slots) to learn about the available slots.

  :::

### Columns panel

In the following demo, the columns panel is replaced with a custom component that represents the [column groups](/x/react-data-grid/column-groups/) as a nested list.

{{"demo": "CustomColumnsPanel.js", "bg": "inline"}}

### Column menu

As mentioned above, the column menu is a component slot that can be recomposed easily and customized on each column as in the demo below.

{{"demo": "CustomColumnMenu.js", "bg": "inline"}}

### Toolbar

To enable the toolbar you need to add the `toolbar: GridToolbar` to the Data Grid `slots` prop.
This demo showcases how this can be achieved.

{{"demo": "ToolbarGrid.js", "bg": "inline"}}

You can also compose your own toolbar. Each button in the toolbar is wrapped with a tooltip component.
In order to override some of the props corresponding to the toolbar buttons, you can use the `slotProps` prop.

The following demo shows how to override the tooltip title of the density selector and the variant of the export button.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      />
    </GridToolbarContainer>
  );
}
```

{{"demo": "CustomToolbarGrid.js", "bg": "inline"}}

### Footer

The grid exposes props to hide specific elements of the UI:

- `hideFooter`: If `true`, the footer component is hidden.
- `hideFooterRowCount`: If `true`, the row count in the footer is hidden.
- `hideFooterSelectedRowCount`: If `true`, the selected row count in the footer is hidden.
- `hideFooterPagination`: If `true`, the pagination component in the footer is hidden.

{{"demo": "CustomFooter.js", "bg": "inline"}}

### Pagination

The default pagination component is exported as `GridPagination`.
This component is an extension of the [TablePagination](/material-ui/react-pagination/#table-pagination) component, and it renders the page size control, the number of rows in the page and also the buttons to go to the previous and next page.
You can replace the pagination component completely or reuse the default one.

The next demo reuses `GridPagination` but replaces the previous and next page buttons with [Pagination](/material-ui/react-pagination/), which renders a dedicated button for each page.

{{"demo": "CustomPaginationGrid.js", "bg": "inline"}}

### Row

The `slotProps.row` prop can be used to pass additional props to the row component.
One common use case might be to listen for events not exposed by [default](/x/react-data-grid/events/#catalog-of-events).
The demo below shows a context menu when a row is right-clicked.

{{"demo": "RowContextMenu.js", "bg": "inline"}}

### Cell

The following demo uses the `slotProps.cell` prop to listen for specific events emitted by the cells.
Try it by hovering a cell with the mouse and it should display the number of characters each cell has.

{{"demo": "CellWithPopover.js", "bg": "inline"}}

### Icons

As any component slot, every icon can be customized. However, it is not yet possible to use the `slotProps` with icons.

{{"demo": "CustomSortIcons.js", "bg": "inline"}}

### Overlays

See the [Overlays](/x/react-data-grid/overlays/) documentation on how to customize the `loadingOverlay`, `noRowsOverlay`, and `noResultsOverlay`.

## Custom slot props with TypeScript

:::success
This section focuses on module augmentation.

See [Custom slots and subcomponents—Usage with TypeScript](/x/common-concepts/custom-components/#usage-with-typescript) if you don't want to use this approach.
:::

If the custom component requires additional props to work properly, TypeScript may throw type errors.
To solve these type errors, use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to enhance the props interface.

The naming of overridable interfaces uses a pattern like this:

```js
`${slotNameInPascalCase}PropsOverrides`;
```

For example, for `columnMenu` slot, the interface name would be `ColumnMenuPropsOverrides`.

This [file](https://github.com/mui/mui-x/blob/-/packages/x-data-grid/src/models/gridSlotsComponentsProps.ts) lists all the interfaces for each slot that could be used for augmentation.

<codeblock storageKey="pricing-plan">

```tsx Community
// augment the props for the toolbar slot
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    someCustomString: string;
    someCustomNumber: number;
  }
}

<DataGrid
  slots={{
    // custom component passed to the toolbar slot
    toolbar: CustomGridToolbar,
  }}
  slotProps={{
    toolbar: {
      // props used by CustomGridToolbar
      someCustomString: 'Hello',
      someCustomNumber: 42,
    },
  }}
/>;
```

```tsx Pro
// augment the props for the toolbar slot
declare module '@mui/x-data-grid-pro' {
  interface ToolbarPropsOverrides {
    someCustomString: string;
    someCustomNumber: number;
  }
}

<DataGridPro
  slots={{
    // custom component passed to the toolbar slot
    toolbar: CustomGridToolbar,
  }}
  slotProps={{
    toolbar: {
      // props used by CustomGridToolbar
      someCustomString: 'Hello',
      someCustomNumber: 42,
    },
  }}
/>;
```

```tsx Premium
// augment the props for the toolbar slot
declare module '@mui/x-data-grid-premium' {
  interface ToolbarPropsOverrides {
    someCustomString: string;
    someCustomNumber: number;
  }
}

<DataGridPremium
  slots={{
    // custom component passed to the toolbar slot
    toolbar: CustomGridToolbar,
  }}
  slotProps={{
    toolbar: {
      // props used by CustomGridToolbar
      someCustomString: 'Hello',
      someCustomNumber: 42,
    },
  }}
/>;
```

</codeblock>

This demo below shows how to use the `slotProps` prop and module augmentation to pass a new prop `status` to the `footer` slot.

{{"demo": "CustomFooter.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
