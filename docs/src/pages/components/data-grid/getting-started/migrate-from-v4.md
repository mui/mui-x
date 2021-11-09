---
title: Data Grid - Migrate from v4
---

<p class="description">MUI X v5 is now stable!</p>

## Introduction

This a reference for upgrading your site from MUI X v4 to v5. MUI X v5 is fully compatible with MUI Core v5 and can be used with MUI Core v4 with some additional steps.
Most breaking changes are renaming of CSS classes or variables to improve the consistency of the grid.

## Using MUI X v5 with MUI Core v4

We strongly recommend you to migrate both MUI X and MUI Core to v5.
Depending on the complexity of the application however, this might not be possible.
An alternative is to install MUI Core v4 alongside to v5, and to configure them to avoid conflicts.
This can be achieved with the following steps:

1. First, make sure you have MUI Core v5 installed. If not, install it with these [instructions](/components/data-grid/getting-started/#installation).

2. Add a custom [`createGenerateClassName`](/styles/api/#heading-creategenerateclassname-options-class-name-generator) to disable the generation of global class names in JSS.

```jsx
import { createGenerateClassName } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
  // By enabling this option, if you have non-MUI elements (e.g. `<div />`)
  // using MUI classes (e.g. `.MuiButton`) they will lose styles.
  // Make sure to convert them to use `styled()` or `<Box />` first.
  disableGlobal: true,
  // Class names will receive this seed to avoid name collisions.
  seed: 'mui-jss',
});
```

3. Create a v5 theme with the same customizations as the v4 theme. This has to be done as the theme is not shared between different MUI Core versions.

```jsx
import { createMuiTheme as createThemeV4 } from '@material-ui/core/styles';
import { createTheme as createThemeV5 } from '@mui/material/styles';

const themeV4 = createThemeV4({
  palette: {
    primary: {
      main: '#2196f3',
    },
  },
});

const themeV5 = createThemeV5({
  palette: {
    primary: {
      main: theme.palette.primary.main,
    },
  },
});
```

4. Apply the class name generator and v5 theme to the application.

```jsx
import * as React from 'react';
import { ThemeProvider as ThemeProviderV5 } from '@mui/material/styles';
import { ThemeProvider as ThemeProviderV4, StylesProvider } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({ ... });
const themeV4 = createThemeV4({ ... });
const themeV5 = createThemeV5({ ... });

export default function DataGridDemo() {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProviderV4 theme={themeV4}>
        <ThemeProviderV5 theme={themeV5}>
          {/* Your component tree. */}
        </ThemeProviderV5>
      </ThemeProviderV4>
    </StylesProvider>
  );
}
```

The following interactive demo shows how these steps tie together:

{{"demo": "pages/components/data-grid/getting-started/DataGridV5WithCoreV4.js", "hideToolbar": true, "bg": true}}

## Migrating MUI X from v4

### CSS classes

- Some CSS classes were removed

  1. `.MuiDataGrid-window` was removed
  2. `.MuiDataGrid-windowContainer` was removed

- Some CSS classes were renamed

  1. `.MuiDataGrid-viewport` was renamed `.MuiDataGrid-virtualScroller`
  2. `.MuiDataGrid-dataContainer` was renamed `.MuiDataGrid-virtualScrollerContent`
  3. `.MuiDataGrid-renderingZone` was renamed `.MuiDataGrid-virtualScrollerRenderZone`
  4. `.MuiDataGrid-gridMenuList` was renamed `.MuiDataGrid-menuList`
  5. `.MuiGridToolbarContainer-root` was renamed `.MuiDataGrid-toolbarContainer`
  6. `.MuiGridMenu-root` was renamed `.MuiDataGrid-menu`
  7. `.MuiDataGridColumnsPanel-root` was renamed `.MuiDataGrid-columnsPanel`
  8. `.MuiGridPanel-root` was renamed `.MuiDataGrid-panel`
  9. `.MuiGridPanelContent-root` was renamed `.MuiDataGrid-panelContent`
  10. `.MuiGridPanelFooter-root` was renamed `.MuiDataGrid-panelFooter`
  11. `.MuiDataGridPanelHeader-root` was renamed `.MuiDataGrid-panelHeader`
  12. `.MuiGridPanelWrapper-root` was renamed `.MuiDataGrid-panelWrapper`
  13. `.MuiGridFilterForm-root` was renamed `.MuiDataGrid-filterForm`
  14. `.MuiGridToolbarFilterButton-root` was renamed `.MuiDataGrid-toolbarFilterList`

### Module augmentation

- The module augmentation is no longer enabled by default. This change was done to prevent conflicts with projects using `DataGrid` and `DataGridPro` together.

  In order to still be able to do overrides at the theme level, add the following imports to your project:

  ```diff
  +import type {} from '@mui/x-data-grid/themeAugmentation';
  +import type {} from '@mui/x-data-grid-pro/themeAugmentation';
  ```

### Virtualization

- The `onViewportRowsChange` prop and the `viewportRowsChange` event have been removed

  You can replace them with a listener on the `rowsScroll` event:

  ```tsx
  const apiRef = useGridApiRef();
  const prevRenderContext = React.useRef(null);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('rowsScroll', ({ renderContext }) => {
      if (
        !prevRenderContext.current ||
        renderContext.firstRowIdx !== prevRenderContext.current.firstRowIndex ||
        renderContext.lastRowIdx !== prevRenderContext.current.lastRowIndex
      ) {
        prevRenderContext.current = renderContext;
        const params = {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: renderContext.lastRowIndex,
        };
      }
    });
  }, [apiRef]);

  <DataGridPro apiRef={apiRef} />;
  ```

### Properties of the Grid

- Some event listeners and DOM attributes were removed from `GridCell` and `GridRow` to improve performances.

  The following props were removed.

  - `onCellBlur`
  - `onCellOver`
  - `onCellOut`
  - `onCellEnter`
  - `onCellLeave`
  - `onRowOver`
  - `onRowOut`
  - `onRowEnter`
  - `onRowLeave`

  If you depend on them, you can use `componentsProps.row` and `componentsProps.cell` to pass custom props to the row or cell.
  For more information, check [this page](https://mui.com/components/data-grid/components/#row). Example:

  ```diff
  -<DataGrid onRowOver={handleRowOver} />;
  +<DataGrid
  +  componentsProps={{
  +    row: { onMouseOver: handleRowOver },
  +  }}
  +/>;
  ```

  The `data-rowindex` and `data-rowselected` attributes were removed from the cell element. Equivalent attributes can be found in the row element.

  The `data-editable` attribute was removed from the cell element. Use the `.MuiDataGrid-cell--editable` CSS class.

  The `data-mode` attribute was removed from the cell element. Use the `.MuiDataGrid-cell--editing` CSS class.

### State access

- The state direct access is not considered part of the public API anymore. We only guarantee that the selectors continue to work between minor releases.
  We advise you to avoid accessing directly a state sub-key and to use selectors or `apiRef` methods whenever possible.
  You can replace the following state access by there matching selectors:

  | Direct state access     | Selector                           |
  | ----------------------- | ---------------------------------- |
  | `state.rows`            | `gridRowsStateSelector`            |
  | `state.filter`          | `gridFilterStateSelector`          |
  | `state.sorting`         | `gridSortingStateSelector`         |
  | `state.editRows`        | `gridEditRowsStateSelector`        |
  | `state.pagination`      | `gridPaginationSelector`           |
  | `state.columns`         | `gridColumnsSelector`              |
  | `state.columnMenu`      | `gridColumnMenuSelector`           |
  | `state.focus`           | `gridFocusStateSelector`           |
  | `state.tabIndex`        | `gridTabIndexStateSelector`        |
  | `state.selection`       | `gridSelectionStateSelector`       |
  | `state.preferencePanel` | `gridPreferencePanelStateSelector` |
  | `state.density`         | `gridDensitySelector`              |
  | `state.columnReorder`   | `gridColumnReorderSelector`        |
  | `state.columnResize`    | `gridColumnResizeSelector`         |

- The `apiRef.current.getState` method was removed. You can directly access the state through `apiRef.current.state`

  ```diff
  -const state = apiRef.current.getState();
  +const state = apiRef.current.state

  const filterModel = gridFilterModelSelector(state);
  ```

- The `state` prop was not working correctly and was removed.
  You can use the new `initialState` prop instead.

  Note that `initialState` only allows the `preferencePanel`, `filter.filterModel` and `sort.sortModel` keys.
  To fully control the state, use the feature's model prop and change callback (e.g. `filterModel` and `onFilterModelChange`).

  ```diff
  <DataGrid
  -  state={{
  +  initialState={{
      preferencePanel: {
        open: true,
        openedPanelValue: GridPreferencePanelsValue.filters,
      },
    }}
  />
  ```

- Some selectors have been renamed to match with our naming convention

  1. `unorderedGridRowIdsSelector` was renamed to `gridRowIdsSelector`
  2. `sortingGridStateSelector` was renamed to `gridSortingStateSelector`
  3. `sortedGridRowIdsSelector` was renamed to `gridSortedRowIdsSelector`
  4. `filterGridStateSelector` was renamed to `gridFilterModelSelector`
  5. `visibleSortedGridRowIdsSelector` was renamed to `gridVisibleSortedRowIdsSelector`
  6. `visibleGridRowCountSelector` was renamed to `gridVisibleRowCountSelector`
  7. `filterGridColumnLookupSelector` was renamed to `gridFilterActiveItemsLookupSelector`
  8. `densitySelector` was renamed to `gridDensitySelector`

- Some selectors have been removed / reworked

  1. `sortedGridRowsSelector` was removed. You can use `gridSortedRowEntriesSelector` instead.

  The return format has changed:

  ```diff
  -sortedGridRowsSelector: (state: GridState) => Map<GridRowId, GridRowModel>
  +gridSortedRowEntriesSelector: (state: GridState) => GridRowEntry[]
  ```

  If you need the old format, you can convert the selector return value as follows:

  ```diff
  -const map = sortedGridRowsSelector(state);
  +const map = new Map(gridSortedRowEntriesSelector(state).map(row => [row.id, row.model]));
  ```

  2. `filterGridItemsCounterSelector` was removed. You can use `gridFilterActiveItemsSelector`

  ```diff
  -const filterCount = filterGridItemsCounterSelector(state);
  +const filterCount = gridFilterActiveItemsSelector(state).length;
  ```

  3. `unorderedGridRowModelsSelector` was removed. You can use `apiRef.current.getRowModels` or `gridRowIdsSelector` and `gridRowsLookupSelector`

  ```diff
  -const rowModels = unorderedGridRowModelsSelector(apiRef.current.state);

  // using the `apiRef`
  +const rowModels = apiRef.current.getRowModels();

  // using selectors
  +const allRows = gridRowIdsSelector(apiRef.current.state);
  +const idRowsLookup = gridRowsLookupSelector(apiRef.current.state);
  +const rowModels = new Map(allRows.map((id) => [id, idRowsLookup[id]]));
  ```

  4. The `visibleSortedGridRowsSelector` was removed. You can use `gridVisibleSortedRowEntriesSelector`

  The return format has changed:

  ```diff
  -visibleSortedGridRowsSelector: (state: GridState) => Map<GridRowId, GridRowModel>;
  +gridVisibleSortedRowEntriesSelector: (state: GridState) => GridRowEntry[]
  ```

  If you need the old format, you can convert the selector return value as follows:

  ```diff
  -const map = visibleSortedGridRowsSelector(state);
  +const map = new Map(gridVisibleSortedRowEntriesSelector(state).map(row => [row.id, row.model]));
  ```

  5. The `visibleSortedGridRowsAsArraySelector` was removed. You can use `gridVisibleSortedRowEntriesSelector`

  The return format has changed:

  ```diff
  -visibleSortedGridRowsAsArraySelector: (state: GridState) => [GridRowId, GridRowData][];
  +gridVisibleSortedRowEntriesSelector: (state: GridState) => GridRowEntry[]
  ```

  If you need the old format, you can convert the selector return value as follows:

  ```diff
  -const rows = visibleSortedGridRowsAsArraySelector(state);
  +const rows = gridVisibleSortedRowEntriesSelector(state).map(row => [row.id, row.model])
  ```

### `apiRef`

- The `apiRef` methods to partially update the filter model have been renamed

  1. `apiRef.current.applyFilterLinkOperator` was renamed `apiRef.current.setFilterLinkOperator`
  2. `apiRef.current.upsertFilter` was renamed `apiRef.current.upsertFilterItem`
  3. `apiRef.current.deleteFilter` was renamed `apiRef.current.deleteFilterItem`

- The third argument in `apiRef.current.selectRow` is now inverted to keep consistency with other selection APIs.

  If you were passing `allowMultiple: true`, you should now pass `resetSelection: false` or stop passing anything

  If you were passing `allowMultiple: false` or not passing anything on `allowMultiple`, you should now pass `resetSelection: true`

  ```diff
  -selectRow: (id: GridRowId, isSelected?: boolean, allowMultiple?: boolean = false) => void;
  +selectRow: (id: GridRowId, isSelected?: boolean, resetSelection?: boolean = false) => void;
  ```

### Columns

- The params passed to the `valueFormatter` were changed.

  You can use the `api` to get the missing params.
  The `GridValueFormatterParams` interface has the following signature now:

  ```diff
  -export type GridValueFormatterParams = Omit<GridRenderCellParams, 'formattedValue' | 'isEditable'>;
  +export interface GridValueFormatterParams {
  +  /**
  +   * The column field of the cell that triggered the event
  +   */
  +  field: string;
  +  /**
  +   * The cell value, but if the column has valueGetter, use getValue.
  +   */
  +  value: GridCellValue;
  +  /**
  +   * GridApi that let you manipulate the grid.
  +   */
  +  api: any;
  +}
  ```

### Other exports

- The `gridCheckboxSelectionColDef` was renamed `GRID_CHECKBOX_SELECTION_COL_DEF`

- The individual string constant have been removed in favor of a single `gridClasses` object

  ```diff
  -const columnHeaderClass = GRID_COLUMN_HEADER_CSS_CLASS
  +const columnHeaderClass = gridClasses.columnHeader

  -const rowClass = GRID_ROW_CSS_CLASS
  +const rowClass = gridClasses.row

  -const cellClass = GRID_CELL_CSS_CLASS
  +const cellClass = gridClasses.cell

  -const columnSeparatorClass = GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS
  +const columnSeparatorClass = gridClasses['columnSeparator--resizable']

  -const columnHeaderTitleClass = GRID_COLUMN_HEADER_TITLE_CSS_CLASS
  +const columnHeaderTitleClass = gridClasses.columnHeaderTitle

  -const columnHeaderDropZoneClass = GRID_COLUMN_HEADER_DROP_ZONE_CSS_CLASS
  +const columnHeaderDropZoneClass = gridClasses.columnHeaderDropZone

  -const columnHeaderDraggingClass = GRID_COLUMN_HEADER_DRAGGING_CSS_CLASS
  +const columnHeaderDraggingClass = gridClasses["columnHeader--dragging"]
  ```

- The constants referring to the column types were removed
  Their value can be hardcoded.

  ```diff
  -const isColumnString = column.type === GRID_STRING_COLUMN_TYPE;
  +const isColumnString = col.type === 'string';

  -const isColumnNumber = col.type === GRID_NUMBER_COLUMN_TYPE;
  +const isColumnNumber = col.type === 'number';

  -const isColumnDate = col.type === GRID_DATE_COLUMN_TYPE;
  +const isColumnDate = col.type === 'date';

  -const isColumnDateTime = col.type === GRID_DATETIME_COLUMN_TYPE;
  +const isColumnDateTime = col.type === 'dateTime';

  -const isColumnBoolean = col.type === GRID_BOOLEAN_COLUMN_TYPE;
  +const isColumnBoolean = col.type === 'boolean';
  ```

- The hook `useGridSlotComponentProps` was removed.
  You can use the following hooks to access the same data.

  ```diff
  -const { apiRef, state, rootElement, options } = useGridSlotComponentProps();
  +const apiRef = useGridApiContext();
  +const [state] = useGridState(apiRef);
  +const rootElement = apiRef.current.rootElementRef;
  +const rootProps = useGridRootProps(); // equivalent of `options`
  ```

### Removal from public API

We removed some API methods / selectors from what we consider public by adding the `unstable_` prefix on them.
You can continue to use those methods if you really need to, but they may be removed / changed drastically on minor versions.
Most of the time, you should be able to avoid using them.

1. `apiRef.current.applyFilters` was renamed `apiRef.current.unstable_applyFilters`
2. `gridContainerSizesSelector` was renamed `unstable_gridContainerSizesSelector`
3. `gridViewportSizesSelector` was renamed `unstable_gridViewportSizesSelector`
4. `gridScrollBarSizeSelector` was renamed `unstable_gridScrollBarSizeSelector`
