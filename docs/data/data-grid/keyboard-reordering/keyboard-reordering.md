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
The checkboxes above each demo turn row selection, the checkbox column and cell selection on and off, to test how the highlight coexists with them.

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

## Alternative: direct moves from any cell, no highlight

The demo below has no persistent highlight at all, which avoids any conflict with row and cell selection.
<kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> works from any cell: <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> moves the column of the focused cell, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> moves its row.
If the focused row is part of a contiguous block of selected rows, the whole block moves: row selection is the multi-row mechanism here.
What just moved is marked for a moment, with a lighter edge than a highlight, then the mark fades.

<kbd class="key">Esc</kbd>, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow</kbd></kbd> and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> keep their default behavior.
Moving several columns at once isn't possible in this variant, since the Data Grid has no column selection.

{{"demo": "KeyboardReorderingDirect.js", "bg": "inline", "defaultCodeOpen": false}}

## Alternative: selection is the highlight

The two demos below drop the highlight concept for any Data Grid that allows selection.
Selection is the row and column level object:

- **Rows.** Selected rows move together with <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> when the focused row is part of a contiguous block of selected rows.
  Rows are selected as usual: <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd>, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd>, the checkbox column, clicks.
- **Columns.** A selected column is a range of selected cells that covers the whole column.
  With cell selection on, <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> selects the focused column, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> grows the selection by whole columns, and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> moves the selected columns.
  Without cell selection, columns can only be moved one at a time.
- **Rows without row selection.** With cell selection on and row selection off, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> selects the focused row as a range of cells, and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> grows it by whole rows.
- **No selection at all.** When both row selection and cell selection are off, the highlight of the first demo comes back (<kbd class="key">Esc</kbd> toggles it), drawn as an outline instead of a fill so it can't be mistaken for a selection.

The two demos differ in what moves when nothing is selected:

- **Any cell moves.** <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> on any cell moves that cell's row or column. What moved is marked for a moment.
- **Only explicit targets move.** <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> only moves selected rows, selected columns, the row of a focused drag handle, or the column of a focused header. From an ordinary cell it announces what to do instead.

Turn the selection checkboxes on and off to compare the configurations.

### Any cell moves

{{"demo": "KeyboardReorderingSelectionAnyCell.js", "bg": "inline", "defaultCodeOpen": false}}

### Only explicit targets move

{{"demo": "KeyboardReorderingSelectionExplicit.js", "bg": "inline", "defaultCodeOpen": false}}

### Behavior by configuration

|                                                                            Keys | No selection                                               | Row selection                                                         | Cell selection                                                              | Row and cell selection                  |
| ------------------------------------------------------------------------------: | :--------------------------------------------------------- | :-------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :-------------------------------------- |
|                                                      <kbd class="key">Esc</kbd> | Toggles the outline highlight of the focused row or column | Nothing                                                               | Nothing                                                                     | Nothing                                 |
|            <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Nothing                                                    | Toggles the row selection                                             | Selects the focused row as a range of cells                                 | Toggles the row selection               |
|             <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> | Nothing                                                    | Nothing                                                               | Selects the focused column as a range of cells                              | Selects the focused column              |
|    <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Extends the row highlight                                  | Extends the row selection                                             | Extends a full-row range by rows, otherwise the cell range                  | Extends the row selection               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Extends the column highlight (headers)                     | Nothing                                                               | Extends a full-column range by columns, otherwise the cell range            | Same as cell selection                  |
|      <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | The highlighted rows, else see the next table              | The selected block that contains the focused row, else the next table | The full-row range that contains the focused row, else the next table       | The selected block, else the next table |
|   <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | The highlighted columns, else the next table               | See the next table                                                    | The full-column range that contains the focused column, else the next table | Same as cell selection                  |

### What moves when nothing is selected or highlighted

|                                                                                        Focus on | Any cell moves                  | Only explicit targets move                                               |
| ----------------------------------------------------------------------------------------------: | :------------------------------ | :----------------------------------------------------------------------- |
|                                                                                 A column header | Its column                      | Its column                                                               |
|                                                                             The row drag handle | Its row                         | Its row                                                                  |
|    An ordinary cell, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Its row, marked for a moment    | Nothing; announces "Select the row to move it, or focus its drag handle" |
| An ordinary cell, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Its column, marked for a moment | Nothing; announces "Select the column to move it, or focus its header"   |
|                                                              A cell in a selected row or column | The selected block              | The selected block                                                       |

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

- The demos use the Data Grid Premium so that cell selection can be turned on; reordering itself is a Pro feature.
- <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> switches the input source on macOS when several keyboard layouts are installed. <kbd class="key">⌘ Command</kbd>+<kbd class="key">Space</kbd> is Spotlight. The key is the APG grid convention for column selection, but it needs a macOS alternative.
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
