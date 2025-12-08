---
title: Data Grid - Undo and redo
---

# Data Grid - Undo and redo [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Allow users to undo and reapply changes made to the Data Grid.</p>

The undo/redo feature allows users to reverse and reapply their actions in the Data Grid.
It tracks registered events, listens for keyboard events and adds toolbar buttons.

## Basic usage

The undo/redo feature is enabled when at least one event handler is registered and `historyQueueSize` is greater than 0.
The toolbar automatically displays undo and redo buttons when the feature is active.

Users can:

- Undo an action using <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Z</kbd></kbd> (<kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Z</kbd></kbd> on macOS)
- Redo an action using <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Z</kbd></kbd> and <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Y</kbd></kbd> (<kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Z</kbd></kbd> and <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Y</kbd></kbd> on macOS)

{{"demo": "BasicUndoRedo.js", "bg": "inline", "defaultCodeOpen": false}}

### Disabling the undo and redo

To disable the undo/redo feature, set `historyQueueSize` to `0`:

```tsx
<DataGridPremium historyQueueSize={0} />
```

This will prevent any history from being tracked and hide the undo/redo buttons from the toolbar.

### Removing the toolbar buttons

To only remove the toolbar buttons for undo and redo, but keep the keyboard controls active, set the `showUndoRedo` flag to `false` in the Toolbar's slot props.

```tsx
<DataGridPremium
  slotProps={{
    toolbar: {
      showUndoRedo: false,
      // ... other toolbar slotProps
    },
    // ... other slotProps
  }}
/>
```

## Event handlers

The Data Grid tracks changes and stores the data that can be used to revert those changes based on the provided history event handlers.

A history event handler is an object that defines how to `store()`, `undo()`, `redo()`, and `validate()` the ability to undo or redo an action.

```tsx
interface GridHistoryEventHandler<T = any> {
  // Store the data when the event occurs.
  // Returns null to skip adding the current change to the queue (to control undo step granularity)
  store: (...params: any[]) => T | null;

  // Undo the action
  undo: (data: T) => void | Promise<void>;

  // Redo the action
  redo: (data: T) => void | Promise<void>;

  // Validate if the operation can be performed
  // Can be omitted if the validation is not needed for the current event handler
  validate?: (data: T, operation: 'undo' | 'redo') => boolean;
}
```

### Default handlers

The list of the events that are handled by default depends on the way the data is provided to the Data Grid.
When not using a data source, the following events are tracked out of the box:

- `rowEditStop` - Tracks changes made to entire rows in row edit mode
- `cellEditStop` - Tracks changes made to individual cells in cell edit mode
- `clipboardPasteEnd` - Tracks paste operations that can modify multiple cells

When using a [data source](/x/react-data-grid/server-side-data/), `clipboardPasteEnd` is not tracked and the other two events are tracked only if your data source supports [editing](/x/react-data-grid/server-side-data/#updating-server-side-data) (by providing the `updateRow` method).

If you use a data source that does not have an `updateRow` method, the event handler list is empty and the feature is disabled.

The following demo shows the undo/redo feature working with a data source supporting row editing.
Remove the `updateRow` method to see the toolbar adjustment.

{{"demo": "DataSourceUndoRedo.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom event handlers

Provide your own map of the event handlers via the `historyEventHandlers` prop to change the default handlers or to track more events and add them to the undo/redo queue.
Use default handler exports (like `createCellEditHistoryHandler()`) to create a map that can combine:

- default handlers
- your own handlers replacing default handlers
- handlers for other events not covered by the default handlers

### Customizing default handlers

The following demo shows how to keep the default clipboard paste event handler and customize the cell edit handler to:

- Allow undo/redo operations even when the cell is on a different page
- Automatically navigate to the correct page when undoing/redoing

{{"demo": "CustomCellUpdateHandler.js", "bg": "inline", "defaultCodeOpen": false}}

### Creating a new handler

Track and allow undo of any Data Grid interaction by providing custom history event handlers.

The following demo keeps all the default handlers, and adds a custom history handler that tracks filter model changes.
This allows users to undo and redo filter operations.

To reduce the number of undo steps, changes on the filter model items that do not have a value are ignored.

{{"demo": "AddFilterHandler.js", "bg": "inline", "defaultCodeOpen": false}}

## Validation events

The undo/redo state is automatically revalidated when certain grid events occur.
By default, validation happens on `paginationModelChange`, `columnsChange` and `rowsSet` events.

During revalidation, the `validate()` method of the current item in the queue is called for the `undo` operation and the `validate()` method of the next item in the queue is called for the `redo` operation.
If validation fails for the `undo` operation, all items in the queue before the current item and the current item itself are removed from the queue.
If validation fails for the `redo` operation, all items after the current item in the queue are removed from the queue.

### Customizing validation events

You can customize which events trigger revalidation using the `historyValidationEvents` prop.

```tsx
<DataGridPremium historyValidationEvents={['stateChange']} />
```

This is useful when you create a handler that tracks changes that do not affect rows or columns or if you remove the default handlers and you don't need the validation on the default events anymore.

:::warning
List the events in the `historyValidationEvents` prop that are enough for the validation to occur at the right time.
Adding `'stateChange'` to the list will have an impact on the performance of Data Grid.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
