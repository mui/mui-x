# Data Grid - Copy and paste

<p class="description">Copy and paste data using clipboard.</p>

## Clipboard copy

You can copy selected grid data to the clipboard using the <kbd class="key">Ctrl</kbd>+<kbd class="key">C</kbd> (<kbd class="key">⌘ Command</kbd>+<kbd class="key">C</kbd> on macOS) keyboard shortcut.
The copied cell values are separated by a tab (`\t`) character and the rows are separated by a new line (`\n`) character.

The priority of the data copied to the clipboard is the following, from highest to lowest:

1. If more than one cell is selected (see [Cell selection<span class="plan-premium" title="Premium plan"></span>](/x/react-data-grid/cell-selection/)), the selected cells are copied
2. If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)), the selected rows are copied
3. If there is a single cell selected, the single cell is copied

{{"demo": "ClipboardCopy.js", "bg": "inline", "defaultCodeOpen": false}}

## Clipboard paste [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

:::info

<details style="margin: 0">
  <summary markdown="span">Video preview</summary>
  <video muted loop playsinline controls style="margin-top: 8px">
    <source src="https://github-production-user-asset-6210df.s3.amazonaws.com/13808724/237996024-abfcb5c6-9db6-4677-9ba7-ae97de441080.mov" type="video/mp4" />
  </video>
</details>
:::

:::warning
To make sure the copied cells are formatted correctly and can be parsed,
it is recommended to set the `ignoreValueFormatterDuringExport` prop to `true`.
During clipboard copy operation, the raw cell values will be copied instead of the formatted values,
so that the values can be parsed correctly during the paste operation.

```tsx
<DataGridPremium ignoreValueFormatterDuringExport />
```

:::

You can paste data from clipboard using the <kbd class="key">Ctrl</kbd>+<kbd class="key">V</kbd> (<kbd class="key">⌘ Command</kbd>+<kbd class="key">V</kbd> on macOS) keyboard shortcut.
The paste operation only affects cells in the columns that are [`editable`](/x/react-data-grid/editing/#making-a-column-editable).

Same as with editing, you can use `valueParser` to modify the pasted value and `valueSetter` to update the row with new values.
See [Value parser and value setter](/x/react-data-grid/editing/#value-parser-and-value-setter) section of the editing documentation for more details.

The behavior of the clipboard paste operation depends on the selection state of the data grid and the data pasted from clipboard.
The priority is the following, from highest to lowest:

1. If multiple cells are selected (see [Cell selection<span class="plan-premium" title="Premium plan"></span>](/x/react-data-grid/cell-selection/)), the selected cells are updated with the pasted values.
2. If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)), the selected rows are updated with the pasted values.
3. If a single cell is selected, the values are pasted starting from the selected cell.

{{"demo": "ClipboardPaste.js", "bg": "inline"}}

### Disable clipboard paste

To disable clipboard paste, set the `disableClipboardPaste` prop to `true`:

{{"demo": "ClipboardPasteDisabled.js", "bg": "inline"}}

### Persisting pasted data

Clipboard paste uses the same API for persistence as [Editing](/x/react-data-grid/editing/#server-side-persistence)—use the `processRowUpdate` prop to persist the updated row in your data source:

```tsx
processRowUpdate?: (newRow: R, oldRow: R) => Promise<R> | R;
```

The row will be updated with a value returned by the `processRowUpdate` callback.
If the callback throws or returns a rejected promise, the row will not be updated.

The demo below shows how to persist the pasted data in the browser's `sessionStorage`.

{{"demo": "ClipboardPastePersistence.js", "bg": "inline", "defaultCodeOpen": false}}

### Events

The following events are fired during the clipboard paste operation:

- `clipboardPasteStart` - fired when the clipboard paste operation starts
- `clipboardPasteEnd` - fired when all row updates from clipboard paste have been processed

For convenience, you can also listen to these events using their respective props:

- `onClipboardPasteStart`
- `onClipboardPasteEnd`

Additionally, there is the `onBeforeClipboardPasteStart` prop, which is called before the clipboard paste operation starts
and can be used to cancel or confirm the paste operation:

```tsx
const onBeforeClipboardPasteStart = async () => {
  const confirmed = window.confirm('Are you sure you want to paste?');
  if (!confirmed) {
    throw new Error('Paste operation cancelled');
  }
};

<DataGridPremium onBeforeClipboardPasteStart={onBeforeClipboardPasteStart} />;
```

The demo below uses the [`Dialog`](/material-ui/react-dialog/) component for paste confirmation.
If confirmed, the Data Grid displays a loading indicator during the paste operation.

{{"demo": "ClipboardPasteEvents.js", "bg": "inline"}}

## Format of the clipboard data

By default, the clipboard copy and paste operations use the following format:

- The cell values are separated by a tab (`\t`) character.
- The rows are separated by a new line (`\n`) character.

You can use `clipboardCopyCellDelimiter` and `splitClipboardPastedText` props to change the format:

```tsx
<DataGridPremium
  {...otherProps}
  // support comma separated values
  clipboardCopyCellDelimiter={','}
  splitClipboardPastedText={(text) => text.split('\n').map((row) => row.split(','))}
/>
```

The demo below uses `,` (comma) character as a cell delimiter for both copy and paste operations:

{{"demo": "ClipboardPasteDelimiter.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
