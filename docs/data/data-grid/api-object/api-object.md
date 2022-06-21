---
title: Data Grid - API object
---

# Data grid - API object

<p class="description">Interact with the grid using its api.</p>

## What is the API object ?

The API object is an interface containing the state and all the methods needed to interact imperatively with the grid.

You can find the list of all the available API methods on the [GridApi page](/x/api/data-grid/grid-api/).

:::warning
All the methods prefixed by `unstable_` are private.
They should not be used by third party user and can be removed / renamed / reworked at any time.

If you need to use a private method, please open a GitHub issue describing your use case.
We will help you to achieve the same goal with public methods, or we will discuss making this specific method public.
:::

## How to use the API object ?

The API object is accessible through the `apiRef` variable.
Depending on where you are trying to access this variable, you will have to use either `useGridApiContext` or `useGridApiRef`.

### Use it inside the grid

If you need to access the api object inside component slots or inside renders (e.g: `renderCell`, `renderHeader`),
you can use the `useGridApiContext` hook.

```tsx
const apiRef = useGridApiContext();

<Button onClick={() => apiRef.current.setPage(1)}>Go to page 1</Button>;
```

:::info
You don't have to initialize the API object using `useGridApiRef` to be able to it inside the grid components.
:::

{{"demo": "UseGridApiContext.js", "bg": "inline", "defaultCodeOpen": false}}

### Use it outside the grid [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

When using the API object outside the grid components, you need to initialize it using the `useGridApiRef` hook.
You can then pass it to the `apiRef` prop of the grid.

```tsx
const apiRef = useGridApiRef();

<div>
  <Button onClick={() => apiRef.current.setPage(1)}>Go to page 1</Button>
  <DataGridPro apiRef={apiRef} {...other} />
</div>;
```

:::warning
The API object will be populated by the various plugins of the grid during the 1st render of our component.
If you try to use it in the 1st render of your component, all the methods will be undefined.
:::

{{"demo": "UseGridApiRef.js", "bg": "inline", "defaultCodeOpen": false}}

## Common use cases

### Retrieve data from the state

You can find a detailed example in the [State page](/x/react-data-grid/state/#access-the-state).

### Listen to grid events

You can find a detailed example in the [Events page](/x/react-data-grid/events/#subscribing-to-events).

## API

- [GridApi](/x/api/data-grid/grid-api/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
