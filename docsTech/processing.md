# Processing

## Introduction

Each feature is contained in a single hook, but features are not independent.

For example, the detail panel has an impact on the row height.

To allows hooks to interact and produce a coherent state, various patterns are presented on this page.

For each pattern, you will find a list of where such pattern is used, why it is necessary, and an overview of its behavior.

## Summary

- Pipe-processing
  - Plugin state enrichment
  - Add custom behavior to an api method
  - Feature limitation
  - Component children processing
- Family-processing

## Pipe-processing

A pipe processing is a pattern allowing plugins or components to enrich data used by another plugin.

We can classify the pipe-processing into several categories:

### Plugin state enrichment

**Goal**: Allow plugins to enrich another plugin state before saving it.

#### Processing list

##### `'hydrateColumns'`

**Publisher**: `useGridColumns` plugin before updating `state.columns`.

**Why register to this processing**: Add some columns (eg: processor of the Selection plugin) or re-order the columns (eg: processor of the Column Pinning plugin).

**Example**:

```ts
const addCustomFeatureColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
  (columnsState) => {
    const customFeatureColumn = getCustomFeatureColumn();
    const shouldHaveCustomFeatureColumn = !props.disableCustomFeature;
    const haveCustomFeatureColumn = columnsState.lookup[customFeatureColumn.field] != null;

    if (shouldHaveCustomFeatureColumn && !haveCustomFeatureColumn) {
      columnsState.lookup[customFeatureColumn.field] = customFeatureColumn;
      columnsState.all = [customFeatureColumn.field, ...columnsState.all];
    }
    // ⚠ The `columnsState` passed to the processors can contain the columns returned by the previous processing.
    // If the plugin is not enabled during the current processing, it must check if its columns are present, and if so remove them.
    else if (!shouldHaveCustomFeatureColumn && haveCustomFeatureColumn) {
      delete columnsState.lookup[customFeatureColumn.field];
      columnsState.all = columnsState.all.filter((field) => field !== customFeatureColumn.field);
    }

    return columnsState;
  },
  [apiRef, classes, getSelectionColumn],
);

useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
```

##### `'rowHeight'`

**Publisher**: `useGridRowsMeta` plugin before updating `state.rowsMeta` (it is called for each row).

**Why register to this processing**: Modify the base height of a row of add the height of some custom elements (eg: processor of the Detail Panel plugin increase the row height when the detail panel is open).

**Example**:

```ts
const addCustomFeatureHeight = React.useCallback<GridPipeProcessor<'rowHeight'>>(
  (initialValue, row) => {
    if (props.disableCustomFeature) {
      return {
        ...initialValue,
        customFeature: 0,
      };
    }

    return {
      ...initialValue,
      customFeature: customFeatureHeightLookup[row.id],
    };
  },
  [apiRef, customFeatureHeightLookup],
);

useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight);
```

### Add custom behavior to an api method

**Goal**: To add some data on the value returned by an api method (eg: `exportState`) or to apply some custom behavior based on the input value of an api method (eg: `restoreState`)

#### List

##### `'exportState'`

**Publisher**: `useGridStatePersistence` plugin when calling `apiRef.current.exportState`.

**Why register to this processing**: Add a portable state to the returned value of `apiRef.current.exportState`.

**Example**:

```ts
const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
  (prevState) => {
    const customFeatureModel = gridCustomFeatureModel(apiRef);

    // Avoids adding a value equals to the default value
    if (customFeatureModel.length === 0) {
      return prevState;
    }

    return {
      ...prevState,
      customFeature: {
        model: customFeatureModel,
      },
    };
  },
  [apiRef],
);

useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
```

##### `'restoreState'`

**Publisher**: `useGridStatePersistence` plugin when calling `apiRef.current.restoreState`.

**Why register to this processing**: Update the state based on the value passed to `apiRef.current.restoreState`.

**Example**:

```ts
const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
  (params, context) => {
    const customFeatureModel = context.stateToRestore.customFeature?.model;
    if (customFeatureModel == null) {
      return params;
    }
    // This part should not cause any re-render (no call to `apiRef.current.forceUpdate`)
    // Be carefull when calling methods like `apiRef.current.setCustomFeature` which often automatically triggers a re-render.
    apiRef.current.setState(mergeStateWithCustomFeatureModel(customFeatureModel));

    return {
      ...params,
      // Add a callback that will be run after all the processors are applied
      callbacks: [...params.callbacks, apiRef.current.applyCustomFeatureDerivedStates],
    };
  },
  [apiRef],
);

useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
```

##### `'scrollToIndexes'`

**Publisher**: `UseGridScroll` when calling `apiRef.current.scrollToIndexes`.

**Why register to this processing**: Modify the target scroll coordinates.

**Examples**:

```ts
const calculateScrollLeft = React.useCallback<GridPipeProcessor<'scrollToIndexes'>>(
  (initialValue, params) => {
    if (props.disableCustomFeature) {
      return initialValue;
    }

    return {
      ...initialValue,
      left: getCustomFeatureCompatibleScrollLeft(initialValue),
    };
  },
  [apiRef, props.disableCustomFeature],
);

useGridRegisterPipeProcessor(apiRef, 'scrollToIndexes', calculateScrollLeft);
```

### Feature limitation

**Goal**: To block the application of another plugin (eg: `canBeReorder`)

#### List

##### `'canBeReordered'` (pro only)

**Publisher**: `useGridColumnReorder` when dragging a column over another.

**Why register to this processing**:

**Example**:

```ts
const checkIfCanBeReordered = React.useCallback<GridPipeProcessor<'canBeReordered'>>(
  (initialValue, context) => {
    if (context.targetIndex === 0) {
      return false;
    }

    return initialValue;
  },
  [apiRef, pinnedColumns],
);

useGridRegisterPipeProcessor(apiRef, 'canBeReordered', checkIfCanBeReordered);
```

### Component children processing

**Goal**: Allow plugins to enrich the children of a component.

#### List

##### `'columnMenu'`

**Publisher**: `GridColumnMenu` component on render.

**Why register to this processing**: Add one or multiple menu items to `GridColumnMenu`.

**Example**:

```tsx
const addColumnMenuItems = React.useCallback<GridPipeProcessor<'columnMenu'>>(
  (initialValue, column) => {
    if (props.disableCustomFeature) {
      return initialValue;
    }

    if (column.hasCustomFeature === false) {
      return initialValue;
    }

    return [...initialValue, <Divider />, <GridCustoMFeatureMenuItems />];
  },
  [props.disableCustomFeature],
);

useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItems);
```

##### `'preferencePanel'`

**Publisher**: `GridPreferencePanel` component on render.

**Why register to this processing**: Modify the rendered panel in `GridPreferencePanel` based on the current value.

**Example**:

```tsx
const preferencePanelPreProcessing = React.useCallback<GridPipeProcessor<'preferencePanel'>>(
  (initialValue, value) => {
    if (value === GridPreferencePanelsValue.customFeature) {
      const CustomFeaturePanel = props.components.CustomFeaturePanel;
      return <CustomFeaturePanel {...props.componentsProps?.customFeaturePanel} />;
    }

    return initialValue;
  },
  [props.components.CustomFeaturePanel, props.componentsProps?.customFeaturePanel],
);

useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
```

> ⚠ This behavior should probably be improved to be a strategy processing to avoid having each processor check the value

## Strategy-processing

A strategy processing is a pattern allowing plugins or component to register processors that will be applied only when the correct strategy is active.

### Example

If we are using the Tree Data, we want the Tree Data plugin to be responsible for the following behaviors:

- Create the row tree
- Sort the rows
- Decide if a row matches the filters or not and if it should be expanded or not
