---
title: Data Grid - Formulas
---

# Data Grid - Formulas [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Let users derive cell values from other cells with spreadsheet-like formulas.</p>

On columns that opt in with `allowFormulas`, cell values that are strings starting with `=` are parsed and evaluated.
The evaluated value flows through rendering, sorting, filtering, aggregation, clipboard copy, and export, while the formula source remains the value stored in the row data.

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

Formulas use an Excel-like, en-US syntax (`,` as the argument separator, `.` as the decimal separator):

- Operators with Excel precedence and semantics: `+`, `-`, `*`, `/`, `^`, `&` (text concatenation), and the comparisons `=`, `<>`, `<`, `<=`, `>`, `>=`.
- Literals: numbers, double-quoted strings (`""` to escape a quote), `TRUE` and `FALSE`.
- A bare identifier such as `price` references the value of that field **in the same row**.
  For field names that are not valid identifiers, use `FIELD("unit price")`.
- `REF(COLUMN("price"), ROW(42))` references the `price` cell of the row with id `42`.
- Function calls such as `=ROUND(price * quantity, 2)`. Function names are case-insensitive; field names are case-sensitive.

Values referenced through another column's `valueGetter` resolve to the derived value—formulas see what users see.

### Built-in functions

`SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `COUNTA`, `ROUND`, `ABS`, `MOD`, `POWER`, `IF`, `AND`, `OR`, `NOT`, `IFERROR`, `ISBLANK`, `CONCAT`/`CONCATENATE`, `LEN`, `UPPER`, `LOWER`, `TRIM`, `LEFT`, `RIGHT`.

### Error values

When a formula cannot be evaluated, the cell renders one of the following error codes: `#ERROR!` (syntax error), `#NAME?` (unknown function), `#VALUE!` (invalid operand), `#DIV/0!`, `#REF!` (unknown row or field), and `#CYCLE!` (circular reference).
Errors sort, filter, and export as their code strings.

## Editing

When a formula cell enters edit mode, the editor shows the formula source instead of the evaluated value, and always uses a text input—even on `number` columns.
To turn a plain cell into a formula cell, type `=`: the formula editor opens regardless of the column type.
Double-clicking a plain cell opens the column type's default editor.
Committing an edit without changes keeps the formula intact, including in row edit mode.
Invalid formulas can still be committed: the cell shows the corresponding error code until the formula is fixed.

`processRowUpdate` and undo/redo operate on the formula source, so persisting and restoring rows keeps formulas working for free.

## Custom functions

Provide custom functions with the `formulaFunctions` prop.
The prop **replaces** the built-in set—spread `GRID_FORMULA_FUNCTIONS` to extend it:

```tsx
import {
  DataGridPremium,
  GRID_FORMULA_FUNCTIONS,
  GridFormulaFunctionDefinition,
} from '@mui/x-data-grid-premium';

const DOUBLE: GridFormulaFunctionDefinition = {
  name: 'DOUBLE',
  minArgs: 1,
  maxArgs: 1,
  apply: ([value], context) => {
    const number = context.coerce.toNumber(value);
    return typeof number === 'number' ? number * 2 : number;
  },
};

<DataGridPremium formulaFunctions={{ ...GRID_FORMULA_FUNCTIONS, DOUBLE }} />;
```

## API methods

The grid API exposes formula methods—see the [API reference](/x/api/data-grid/grid-api/) for details:

- `setCellFormula()` stores a formula and re-evaluates.
- `getCellFormula()` returns the stored source of a formula cell.
- `getCellFormulaResult()` returns the evaluation result.
- `validateCellFormula()` statically validates a formula source.
- `reevaluateFormulas()` re-evaluates everything—an escape hatch after in-place row mutations.

## Current limitations

- Ranges (`RANGE()`, `COLUMN_VALUES()`) and position-based references (`ROW_POSITION()`, `COLUMN_POSITION()`) parse but evaluate to `#REF!`. Their support is planned.
- The `A1` editor notation is not available yet.
- Formulas are not supported with the [server-side data source](/x/react-data-grid/server-side-data/) or while [pivoting](/x/react-data-grid/pivoting/) is active.
- [Row grouping](/x/react-data-grid/row-grouping/) on a formula column groups by the raw source values.
- [Row spanning](/x/react-data-grid/row-spanning/) compares raw source values, so identical formula sources span as one cell even when their evaluated values differ.
- The formula syntax is en-US only.

## API

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridApi](/x/api/data-grid/grid-api/)
