---
title: Data Grid - State
---

# Data Grid - State

<p class="description">Initialize and read the state of the data grid.</p>

## Initialize the state

Some state keys can be initialized with the `initialState` prop.

> ⚠️ The `initialState` is only used to set the initial value of the state, the grid will not react if you change the `initialState` value later on.
>
> If you need to fully control some models, use the control props instead (e.g. `prop.filterModel` or `prop.sortModel`).
> More information on each feature documentation page.

{{"demo": "pages/components/data-grid/state/InitialState.js", "bg": "inline", "hideToolbar": true}}

## Access the state [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The state is exposed on the `apiRef` object.
We strongly advise you to only access it through selectors which are functions which takes the whole state as an argument and return some value.
The structure of the state can change, but we guarantee that all the selectors will keep working between minor releases.

### Direct selector access

```tsx
const pageSize = gridPageSizeSelector(apiRef.current.state);
```

{{"demo": "pages/components/data-grid/state/DirectSelector.js", "bg": "inline", "hideToolbar": true}}

### With `useGridSelector`

If you want to render something depending on some state value, you can use the `useGridSelector` hook.

```tsx
const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
```

> ⚠️ This hook can only be used on component renderer inside the context of the grid. Otherwise, you will have an error saying that the state is not initialized during the first render.

{{"demo": "pages/components/data-grid/state/UseGridSelector.js", "bg": "inline", "hideToolbar": true}}

### Catalog of selectors

Some selectors are yet to be documented.

{{"demo": "pages/components/data-grid/state/SelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Save and restore the state

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #820](https://github.com/mui-org/material-ui-x/issues/820) if you want to see it land faster.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
