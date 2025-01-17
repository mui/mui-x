# Data Grid - Editing persistence

<p class="description">Persisting edited rows.</p>

## The `processRowUpdate()` callback

When the user performs an action to [stop editing](#stop-editing), the `processRowUpdate()` callback is triggered.
Use it to send the new values to the server and save them into a database or other storage method.
The callback is called with three arguments:

1. The updated row with the new values returned by the [`valueSetter()`](#value-parser-and-value-setter).
2. The original values of the row before editing.
3. An object with additional properties such as `rowId`.

Please note that the `processRowUpdate()` must return the row object to update the Data Grid internal state.
The value returned is used later as an argument on a call to `apiRef.current.updateRows()`.

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  processRowUpdate={(updatedRow, originalRow) =>
    mySaveOnServerFunction(updatedRow);
  }
  onProcessRowUpdateError={handleProcessRowUpdateError}
/>
```

If you want to delete a row from the internal state of the Data Grid, you can return an additional property `_action: 'delete'` in the row object from the `processRowUpdate()` callback.
This removes the row from the internal state of the Data Grid.
It is a more performant way to delete a row as compared to updating the [`rows` prop](/x/react-data-grid/row-updates/#the-rows-prop) or using `setRows()` API method because `processRowUpdate` uses the [`updateRows()`](/x/react-data-grid/row-updates/#the-updaterows-method) under the hood which doesn't cause a full regeneration of the row tree.

```tsx
<DataGrid
  {...otherProps}
  processRowUpdate={(updatedRow, originalRow) => {
    if (shouldDeleteRow(updatedRow)) {
      return { ...updatedRow, _action: 'delete' };
    }
    return updatedRow;
  }}
/>
```

In the example above, `shouldDeleteRow` is a function that determines whether a row should be deleted based on the updated row data.
If `shouldDeleteRow` returns `true`, the row will be deleted from the Data Grid's internal state.

## Server-side validation

If you need to cancel the save process on `processRowUpdate()`—for instance, when a database validation fails, or the user wants to reject the changes—there are two options:

1. Reject the promise so that the internal state is not updated and the cell remains in edit mode.
2. Resolve the promise with the second argument (original row before editing), so that the internal state is not updated, and the cell exits edit mode.

The following demo implements the first option: rejecting the promise.
Instead of [validating](#validation) while typing, it simulates validation on the server.
If the new name is empty, the promise responsible for saving the row will be rejected, and the cell will remain in edit mode.

The demo also shows that `processRowUpdate()` can pre-process the row model that will be saved into the internal state.

Additionally, `onProcessRowUpdateError()` is called to display the error message.

To exit edit mode, press <kbd class="key">Escape</kbd> or enter a valid name.

{{"demo": "ServerSidePersistence.js", "bg": "inline", "defaultCodeOpen": false}}

## Confirm before saving

The second option—resolving the promise with the second argument—lets the user cancel the save process by rejecting the changes and exiting the edit mode.
In this case, `processRowUpdate()` is resolved with the original value(s) of the row.

The following demo shows how this approach can be used to ask for confirmation before sending the data to the server.
If the user accepts the change, the internal state is updated with the values.
But if the changes are rejected, the internal state remains unchanged, and the cell is reverted back to its original value.
The demo also employs validation to prevent entering an empty name.

{{"demo": "AskConfirmationBeforeSave.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
