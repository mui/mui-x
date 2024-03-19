# Data Grid - Events

<p class="description">Subscribe to the events emitted by the Data Grid to trigger custom behavior.</p>

## Subscribing to events

You can subscribe to one of the [events emitted](/x/react-data-grid/events/#catalog-of-events) by providing an event handler to the Data Grid.

The handler is a method that's called with three arguments:

1. the parameters containing the information related to the event
2. the `MuiEvent` containing the DOM event or the React synthetic event, when available
3. the `GridCallbackDetails` containing the `GridApi`—only if `DataGridPro` or `DataGridPremium` is being used

For example, here is an event handler for the `rowClick` event:

```tsx
const handleEvent: GridEventListener<'rowClick'> = (
  params, // GridRowParams
  event, // MuiEvent<React.MouseEvent<HTMLElement>>
  details, // GridCallbackDetails
) => {
  setMessage(`Movie "${params.row.title}" clicked`);
};
```

You can provide this event handler to the Data Grid in several ways:

### With the prop of the event

```tsx
<DataGrid onRowClick={handleEvent} {...other} />
```

:::info
Not all events have a dedicated prop.
Check out the examples in the [Catalog of events](#catalog-of-events) below to determine if a given event has a dedicated prop.
:::

The following demo shows how to subscribe to the `rowClick` event using the `onRowClick` prop—try it out by clicking on any row:

{{"demo": "SubscribeToEventsProp.js", "bg": "inline", "defaultCodeOpen": false}}

### With `useGridApiEventHandler`

```tsx
useGridApiEventHandler(apiRef, 'rowClick', handleEvent);
```

:::warning
This hook can only be used inside the scope of the Data Grid (that is inside component slots or cell renderers).
:::

The following demo shows how to subscribe to the `rowClick` event using `useGridApiEventHandler`—try it out by clicking on any row:

{{"demo": "SubscribeToEventsHook.js", "bg": "inline", "defaultCodeOpen": false}}

### With `apiRef.current.subscribeEvent`

```tsx
apiRef.current.subscribeEvent('rowClick', handleEvent);
```

The following demo shows how to subscribe to the `rowClick` event using `apiRef.current.subscribeEvent`—try it out by clicking on any row:

{{"demo": "SubscribeToEventsApiRef.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
The `apiRef.current.subscribeEvent` method returns a cleaning callback that unsubscribes the given handler when called.
For instance, when used inside a `useEffect` hook, you should always return the cleaning callback.
Otherwise, you will have multiple registrations of the same event handler.
:::

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

Usually, double-clicking a cell will put it into [edit mode](/x/react-data-grid/editing/).
The following example changes this behavior by also requiring the end user to press the <kbd class="key">Ctrl</kbd> key:

{{"demo": "DoubleClickWithCtrlToEdit.js", "bg": "inline"}}

## Catalog of events

Expand the rows to see how to use each event.

{{"demo": "CatalogOfEventsNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
