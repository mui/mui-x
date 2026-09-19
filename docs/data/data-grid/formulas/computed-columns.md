---
title: Data Grid - Computed columns
---

# Data Grid - Computed columns [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Add read-only columns whose values are computed from the other fields of each row with a single formula.</p>

A computed column is defined once, by a formula, and evaluated for every row of the grid.
Users create and edit computed columns from the toolbar, the column menu, or a side panel; you can also define them in code.
The definitions are a serializable list, so they persist, restore, and travel with the rest of the grid state, and every change is one undo step.

The demo below has two computed columns—**Total** and **Margin**—defined from the **Price**, **Cost**, **Qty**, and **Discount** columns.
Edit any of those values and watch the computed cells update, or open the **Computed columns** panel from the toolbar to add a column of your own.

{{"demo": "ComputedColumnsBasic.js", "bg": "inline", "defaultCodeOpen": false}}

Computed columns are part of the formulas feature, which is not bundled with the grid.
Inject it through the `featureDependencies` prop, as described in [Enabling formulas](/x/react-data-grid/formulas/#enabling-formulas):

```tsx
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

<DataGridPremium featureDependencies={{ formula: formulaFeature }} />;
```

Without it, the computed columns props and API have no effect, and the toolbar button and column menu items are hidden—a console warning points at the missing dependency in development builds.

:::info
Computed columns and [cell formulas](/x/react-data-grid/formulas/) share the same formula language and engine, but solve different problems: a cell formula is a value stored in the row data of one cell, whereas a computed column applies one formula to every row and stores nothing in the row data.
:::

## Quick start

With the feature injected, computed columns are available out of the box:

- The **Computed columns** button in the default toolbar opens the side panel, which lists the computed columns of the grid. From there, add a column, or open one to edit or remove it.
- The column menu of any column offers **Add computed column**, which inserts the new column right after it. The column menu of a computed column also offers **Edit computed column** and **Remove computed column**.
- Double-clicking a computed cell, or pressing <kbd class="key">Enter</kbd> on it, opens the editor with that row as the preview row.

The editor asks for a name, a field, a formula, a result type, and—for numbers—a display format.
The field is derived from the name until you edit it and cannot be changed once the column exists.
While you type the formula, the referenced cells of the preview row are outlined in the grid and the result is previewed below the formula, through the same path the cells use—so the preview shows exactly what the cells show, including errors.
The **Insert** pane under the formula lists the columns and the functions you can reference; click one to insert it at the caret.
The column is created or updated when you click **Add column** or **Apply**, or press <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> (<kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> on macOS).
<kbd class="key">Escape</kbd> discards the draft.

In the grid, a computed column shows a `ƒx` badge in its header; hover it to see the formula.
Computed cells are read-only: they cannot be edited, but they can be sorted, filtered, grouped, aggregated, copied, and exported like any other cell.

## Definitions

Each computed column is described by a `GridComputedColumnDefinition`.
The list of definitions is the **computed columns model**:

```ts
interface GridComputedColumnDefinition {
  // The field of the generated column. Must be unique among all the columns of the grid.
  field: string;
  // The header of the generated column.
  headerName: string;
  // The formula, with its leading `=`.
  formula: string;
  // The result type: 'number' | 'string' | 'boolean' | 'date' | 'dateTime'.
  type: GridComputedColumnType;
  // The display format of a 'number' column.
  numberFormat?: Intl.NumberFormatOptions;
  // Shown as the header tooltip.
  description?: string;
}

type GridComputedColumnsModel = GridComputedColumnDefinition[];
```

The **formula** uses the [formula syntax](/x/react-data-grid/formula-syntax/), with bare field names to reference the other columns of the same row (`=price * quantity`), `FIELD("unit price")` for fields that are not valid identifiers, and any built-in or [custom function](/x/react-data-grid/formula-engine/#custom-functions).
Store it with its leading `=`, as it appears in the editor—the editor adds a missing `=` when the column is applied.
Cross-row references, ranges, and `COLUMN_VALUES` are not available to computed columns; see [Current limitations](#current-limitations).

The **result type** becomes the [column type](/x/react-data-grid/column-definition/#column-types) of the generated column, so sorting, filtering, and rendering behave as they do for that type.
The formula result is checked against it: a `number`, `boolean`, `date`, or `dateTime` column whose formula returns a value of another type shows `#VALUE!`, while a `string` column converts any result to text.
In the editor, the result type of a new column follows the preview until you pick one yourself.

The optional **number format** is an [`Intl.NumberFormatOptions`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options) object applied by the column's `valueFormatter`.
The editor manages the `style`, `currency`, `minimumFractionDigits`, `maximumFractionDigits`, and `useGrouping` options; any other option you set in code is kept.

To initialize the model without controlling it, use `initialState`:

```tsx
<DataGridPremium
  featureDependencies={{ formula: formulaFeature }}
  initialState={{
    computedColumns: {
      model: [
        {
          field: 'total',
          headerName: 'Total',
          formula: '=price * quantity',
          type: 'number',
          numberFormat: { style: 'currency', currency: 'USD' },
        },
      ],
    },
  }}
/>
```

### Customizing the generated columns

The generated columns are regular [column definitions](/x/react-data-grid/column-definition/): they take part in the column order, can be resized, hidden, pinned, and reordered, and appear in the columns panel.
To customize them, pass a partial column definition—or a function returning one for each computed column—through the `computedColDef` prop:

```tsx
<DataGridPremium
  computedColDef={(definition) => ({
    width: definition.type === 'number' ? 120 : 180,
    headerAlign: 'center',
  })}
/>
```

The `field`, `type`, `editable`, `allowFormulas`, `valueGetter`, and `valueSetter` properties are owned by the feature and cannot be overridden; `cellClassName` and `headerClassName` are merged with the classes of the feature.

The generated column definitions carry a `computed: true` flag, which lets you tell them apart from the other columns—in a custom column menu, for instance.

## Controlled and persisted models

Use the `computedColumns` and `onComputedColumnsChange` props to control the model.
Every change made from the panel, the column menu, or the API goes through the callback:

```tsx
const [computedColumns, setComputedColumns] =
  React.useState<GridComputedColumnsModel>([]);

<DataGridPremium
  computedColumns={computedColumns}
  onComputedColumnsChange={setComputedColumns}
/>;
```

In the demo below, the model is shown under the grid.
Open the panel to add, edit, or remove a column and watch it change; the **Total pay** column references the two other computed columns.

{{"demo": "ComputedColumnsControlled.js", "bg": "inline", "defaultCodeOpen": false}}

The model is part of the [grid state](/x/react-data-grid/state/): `apiRef.current.exportState()` includes it as `computedColumns.model`, and `initialState` or `apiRef.current.restoreState()` bring it back—together with the position, width, and visibility of the generated columns, which live in the `columns` slice like those of any other column.
Definitions are plain objects, so the model can be stored as JSON.

To turn the feature off at runtime, set `disableComputedColumns`: the columns of the model are removed from the grid and the toolbar button, the column menu items, and the panel are hidden, while the model itself is kept.

## Programmatic API

The `apiRef` exposes the following methods:

- `addComputedColumn(definition, { columnIndex })` adds a column, appended by default or inserted at `columnIndex`.
- `updateComputedColumn(field, changes)` updates the given properties of an existing column. Pass `undefined` to remove an optional property, such as `numberFormat`.
- `removeComputedColumn(field)` removes a column.
- `setComputedColumns(model)` replaces the whole model; it also accepts an updater function.
- `showComputedColumnEditor(field, { sampleRowId, columnIndex })` opens the panel on the editor of the given column, or on a new column when `field` is omitted, using `sampleRowId` as the preview row. `hideComputedColumnEditor()` closes the panel.
- `validateComputedColumn(definition)` returns the validation result of a definition without applying it—see [Validation](#validation).

{{"demo": "ComputedColumnsApi.js", "bg": "inline", "defaultCodeOpen": false}}

The `computedColumnsChange` event is published on every model change, and the `gridComputedColumnsSelector` returns the current model—see [Selectors](#selectors).

## Referencing other computed columns

A computed column can reference other computed columns by field, as the **Total pay** column of the [controlled demo](#controlled-and-persisted-models) does.
Columns are evaluated in dependency order, whatever the order of the definitions, so a column can be defined before the columns it reads.

A column that references itself, directly or through other computed columns, is invalid: it shows a `#CYCLE!` error in every cell, and the editor reports the circular path.
Removing a column that others depend on makes those columns invalid too (`#REF!`) until their formula is updated or the column is added back.

## Validation

A definition is validated when it is applied from the editor, and again whenever the model or the columns of the grid change—a column that was valid becomes invalid when a column it reads is removed from the grid.
The editor lists the issues of the draft and keeps the **Apply** button disabled until they are resolved.

Definitions set from code, `initialState`, or a restored state are stored even when invalid.
The generated column then shows the same error code in every cell and a warning variant of the `ƒx` badge, whose tooltip explains the issue:

| Issue                                                                          | Code shown in the cells |
| :----------------------------------------------------------------------------- | :---------------------- |
| Empty formula or syntax error                                                  | `#ERROR!`               |
| Reference to a column that does not exist, a cell, a range, or `COLUMN_VALUES` | `#REF!`                 |
| Self-reference or circular reference                                           | `#CYCLE!`               |
| Unknown function                                                               | `#NAME?`                |
| Function called with a wrong number of arguments                               | `#VALUE!`               |

The field is validated too: it must be a valid identifier (letters, digits, and underscores, not starting with a digit), unique among the columns of the grid, and—when [`formulaA1Notation`](/x/react-data-grid/formula-syntax/#a1-notation) is enabled—must not read as a cell address such as `q1`.
A definition whose field collides with a data column is not added to the grid.

`apiRef.current.validateComputedColumn(definition)` runs the same checks against the current columns and returns `{ valid, issues }`, where each issue carries a `code`, a localized `message`, and—for a syntax error—the `span` of the problem in the formula.
When the definition's field is that of an existing computed column, the validation treats it as a replacement.

## Errors

A formula that is valid can still fail for some rows—dividing by an empty **Units sold** cell, for instance.
The cell then shows the [error code](/x/react-data-grid/formula-syntax/#error-values) and its tooltip explains the cause.

To provide a fallback, wrap the expression in `IFERROR`:

```text
=IFERROR(revenue / unitsSold, 0)
```

In the demo below, **Unit price** shows `#DIV/0!` for the regions without sales, **Unit price (safe)** falls back to zero, and **Revenue per store** references a column that does not exist, so it is invalid.

{{"demo": "ComputedColumnsErrors.js", "bg": "inline", "defaultCodeOpen": false}}

Errors are values of the column: sorting places them after every other value in both directions, the filter operators of a `number`, `boolean`, `date`, or `dateTime` column never match them, the quick filter matches their code as text, and export writes the code.

## Working with other features

Every feature reads the evaluated value of a computed cell through the column definition, so computed columns work with the rest of the grid like a column of their type:

- **Sorting and filtering** use the value and the operators of the result type. Errors sort last and never match a typed filter.
- **Export** to CSV and Excel, print, and clipboard copy write the evaluated value; Excel export writes the value even with `escapeFormulas: false`.
- **Aggregation** functions apply to the computed values, from the column menu or the `aggregationModel`, and a computed column can be **grouped** by, or used for **row spanning**, like any column.
- **Cell formulas** can reference a computed column by field (`=total * 1.2`), and a computed column can reference a column that contains cell formulas: the formula results are the values it reads.
- **Pivoting** does not include computed columns: while pivot mode is active they are not added to the grid, and the model is kept for when pivoting is turned off.
- **Editing**: a computed cell never enters edit mode. Double-clicking it or pressing <kbd class="key">Enter</kbd> opens the editor of the column instead.

Computed values are evaluated lazily and memoized per row: nothing is computed until a cell is read, and a row is re-evaluated only when it changes.

## Undo and redo

When computed columns are available, the [undo and redo](/x/react-data-grid/undo-redo/) feature tracks the `computedColumnsChange` event out of the box, even if the grid has no editable column.
Every change of the model—adding, editing, or removing a column, from the panel, the column menu, or the API—is one step.
Undoing a removal restores the column with its previous position, width, and visibility.

Model changes made from code, such as `apiRef.current.restoreState()` or a new value of the controlled `computedColumns` prop, are recorded as steps too.
To opt out, provide your own map through the `historyEventHandlers` prop and leave the `computedColumnsChange` handler out of it; the default handler is exported as `createComputedColumnsHistoryHandler()` so you can combine it with your own handlers.

The undo and redo shortcuts typed in the text fields of the panel keep their native meaning—they undo and redo your typing, not the grid.

## Current limitations

- Computed columns are not supported with the [server-side data source](/x/react-data-grid/server-side-data/) or while [pivoting](/x/react-data-grid/pivoting/) is active: the definitions are kept, but the columns are not added to the grid.
- A computed column formula can only reference the fields of the same row. Cell references, ranges, and `COLUMN_VALUES` make the column invalid (`#REF!`).
- Computed values are read-only: there are no per-cell overrides, and an existing column with data cannot be turned into a computed column—add a computed column next to it instead.
- Sorting and filtering by a computed column are not re-applied when its formula or the `formulaFunctions` prop changes; aggregation, row grouping, and row spanning are. This is the same rule as for cell formulas.
- A cell formula that reads a computed column which in turn reads a cell formula is refreshed on the next update of its row, not immediately.
- Excel export writes the evaluated values of computed columns, not live formulas.
- In a `string` column, a result equal to an error code, such as `"#REF!"`, is treated as an error by sorting.
- A change of the `computedColDef` prop applies the next time the columns are updated.
- Validation messages are localized when a definition is validated: after a change of `localeText` at runtime, the issues listed in the panel and in the badge tooltip keep the previous language until the columns are next updated.
- The display format is limited to number formats; date and time results use the default formatting of their column type, and `Intl.NumberFormat` uses the locale of the browser.

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Computed columns"}}

## API

{{"demo": "ComputedColumnsApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [ComputedColumnsPanelTrigger](/x/api/data-grid/computed-columns-panel-trigger/)
