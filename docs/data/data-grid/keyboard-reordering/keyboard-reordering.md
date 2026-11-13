---
title: Data Grid - Keyboard reordering
---

# Data Grid - Keyboard reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Three candidate behaviors for reordering rows and columns with the keyboard, for review.</p>

:::warning
This page is an interaction prototype for reviewers.
Each demo runs on the public API of the Data Grid, so you can try a behavior before it exists in the packages.
Nothing on this page is released.
:::

## The decision

Reordering rows and columns requires dragging today.
The proposed shortcut is <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd>, and each press moves a row or column by one position.

The open question is what a press moves, especially when the user wants to move several rows or columns together.
The Data Grid can select rows and cells, but it has no selected column.
The three solutions on this page answer that question differently.

|                               | Solution 1: highlight                                                                                                                     | Solution 2: selection                                                                                                                                                            | Solution 3: selected rows, highlighted columns                                                                                              |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| Role of the highlight         | An additional state. It coexists with selection                                                                                           | An alternative to selection. It exists only when selection doesn't                                                                                                               | An additional state, for columns only. It coexists with selected rows and cells                                                             |
| What a press moves            | The highlighted rows or columns                                                                                                           | The selected rows or columns                                                                                                                                                     | Selected rows, highlighted columns                                                                                                          |
| Preparation before a move     | Turn on the highlight with the arrow keys. A column header or a drag handle needs no highlight                                            | None. A press works from any cell                                                                                                                                                | None. A press works from any cell                                                                                                           |
| What the press does first     | Nothing                                                                                                                                   | Selects the row or column if it isn't selected yet                                                                                                                               | Selects the row, or highlights the column                                                                                                   |
| Moving several rows           | <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> builds a highlight                | Select the rows first, with the usual selection keys                                                                                                                             | Select the rows first, with the usual selection keys                                                                                        |
| Moving several columns        | <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> on a header builds a highlight | <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> selects a column, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> adds to it | <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> builds a highlight from any cell |
| Effect on row selection       | None. The two states coexist, and selected rows don't move unless they are highlighted                                                    | Selected rows are what moves. A press on another row replaces them                                                                                                               | Selected rows are what moves. A press on another row replaces them                                                                          |
| With selection turned off     | No difference                                                                                                                             | An outline highlight replaces selection, and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow</kbd></kbd> extends it                                                     | Rows move one at a time. Columns don't change                                                                                               |
| New concepts in the Data Grid | Highlight                                                                                                                                 | Column selection, and a highlight for grids without selection                                                                                                                    | Highlight, for columns only                                                                                                                 |

## What every solution shares

- <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> moves rows, and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> moves columns.
- <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Home</kbd></kbd> and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">End</kbd></kbd> move as far as allowed. They move rows from a cell, and columns from a column header.
- The focus stays on the moved row or column, and the Data Grid scrolls to it.
- A screen reader hears the result of every press. Each demo shows the same text above the Data Grid, next to "Announced".
- A move that isn't allowed does nothing and announces why. The reasons are the edge of the Data Grid, a column that can't be reordered, a sorted Data Grid, and selected rows or columns that aren't next to each other.
- <kbd class="key">Esc</kbd> clears a highlight or a column selection. With neither present, <kbd class="key">Esc</kbd> stays available to the page, for example to close a dialog.

To try a demo, click a cell or press <kbd class="key">Tab</kbd> until the Data Grid has focus.
The checkboxes above each demo turn row selection, the checkbox column and cell selection on and off.

## Solution 1: a highlight next to selection

In this solution, the highlight is an additional state on top of selection, and the two coexist.

A highlight marks whole rows or columns as the target of the next move.
It is separate from focus and from selection, so a row can be selected, highlighted, or both.

The highlight is gray and lighter than selection, so the two stay distinct.
A row that is both selected and highlighted keeps its blue selection background and gains a gray edge.

{{"demo": "KeyboardReorderingHighlight.js", "bg": "inline", "defaultCodeOpen": false}}

### Try it

1. Focus the drag handle cell of a row, which is the first cell, and press <kbd class="key">Arrow Left</kbd>. The row turns gray and the focus doesn't move.
2. Press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Down</kbd></kbd> to add the next row.
3. Press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up</kbd></kbd> to move both rows.
4. Press <kbd class="key">Esc</kbd> to clear the highlight.
5. Focus a column header and press <kbd class="key">Arrow Up</kbd> to highlight the column.
6. Press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Right</kbd></kbd> to add the next column, then <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Right</kbd></kbd> to move both.
7. Press <kbd class="key">Arrow Down</kbd> to clear the highlight.

### Behavior

The highlight works the same way in every selection configuration, so this table has one column per highlight state instead.

|                                                                                                                                                                                                                    Keys | Nothing highlighted                                          | A row or column highlighted                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                                                                                                 <kbd class="key">Arrow Left</kbd> on a row's first cell | Highlights the row. The focus stays                          | Keeps the highlight                                                                                                                             |
|                                                                                                                                                                <kbd class="key">Arrow Right</kbd> on a row's first cell | Moves the focus to the next cell                             | Clears the highlight. The focus stays, and the next press moves it                                                                              |
|                                                                                                                                                                      <kbd class="key">Arrow Up</kbd> on a column header | Highlights the column. The focus stays                       | Keeps the highlight                                                                                                                             |
|                                                                                                                                                                    <kbd class="key">Arrow Down</kbd> on a column header | Moves the focus into the first row                           | Clears the highlight. The focus stays, and the next press moves it                                                                              |
|                                                                                                                                                                                                        Other arrow keys | Move the focus                                               | Move the focus. The highlight follows it, as a column in the header and as a row in the body. Moving inside a highlighted block keeps the block |
|                                                                                                       <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> on a cell | Nothing. Announces that the row must be highlighted first    | Adds the next row. The focus moves to it                                                                                                        |
|                                                                                           <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> on a column header | Nothing. Announces that the column must be highlighted first | Adds the next column. The focus moves to it                                                                                                     |
|                                                                                                                             <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> on a drag handle | Moves its row, and marks it for a moment                     | Moves the highlighted rows                                                                                                                      |
|                                                                                                                              <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> on another cell | Nothing. Announces how to move the row                       | Moves the highlighted rows                                                                                                                      |
|                                                                                                                        <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> on a column header | Moves its column, and marks it for a moment                  | Moves the highlighted columns                                                                                                                   |
|                                                                                                                                 <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> on a cell | Nothing. Announces how to move the column                    | Nothing. Announces how to move the column                                                                                                       |
|                                                                                                                                                                                              <kbd class="key">Esc</kbd> | Left to the page                                             | Clears the highlight                                                                                                                            |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow</kbd></kbd>, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd>, <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd></kbd>, checkboxes | Change the selection, as they do today                       | Change the selection, as they do today. If the focus moves, the highlight follows it                                                            |

### What to weigh

- Rows have two multi-row states side by side. A user who selects rows with the checkboxes and presses <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Down</kbd></kbd> moves nothing and has to highlight the same rows again.
- A row highlight only starts from the first cell of the row, so a user in the middle of a row has to navigate to it first.
- <kbd class="key">Arrow Up</kbd> on a column header no longer reaches column group headers. The demo has no column groups, and this needs an answer before implementation.

## Solution 2: selection moves

In this solution, the highlight is an alternative to selection.
It exists only when the Data Grid has no selection enabled, so the two never appear together.

Selection is what moves, and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> works from any cell with no preparation.
If the focused row isn't selected, the press selects it, replaces the previous selection, and moves it.
If the focused row is part of the selection, the press moves all the selected rows.

The Data Grid has no selected column today, so this solution adds one.
A selected column has the selection background on its header and on its cells.
Only one kind of selection exists at a time, so selecting columns clears the selected rows and cells, and selecting rows or cells clears the selected columns.

When both row selection and cell selection are off, nothing can be selected, so the highlight takes over.
The press highlights the row or column and moves it. The highlight is an outline, and moving the focus away or pressing <kbd class="key">Esc</kbd> clears it.
The highlight stands in for selection, so <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow</kbd></kbd> extends it, the same keys that extend a selection.

{{"demo": "KeyboardReorderingSelection.js", "bg": "inline", "defaultCodeOpen": false}}

### Try it

1. Focus any cell and press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Down</kbd></kbd>. The row becomes selected and moves.
2. Select two adjacent rows with <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Down</kbd></kbd>, then press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up</kbd></kbd> to move both.
3. Focus any cell and press <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> to select its column. Press <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Right</kbd></kbd> to add the next column, then <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Right</kbd></kbd> to move both.
4. Press <kbd class="key">Esc</kbd> to clear the selected columns.
5. Clear the "Row selection" checkbox and press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Down</kbd></kbd> on a cell. The row gets an outline and moves.
6. Press <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Down</kbd></kbd> to add the next row, then <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up</kbd></kbd> to move both.

### Behavior by configuration

|                                                                            Keys | No selection                                                                     | Row selection                                                                                                   | Cell selection                                                                                            | Row and cell selection                                  |
| ------------------------------------------------------------------------------: | :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ |
|                                                      <kbd class="key">Esc</kbd> | Clears the highlight                                                             | Clears the selected columns, otherwise left to the page                                                         | Clears the selected columns, otherwise left to the page                                                   | Clears the selected columns, otherwise left to the page |
|                                                                      Arrow keys | Move the focus. The highlight clears when the focus leaves it                    | Move the focus                                                                                                  | Move the focus and clear the cell range                                                                   | Move the focus and clear the cell range                 |
|            <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Nothing                                                                          | Toggles the row selection                                                                                       | Selects the focused row as a range of cells                                                               | Toggles the row selection                               |
|             <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> | Nothing                                                                          | Selects the focused column                                                                                      | Selects the focused column                                                                                | Selects the focused column                              |
|    <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Starts or extends a row highlight                                                | Extends the row selection                                                                                       | Extends a full-row range by rows, otherwise the cell range                                                | Extends the row selection and the cell range            |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Starts or extends a column highlight                                             | Adds a column if the focused column is selected, otherwise nothing                                              | Adds a column if the focused column is selected, otherwise extends the cell range                         | Same as cell selection                                  |
|      <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Moves the highlighted rows, otherwise highlights and moves the focused row       | Moves the selected rows if the focused row is one of them, otherwise selects and moves the focused row          | Moves the full-row range that contains the focused row, otherwise selects the row as a range and moves it | Same as row selection                                   |
|   <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Moves the highlighted columns, otherwise highlights and moves the focused column | Moves the selected columns if the focused column is one of them, otherwise selects and moves the focused column | Same as row selection                                                                                     | Same as row selection                                   |

### What to weigh

- A move changes the selection, so `onRowSelectionModelChange` fires when the user only meant to reorder. This affects applications that attach actions to the selection.
- Column selection is a new concept that other features have to learn about. In the demo, <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">C</kbd></kbd> and the fill handle ignore selected columns.
- Selection now clears across axes. A user with selected rows loses them by selecting a column.
- Grids without selection behave differently, because a highlight replaces the selection.
- <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> needs a macOS alternative. See the [limitations](#limitations-of-the-prototype).

## Solution 3: selected rows, highlighted columns

Rows work as in solution 2, so a press from any cell selects the row and moves it.

Columns don't gain a selection. A press from any cell or column header highlights the column and moves it, and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> builds a block of highlighted columns.
As in solution 1, the highlight is an additional state that coexists with selection, so it uses the same gray style.
Moving the focus to another column, moving a row, or pressing <kbd class="key">Esc</kbd> clears it.

When selection is off, rows have nothing to select and no highlight to fall back on. A press moves the focused row alone and marks it for a moment.

{{"demo": "KeyboardReorderingColumnHighlight.js", "bg": "inline", "defaultCodeOpen": false}}

### Try it

1. Focus any cell and press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Right</kbd></kbd>. The column turns gray and moves.
2. Press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Right</kbd></kbd> to add the next column, then <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left</kbd></kbd> to move both.
3. Press <kbd class="key">Esc</kbd> to clear the highlight.
4. Press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Down</kbd></kbd> on any cell. The row becomes selected and moves.
5. Clear the "Row selection" checkbox and press <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Down</kbd></kbd> again. The row moves and is marked for a moment.

### Behavior by configuration

|                                                                                                       Keys | No selection                                                                     | Row selection                                                                                          | Cell selection                                                                                            | Row and cell selection                       |
| ---------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------- |
|                                                                                 <kbd class="key">Esc</kbd> | Clears the column highlight, otherwise left to the page                          | Same as no selection                                                                                   | Same as no selection                                                                                      | Same as no selection                         |
|                                                                                                 Arrow keys | Move the focus. The highlight clears when the focus leaves the column            | Same as no selection                                                                                   | Same as no selection, and clear the cell range                                                            | Same as cell selection                       |
|                                       <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Nothing                                                                          | Toggles the row selection                                                                              | Selects the focused row as a range of cells                                                               | Toggles the row selection                    |
|                                        <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> | Nothing                                                                          | Nothing                                                                                                | Nothing                                                                                                   | Nothing                                      |
|                               <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Nothing                                                                          | Extends the row selection                                                                              | Extends a full-row range by rows, otherwise the cell range                                                | Extends the row selection and the cell range |
|                            <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Nothing                                                                          | Nothing                                                                                                | Extends the cell range                                                                                    | Extends the cell range                       |
|    <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Nothing                                                                          | Nothing                                                                                                | Nothing                                                                                                   | Nothing                                      |
| <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Starts or extends a column highlight                                             | Same as no selection                                                                                   | Same as no selection                                                                                      | Same as no selection                         |
|                                 <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Moves the focused row and marks it for a moment                                  | Moves the selected rows if the focused row is one of them, otherwise selects and moves the focused row | Moves the full-row range that contains the focused row, otherwise selects the row as a range and moves it | Same as row selection                        |
|                              <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Moves the highlighted columns, otherwise highlights and moves the focused column | Same as no selection                                                                                   | Same as no selection                                                                                      | Same as no selection                         |

### What to weigh

- Rows and columns follow two different models, so the same keys select one axis and highlight the other.
- A row move changes the selection, as in solution 2.
- There is no new column selection for other features to support.
- A grid without selection can't move several rows at once.

## Comparison: what a press moves

This table starts from an unprepared Data Grid, with nothing selected or highlighted unless the first column says so.
For solutions 2 and 3 it assumes that row selection is on.

|                                                                                                   Focus on | Solution 1                                                                  | Solution 2                                             | Solution 3                             |
| ---------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------- | :------------------------------------- |
|             A column header, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Its column, marked for a moment                                             | Its column, which becomes selected                     | Its column, which becomes highlighted  |
|                The drag handle, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Its row, marked for a moment                                                | Its row, which becomes selected                        | Its row, which becomes selected        |
|               An ordinary cell, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Nothing. Announces "Highlight the row to move it, or focus its drag handle" | Its row, which becomes selected                        | Its row, which becomes selected        |
|            An ordinary cell, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Nothing. Announces "Highlight the column to move it, or focus its header"   | Its column, which becomes selected                     | Its column, which becomes highlighted  |
|       A cell in a selected row, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Same as an ordinary cell. Selected rows don't move                          | All the selected rows                                  | All the selected rows                  |
|    A cell in a selected row, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Same as an ordinary cell                                                    | Its column, which becomes selected and clears the rows | Its column, and the rows stay selected |
| A cell in a selected column, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left/Right</kbd></kbd> | Doesn't apply                                                               | All the selected columns                               | Doesn't apply                          |
|    A cell in a selected column, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Doesn't apply                                                               | Its row, which becomes selected and clears the columns | Doesn't apply                          |

## Questions for reviewers

- Which solution should move forward?
- Is it acceptable for a move to change the selection, as in solutions 2 and 3?
- Should selected columns replace selected rows, or should the two coexist?
- In solution 1, should a row highlight be reachable from any cell, instead of only the first cell?
- In solution 3, is it acceptable for a grid without selection to move only one row at a time?

## Keys

:::info
The key assignments on this page apply to Windows and Linux users.

On macOS replace:

- <kbd class="key">Alt</kbd> with <kbd class="key">⌥ Option</kbd>
- <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>

:::

Everything the [accessibility page](/x/react-data-grid/accessibility/#keyboard-navigation) documents keeps working in all three solutions, except where the tables above say otherwise:

|                                                                Keys | Description                                                     |
| ------------------------------------------------------------------: | :-------------------------------------------------------------- |
|                                        <kbd class="key">Enter</kbd> | Sort the focused column, or start editing the focused cell      |
| <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> | Open the column menu, or toggle the detail panel                |
|                                        <kbd class="key">Space</kbd> | Navigate to the next scrollable page                            |
|     <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd></kbd> | Select all rows                                                 |
|            <kbd class="key">Home</kbd> / <kbd class="key">End</kbd> | Navigate to the first or last cell of the row, or column header |
|                                          <kbd class="key">Tab</kbd> | Leave the Data Grid. A highlight stays until it is cleared      |

## Limitations of the prototype

- The demos use the Data Grid Premium so that cell selection can be turned on. Reordering itself is a Pro feature.
- Selected columns exist only inside the demo. Other Data Grid features don't see them.
- <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Space</kbd></kbd> switches the input source on macOS when several keyboard layouts are installed, and <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Space</kbd></kbd> is Spotlight. The key is the APG grid convention for column selection, but it needs a macOS alternative.
- On Windows, <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd></kbd> on its own switches keyboard layouts by default. <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow</kbd></kbd> needs testing with several layouts installed.
- Column groups, pinned columns, pinned rows, tree data and row grouping aren't handled yet. The real implementation reuses the rules of drag-and-drop reordering for them.
- Right-to-left layouts aren't handled. <kbd class="key">Arrow Left</kbd> always moves toward lower column indexes.
- The Data Grid moves a block one row or column at a time, so `onRowOrderChange` and `onColumnOrderChange` fire once per row or column of the block.
- In solutions 2 and 3, a press that can't move still selects or highlights the row or column.
- <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow</kbd></kbd> on a body cell never reaches the browser, so it can't trigger history navigation.
- With NVDA or JAWS, <kbd class="key">Esc</kbd> may leave focus mode. Screen reader testing is part of this evaluation.

## API

- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridRowOrderChangeParams](/x/api/data-grid/grid-row-order-change-params/)
