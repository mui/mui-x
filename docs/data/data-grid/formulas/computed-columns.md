---
title: Data Grid - Computed columns
---

# Data Grid - Computed columns [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Add read-only columns whose values are computed from the other fields of each row with a single formula.</p>

A computed column is defined once, by a formula, and evaluated for every row of the grid.
Users create and edit computed columns from the toolbar, the column menu, or a side panel; you can also define them in code.
The definitions are a serializable list, so they persist, restore, and travel with the rest of the grid state, and every change made from the grid UI is one undo step.

The demo below has two computed columns—**Total** and **Margin**—defined from the **Price**, **Cost**, **Qty**, and **Discount** columns.
Edit any of those values and watch the computed cells update, or open the **Computed columns** panel from the toolbar to add a column of your own.

{{"demo": "ComputedColumnsBasic.js", "bg": "inline", "defaultCodeOpen": false}}

Computed columns are part of the formulas feature, which is not bundled with the grid.
Inject it through the `featureDependencies` prop, as described in [Enabling formulas](/x/react-data-grid/formulas/#enabling-formulas).
The setup below injects the feature, shows the toolbar, and defines a **Total** column from your `price` and `quantity` columns:

```tsx
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

<DataGridPremium
  rows={rows}
  columns={columns}
  showToolbar
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
/>;
```

Without the formula feature, the computed columns props and API have no effect, and the toolbar button and column menu items are hidden—a console warning points at the missing dependency in development builds.

:::info
Computed columns and [cell formulas](/x/react-data-grid/formulas/) share the same formula language and engine, but solve different problems: a cell formula is a value stored in the row data of one cell, whereas a computed column applies one formula to every row and stores nothing in the row data.
:::

## Quick start

With the feature injected, computed columns are available out of the box:

- The **Computed columns** button of the default toolbar—shown with `showToolbar`—opens the side panel, which lists the computed columns of the grid. From there, add a column, or open one to edit or remove it.
- The column menu of any column offers **Add computed column**, which inserts the new column right after it. The column menu of a computed column also offers **Edit computed column** and **Remove computed column**, or only **View computed column** when the column is [locked](#prevent-changes).
- Double-clicking a computed cell, or pressing <kbd class="key">Enter</kbd> on it, opens the editor with that row as the preview row. Set `event.defaultMuiPrevented` in the `onCellDoubleClick` or `onCellKeyDown` prop to keep a gesture from opening it.

To restrict what users can change, or to remove the toolbar button, see [Prevent changes](#prevent-changes).

The editor asks for a name, a field, a formula, a result type, and—for numbers—a display format.
The field is derived from the name until you edit it and cannot be changed once the column exists.
While you type the formula, the referenced cells of the preview row are outlined in the grid and the result is previewed below the formula, formatted like the cells, including errors.
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
  // `false` prevents users from editing or removing the column; see "Prevent changes".
  editable?: boolean;
}

type GridComputedColumnsModel = GridComputedColumnDefinition[];
```

The **formula** uses the [formula syntax](/x/react-data-grid/formula-syntax/), with bare field names to reference the other columns of the same row (`=price * quantity`), `FIELD("unit price")` for fields that are not valid identifiers, and any built-in or [custom function](/x/react-data-grid/formula-engine/#custom-functions).
Store it with its leading `=`, as it appears in the editor—the editor adds a missing `=` when the column is applied.
A computed column only reads the fields of its own row: cell references, ranges, and `COLUMN_VALUES` make it invalid (`#REF!`).

The **result type** becomes the [column type](/x/react-data-grid/column-definition/#column-types) of the generated column, so sorting, filtering, and rendering behave as they do for that type.
The formula result is checked against it: a `number`, `boolean`, `date`, or `dateTime` column whose formula returns a value of another type shows `#VALUE!`, while a `string` column converts any result to text.
In the editor, the result type of a new column follows the preview until you pick one yourself.

The optional **number format** is an [`Intl.NumberFormatOptions`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options) object applied by the column's `valueFormatter`.
The editor manages the `style`, `currency`, `minimumFractionDigits`, `maximumFractionDigits`, and `useGrouping` options; any other option you set in code is kept.

To initialize the model without controlling it, use `initialState`, as in the setup at the top of the page.

### Customizing the generated columns

The generated columns are regular [column definitions](/x/react-data-grid/column-definition/): they take part in the column order, can be resized, hidden, pinned, and reordered, and appear in the columns panel.
To customize them, pass a partial column definition—or a function returning one for each computed column—through the `computedColDef` prop:

```tsx
const computedColDef = (
  definition: GridComputedColumnDefinition,
): GridComputedColDefOverrides => ({
  width: definition.type === 'number' ? 120 : 180,
  headerAlign: 'center',
});

<DataGridPremium computedColDef={computedColDef} />;
```

A change of `computedColDef` applies right away; widths set by the user are kept.

:::warning
Keep `computedColDef` stable between renders when it holds functions, arrays, or objects created in the component: define it outside the component, or memoize it with `React.useMemo()` (`React.useCallback()` for a function).
Otherwise, the computed columns are re-created on every render, which loops when the parent re-renders on grid state—for example with an `onStateChange` that stores the state.
:::

The `field`, `type`, `computed`, `editable`, `allowFormulas`, `valueGetter`, `valueSetter`, `groupingValueGetter`, and `rowSpanValueGetter` properties are owned by the feature and cannot be overridden, and the cell editing ones—`renderEditCell`, `preProcessEditCellProps`, and `pastedValueParser`—are never called, since the cells are never edited.
The `GridComputedColDefOverrides` type of the prop leaves them all out; `cellClassName` and `headerClassName` are merged with the classes of the feature.
The `valueFormatter`, `renderCell`, `sortComparator`, `getSortComparator`, `filterOperators`, and `getApplyQuickFilterFn` functions you pass only receive values of the column type; errors are handled by the grid—see [Errors](#errors).
A `valueFormatter` replaces the `numberFormat` formatting.

The generated column definitions carry a `computed: true` flag, which lets you tell them apart from the other columns—in a custom column menu, for instance.

## Prevent changes

To keep users from changing a computed column, set `editable: false` on its definition:

```ts
const computedColumns: GridComputedColumnsModel = [
  {
    field: 'total',
    headerName: 'Total',
    formula: '=price * quantity',
    type: 'number',
    editable: false,
  },
];
```

A locked column opens in a read-only editor: its column menu offers **View computed column**, and the panel shows a lock instead of its actions menu.
The flag only restricts the grid UI: the `apiRef` methods and the controlled `computedColumns` prop still change a locked definition, the same way `editable: false` on a column does not prevent `updateRows()`.

The demo below locks the **Total** column and leaves **Tax** editable: open their column menus, or the **Computed columns** panel, to compare them.

{{"demo": "ComputedColumnsReadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
The `editable` flag of a definition is not the `editable` property of the generated column.
The cells of a computed column are never editable, so `computedColDef` cannot change that property—passing `editable` there logs a warning in development builds.
:::

A lock covers its own definition, not the columns its formula reads.
If a locked **Margin** column reads an editable computed column **Cost**, editing **Cost** changes the values of **Margin**, and removing it makes **Margin** invalid (`#REF!`).
Lock the computed columns a locked column depends on as well.

Locking or unlocking from code is a model change—see [Undo and redo](#undo-and-redo).

### Hide the toolbar button

To remove the toolbar button while keeping the default toolbar, set `showComputedColumnsButton` to `false` in the toolbar's slot props.
The column menu and the cells still open the panel.

```tsx
<DataGridPremium
  showToolbar
  featureDependencies={{ formula: formulaFeature }}
  slotProps={{ toolbar: { showComputedColumnsButton: false } }}
/>
```

### Read-only computed columns

`editable: false` only covers the columns of the model: users can still add computed columns from the column menu, and from the panel list that the **Back** button of a read-only editor leads to—even when a cell opened the editor.
To prevent any change, lock every definition, hide the toolbar button, remove the computed columns item from the column menu, and keep the cells from opening the editor by setting `event.defaultMuiPrevented` in the `onCellDoubleClick` and `onCellKeyDown` props:

```tsx
const lockAll = (model: GridComputedColumnsModel) =>
  model.map((definition) => ({ ...definition, editable: false }));

<DataGridPremium
  showToolbar
  featureDependencies={{ formula: formulaFeature }}
  initialState={{ computedColumns: { model: lockAll(computedColumns) } }}
  slotProps={{
    toolbar: { showComputedColumnsButton: false },
    columnMenu: { slots: { columnMenuComputedColumnItem: null } },
  }}
  onCellDoubleClick={(params, event) => {
    if (params.colDef.computed) {
      event.defaultMuiPrevented = true;
    }
  }}
  onCellKeyDown={(params, event) => {
    if (params.colDef.computed && event.key === 'Enter') {
      event.defaultMuiPrevented = true;
    }
  }}
/>;
```

### Restoring a saved model

The flag is part of the definition, so it is saved and restored with the model.
A model saved before you locked a column brings it back unlocked: re-apply the locks from code when you restore it.

```ts
const LOCKED_FIELDS = new Set(['total']);

const lockFields = (model: GridComputedColumnsModel) =>
  model.map((definition) =>
    LOCKED_FIELDS.has(definition.field)
      ? { ...definition, editable: false }
      : definition,
  );

const savedState: GridInitialState = JSON.parse(localStorage.getItem('gridState')!);
apiRef.current.restoreState(
  savedState.computedColumns?.model
    ? {
        ...savedState,
        computedColumns: { model: lockFields(savedState.computedColumns.model) },
      }
    : savedState,
);
```

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

[Undo and redo](/x/react-data-grid/undo-redo/) of a controlled model rely on the parent applying the model passed to `onComputedColumnsChange`: a step is considered done once the model has been requested, so a parent that drops it leaves the history out of sync with the grid until the next change of the model.

In the demo below, the model is shown under the grid.
Open the panel to add, edit, or remove a column and watch it change; the **Total pay** column references the two other computed columns.

{{"demo": "ComputedColumnsControlled.js", "bg": "inline", "defaultCodeOpen": false}}

The model is part of the [grid state](/x/react-data-grid/state/): `apiRef.current.exportState()` includes it as `computedColumns.model`, and `initialState` or `apiRef.current.restoreState()` bring it back—together with the position, width, and visibility of the generated columns, which live in the `columns` slice like those of any other column.
Definitions are plain objects, so the model can be stored as JSON.

To turn the feature off at runtime, set `disableComputedColumns`: the columns of the model are removed from the grid and the toolbar button, the column menu items, and the panel are hidden, while the model itself is kept.

## Referencing other computed columns

A computed column can reference other computed columns by field, as the **Total pay** column of the [controlled demo](#controlled-and-persisted-models) does.
Columns are evaluated in dependency order, whatever the order of the definitions, so a column can be defined before the columns it reads.

A column that references itself, directly or through other computed columns, is invalid: it shows a `#CYCLE!` error in every cell, and the editor reports the circular path.
A cycle that goes through a cell formula shows `#CYCLE!` in the cells on it and in the cells that read them, with no error badge in the header, since the cycle depends on the data of the row.
Every reference counts, even in a branch of `IF` that is not taken.
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

Errors are values of the column: sorting places them after every other value in both directions, the quick filter matches their code as text, and export writes the code.
The filter operators of a `number`, `boolean`, `date`, or `dateTime` column never receive them: only _is not empty_ matches an error, which counts as a value.
In a `string` column, the filters receive the code like any other text.

## Working with other features

Every feature reads the evaluated value of a computed cell through the column definition, so computed columns work with the rest of the grid like a column of their type:

- **Sorting and filtering** use the value and the operators of the result type; errors are handled as described in [Errors](#errors).
- **Export** to CSV and Excel, print, and clipboard copy write the evaluated value; Excel export writes the value even with `escapeFormulas: false`.
- **Aggregation** functions apply to the computed values, from the column menu or the `aggregationModel`, and a computed column can be **grouped** by, or used for **row spanning**, like any column.
- **Cell formulas** can reference a computed column by field (`=total * 1.2`), and a computed column can reference a column that contains cell formulas: the formula results are the values it reads. Chains through both kinds of formulas are evaluated in dependency order; for cycles, see [Referencing other computed columns](#referencing-other-computed-columns).
- **Pivoting** does not include computed columns: while pivot mode is active, they are not added to the grid and their UI is hidden; the model is kept for when pivoting is turned off.
- **Editing**: a computed cell never enters edit mode. Double-clicking it or pressing <kbd class="key">Enter</kbd> opens the editor of the column instead, read-only for a [locked column](#prevent-changes).

## Undo and redo

When computed columns are available, the [undo and redo](/x/react-data-grid/undo-redo/) feature tracks the `computedColumnsChange` event out of the box, even if the grid has no editable column.
Every change made from the panel, the column menu, or the cells—adding, editing, or removing a column—is one step.
Undoing a removal restores the column with its previous position, width, and visibility.

Changes made from code—the `apiRef` methods, `apiRef.current.restoreState()`, or a new value of the controlled `computedColumns` prop—are not steps, the same way `updateRows()` is not a step for cell edits.
They drop the undo and redo steps that no longer match the model.
For example, after a user edits the `total` column in the panel, a call to `apiRef.current.updateComputedColumn('total', { formula: '=price * quantity * 1.2' })` disables Undo, so the user cannot revert your change by undoing their own edit.

To make a change from your own UI an undo step, as the built-in UI does, pass `undoable: true` to the `apiRef` method—`setComputedColumns()`, `addComputedColumn()`, `updateComputedColumn()`, and `removeComputedColumn()` all accept it:

```tsx
// A custom "Remove Total" button
apiRef.current.removeComputedColumn('total', { undoable: true });
```

To leave computed columns out of the history, provide your own map through the `historyEventHandlers` prop without the `computedColumnsChange` handler; the default handler is exported as `createComputedColumnsHistoryHandler()` so you can combine it with your own handlers.

The undo and redo shortcuts typed in the text fields of the panel keep their native meaning—they undo and redo your typing, not the grid.

## Current limitations

- Computed columns are not supported with the [server-side data source](/x/react-data-grid/server-side-data/) or while [pivoting](/x/react-data-grid/pivoting/) is active: the definitions are kept, but the columns are not added to the grid.
- A computed column formula can only reference the fields of the same row—see [Definitions](#definitions).
- Computed values are read-only: there are no per-cell overrides, and an existing column with data cannot be turned into a computed column—add a computed column next to it instead.
- Excel export writes the evaluated values of computed columns, not live formulas.
- In a `string` column, a result equal to an error code, such as `"#REF!"`, is treated as an error by sorting and by the quick filter; the cell itself renders it as text.
- Validation messages are localized when a definition is validated: after a change of `localeText` at runtime, the issues listed in the panel and in the badge tooltip keep the previous language until the columns are next updated.
- The editor only offers number formats: to format date, time, or other results, pass a `valueFormatter` through `computedColDef`. `Intl.NumberFormat` uses the locale of the browser.

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Computed columns"}}

## API

{{"demo": "ComputedColumnsApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [ComputedColumnsPanelTrigger](/x/api/data-grid/computed-columns-panel-trigger/)
