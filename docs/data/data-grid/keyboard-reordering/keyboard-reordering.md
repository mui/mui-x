---
title: Data Grid - Keyboard reordering
---

# Data Grid - Keyboard reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Reorder rows and columns with the keyboard through a highlight level that is distinct from focus and selection.</p>

:::warning
This page is an interaction prototype.
The demo is built on the public API of the Data Grid Pro so the model can be tested live before it is implemented in the packages.
Nothing on this page is released.
:::

## Three levels of interaction

The Data Grid distinguishes three levels of keyboard interaction:

1. **Page level.** <kbd class="key">Tab</kbd> moves between the Data Grid and the rest of the page.
2. **Cell level (focus).** One cell or column header is focused. Arrow keys navigate between cells, and keys such as <kbd class="key">Enter</kbd>, <kbd class="key">Space</kbd> or <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> act on the focused cell or its row.
   Focus is reserved for elements that are truly focusable.
3. **Row and column level (highlight).** A row or a column, or a contiguous block of them, is highlighted.
   The highlight is not a selection: selected rows stay selected, sorting keeps working, and the checkbox column is unaffected.
   It is also independent of the tab sequence: tabbing out of the Data Grid leaves the highlight in place.

Arrow keys always navigate within the current level.
With a highlight on, the arrow keys still move the focus, and the highlight follows it: in the header area the highlight is a column, in the body it is a row.
Moving the focus from the first row up to a column header turns a row highlight into a column highlight, and vice versa.

## Try it

Click a cell or a column header, or press <kbd class="key">Tab</kbd> until the Data Grid has focus.
Press <kbd class="key">Esc</kbd> to highlight the focused row or column, then use <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> keys to move it.
Screen reader announcements are mirrored above the Data Grid.

{{"demo": "KeyboardReordering.js", "bg": "inline", "defaultCodeOpen": false}}

## Alternative: highlight with the arrow keys at the edge

The demo below is the same prototype with a different way to turn the highlight on.
Instead of <kbd class="key">Esc</kbd>, the arrow key that points out of the Data Grid highlights the row or column the focus is in:

- On the first cell of a row, <kbd class="key">Arrow Left</kbd> highlights the row. The focus stays on the cell.
  <kbd class="key">Arrow Right</kbd> clears the highlight, and the focus still stays on the cell. <kbd class="key">Arrow Right</kbd> again moves the focus to the second cell.
- On a column header, <kbd class="key">Arrow Up</kbd> highlights the column. The focus stays on the header.
  <kbd class="key">Arrow Down</kbd> clears the highlight, and <kbd class="key">Arrow Down</kbd> again moves the focus into the first row.

<kbd class="key">Esc</kbd> only clears an existing highlight in this variant, so it keeps closing a surrounding dialog.
Extending with <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow</kbd></kbd> and moving with <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> are unchanged.

{{"demo": "KeyboardReorderingEdgeArrows.js", "bg": "inline", "defaultCodeOpen": false}}

## Keyboard interaction

:::info
The key assignments below apply to Windows and Linux users.

On macOS replace:

- <kbd class="key">Alt</kbd> with <kbd class="key">⌥ Option</kbd>
- <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>

:::

### Highlighting

|                                                                            Keys | Description                                                                                                                                                    |
| ------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                      <kbd class="key">Esc</kbd> | Highlight the focused column (column header focused) or the focused row (cell focused). Press again to clear.                                                  |
|             <kbd class="key">Arrow Up</kbd> / <kbd class="key">Arrow Down</kbd> | Navigate between cells. The highlight follows the focused row; from the first row, the focus moves to the column header and the highlight becomes that column. |
|          <kbd class="key">Arrow Left</kbd> / <kbd class="key">Arrow Right</kbd> | Navigate between cells of the same row, or between column headers. The highlight follows the focused column in the header area.                                |
|    <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | With a row highlighted: extend the highlight to the row above or below. Without a highlight: extend the row selection, as usual.                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | With a column highlighted: extend the highlight to the adjacent column header.                                                                                 |

Moving the focus into or inside a highlighted block keeps the block. Moving the focus out of the block collapses the highlight to the newly focused row or column.

### Moving

|                                                                                                                                 Keys | Description                                                                                                                |
| -----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------- |
|                                                        <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Move the highlighted column(s) one position. Without a highlight, move the column whose header is focused.                 |
|                                                           <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Move the highlighted row(s) one position. Without a highlight, move the row whose drag handle cell is focused.             |
| <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Home</kbd></kbd> / <kbd><kbd class="key">Alt</kbd>+<kbd class="key">End</kbd></kbd> | Move the highlighted rows or columns, or the focused header's column or handle's row, as far as allowed in that direction. |

Every press is a move. The focus follows the moved row or column, the Data Grid scrolls it into view, and the result is announced to screen readers.
A move that isn't allowed does nothing and announces why: the edge of the Data Grid, a column that can't be reordered, or rows that can't be reordered while the Data Grid is sorted.

<kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> on an ordinary body cell, with no highlight, does nothing: a cell in the middle of a row is not a handle for the whole row.

### Unchanged keys

Everything the [accessibility page](/x/react-data-grid/accessibility/#keyboard-navigation) documents keeps working while a row or column is highlighted:

|                                                                 Keys | Description                                                     |
| -------------------------------------------------------------------: | :-------------------------------------------------------------- |
|                                         <kbd class="key">Enter</kbd> | Sort the focused column, or start editing the focused cell      |
|  <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> | Open the column menu, or toggle the detail panel                |
|                                         <kbd class="key">Space</kbd> | Navigate to the next scrollable page                            |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Select or deselect the current row                              |
|      <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd></kbd> | Select all rows                                                 |
|             <kbd class="key">Home</kbd> / <kbd class="key">End</kbd> | Navigate to the first or last cell of the row, or column header |
|                                           <kbd class="key">Tab</kbd> | Leave the Data Grid. The highlight stays until it is cleared.   |

## Limitations of the prototype

- Column groups, pinned columns, pinned rows, tree data and row grouping aren't handled yet. The real implementation reuses the same rules as drag-and-drop reordering for all of them.
- Right-to-left layouts aren't handled: <kbd class="key">Arrow Left</kbd> always moves toward lower column indexes.
- A block move is performed as a sequence of single moves, so `onRowOrderChange` and `onColumnOrderChange` are called once per row or column of the block.
- <kbd class="key">Esc</kbd> is consumed by the Data Grid both to highlight and to clear in the first demo. Inside a dialog, closing the dialog with <kbd class="key">Esc</kbd> from a cell needs a highlight to be cleared first. The arrow-key variant doesn't have this problem.
- In the arrow-key variant, <kbd class="key">Arrow Up</kbd> on a column header no longer reaches column group headers; the demo has none.
- <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> on a body cell is swallowed: it neither moves the focus nor navigates the browser history.
- With NVDA or JAWS, <kbd class="key">Esc</kbd> may leave focus mode. Testing with those screen readers is part of the evaluation of this prototype.

## API

- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridRowOrderChangeParams](/x/api/data-grid/grid-row-order-change-params/)
