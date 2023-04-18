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

## Clipboard paste [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

:::warning
This feature is experimental, it needs to be explicitly activated using the `clipboardPaste` experimental feature flag.

Additionally, to make sure the copied cells are formatted correctly and can be parsed,
it's recommended to set the `unstable_ignoreValueFormatterDuringExport` prop to `true`.

```tsx
<DataGridPremium
  experimentalFeatures={{ clipboardPaste: true }}
  unstable_ignoreValueFormatterDuringExport
/>
```

:::

You can paste data from clipboard using the <kbd class="key">Ctrl</kbd>+<kbd class="key">V</kbd> (<kbd class="key">⌘ Command</kbd>+<kbd class="key">V</kbd> on macOS) keyboard shortcut.
The paste operation only affects cells in the [columns that are `editable`](/x/react-data-grid/editing/#making-a-column-editable).

The priority of the clipboard paste is the following, from highest to lowest:

1. If more than one cell is selected (see [Cell selection<span class="plan-premium" title="Premium plan"></span>](/x/react-data-grid/cell-selection/)):

   1. If the clipboard contains a single cell, it is pasted to each selected cell
   2. If the clipboard contains multiple cells/rows, they are pasted starting from the first selected cell, but won't leak the selected range

2. If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)):

   1. If the clipboard contains a single row, it is pasted to each selected row
   2. If the clipboard contains multiple rows, they are pasted starting from the first selected row, but won't leak the selected range

3. If a single cell is selected:
   1. If the clipboard contains a single cell, it is pasted to the selected cell
   2. If the clipboard contains multiple cells/rows, the data is pasted starting from the selected cell, but won't leak the selected range

{{"demo": "ClipboardPaste.js", "bg": "inline", "defaultCodeOpen": false}}

### Persisting pasted data

Clipboard paste uses the same API for persistence as [Editing](/x/react-data-grid/editing/#persistence)—use the `processRowUpdate` prop to persist the updated row in your data source:

```tsx
processRowUpdate?: (newRow: R, oldRow: R) => Promise<R> | R;
```

The row will be updated with a value returned by the `processRowUpdate` callback.
If the callback throws or returns a rejected promise, the row will not be updated.

The demo below shows how to persist the pasted data in browser's `sessionStorage`.

{{"demo": "ClipboardPastePersistence.js", "bg": "inline", "defaultCodeOpen": false}}
