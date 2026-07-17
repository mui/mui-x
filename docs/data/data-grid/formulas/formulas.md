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

## Formula syntax

Formulas use an Excel-like, en-US syntax: `,` separates arguments and `.` is the decimal separator.

There are two ways to write cell references:

- The **canonical syntax** described in this section—explicit forms such as `REF()`, `RANGE()`, and `COLUMN_VALUES()`—is what the grid stores in the row data and accepts everywhere.
- The optional **[A1 notation](#a1-notation)**—spreadsheet addresses such as `B2` or `$B$2`—is an editing layer most applications enable for their users.

### Operators

Operators follow Excel precedence and semantics, from lowest to highest:

| Precedence | Operators                       | Meaning            |
| :--------- | :------------------------------ | :----------------- |
| 1          | `=`, `<>`, `<`, `<=`, `>`, `>=` | Comparison         |
| 2          | `&`                             | Text concatenation |
| 3          | `+`, `-`                        | Add, subtract      |
| 4          | `*`, `/`                        | Multiply, divide   |
| 5          | `^`                             | Exponentiation     |
| 6          | `-`, `+` (unary)                | Sign               |

For example, `=7 * 8 + 2` is `58` and `=7 * (8 + 2)` is `70`.
Two quirks match Excel exactly: binary operators are left-associative, including `^` (`=2 ^ 3 ^ 2` is `64`), and the unary minus binds tighter than `^` (`=-2 ^ 2` is `4`).
Comparisons between strings are case-insensitive, like in Excel: `="a" = "A"` is `TRUE`.

### Values and same-row references

- Literals: numbers, double-quoted strings (`""` escapes a quote), `TRUE`, and `FALSE`.
- A bare identifier such as `price` references the value of that field **in the same row**.
  For field names that are not valid identifiers, use `FIELD("unit price")`.
- Function names are case-insensitive; field names are case-sensitive.

Values referenced through another column's `valueGetter` resolve to the derived value—formulas see what users see.

### Cross-row references

`REF(column, row)` references a single cell anywhere in the grid.
Each axis identifies its target either by **identity** (field name, row id) or by **position** in the current view:

| Selector             | Meaning                                                             |
| :------------------- | :------------------------------------------------------------------ |
| `COLUMN("price")`    | The column with the field `price`                                   |
| `COLUMN_POSITION(2)` | The second visible column                                           |
| `ROW(42)`            | The row with the id `42`—row ids can also be strings: `ROW("a-01")` |
| `ROW_POSITION(1)`    | The first row of the current sorted and filtered view (1-based)     |

The two kinds can be mixed freely: `=REF(COLUMN("price"), ROW_POSITION(1))` reads the `price` cell of whichever row is currently displayed first.
Identity-based references follow their row and column when the grid is re-sorted or re-filtered; position-based references keep pointing at the same view coordinates.

:::warning
References by row id require stable ids: if you provide [`getRowId()`](/x/react-data-grid/row-definition/#row-identifier), it must return the same id for the same logical row across updates.
A row whose id changes is a removed row from the formula engine's perspective, and references to it resolve to `#REF!`.
:::

### Ranges and whole columns

Two range forms aggregate over many cells at once.
Ranges are only valid as arguments of range-accepting functions such as `SUM`—a range in a scalar position is a `#VALUE!` error, and an error value inside a range propagates to the result.

- `COLUMN_VALUES("price")` is the list of the field's values over the current **sorted and filtered** rows, in view order.
  This form is sort-proof and filter-aware, making it the recommended way to aggregate a column: `=SUM(COLUMN_VALUES("price"))`.
- `RANGE(REF(...), REF(...))` is the inclusive rectangle between two cell anchors, resolved against the current view.
  An anchor on a row that is filtered out, or on a hidden column, has no position and the range evaluates to `#REF!`.

Autogenerated rows—group headers, aggregation footers—and pinned rows have no position and are never part of a range.

Formulas that materialize very large ranges (above roughly 100,000 cells per evaluation) log a development-mode warning—consider the [aggregation](/x/react-data-grid/aggregation/) feature for whole-column summaries displayed outside the rows.

### Updates on sorting and filtering

When rows are sorted or filtered, the grid first applies the new order using the formula values it already has.
Formulas that depend on view positions—`ROW_POSITION()`, `COLUMN_POSITION()`, and ranges—then re-evaluate once against the new order.
The grid never sorts, filters, or groups again in response, just like a spreadsheet never re-sorts itself after recalculating.
If a re-evaluated value ends up out of order, re-apply the sort.

References by field name and row id are unaffected by this policy.

### Built-in functions

Math and aggregation:

| Function                 | Description                                                           |
| :----------------------- | :-------------------------------------------------------------------- |
| `SUM(value1, value2, …)` | Adds numbers, ranges, and columns.                                    |
| `AVERAGE(value1, …)`     | Returns the arithmetic mean of its numeric values.                    |
| `MIN(value1, …)`         | Returns the smallest numeric value.                                   |
| `MAX(value1, …)`         | Returns the largest numeric value.                                    |
| `COUNT(value1, …)`       | Counts how many values are numbers or dates.                          |
| `COUNTA(value1, …)`      | Counts how many values are not empty.                                 |
| `ROUND(value, [digits])` | Rounds a number to the given number of decimal digits (0 by default). |
| `ABS(value)`             | Returns the absolute value of a number.                               |
| `MOD(value, divisor)`    | Returns the remainder of a division (sign of the divisor).            |
| `POWER(base, exponent)`  | Raises a number to a power.                                           |

Logical:

| Function                                     | Description                                                                |
| :------------------------------------------- | :------------------------------------------------------------------------- |
| `IF(condition, valueIfTrue, [valueIfFalse])` | Returns one value when the condition is true and another when it is false. |
| `AND(condition1, condition2, …)`             | Returns `TRUE` when every condition is true.                               |
| `OR(condition1, condition2, …)`              | Returns `TRUE` when at least one condition is true.                        |
| `NOT(condition)`                             | Reverses a boolean value.                                                  |
| `IFERROR(value, valueIfError)`               | Returns a fallback value when the first argument is an error.              |
| `ISBLANK(value)`                             | Returns `TRUE` when the value is empty.                                    |

Text:

| Function                      | Description                                                    |
| :---------------------------- | :------------------------------------------------------------- |
| `CONCAT(text1, text2, …)`     | Joins values into a single text string (alias: `CONCATENATE`). |
| `LEN(text)`                   | Returns the number of characters in a text string.             |
| `UPPER(text)` / `LOWER(text)` | Converts text to uppercase or lowercase.                       |
| `TRIM(text)`                  | Removes leading, trailing, and repeated spaces from text.      |
| `LEFT(text, [count])`         | Returns the first characters of a text string (1 by default).  |
| `RIGHT(text, [count])`        | Returns the last characters of a text string (1 by default).   |

`IF`, `AND`, and `OR` are lazy—branches that are not taken are never evaluated.

### Error values

When a formula cannot be evaluated, the cell renders an error code:

| Code      | Meaning                                                                                     |
| :-------- | :------------------------------------------------------------------------------------------ |
| `#ERROR!` | The formula could not be parsed or evaluated.                                               |
| `#NAME?`  | Unknown function name.                                                                      |
| `#VALUE!` | Invalid operand or argument—for example, a range passed to a function that takes a scalar.  |
| `#DIV/0!` | Division by zero.                                                                           |
| `#REF!`   | Unknown row or field, or a position-based reference with no matching row or column in view. |
| `#CYCLE!` | The formula participates in a circular reference chain.                                     |

Errors sort, filter, and export as their code strings.
An invalid formula can still be committed—the cell shows its error code until the formula is fixed—so users never lose a half-written formula.

## A1 notation

For end users who know spreadsheets, enable the optional A1 editing dialect with the `formulaA1Notation` prop.
It adds a row-number column at the left and a letter adornment to each column header, and the formula editor accepts and displays spreadsheet addresses:

| A1 form | Stored as                        | Behavior                                                              |
| :------ | :------------------------------- | :-------------------------------------------------------------------- |
| `B2`    | Field name and row id (identity) | Follows its row and column when the view changes; adjusts when filled |
| `$B2`   | Positional column, identity row  | The `$` axis stays pinned to the view position                        |
| `B$2`   | Identity column, positional row  | The `$` axis stays pinned to the view position                        |
| `$B$2`  | Positional column and row        | Always the cell at that view position; never adjusted by fills        |
| `B2:C5` | `RANGE()` between two anchors    | The rectangle between the anchors in the current view                 |
| `B:B`   | `COLUMN_VALUES()` of the field   | Every value of the column over the sorted and filtered rows           |

Like in Excel, a plain address is **relative** and a `$`-anchored axis is **absolute**.
One difference is deliberate: a relative reference maps to the row id and field name, so it keeps tracking the same cell when the grid is re-sorted—positions in a data grid change far more often than in a spreadsheet.

A1 notation is an editing layer only:

- Row data, clipboard copy, export, and `processRowUpdate` always carry the canonical syntax.
  A1 text is converted at commit time.
- Same-row references keep their field names (`=price * quantity`)—an A1 address would pin them to one specific row.
- The row numbers and header letters always show the coordinates that A1 addresses and position-based references resolve to, even after sorting or filtering.

The prop has no effect when `disableFormulas` is enabled or a [data source](/x/react-data-grid/server-side-data/) is set.

## How it works

The formula source is stored **only in the row data**—everything else is derived from it.
A dedicated engine parses each distinct source once, tracks which cells every formula reads, and evaluates in dependency order.
The results form a lookup that the grid consults whenever it needs a cell value:

<div class="only-light-mode">
  <img src="/static/x/data-grid/formulas/formula-data-flow-light.svg" width="920" height="320" alt="Formulas data flow: row data is parsed and evaluated by the formula engine into derived values consumed by grid features, while edits write the formula source back to the row data." loading="lazy" style="display: block; width: 100%;">
</div>
<div class="only-dark-mode">
  <img src="/static/x/data-grid/formulas/formula-data-flow-dark.svg" width="920" height="320" alt="Formulas data flow: row data is parsed and evaluated by the formula engine into derived values consumed by grid features, while edits write the formula source back to the row data." loading="lazy" style="display: block; width: 100%;">
</div>

Because the source of truth never leaves the row data, persistence comes for free: `processRowUpdate` receives the formula source, undo and redo replay it, and controlled rows work unchanged.

When a cell changes—through editing, `updateRows()`, or a paste—the engine re-evaluates only that cell and its transitive dependents:

<div class="only-light-mode">
  <img src="/static/x/data-grid/formulas/formula-edit-cycle-light.svg" width="920" height="210" alt="Edit cycle: the editor opens on the formula source, the commit writes the source to the row, the engine re-evaluates the cell and its dependents, and only changed cells re-render." loading="lazy" style="display: block; width: 100%;">
</div>
<div class="only-dark-mode">
  <img src="/static/x/data-grid/formulas/formula-edit-cycle-dark.svg" width="920" height="210" alt="Edit cycle: the editor opens on the formula source, the commit writes the source to the row, the engine re-evaluates the cell and its dependents, and only changed cells re-render." loading="lazy" style="display: block; width: 100%;">
</div>

After each evaluation pass the grid emits the `formulaEvaluationEnd` event with the list of changed cells.

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

## Copying, pasting, and filling

Clipboard copy places the **evaluated value** on the clipboard, not the formula.
In the other direction, pasting a string that starts with `=` into an `allowFormulas` column stores it as a formula.
With `formulaA1Notation` enabled, relative A1 references in pasted formulas are offset by each cell's distance from the paste origin, the way a spreadsheet adjusts them.

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

## Custom functions

Provide custom functions with the `formulaFunctions` prop.
The prop **replaces** the built-in set—spread `GRID_FORMULA_FUNCTIONS` to extend it:

```tsx
import {
  DataGridPremium,
  GRID_FORMULA_FUNCTIONS,
  GridFormulaFunctionDefinition,
} from '@mui/x-data-grid-premium';

const MARGIN: GridFormulaFunctionDefinition = {
  name: 'MARGIN',
  minArgs: 2,
  maxArgs: 2,
  signature: 'MARGIN(revenue, cost)',
  description: 'Gross margin as a fraction of revenue.',
  category: 'Finance',
  apply: ([revenue, cost], context) => {
    const income = context.coerce.toNumber(revenue);
    const expense = context.coerce.toNumber(cost);
    if (typeof income !== 'number') {
      return income; // pass the coercion error through
    }
    if (typeof expense !== 'number') {
      return expense;
    }
    return (income - expense) / income;
  },
};

<DataGridPremium formulaFunctions={{ ...GRID_FORMULA_FUNCTIONS, MARGIN }} />;
```

A definition supports the following fields:

| Field                                  | Description                                                                                     |
| :------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `name`                                 | Uppercase identifier (`A–Z`, `0–9`, `_`). Reserved names such as `REF` or `RANGE` are rejected. |
| `minArgs` / `maxArgs`                  | Accepted argument count. `maxArgs: null` makes the function variadic.                           |
| `apply(args, context)`                 | The implementation. Returns a number, string, boolean, `Date`, `null`, or an error value.       |
| `lazy`                                 | Arguments arrive as functions to call on demand—how `IF` skips the branch that is not taken.    |
| `acceptsRanges`                        | Allows range arguments. Without it, passing a range produces `#VALUE!`.                         |
| `acceptsErrors`                        | Receives error arguments instead of propagating them—how `IFERROR` inspects its first argument. |
| `signature`, `description`, `category` | Optional metadata displayed by the [autocomplete](#autocomplete) dropdown.                      |

The `context` argument provides `coerce` helpers (`toNumber`, `toText`, `toBoolean`, `isEmpty`, `compare`) that apply the same coercion rules as the built-in functions and return either the coerced value or an error value, plus `currentCell` with the `id` and `field` of the evaluating cell.

### Ranges, lazy arguments, and errors

A range argument is an object of the shape `{ kind: 'range', values }`, where `values` lists the scalar cell values in row-major order.
To fail with a specific error, return `{ kind: 'error', code, message }` with one of the [error codes](#error-values)—the message is informational only.

```tsx
const SPREAD: GridFormulaFunctionDefinition = {
  name: 'SPREAD',
  minArgs: 1,
  maxArgs: 1,
  acceptsRanges: true,
  signature: 'SPREAD(range)',
  description: 'Difference between the largest and smallest value.',
  apply: ([arg], context) => {
    const values =
      typeof arg === 'object' &&
      arg !== null &&
      'kind' in arg &&
      arg.kind === 'range'
        ? arg.values
        : [arg];
    const numbers: number[] = [];
    for (const value of values) {
      if (context.coerce.isEmpty(value)) {
        continue;
      }
      const numeric = context.coerce.toNumber(value);
      if (typeof numeric !== 'number') {
        return numeric;
      }
      numbers.push(numeric);
    }
    if (numbers.length === 0) {
      return {
        kind: 'error',
        code: '#VALUE!',
        message: 'SPREAD needs at least one number.',
      };
    }
    return Math.max(...numbers) - Math.min(...numbers);
  },
};
```

With `lazy: true`, each entry of `args` is a function instead of a value—call it to evaluate the argument.
Arguments that are never called are never evaluated, which is how `IF`, `AND`, and `OR` short-circuit.

## Current limitations

- Formulas are not supported with the [server-side data source](/x/react-data-grid/server-side-data/) or while [pivoting](/x/react-data-grid/pivoting/) is active.
- The formula syntax is en-US only, and the built-in function metadata is not localized.
- Pinned rows are excluded from the position context, so they cannot be referenced positionally or included in ranges.
- The formula editor is single-line and does not support in-editor undo—the grid-level undo and redo of committed values work as usual.
- A formula column's own `valueGetter` is ignored for its formula cells (a development-mode warning points this out); it applies normally to plain cells in the column.
- Clipboard copy places evaluated values on the clipboard—use the [fill handle](#fill-handle) to replicate formulas inside the grid.

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Formulas"}}

## API

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
