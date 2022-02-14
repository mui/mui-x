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

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #820](https://github.com/mui/mui-x/issues/820) if you want to see it land faster.

[//]: # 'The current state of the grid can be exported using `apiRef.current.exportState()`.'
[//]: # 'It can then be restored by either passing it to the `initialState` prop or to the `apiRef.current.restoreState()` method.'
[//]: #
[//]: # 'Watch out for controlled models and their callbacks (`onFilterModelChange` if you use `filterModel` for instance), the grid will call those callbacks when restoring the state.'
[//]: # 'But if the callback is not defined or if calling it does not update the prop value, then the restored value will not be applied.'
[//]: #
[//]: # '### Restore the state with `initialState`'
[//]: #
[//]: # '> ⚠️ If you restore the page using `initialState` before the data is fetched, the grid will automatically move to the 1st page.'
[//]: #
[//]: # '{{"demo": "RestoreStateInitialState.js", "bg": "inline", "defaultCodeOpen": false}}'
[//]: #
[//]: # '### Restore the state with `apiRef` [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)'
[//]: #
[//]: # '{{"demo": "RestoreStateApiRef.js", "bg": "inline", "defaultCodeOpen": false}}'
[//]: #
[//]: # '#### Restore part of the state'
[//]: #
[//]: # 'It is possible to restore specific properties of the state using the `apiRef.current.restoreState()` method.'
[//]: # 'For instance, to only restore the pinned columns:'
[//]: #
[//]: # '```ts'
[//]: # 'apiRef.current.restoreState({'
[//]: # "  pinnedColumns: ['brand'],"
[//]: # '});'
[//]: # '```'
[//]: #
[//]: # '> ⚠️ Most of the state keys are not fully independent.'
[//]: # '>'
[//]: # '> Restoring the pagination without restoring the filters or the sorting will work, but the rows displayed after the re-import will not be the same as before the export.'

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
