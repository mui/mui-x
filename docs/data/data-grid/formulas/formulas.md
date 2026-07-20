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

## Enabling formulas

Formula support is opt-in per column:

```tsx
const columns: GridColDef[] = [
  { field: 'price', type: 'number' },
  { field: 'quantity', type: 'number' },
  { field: 'total', type: 'number', allowFormulas: true, editable: true },
];

const rows = [{ id: 1, price: 2, quantity: 3, total: '=price * quantity' }];
```

Without `allowFormulas`, values starting with `=` render as plain strings.
To store a literal string starting with `=` in a formula column, prefix it with an apostrophe: `'=not a formula`.

Use the `disableFormulas` prop to turn the feature off for the whole grid.

## Editing

When a formula cell enters edit mode, the editor shows the formula source instead of the evaluated value—even on `number` columns.
To turn a plain cell into a formula cell, type `=`: the formula editor opens regardless of the column type.
Double-clicking a plain cell opens the column type's default editor, and a column with a custom `renderEditCell` always keeps its own editor.

- Committing an edit without changes keeps the formula intact, including in row edit mode.
- To remove a formula, commit a plain value in its place, or clear the cell content.
- The editor is single-line—line breaks in typed or pasted content are removed.

The formula editor floats over the cell and grows with the formula: when the content no longer fits the column, the editor extends over the neighboring cells—up to the visible edge of the grid—so the formula stays readable while you type.
Deleting content never shrinks the editor mid-edit, and a formula longer than the available width scrolls horizontally inside it.
In row edit mode, only the focused cell shows the floating editor; the row's other formula cells display their current draft in place.

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

Double-click any **Q1 total** cell in the demo below to see its three references highlighted, or the **Annual run rate** cell for a range outline.

{{"demo": "FormulaReferenceHighlighting.js", "bg": "inline", "defaultCodeOpen": false}}

- Colors are keyed on the **resolved target**, so two references to the same cell share a color, and a reference repeated in the formula is outlined once.
- A reference that cannot be resolved—a hidden column, a filtered-out row, or the edited cell itself—is left uncolored and is not outlined.
- Highlighting works in both the canonical and the A1 syntax.
- A column with a custom `renderEditCell` keeps full control of its editor and is not highlighted.

The palette contains ten colors, exposed as the `--DataGrid-formulaRefColor-0` through `--DataGrid-formulaRefColor-9` CSS variables on the formula editor and the highlight overlay, and can be overridden in a theme.

### Formula bar

Enable the spreadsheet-style formula bar on the default toolbar with `slotProps.toolbar.formulaBar`:

```tsx
<DataGridPremium showToolbar slotProps={{ toolbar: { formulaBar: true } }} />
```

The bar is a permanently open formula editor for the focused cell:

- With the cell in **view mode**, typing in the bar edits a draft: references are colored and outlined in the grid, and the draft's result is evaluated on the fly next to the input—nothing is committed while typing.
  <kbd class="key">Enter</kbd> commits the draft (through `processRowUpdate`, as a single undo step) and moves the focus down, <kbd class="key">Tab</kbd> commits and moves right, and clicking another cell or leaving the bar also commits—<kbd class="key">Escape</kbd> is the only way to discard.
- With the cell in **edit mode**, the bar is a live mirror of the editor: typing in the cell shows up in the bar, typing in the bar shows up in the cell, and interacting with the bar does not close the cell's editor.

Click any **Amount** cell in the demo below and edit its formula from the bar, or double-click a cell and watch the bar mirror the edit.

{{"demo": "FormulaBarBasic.js", "bg": "inline", "defaultCodeOpen": false}}

To place the bar in a custom toolbar—or anywhere else in the page through a portal—compose the exported component; see the [Formula Bar component](/x/react-data-grid/components/formula-bar/) page.

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
- Offsets are measured in the current **sorted and filtered** view order, so a fill respects the rows as they are displayed.
- A reference that would move past the first row or column keeps its original target; one that moves past the last row or column resolves to `#REF!`.

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
Relative references stay relative (`B2`) and absolute references stay absolute (`$B$2`), matching the grid.

- A reference to a cell **outside the export**—a filtered-out row, or a column removed with `disableExport` or the `fields` option—is marked as a `#REF!` error.
- Functions are exported unchanged: a function that Excel does not recognize keeps its cached value but shows `#NAME?` if the spreadsheet recalculates.
- `COLUMN_VALUES` and `RANGE` export as contiguous A1 ranges. When the export includes grouped or pinned rows, those ranges also cover them, so the value is correct but a manual recalculation in Excel can differ.
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
- Pinned rows are excluded from the position context, so they cannot be referenced positionally or included in ranges.
- The formula editor is single-line and does not support in-editor undo—the grid-level undo and redo of committed values work as usual.
- A formula column's own `valueGetter` is ignored for its formula cells (a development-mode warning points this out); it applies normally to plain cells in the column.
- Clipboard copy places evaluated values on the clipboard—use the [fill handle](#fill-handle) to replicate formulas inside the grid.

## API

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
