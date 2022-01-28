---
title: Data Grid - State
---

# Data Grid - State

<p class="description">Initialize and read the state of the data grid.</p>

## Initialize the state

Some state keys can be initialized with the `initialState` prop.

> ⚠️ The `initialState` can only be used to set the initial value of the state, the grid will not react if you change the `initialState` value later on.
>
> If you need to fully control specific models, use the control props instead (e.g. `prop.filterModel` or `prop.sortModel`).
> You can find more information on the corresponding feature documentation page.

{{"demo": "pages/components/data-grid/state/InitialState.js", "bg": "inline"}}

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

**Note:** Calling with `apiRef.current.state` also works but it may cause side effects when multiple grid instances are in the same page.

{{"demo": "pages/components/data-grid/state/DirectSelector.js", "bg": "inline"}}

### With `useGridSelector`

If you want to access sole state value in the render of your components, you can use the `useGridSelector` hook.

```tsx
const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
```

> ⚠️ This hook can only be used inside the context of the grid, such as custom components. Otherwise, you will have an error saying that the state is not initialized during the first render.

{{"demo": "pages/components/data-grid/state/UseGridSelector.js", "bg": "inline"}}

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
