---
title: Data Grid - Formula syntax
---

# Data Grid - Formula syntax [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">The complete reference for writing formulas: operators, cell references, ranges, built-in functions, and error values.</p>

This page is the reference for the formula language used by the [Formulas](/x/react-data-grid/formulas/) feature.
Formulas use an Excel-like, en-US syntax: `,` separates arguments and `.` is the decimal separator.

There are two ways to write cell references:

- The **canonical syntax** described on this page—explicit forms such as `REF()`, `RANGE_REF()`, and `COLUMN_VALUES()`—is what the grid stores in the row data and accepts everywhere.
- The optional **[A1 notation](#a1-notation)**—spreadsheet addresses such as `B2` or `$B$2`—is an editing layer most applications enable for their users.

## Operators

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

## Values and same-row references

- Literals: numbers, double-quoted strings (`""` escapes a quote), `TRUE`, and `FALSE`.
- A bare identifier such as `price` references the value of that field **in the same row**.
  For field names that are not valid identifiers, use `FIELD("unit price")`.
- Function names are case-insensitive; field names are case-sensitive.

Values referenced through another column's `valueGetter` resolve to the derived value—formulas see what users see.

## Cross-row references

`REF(column, row)` references a single cell anywhere in the grid.
Each axis identifies its target either by **identity** (field name, row id) or by **position** in the current view:

| Selector             | Meaning                                                             |
| :------------------- | :------------------------------------------------------------------ |
| `COLUMN("price")`    | The column with the field `price`                                   |
| `COLUMN_POSITION(2)` | The second visible column                                           |
| `ROW(42)`            | The row with the id `42`—row ids can also be strings: `ROW("a-01")` |
| `ROW_POSITION(1)`    | The first displayed row (1-based)                                   |

The two kinds can be mixed freely: `=REF(COLUMN("price"), ROW_POSITION(1))` reads the `price` cell of whichever row is currently displayed first.
Row positions cover pinned rows too: top-pinned rows take the first positions, followed by the sorted and filtered data rows, then bottom-pinned rows.
Identity-based references follow their row and column when the grid is re-sorted or re-filtered; position-based references keep pointing at the same view coordinates.
The identity/position choice exists for single-cell references only—[range](#ranges-and-whole-columns) endpoints are either anchored to the formula's own cell or fixed to view positions.

:::warning
References by row id require stable ids: if you provide [`getRowId()`](/x/react-data-grid/row-definition/#row-identifier), it must return the same id for the same logical row across updates.
A row whose id changes is a removed row from the formula engine's perspective, and references to it resolve to `#REF!`.
:::

## Ranges and whole columns

Two range forms aggregate over many cells at once.
Ranges are only valid as arguments of range-accepting functions such as `SUM`—a range in a scalar position is a `#VALUE!` error, and an error value inside a range propagates to the result.

- `COLUMN_VALUES("price")` is the list of the field's values over the current **sorted and filtered** rows, in view order.
  This form is sort-proof and filter-aware, making it the recommended way to aggregate a column: `=SUM(COLUMN_VALUES("price"))`.
- `RANGE_REF(COLUMN_FROM(c1), ROW_FROM(r1), COLUMN_TO(c2), ROW_TO(r2))` is the inclusive rectangle between two endpoints—for example, `=SUM(RANGE_REF(COLUMN_FROM(4), ROW_FROM(1), COLUMN_TO(4), ROW_TO(4)))` sums the first four rows of the fourth visible column.

Each `RANGE_REF()` axis takes one of two forms, matching the relative/absolute distinction spreadsheets make:

- A plain **view position** (`ROW_FROM(1)`) covers that position whatever occupies it. Wrapping it in `FIXED()`—the canonical form of the `$` prefix in [A1 notation](#a1-notation)—additionally pins it against the fill handle: a non-`FIXED()` position shifts with the fill offset, a `FIXED()` one never adjusts, on fill or otherwise.
- **`ANCHOR(delta)`** (`ROW_FROM(ANCHOR(-3))`) is a signed offset from the cell that owns the formula—the canonical form of a plain (no-`$`) A1 endpoint. The window keeps its geometry relative to the formula: re-sorting or re-filtering moves it along with its cell, and filling copies it verbatim because the offsets re-anchor to each target on their own.

A positional window always covers the same view coordinates and clips to what is available when the view is smaller—an entirely out-of-view window is simply empty, never a `#REF!` error.
An anchored window is strict instead: when its own row or column has no position (filtered out or hidden), or an endpoint falls outside the data rows after a re-sort, the range is a `#REF!` error—covering a silently different set of cells than the one anchored to would be worse than the honest error.
Because a new row lands wherever the active sort places it, neither window form grows or shrinks when rows are added or removed.

Autogenerated rows—group headers, aggregation footers—have no position and cannot be referenced.
Pinned rows have positions (top-pinned rows come before the data rows, bottom-pinned rows after) and can be referenced individually with `REF()`, but ranges and `COLUMN_VALUES` never include them—a window overlapping pinned positions silently drops them.
This is what lets a pinned summary row aggregate the data without covering itself, so put positional range totals in pinned rows: an in-band summary row with a positional (or `$`) window can be swept inside it by a sort, which is a `#CYCLE!` error.
Anchored windows cannot be swept into their own cell—their geometry moves with the formula—so a sort turns an impossible anchored window into `#REF!`, never `#CYCLE!`.

Formulas that materialize very large ranges (above roughly 100,000 cells per evaluation) log a development-mode warning—consider the [aggregation](/x/react-data-grid/aggregation/) feature for whole-column summaries displayed outside the rows.

## Updates on sorting and filtering

When rows are sorted or filtered, the grid first applies the new order using the formula values it already has.
Formulas that depend on view positions—`ROW_POSITION()`, `COLUMN_POSITION()`, and ranges—then re-evaluate once against the new order.
The grid never sorts, filters, or groups again in response, just like a spreadsheet never re-sorts itself after recalculating.
If a re-evaluated value ends up out of order, re-apply the sort.

References by field name and row id are unaffected by this policy.

## Built-in functions

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

## Error values

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

| A1 form     | Stored as                        | Behavior                                                              |
| :---------- | :------------------------------- | :-------------------------------------------------------------------- |
| `B2`        | Field name and row id (identity) | Follows its row and column when the view changes; adjusts when filled |
| `$B2`       | Positional column, identity row  | The `$` axis stays pinned to the view position                        |
| `B$2`       | Identity column, positional row  | The `$` axis stays pinned to the view position                        |
| `$B$2`      | Positional column and row        | Always the cell at that view position; never adjusted by fills        |
| `B2:C5`     | `RANGE_REF()` with `ANCHOR()`    | The rectangle at those offsets from the formula; moves with its cell  |
| `$B$2:$C$5` | `RANGE_REF()` with `FIXED()`     | The rectangle at those view positions; never adjusted                 |
| `B:B`       | `COLUMN_VALUES()` of the field   | Every value of the column over the sorted and filtered rows           |

Like in Excel, a plain address is **relative** and a `$`-anchored axis is **absolute**.
On a range endpoint the rule is exactly the spreadsheet one: a plain axis of `B2:C5` is stored as an offset from the formula's own cell, so the window moves with the formula under sorting and filling, while a `$` axis is an absolute view position that never adjusts.
A range written in a **pinned row** stores plain endpoints as view positions instead—a pinned summary sits outside the sortable data, so "relative to me" has no meaning there and the window stays put, exactly like a spreadsheet total outside the sorted range.
One difference from spreadsheets is deliberate: a relative **single-cell** reference maps to the row id and field name, so it keeps tracking the same cell when the grid is re-sorted—positions in a data grid change far more often than in a spreadsheet.
`$` has no effect on a whole-column range—`$B:$B` normalizes to `B:B`, tracks its field, and shifts on horizontal fill.

A1 notation is an editing layer only:

- Row data, clipboard copy, export, and `processRowUpdate` always carry the canonical syntax.
  A1 text is converted at commit time.
- Same-row references keep their field names (`=price * quantity`)—an A1 address would pin them to one specific row.
  A field whose name reads as an A1 address (a field named `q1`, for example) displays and is written as `FIELD("q1")` while editing, so it can't be mistaken for cell `Q1`.
- The row numbers and header letters always show the coordinates that A1 addresses and position-based references resolve to, even after sorting or filtering.

The prop has no effect when `disableFormulas` is enabled or a [data source](/x/react-data-grid/server-side-data/) is set.

## API

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
