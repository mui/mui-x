---
title: Data Grid - Formulas
---

# Data Grid - Formulas [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Let users derive cell values from other cells with spreadsheet-like formulas.</p>

On columns that opt in with `allowFormulas`, cell values that are strings starting with `=` are parsed and evaluated.
The evaluated value flows through rendering, sorting, filtering, aggregation, clipboard copy, and export, while the formula source remains the value stored in the row data.

The demo below is an invoice where every **Amount** cell is a formula.
Edit a quantity, a unit price, or a discount, and watch the line amount, the subtotal, the tax, and the total due update in order.

{{"demo": "FormulaBasic.js", "bg": "inline", "defaultCodeOpen": false}}

For the complete formula language—operators, cell references, ranges, built-in functions, and error values—see the [Syntax reference](/x/react-data-grid/formula-syntax/) page.
The [Formula engine](/x/react-data-grid/formula-engine/) page explains how evaluation works and how to register custom functions.

A cell formula is a value of one cell.
To apply one formula to every row of the grid instead (a read-only column managed from the toolbar, the column menu, or code) see the [Computed columns](/x/react-data-grid/computed-columns/) page.

## Enabling formulas

The formula runtime—the parser, the evaluation engine, and the formula editor—is not bundled with the grid, so applications that do not use formulas do not pay for it in bundle size.
To enable formulas, import the feature from the `@mui/x-data-grid-premium/formula` entry point and inject it through the `featureDependencies` prop:

```tsx
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

<DataGridPremium featureDependencies={{ formula: formulaFeature }} />;
```

The prop is read when the grid mounts and must not change afterwards.
Without it, `=` cell values render as plain strings and the formula props have no effect—a console warning points at the missing dependency in development builds.

:::info
Everything formula-related that is a runtime value—`formulaFeature`, the [`FormulaBar`](/x/react-data-grid/components/formula-bar/) component, and the [`GRID_FORMULA_FUNCTIONS`](/x/react-data-grid/formula-engine/#custom-functions) built-in function set—is exported from `@mui/x-data-grid-premium/formula`.
The formula TypeScript types remain available from the package root.
:::

With the feature injected, formula support is opt-in per column:

```tsx
const columns: GridColDef[] = [
  { field: 'price', type: 'number' },
  { field: 'quantity', type: 'number' },
  { field: 'total', type: 'number', allowFormulas: true, editable: true },
];

const rows = [{ id: 1, price: 2, quantity: 3, total: '=price * quantity' }];
```

Without `allowFormulas`, values starting with `=` render as plain strings.
To store a literal string starting with `=` in a column with `allowFormulas`, prefix it with an apostrophe: `'=not a formula`.

Use the `disableFormulas` prop to turn evaluation off at runtime for the whole grid—unlike omitting `featureDependencies`, it can be toggled while the grid is mounted.

## Editing

When a formula cell enters edit mode, the editor shows the formula source instead of the evaluated value—even on `number` columns.
To turn a plain cell into a formula cell, type `=`: the formula editor opens regardless of the column type.
Double-clicking a plain cell opens the column type's default editor, and a column with a custom `renderEditCell` always keeps its own editor.

- Committing an edit without changes keeps the formula intact, including in row edit mode.
- To remove a formula, commit a plain value in its place, or clear the cell content.
- A formula is a single line of text—line breaks in typed or pasted content are removed, and <kbd class="key">Enter</kbd> commits the edit. A long formula wraps visually in the editor, but never contains a line break.

The formula editor floats over the cell and grows with the formula, so the whole formula stays visible while you type.
It first extends over the neighboring cells, up to the visible edge of the grid.
Out of horizontal room, the formula wraps and the editor grows by whole lines instead—over the rows below, or over the rows above when the cell is at the bottom of the grid—up to five lines, after which the text scrolls inside the editor.
Deleting content never shrinks the editor mid-edit.
In row edit mode, only the focused cell shows the floating editor; the row's other formula cells display their current draft in place.

Formula text is set in a monospace font—so it reads as the code it is, and so a formula is distinguishable at a glance from a plain value in the [formula bar](#formula-bar), which renders both.
Operators, parentheses, commas, and the leading `=` use the secondary text color, leaving the function names, identifiers, and literals to lead the line.
Override the `--DataGrid-formulaFontFamily` CSS variable in a theme to change the font.

`processRowUpdate` and undo/redo operate on the formula source, so persisting and restoring rows keeps formulas working for free:

```tsx
<DataGridPremium
  processRowUpdate={async (newRow) => {
    // newRow.total === '=price * quantity'
    await saveRow(newRow);
    return newRow;
  }}
/>
```

### Autocomplete

While editing a formula, a suggestion dropdown offers ranked completions for the partial token at the caret: functions, references, constants, and the grid's column fields (plus the column letters when `formulaA1Notation` is enabled).
Accepting a function inserts it with an open parenthesis and places the caret inside, and signature help appears while the caret is within a call.
Suggestions are spliced at the caret, so the rest of the formula is preserved.

The demo below registers a custom `MARGIN` function.
Click the empty **Gross margin** cell and type `=M` to see it in the dropdown with its signature help.

{{"demo": "FormulaAutocomplete.js", "bg": "inline", "defaultCodeOpen": false}}

The dropdown is on by default.
While it is open, <kbd class="key">Down</kbd> and <kbd class="key">Up</kbd> move the highlight, <kbd class="key">Enter</kbd> and <kbd class="key">Tab</kbd> accept the highlighted suggestion, and <kbd class="key">Escape</kbd> closes it—so those keys do not commit the edit or move between cells until the dropdown is closed.
Pass the `disableFormulaAutocomplete` prop to turn the dropdown off.

### Reference highlighting

While editing a formula, each distinct cell, range, or column reference is shown in its own color in the editor, and the cells it points to are outlined in the grid with a matching dashed rectangle—so it is easy to see what a formula reads.

Double-click any **Q1 total** cell in the demo below to see its three references highlighted, or an **All departments** cell for a range outline.

{{"demo": "FormulaReferenceHighlighting.js", "bg": "inline", "defaultCodeOpen": false}}

- Colors are keyed on the **resolved target**, so two references to the same cell share a color, and a reference repeated in the formula is outlined once.
- A reference that cannot be resolved—a hidden column, a filtered-out row, or the edited cell itself—is left uncolored and is not outlined.
- A reference to a cell in a pinned column or a pinned row keeps its color in the editor, but no rectangle is drawn in the grid—the pinned sections paint above the highlight overlay.
- Highlighting works in both the canonical and the A1 syntax.
- A column with a custom `renderEditCell` keeps full control of its editor and is not highlighted.

The palette contains ten colors, exposed as the `--DataGrid-formulaRefColor-0` through `--DataGrid-formulaRefColor-9` CSS variables on the formula editor and the highlight overlay, and can be overridden in a theme.

### Formula bar

Enable the spreadsheet-style formula bar on the default toolbar with `slotProps.toolbar.formulaBar`:

```tsx
<DataGridPremium
  showToolbar
  featureDependencies={{ formula: formulaFeature }}
  slotProps={{ toolbar: { formulaBar: true } }}
/>
```

The bar is a permanently open formula editor for the focused cell:

- With the cell in **view mode**, typing in the bar edits a draft: references are colored and outlined in the grid, and the draft's result is evaluated on the fly next to the input—nothing is committed while typing.
  <kbd class="key">Enter</kbd> commits the draft (through `processRowUpdate`, as a single undo step) and moves the focus down, <kbd class="key">Tab</kbd> commits and moves right, and clicking another cell or leaving the bar also commits—<kbd class="key">Escape</kbd> is the only way to discard.
- With the cell in **edit mode**, the bar is a live mirror of the editor: typing in the cell shows up in the bar, typing in the bar shows up in the cell, and interacting with the bar does not close the cell's editor.

Click any **Amount** cell in the demo below and edit its formula from the bar, or double-click a cell and watch the bar mirror the edit.

{{"demo": "FormulaBarBasic.js", "bg": "inline", "defaultCodeOpen": false}}

To place the bar in a custom toolbar—or anywhere else in the page through a portal—compose the exported component; see the [Formula Bar component](/x/react-data-grid/components/formula-bar/) page.

### Reference picking

By default, clicking another cell while a formula is being edited ends the edit, like for any other cell.
Pass the `formulaReferencePicking` prop to let users point at cells instead of typing their references: a click on a cell writes its reference into the formula, and the editor keeps the focus.

```tsx
<DataGridPremium
  featureDependencies={{ formula: formulaFeature }}
  formulaReferencePicking
/>
```

In the demo below, select the empty **Q1 total** cell of the **Operations** row, type `=`, click the **January** cell of that row, type `+`, and continue with the two other months.
Then select the empty **February** cell of the **All departments** row, type `=SUM(`, drag over the four cells above it, type `)`, and press <kbd class="key">Enter</kbd>.

{{"demo": "FormulaReferencePicking.js", "bg": "inline", "defaultCodeOpen": false}}

A click writes a reference only where the formula can take one—anywhere else, it ends the edit as usual:

- **Where a reference is expected**—after the `=`, an operator, an opening parenthesis, or a comma—the reference is inserted at the caret: with `=B2+`, a click on C3 gives `=B2+C3`.
- **On a reference**—the caret inside it or at one of its ends—the click replaces that reference: with the caret at the end of `=price * qty`, a click on C3 gives `=price * C3`. After typing a reference, commit with <kbd class="key">Enter</kbd> or <kbd class="key">Tab</kbd> instead of clicking another cell.
- The reference a click wrote is replaced by the next click, until you type something. Its cell is outlined with a solid rectangle instead of a dashed one.
- **Anywhere else**—after a number, a string, a closing parenthesis, or a name that is not a column, as in `=B2+5`, `=SUM(B2:C4)`, or `=pri`—the click ends the edit and moves the focus. The same goes for an edit whose text does not start with `=`.

The following gestures are supported:

| Gesture                                                                                                   | Result                                                                                                   | Example                         |
| :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------ |
| Click                                                                                                     | Writes the reference of the cell                                                                         | `=SUM(` becomes `=SUM(B2`       |
| Drag                                                                                                      | Writes the range between the first and the last cell, updated while dragging                             | `=SUM(` becomes `=SUM(B2:C4`    |
| <kbd><kbd class="key">Shift</kbd>+click</kbd>                                                             | Turns the reference at the caret into a range that ends at the clicked cell                              | `=SUM(B2` becomes `=SUM(B2:C6`  |
| <kbd><kbd class="key">Ctrl</kbd>+click</kbd> (<kbd><kbd class="key">⌘ Command</kbd>+click</kbd> on macOS) | Adds the reference as another argument when the reference at the caret is an argument of a function call | `=SUM(B2` becomes `=SUM(B2, C3` |

Outside the arguments of a function call, <kbd><kbd class="key">Ctrl</kbd>+click</kbd> behaves like a click, and so does <kbd><kbd class="key">Shift</kbd>+click</kbd> when there is no reference at the caret.
A range is also written outside a function call (`=B2:C4`), which is an error until it is wrapped in a function such as `SUM`.
<kbd class="key">Enter</kbd> and <kbd class="key">Tab</kbd> commit the edit and <kbd class="key">Escape</kbd> cancels it, as usual.

The text that a pick writes depends on the clicked cell and on the syntax of the editor:

- A cell in the **row of the formula** is written as its field name (`price`), like a [same-row reference](/x/react-data-grid/formula-syntax/#values-and-same-row-references) typed by hand.
- A cell in **another row** is written as a cell reference: `B2` with `formulaA1Notation`, `REF(COLUMN("price"), ROW(2))` otherwise.
- A **range** is written as `B2:C4` with `formulaA1Notation`, and as the matching `RANGE_REF()` otherwise.
- Picked references are relative. To make one absolute in the A1 syntax, type the `$` by hand.

Picking works the same way from every formula editor:

- The **cell editor**, in cell and row edit modes. In row edit mode, a click on another editor of the row moves the focus to it.
- The **[formula bar](#formula-bar)**, for a draft as well as for a mirrored edit.
- The formula field of the **[computed columns](/x/react-data-grid/computed-columns/) panel**, where a click on any cell of a column writes its field name—a computed column only references its own row, so no range is written.

Some cells cannot be picked, and a click on them keeps its regular behavior: the cells of pinned rows, group rows, and aggregation rows, the cells of the checkbox, actions, detail toggle, reorder, and row number columns, a cell in edit mode, and the edited cell itself.
A click on a column header ends the edit too.
Clicks with the right button or with the <kbd class="key">Alt</kbd> key pressed are never picks.

A pick does not change the focus, the row selection, or the cell selection, and it does not need the `cellSelection` prop.
The `onCellClick` and `onRowClick` props are still called for a click that picks a reference.

While the caret is where a click would pick a reference, the grid root has the `MuiDataGrid-root--formulaReferencePicking` class and its cells show the `cell` cursor.

- The cursor is set with CSS, so it also shows on a few cells that cannot be picked, such as the cells of group rows and of an actions column.
- A drag does not scroll the grid when the pointer reaches its edges—use the mouse wheel during the drag.
- An existing cell selection stays visible under the reference rectangles.
- On touch devices, a tap picks a cell, but a range cannot be picked by dragging.
- There is no keyboard equivalent: the arrow keys move the caret in the formula.

## Copying, pasting, and filling

Clipboard copy places the **evaluated value** on the clipboard, not the formula.
In the other direction, pasting a string that starts with `=` into an `allowFormulas` column stores it as a formula.
With [`formulaA1Notation`](/x/react-data-grid/formula-syntax/#a1-notation) enabled, relative A1 references in pasted formulas are offset by each cell's distance from the paste origin, the way a spreadsheet adjusts them.

To replicate a formula across cells inside the grid, use the fill handle.

### Fill handle

When the cell selection [fill handle](/x/react-data-grid/clipboard/#drag-to-fill) is enabled (`cellSelection` and `cellSelectionFillHandle`), dragging a formula cell—or pressing <kbd class="key">Ctrl</kbd>+<kbd class="key">D</kbd> (fill down) or <kbd class="key">Ctrl</kbd>+<kbd class="key">R</kbd> (fill right)—copies the formula and adjusts its references for each target cell.

In the demo below, select the first **Total with tax** cell and drag the fill handle down: the relative `amount` reference follows each row, while the absolute `$C$1` reference stays pinned to the shared tax rate.
Then edit the tax rate and watch every total update.

{{"demo": "FormulaFillHandle.js", "bg": "inline", "defaultCodeOpen": false}}

- **Relative references shift** by the distance the cell moved: a formula written as `=A1 * B1` becomes `=A2 * B2` one row down, and same-row field references such as `=price * quantity` move to the next column when filled sideways.
- **Absolute references stay fixed**: positional references (the `$A$1` form) are never shifted.
- **Range windows follow too**: a plain range endpoint is stored as an offset from the formula's own cell, so `=SUM(B1:B4)` filled one row down reads `=SUM(B2:B5)`—the copied text is identical, each copy re-anchors to its own row. A `$` axis stays pinned, so `=SUM($A$1:A1)` filled down builds a running total. See [Ranges](/x/react-data-grid/formula-syntax/#ranges-and-whole-columns).
- Offsets are measured in the current **sorted and filtered** view order, so a fill respects the rows as they are displayed.
- A single-cell reference that would move past the first row or column keeps its original target; one that moves past the last row or column resolves to `#REF!`. A range whose window ends up outside the data rows is a `#REF!` error too, like in a spreadsheet.

Filling a formula into a column that is **not** `allowFormulas` copies the source cell's evaluated value instead of the formula, so a `=…` string is never stored in a plain column.

## Excel export

By default, [Excel export](/x/react-data-grid/export/#excel-export) writes the **evaluated value** of each formula cell.
To export the formulas themselves—as real Excel formulas that the spreadsheet recalculates—set `escapeFormulas: false`.

Pass it through the toolbar's `excelOptions` so the built-in **Export** button uses it:

```tsx
<DataGridPremium
  showToolbar
  slotProps={{
    toolbar: {
      excelOptions: { escapeFormulas: false },
    },
  }}
/>
```

Or pass it directly when exporting through the API:

```tsx
apiRef.current.exportDataAsExcel({ escapeFormulas: false });
```

Exported references are rewritten to Excel A1 notation pointing at each cell's position in the **exported sheet**, accounting for header rows and the exported column and row order—independently of the `formulaA1Notation` prop.
Relative references stay relative (`B2`) and absolute references stay absolute (`$B$2`), matching the grid—for a range window, an axis exports with `$` exactly when it is `FIXED()`.
Excel itself stores a relative range endpoint as an offset from the formula cell, which is exactly how the grid stores it too—so copy, fill, and sort inside Excel behave like they do in the grid.

- A reference to a cell **outside the export**—a filtered-out row, or a column removed with `disableExport` or the `fields` option—is marked as a `#REF!` error.
- A cell exports as a live formula only when every function it calls is registered in the grid—including [custom functions](/x/react-data-grid/formula-engine/#custom-functions). A formula calling an unknown function exports its evaluated value instead, so untrusted row data can never smuggle a spreadsheet-evaluated formula into the file.
- Registered functions are exported unchanged: a custom function that Excel does not recognize keeps its cached value but shows `#NAME?` if the spreadsheet recalculates.
- `COLUMN_VALUES` and `RANGE_REF` export as contiguous A1 ranges. When the export includes grouped or pinned rows, those ranges also cover them, so the value is correct but a manual recalculation in Excel can differ.
- CSV export always writes evaluated values.

The demo below compares mortgage offers with amortized-payment formulas.
Export it through the toolbar, open the file in Excel, and change an APR—the monthly payment and the best offer recalculate inside Excel, because the cells hold live formulas.

{{"demo": "FormulaExcelExport.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
`escapeFormulas` defaults to `true` to prevent [CSV and Excel formula injection](https://owasp.org/www-community/attacks/CSV_Injection): any string value that starts with `=`, `+`, `-`, or `@` is written as text.
Setting it to `false` exports grid formulas as live formulas, but also lets such strings in other columns run as formulas in Excel—only turn it off for trusted data.
:::

## Current limitations

- Formulas are not supported with the [server-side data source](/x/react-data-grid/server-side-data/) or while [pivoting](/x/react-data-grid/pivoting/) is active.
- The formula syntax is en-US only, and the built-in function metadata is not localized.
- Ranges and `COLUMN_VALUES` never cover pinned rows—reference their cells individually instead.
- A range window does not grow or shrink when rows are added or removed. A plain (anchored) window keeps its geometry relative to its formula and a `$` (fixed) window keeps its view positions, so an inserted row that sorts into the middle of a window changes which rows it covers.
- The formula editor does not support in-editor undo—the grid-level undo and redo of committed values work as usual.
- The `valueGetter` of a column with `allowFormulas` is ignored for its formula cells (a development-mode warning points this out); it applies normally to plain cells in the column.
- Clipboard copy places evaluated values on the clipboard—use the [fill handle](#fill-handle) to replicate formulas inside the grid.

## API

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
