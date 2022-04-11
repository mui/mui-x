---
title: Data Grid - State
---

# Data Grid - State

<p class="description">Initialize and read the state of the data grid.</p>

## Initialize the state

Some state keys can be initialized with the `initialState` prop.
This prop has the same format as the returned value of `apiRef.current.exportState()`.

> ⚠️ The `initialState` can only be used to set the initial value of the state, the grid will not react if you change the `initialState` value later on.
>
> If you need to fully control specific models, use the control props instead (e.g. `prop.filterModel` or `prop.sortModel`).
> You can find more information on the corresponding feature documentation page.

{{"demo": "InitialState.js", "bg": "inline"}}

## Access the state [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The state is exposed on the `apiRef` object.
It is strongly advised not to access the state values directly because the state itself is not considered a public API and its structure can change.

The `@mui/x-data-grid-pro` package exposes a set of state selectors that take the `apiRef.current.state` as an argument and return a value.
You can use them to get data from the state without worrying about its internal structure.

### Direct selector access

The simplest way to use a selector is to call it as a function with `apiRef` as its first argument.

```tsx
const pageSize = gridPageSizeSelector(apiRef);
```

> **Note:** Calling with `apiRef.current.state` also works but it may cause side effects when multiple grid instances are in the same page.
> If you still need to call it with the state, do not forget to pass the instance ID as the example:
>
> ```tsx
> const pageSize = gridPageSizeSelector(
>   apiRef.current.state,
>   apiRef.current.instanceId,
> );
> ```

{{"demo": "DirectSelector.js", "bg": "inline"}}

### With `useGridSelector`

If you want to access sole state value in the render of your components, you can use the `useGridSelector` hook.

```tsx
const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
```

> ⚠️ This hook can only be used inside the context of the grid, such as custom components. Otherwise, you will have an error saying that the state is not initialized during the first render.

{{"demo": "UseGridSelector.js", "bg": "inline"}}

### Catalog of selectors

Some selectors are yet to be documented.

{{"demo": "SelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Save and restore the state

The current state of the grid can be exported using `apiRef.current.exportState()`.
It can then be restored by either passing the returned value to the `initialState` prop or to the `apiRef.current.restoreState()` method.

Watch out for controlled models and their callbacks (`onFilterModelChange` if you use `filterModel`, for instance), as the grid will call those callbacks when restoring the state.
But if the callback is not defined or if calling it does not update the prop value, then the restored value will not be applied.

> ⚠️ To avoid breaking changes, the grid only saves the column visibility if you are using the [new api](/x/react-data-grid/columns/#initialize-the-visible-columns)
> Make sure to initialize `props.initialState.columns.columnVisibilityModel` or to control `props.columnVisibilityModel`.
>
> The easier way is to initialize the model with an empty object:
>
> ```tsx
> <DataGrid
>   initialState={{
>     columns: { columnVisibilityModel: {} },
>   }}
> />
> ```

### Restore the state with `initialState`

You can pass the state returned by `apiRef.current.exportState()` to the `initialState` prop.
In the demo below, clicking on **Recreate the 2nd grid** will re-mount the 2nd grid with the current state of the 1st grid.

> ⚠️ If you restore the page using `initialState` before the data is fetched, the grid will automatically move to the 1st page.

{{"demo": "RestoreStateInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

### Restore the state with `apiRef` [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

You can pass the state returned by `apiRef.current.exportState()` to the `apiRef.current.restoreState` method.
In the demo below, clicking on **Save current view** will create a snapshot of the changes made in the state, considering the initial state.
You can apply these changes on the grid later selecting a saved view in the **Custom view** menu.

{{"demo": "RestoreStateApiRef.js", "bg": "inline", "defaultCodeOpen": false}}

#### Restore part of the state

It is possible to restore specific properties of the state using the `apiRef.current.restoreState()` method.
For instance, to only restore the pinned columns:

```ts
apiRef.current.restoreState({
  pinnedColumns: ['brand'],
});
```

> ⚠️ Most of the state keys are not fully independent.
>
> Restoring the pagination without restoring the filters or the sorting will work, but the rows displayed after the re-import will not be the same as before the export.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
