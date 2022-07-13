---
title: Data Grid - Events
---

# Data grid - Events

<p class="description">Subscribe to the events emitted by the data grid to trigger custom behavior.</p>

## Subscribing to events

You can subscribe to one of the [events emitted](/x/react-data-grid/events/#catalog-of-events) by providing an event handler to the grid.

The handler is a method that will be called with three arguments:

1. the parameters containing the information related to the event.
2. the `MuiEvent` containing the DOM event or the React synthetic event, when available.
3. the `GridCallbackDetails` containing the `GridApi` only if `DataGridPro` or `DataGridPremium` is being used.

For instance here is an event handler for the `rowClick` event:

```tsx
const onEvent: GridEventListener<'rowClick'> = (
  params, // GridRowParams
  event, // MuiEvent<React.MouseEvent<HTMLElement>>
  details, // GridCallbackDetails
) => {
  setMessage(`Movie "${params.row.title}" clicked`);
};
```

You can provide this event handler to the grid in several ways:

### With the prop of the event

```tsx
<DataGrid onRowClick={onEvent} {...other} />
```

:::info
Not all the event have a dedicated prop.
You can find if the event you want to use has one by looking at its example in the catalog below.
:::

The following demo shows how to subscribe to the `rowClick` event using the `onRowClick` prop. Try it by clicking on any row.

{{"demo": "SubscribeToEventsProp.js", "bg": "inline", "defaultCodeOpen": false}}

### With `useGridApiEventHandler`

```tsx
useGridApiEventHandler('rowClick', onEvent);
```

:::warning
This hook can only be used inside the scope of the grid (inside component slots or cell renderers for instance).
:::

The following demo shows how to subscribe to the `rowClick` event using `useGridApiEventHandler`. Try it by clicking on any row.

{{"demo": "SubscribeToEventsHook.js", "bg": "inline", "defaultCodeOpen": false}}

### With `apiRef.current.subscribeEvent` [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

```tsx
apiRef.current.subscribeEvent('rowClick', onEvent);
```

The following demo shows how to subscribe to the `rowClick` event using `apiRef.current.subscribeEvent`. Try it by clicking on any row.

{{"demo": "SubscribeToEventsApiRef.js", "bg": "inline", "defaultCodeOpen": false}}

## Disabling the default behavior

Depending on the use case, it might be necessary to disable the default action taken by an event.
The `MuiEvent` passed to the event handler has a `defaultMuiPrevented` property to control when the default behavior can be executed or not.
Set it to `true` to block the default handling of an event and implement your own.

```tsx
<DataGrid
  onCellClick={(params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    event.defaultMuiPrevented = true;
  }}
/>
```

Usually, double clicking a cell will put it into [edit mode](/x/react-data-grid/editing/).
The following example changes this behavior by also requiring <kbd class="key">Ctrl</kbd> to be pressed.

{{"demo": "DoubleClickWithCtrlToEdit.js", "bg": "inline"}}

## Catalog of events

Expand the rows to see how to use each event.

{{"demo": "CatalogOfEventsNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
