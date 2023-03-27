# Data Grid - Clipboard

<p class="description">Copy and paste data using clipboard.</p>

## Clipboard copy

You can copy selected grid data to the clipboard using the <kbd class="key">Ctrl</kbd>/<kbd class="key">⌘ Command</kbd>+<kbd class="key">V</kbd> keyboard shortcut.
The copied cell values are separated by a tab (`\t`) character and the rows are separated by a new line (`\n`) character.

The priority of the data copied to the clipboard is the following, from highest to lowest:

- If more than one cell is selected (see [Cell selection](/x/react-data-grid/cell-selection/)), the selected cells are copied
- If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)), the selected rows are copied
- If there is a single cell selected, the single cell is copied

{{"demo": "ClipboardCopy.js", "bg": "inline", "defaultCodeOpen": false}}

## 🚧 Clipboard paste [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

### Persisting pasted data

{{"demo": "ClipboardImport.js", "bg": "inline", "defaultCodeOpen": false}}
