# Processing

## Introduction

## Pipe-processing

### List of pipe-processing

#### `canBeReordered` (pro only)

**Publisher**: `useGridColumnReorder` when dragging a column over another.

**Why register to this processing**:

**Example**:

```ts
// Column Pinning plugin
const checkIfCanBeReordered = React.useCallback<GridPipeProcessor<'canBeReordered'>>(
  (initialValue, { targetIndex }) => {
    const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
      pinnedColumns,
      gridVisibleColumnFieldsSelector(apiRef),
    );

    if (leftPinnedColumns.length === 0 && rightPinnedColumns.length === 0) {
      return initialValue;
    }

    if (leftPinnedColumns.length > 0 && targetIndex < leftPinnedColumns.length) {
      return false;
    }

    if (rightPinnedColumns.length > 0) {
      const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
      const firstRightPinnedColumnIndex = visibleColumns.length - rightPinnedColumns.length;
      return targetIndex >= firstRightPinnedColumnIndex ? false : initialValue;
    }

    return initialValue;
  },
  [apiRef, pinnedColumns],
);

useGridRegisterPipeProcessor(apiRef, 'canBeReordered', checkIfCanBeReordered);
```

#### `columnMenu`

**Publisher**: `GridColumnMenu` component on render.

**Why register to this processing**: Add one or multiple menu items to `GridColumnMenu`.

**Example**:

```tsx
// Column pinning plugin
const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
  (initialValue, column) => {
    if (props.disableColumnPinning) {
      return initialValue;
    }

    if (column.pinnable === false) {
      return initialValue;
    }

    return [...initialValue, <Divider />, <GridColumnPinningMenuItems />];
  },
  [props.disableColumnPinning],
);

useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
```

#### `exportState`

**Publisher**: `useGridStatePersistence` plugin when calling `apiRef.current.exportState`.

**Why register to this processing**: Add a portable state to the returned value of `apiRef.current.exportState`.

**Example**:

```ts
// Sorting plugin
const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
  (prevState) => {
    const sortModelToExport = gridSortModelSelector(apiRef);
    // Avoids adding a value equals to the default value
    if (sortModelToExport.length === 0) {
      return prevState;
    }

    return {
      ...prevState,
      sorting: {
        sortModel: sortModelToExport,
      },
    };
  },
  [apiRef],
);

useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
```

#### `hydrateColumns`

**Publisher**: `useGridColumns` plugin before updating `state.columns`.

**Why register to this processing**: Add some columns (eg: processor of the Selection plugin) or re-order the columns (eg: processor of the Column Pinning plugin).

**Example**:

```ts
// Selection plugin
const updateSelectionColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
  (columnsState) => {
    const selectionColumn = getSelectionColumn();
    const shouldHaveSelectionColumn = props.checkboxSelection;
    const haveSelectionColumn = columnsState.lookup[selectionColumn.field] != null;

    if (shouldHaveSelectionColumn && !haveSelectionColumn) {
      columnsState.lookup[selectionColumn.field] = selectionColumn;
      columnsState.all = [selectionColumn.field, ...columnsState.all];
    } else if (!shouldHaveSelectionColumn && haveSelectionColumn) {
      delete columnsState.lookup[selectionColumn.field];
      columnsState.all = columnsState.all.filter((field) => field !== selectionColumn.field);
    }

    return columnsState;
  },
  [apiRef, classes, getSelectionColumn],
);

useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
```

> ⚠ The `columnsState` passed to the processors can contain the columns returned by the previous processing.
> If the plugin is not enabled during the current processing, it must check if its columns are present, and if so remove them.

#### `preferencePanel`

**Publisher**: `GridPreferencePanel` component on render.

**Why register to this processing**: Modify the rendered panel in `GridPreferencePanel` based on the current value.

**Example**:

```tsx
// Columns plugin
const preferencePanelPreProcessing = React.useCallback<GridPipeProcessor<'preferencePanel'>>(
  (initialValue, value) => {
    if (value === GridPreferencePanelsValue.columns) {
      const ColumnsPanel = props.components.ColumnsPanel;
      return <ColumnsPanel {...props.componentsProps?.columnsPanel} />;
    }

    return initialValue;
  },
  [props.components.ColumnsPanel, props.componentsProps?.columnsPanel],
);

useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
```

> ⚠ This behavior should probably be improved to be a strategy processing to avoid having each processor check the value

#### `restoreState`

**Publisher**: `useGridStatePersistence` plugin when calling `apiRef.current.restoreState`.

**Why register to this processing**: Update the state based on the value passed to `apiRef.current.restoreState`.

**Example**:

```ts
// Sorting plugin
const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
  (params, context) => {
    const sortModel = context.stateToRestore.sorting?.sortModel;
    if (sortModel == null) {
      return params;
    }
    apiRef.current.setState(
      mergeStateWithSortModel(sortModel, props.disableMultipleColumnsSorting),
    );

    return {
      ...params,
      // Add a callback that will be run after all the processors are applied
      callbacks: [...params.callbacks, apiRef.current.applySorting],
    };
  },
  [apiRef, props.disableMultipleColumnsSorting],
);

useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
```

#### `rowHeight`

**Publisher**: `useGridRowsMeta` plugin before updating `state.rowsMeta` (it is called for each row).

**Why register to this processing**: Modify the base height of a row of add the height of some custom elements (eg: processor of the Detail Panel plugin).

**Example**:

```ts
// Master Detail plugin
const addDetailHeight = React.useCallback<GridPipeProcessor<'rowHeight'>>(
  (initialValue, row) => {
    if (expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
      return { ...initialValue, detail: 0 };
    }
    const heightCache = gridDetailPanelExpandedRowsHeightCacheSelector(apiRef.current.state);
    return {
      ...initialValue,
      detail: heightCache[row.id] ?? 0,
    };
  },
  [apiRef, expandedRowIds],
);

useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight);
```

##### `scrollToIndexes`

**Publisher**: `UseGridScroll` when calling `apiRef.current.scrollToIndexes`.

**Why register to this processing**: Modify the target scroll coordinates.

**Examples**:

```ts
// Column Pinning plugin
const calculateScrollLeft = React.useCallback<GridPipeProcessor<'scrollToIndexes'>>(
  (initialValue, params) => {
    if (props.disableColumnPinning) {
      return initialValue;
    }

    const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
    const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
      pinnedColumns,
      visibleColumnFields,
    );

    if (!params.colIndex || (leftPinnedColumns.length === 0 && rightPinnedColumns.length === 0)) {
      return initialValue;
    }

    return {
      ...initialValue,
      left: getColumnPinningCompatibleScrollLeft(initialValue),
    };
  },
  [apiRef, pinnedColumns, props.disableColumnPinning],
);

useGridRegisterPipeProcessor(apiRef, 'scrollToIndexes', calculateScrollLeft);
```
