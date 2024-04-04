# Data Grid - State

<p class="description">Initialize and read the state of the Data Grid.</p>

## Initialize the state

Some state keys can be initialized with the `initialState` prop.
This prop has the same format as the returned value of `apiRef.current.exportState()`.

:::warning
The `initialState` can only be used to set the initial value of the state.
The Data Grid will not react if you change the `initialState` value later on.

If you need to fully control specific models, use the control props instead (for example [`prop.filterModel`](/x/react-data-grid/filtering/#controlled-filters) or [`prop.sortModel`](https://mui.com/x/react-data-grid/sorting/#controlled-sort-model)).
You can find more information on the corresponding feature documentation page.
:::

{{"demo": "InitialState.js", "bg": "inline"}}

## Access the state

The state is exposed on the `apiRef` object.

:::warning
Do not access state values directly.
The state itself is not considered a public API and its structure can change.
:::

The `@mui/x-data-grid-pro` package exposes a set of state selectors that take the `apiRef.current.state` as an argument and return a value.
You can use them to get data from the state without worrying about its internal structure.

### Direct selector access

The simplest way to use a selector is to call it as a function with `apiRef` as its first argument:

```tsx
const paginationModel = gridPaginationModelSelector(apiRef);
```

:::warning
Calling with `apiRef.current.state` also works, but may cause side effects when multiple Data Grid instances are present on a single page.
If you still need to call it with the state, don't forget to pass the instance ID as the example:

```tsx
const paginationModel = gridPaginationModelSelector(
  apiRef.current.state,
  apiRef.current.instanceId,
);
```

:::

{{"demo": "DirectSelector.js", "bg": "inline"}}

### With useGridSelector

If you only need to access the state value in the render of your components, use the `useGridSelector` hook.
This hook ensures there is a reactive binding such that when the state changes, the component in which this hook is used is re-rendered.

```tsx
const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
```

:::warning
This hook can only be used inside the context of the Data Grid, such as within custom components.
Otherwise, you will get an error saying that the state is not initialized during the first render.
:::

{{"demo": "UseGridSelector.js", "bg": "inline"}}

### Catalog of selectors

Some selectors have not yet been documented.

{{"component": "modules/components/SelectorsDocs.js"}}

## Save and restore the state

The current state of the Data Grid can be exported using `apiRef.current.exportState()`.
It can then be restored by either passing the returned value to the `initialState` prop or to the `apiRef.current.restoreState()` method.

Watch out for controlled models and their callbacks (`onFilterModelChange` if you use `filterModel`, for instance), as the Data Grid calls those callbacks when restoring the state.
But if the callback is not defined or if calling it does not update the prop value, then the restored value will not be applied.

### Restore the state with initialState

You can pass the state returned by `apiRef.current.exportState()` to the `initialState` prop.

In the demo below, clicking on **Recreate the 2nd grid** will re-mount the second Data Grid with the current state of the first Grid.

{{"demo": "RestoreStateInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
If you restore the page using `initialState` before the data is fetched, the Data Grid will automatically move to the first page.
:::

### Save and restore the state from external storage

You can use `apiRef.current.exportState()` to save a snapshot of the state to an external storage (for example using local storage or redux).
This way the state can be persisted on refresh or navigating to another page.

In the following demo, the state is saved to `localStorage` and restored when the page is refreshed.
This is done by listening on the `beforeunload` event.
When the component is unmounted, the `useLayoutEffect` cleanup function is being used instead.

{{"demo": "SaveAndRestoreStateInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

### Restore the state with apiRef

You can pass the state returned by `apiRef.current.exportState()` to the `apiRef.current.restoreState` method.
In the demo below, clicking on **Save current view** will create a snapshot of the changes made in the state, considering the initial state.
You can apply these changes on the Data Grid later selecting a saved view in the **Custom view** menu.

{{"demo": "RestoreStateApiRef.js", "bg": "inline", "defaultCodeOpen": false}}

#### Restore part of the state

It is possible to restore specific properties of the state using the `apiRef.current.restoreState()` method.
For instance, to only restore the pinned columns:

```ts
apiRef.current.restoreState({
  pinnedColumns: ['brand'],
});
```

:::warning
Most of the state keys are not fully independent.

Restoring pagination without restoring filters or sorting will work, but the rows displayed after the re-import will not be the same as before the export.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
