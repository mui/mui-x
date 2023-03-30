# Data Grid - Clipboard

<p class="description">Copy and paste data using clipboard.</p>

## Clipboard copy

You can copy selected grid data to the clipboard using the <kbd class="key">Ctrl</kbd>/<kbd class="key">⌘ Command</kbd>+<kbd class="key">C</kbd> keyboard shortcut.
The copied cell values are separated by a tab (`\t`) character and the rows are separated by a new line (`\n`) character.

The priority of the data copied to the clipboard is the following, from highest to lowest:

- If more than one cell is selected (see [Cell selection](/x/react-data-grid/cell-selection/)), the selected cells are copied
- If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)), the selected rows are copied
- If there is a single cell selected, the single cell is copied

{{"demo": "ClipboardCopy.js", "bg": "inline", "defaultCodeOpen": false}}

## Clipboard paste [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

You can enable clipboard paste using `unstable_enableClipboardPaste` prop:

```tsx
<DataGridPremium unstable_enableClipboardPaste />
```

:::warning
This feature is not stable yet, meaning that its APIs may suffer breaking changes.
While in development, all props and methods related to cell selection must be prefixed with `unstable_`.
:::

You can paste data from clipboard using the <kbd class="key">Ctrl</kbd>/<kbd class="key">⌘ Command</kbd>+<kbd class="key">V</kbd> keyboard shortcut.
The paste operation only affects cells in the [columns that are `editable`](/x/react-data-grid/editing/#making-a-column-editable).

The priority of the clipboard paste is the following, from highest to lowest:

- If more than one cell is selected (see [Cell selection](/x/react-data-grid/cell-selection/)):
  - If clipboard contains a single cell, it is pasted to each selected cell
  - If clipboard contains multiple cells/rows, they are pasted starting from the first selected cell, but won't leak the selected range
- If more than one row is selected (see [Row selection](/x/react-data-grid/row-selection/)):
  - If clipboard contains a single row, it is pasted to each selected row
  - If clipboard contains multiple rows, they are pasted starting from the first selected row, but won't leak the selected range
- If there is a single cell selected:
  - If clipboard contains a single cell, it is pasted to the selected cell
  - If clipboard contains multiple cells/rows, the data is pasted starting from the selected cell

### Persisting pasted data

{{"demo": "ClipboardImport.js", "bg": "inline", "defaultCodeOpen": false}}
