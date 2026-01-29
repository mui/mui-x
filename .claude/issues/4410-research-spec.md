# Research Spec: `multiSelect` Column Type

**Issue**: #4410
**Status**: ✅ Implementation Complete
**Last Updated**: 2026-01-28
**Tier**: Community

> 🆕 = New API/component that doesn't exist in the codebase yet

---

## Implementation Summary

All 10 phases completed. The `multiSelect` column type is fully implemented.

### Phase 1: Core Type Infrastructure ✅

Added TypeScript types and column definition defaults.

| File                                                                                                                                                              | Description                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`packages/x-data-grid/src/models/colDef/gridColDef.ts`](../../../packages/x-data-grid/src/models/colDef/gridColDef.ts)                                           | Added `GridMultiSelectColDef` interface with `separator` prop |
| [`packages/x-data-grid/src/models/colDef/gridColType.ts`](../../../packages/x-data-grid/src/models/colDef/gridColType.ts)                                         | Added `'multiSelect'` to `GridColType` union                  |
| [`packages/x-data-grid/src/colDef/gridMultiSelectColDef.ts`](../../../packages/x-data-grid/src/colDef/gridMultiSelectColDef.ts)                                   | Created `GRID_MULTI_SELECT_COL_DEF` with defaults             |
| [`packages/x-data-grid/src/colDef/gridDefaultColumnTypes.ts`](../../../packages/x-data-grid/src/colDef/gridDefaultColumnTypes.ts)                                 | Registered `multiSelect` in column types map                  |
| [`packages/x-data-grid/src/components/panel/filterPanel/filterPanelUtils.ts`](../../../packages/x-data-grid/src/components/panel/filterPanel/filterPanelUtils.ts) | Added `isMultiSelectColDef` type guard                        |

### Phase 2: Cell Display (Chips + Overflow) ✅

Implemented chip rendering with auto-overflow and expand popup.

| File                                                                                                                                            | Description                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`packages/x-data-grid/src/components/cell/GridMultiSelectCell.tsx`](../../../packages/x-data-grid/src/components/cell/GridMultiSelectCell.tsx) | Display cell with chips, measure-once overflow calculation, expand popup         |
| [`packages/x-data-grid/src/constants/gridClasses.ts`](../../../packages/x-data-grid/src/constants/gridClasses.ts)                               | Added `multiSelectCell*` CSS classes                                             |

**Performance optimization:** Replaced per-cell ResizeObserver with measure-once approach:
- Measure chips and container width once on mount via `useLayoutEffect`
- React to `colDef.computedWidth` changes via delta calculation
- Use `useMemo` for visible count calculation from cached measurements
- Result: 0 ResizeObservers vs N observers per column, no DOM reads on resize

### Phase 3: Cell Editing (Autocomplete) ✅

Implemented edit cell using MUI Autocomplete with `multiple`.

| File                                                                                                                                                    | Description                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`packages/x-data-grid/src/components/cell/GridEditMultiSelectCell.tsx`](../../../packages/x-data-grid/src/components/cell/GridEditMultiSelectCell.tsx) | Edit cell with Autocomplete, keyboard nav, `disableCloseOnSelect`                                                |
| [`packages/x-data-grid/src/models/gridBaseSlots.ts`](../../../packages/x-data-grid/src/models/gridBaseSlots.ts)                                         | Added `open`, `onOpen`, `onClose`, `disableCloseOnSelect`, `openOnFocus`, `autoHighlight` to `AutocompleteProps` |

### Phase 4: Filter Operators + Quick Filter ✅

Implemented 4 filter operators and quick filter support.

| File                                                                                                                                  | Description                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`packages/x-data-grid/src/colDef/gridMultiSelectOperators.ts`](../../../packages/x-data-grid/src/colDef/gridMultiSelectOperators.ts) | `contains`, `doesNotContain`, `isEmpty`, `isNotEmpty` operators |
| [`packages/x-data-grid/src/colDef/gridMultiSelectColDef.ts`](../../../packages/x-data-grid/src/colDef/gridMultiSelectColDef.ts)       | Added `getGridMultiSelectQuickFilterFn` for array search        |

### Phase 5: Filter Panel Input ✅

Created filter input component for multiSelect columns.

| File                                                                                                                                                                                    | Description                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`packages/x-data-grid/src/components/panel/filterPanel/GridFilterInputMultiSelect.tsx`](../../../packages/x-data-grid/src/components/panel/filterPanel/GridFilterInputMultiSelect.tsx) | Single-select dropdown for filter panel |

### Phase 6: Header Filters (Pro) ✅

Added multiSelect support to header filters.

| File                                                                                                                                                                            | Description                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`packages/x-data-grid-pro/src/components/headerFiltering/GridHeaderFilterCell.tsx`](../../../packages/x-data-grid-pro/src/components/headerFiltering/GridHeaderFilterCell.tsx) | Added `GridFilterInputMultiSelect` to `DEFAULT_INPUT_COMPONENTS` |

### Phase 7: Copy/Paste Support (Premium) ✅

Fixed `pastedValueParser` to return option values.

| File                                                                                                                            | Description                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`packages/x-data-grid/src/colDef/gridMultiSelectColDef.ts`](../../../packages/x-data-grid/src/colDef/gridMultiSelectColDef.ts) | `pastedValueParser` splits by separator, validates against valueOptions, returns option values |

### Phase 8: Excel Export (Premium) ✅

Works out of the box via `valueFormatter` (no changes needed).

### Phase 9: Documentation ✅

Added documentation and demo.

| File                                                                                                                                  | Description                                               |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [`docs/data/data-grid/column-definition/column-definition.md`](../../../docs/data/data-grid/column-definition/column-definition.md)   | Added `multiSelect` to column types table and new section |
| [`docs/data/data-grid/column-definition/MultiSelectColumn.tsx`](../../../docs/data/data-grid/column-definition/MultiSelectColumn.tsx) | Basic usage demo                                          |

### Phase 10: Manual Testing Playground ✅

Created playground for manual testing.

| File                                                                                                                    | Description                                |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [`docs/pages/playground/multiselect-column-builtin.tsx`](../../../docs/pages/playground/multiselect-column-builtin.tsx) | Interactive playground with test checklist |

### Tests Added

| File                                                                                                                                          | Tests                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`packages/x-data-grid/src/tests/filtering.DataGrid.test.tsx`](../../../packages/x-data-grid/src/tests/filtering.DataGrid.test.tsx)           | Filter operators: `contains`, `doesNotContain`, `isEmpty`, `isNotEmpty` |
| [`packages/x-data-grid/src/tests/filterPanel.DataGrid.test.tsx`](../../../packages/x-data-grid/src/tests/filterPanel.DataGrid.test.tsx)       | Filter panel behavior for multiSelect                                   |
| [`packages/x-data-grid/src/tests/quickFiltering.DataGrid.test.tsx`](../../../packages/x-data-grid/src/tests/quickFiltering.DataGrid.test.tsx) | Quick filter array search                                               |
| [`packages/x-data-grid/src/tests/editComponents.DataGrid.test.tsx`](../../../packages/x-data-grid/src/tests/editComponents.DataGrid.test.tsx) | Edit cell with Autocomplete                                             |
| [`packages/x-data-grid/src/tests/cells.DataGrid.test.tsx`](../../../packages/x-data-grid/src/tests/cells.DataGrid.test.tsx)                   | Cell display, chip rendering, overflow chip focus/popup                 |
| [`packages/x-data-grid/src/tests/sorting.DataGrid.test.tsx`](../../../packages/x-data-grid/src/tests/sorting.DataGrid.test.tsx)               | Sort by array length                                                    |
| [`test/utils/helperFn.ts`](../../../test/utils/helperFn.ts)                                                                                   | Added `openMultiSelectPopup` helper                                     |

---

## Next Steps

1. ~~**Design review** - Get sign-off on chip styling, edit cell, filter panel UX~~ ✅ Done
2. ~~**Implementation plan** - Break down into PRs after design approval~~ ✅ Done
3. **PR Review** - Submit for code review
4. **RFC/Discussion** - Consider opening GitHub discussion for community feedback on API

## TODO

- [ ] Support column auto-resize (double-click separator) to display all chips - requires calculating total width from cached chip measurements

---

## Executive Summary

This document analyzes the full scope of implementing a `multiSelect` column type for MUI X Data Grid. The feature enables cells to store arrays of values (e.g., tags, categories) with first-class support for rendering, editing, filtering, sorting, and export.

---

## Feature Impact Matrix

| Area               | Impact Level | Category     | Notes                              |
| ------------------ | ------------ | ------------ | ---------------------------------- |
| Column Definition  | High         | Must-have    | Core type, valueOptions, accessors |
| Cell Display       | High         | Must-have    | Render array as chips/text         |
| Cell Editing       | High         | Must-have    | Autocomplete multi-select          |
| Filter Operators   | High         | Must-have    | Array-aware operators              |
| Filter Panel Input | High         | Must-have    | Select from valueOptions           |
| Sorting            | Medium       | Must-have    | Define default comparator          |
| Value Formatter    | Medium       | Must-have    | Array → string for display         |
| Copy/Paste         | Medium       | Must-have    | Clipboard interop                  |
| CSV Export         | Medium       | Must-have    | Array → delimited string           |
| TypeScript Types   | Medium       | Must-have    | GridMultiSelectColDef              |
| CSS Classes        | Medium       | Must-have    | `multiSelectCell*` for styling     |
| Header Filters     | Medium       | Must-have    | Pro/Premium feature                |
| Quick Filter       | Medium       | Must-have    | Search within arrays               |
| Excel Export       | Medium       | Must-have    | Premium feature                    |
| Row Grouping       | Low          | Nice-to-have | Group by array values              |
| Aggregation        | Low          | Noise        | Sum/count arrays? Unclear use case |
| Pivoting           | Low          | Noise        | Pivot on array values? Edge case   |
| Server-side Data   | Low          | Deferred     | User implements; we document       |

---

## Detailed Feature Analysis

### 1. Column Definition (Must-have)

**What's needed:**

```ts
interface GridMultiSelectColDef extends GridBaseColDef {
  // 🆕 GridMultiSelectColDef
  type: 'multiSelect'; // 🆕 new column type
  valueOptions: ValueOptions[] | ((params: GridValueOptionsParams) => ValueOptions[]); // existing (from singleSelect)
  getOptionValue?: (option: ValueOptions) => any; // existing (from singleSelect)
  getOptionLabel?: (option: ValueOptions) => string; // existing (from singleSelect)
  separator?: string; // 🆕 new prop
}
```

**Column definition defaults:**

```ts
export const GRID_MULTI_SELECT_COL_DEF: Omit<GridMultiSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'multiSelect',
  display: 'flex', // required for chip layout
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  valueFormatter: /* array → string */,
  renderCell: renderMultiSelectCell,
  renderEditCell: renderEditMultiSelectCell,
  filterOperators: getGridMultiSelectOperators(),
  sortComparator: (v1, v2) => (v1?.length ?? 0) - (v2?.length ?? 0),
  getApplyQuickFilterFn: /* search within array elements */,
};
```

**Decisions:**

- `valueOptions` is **required** (mirror singleSelect)
- Async/dynamic `valueOptions` via function is **supported** (mirror singleSelect)
- `display: 'flex'` is set by default (required for chip layout, same as `longText`)

---

### 2. Cell Display (Must-have)

**Decisions:**

| Item            | Decision                                                              |
| --------------- | --------------------------------------------------------------------- |
| Chip size       | `small`                                                               |
| Chip variant    | `filled`                                                              |
| Chip color      | `default` (gray/neutral, theme-aware)                                 |
| Overflow        | Show `+N` chip (outlined variant)                                     |
| Visible count   | **Auto-calculated** based on cell width (no user config needed)       |
| Resize behavior | Recalculate visible chips on column resize (cached widths for expand) |
| Expand trigger  | Spacebar key or click on "+N more" chip (same behavior as `longText`) |
| Empty state     | Empty cell (show nothing)                                             |
| Filter priority | When `contains` filter active, filtered value shown as first chip     |

**Auto-overflow implementation:**

```tsx
function MultiSelectCell({ value, colDef }) {
  const containerRef = useRef();
  const [visibleCount, setVisibleCount] = useState(value.length);

  useEffect(() => {
    const container = containerRef.current;
    const observer = new ResizeObserver(() => {
      // 1. Measure container width
      // 2. Measure each chip width (can cache by label)
      // 3. Reserve space for "+N" chip (~50-60px)
      // 4. Calculate how many chips fit
      // 5. setVisibleCount(calculated)
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [value]);

  return (
    <Stack ref={containerRef} direction="row" gap={0.5} overflow="hidden">
      {value.slice(0, visibleCount).map((v) => (
        <Chip key={v} label={getOptionLabel(v)} size="small" />
      ))}
      {value.length > visibleCount && (
        <Chip
          label={`+${value.length - visibleCount}`}
          size="small"
          variant="outlined"
          onClick={handleExpand}
        />
      )}
    </Stack>
  );
}
```

**Edge cases:**

- Very narrow column → show only "+N" (all chips hidden)
- Single long label → truncate chip text with ellipsis or show "+1"

> Note: The expand popup reuses the same pattern as `longText` column type.

---

### 3. Cell Editing (Must-have)

**Component:** `GridEditMultiSelectCell` 🆕

**Decisions:**

| Item              | Decision                                      |
| ----------------- | --------------------------------------------- |
| Component         | MUI Autocomplete with `multiple`              |
| Dropdown position | Below cell (standard Autocomplete behavior)   |
| Close on select   | No (`disableCloseOnSelect`)                   |
| Keyboard nav      | Arrow keys, Enter to select, Escape to cancel |
| freeSolo          | No (out of scope)                             |

**Requirements:**

- Use `rootProps.slots.baseAutocomplete` with `multiple` prop
  - Slot already exists (used by `GridFilterInputMultipleSingleSelect`, `GridFilterInputMultipleValue`)
  - No new slot needed
  - Allows user customization
- `disableCloseOnSelect` for UX
- Support keyboard navigation (arrow keys, Enter, Escape)
- Prevent Enter from closing edit mode prematurely
- Match singleSelect patterns (initialOpen, onValueChange)

---

### 4. Filter Operators (Must-have)

**Proposed operators:** via `getGridMultiSelectOperators()` 🆕

| Operator            | Description                      | Input         | Priority  |
| ------------------- | -------------------------------- | ------------- | --------- |
| `contains` 🆕       | Cell array includes filter value | Single select | Must-have |
| `doesNotContain` 🆕 | Cell array excludes filter value | Single select | Must-have |
| `isEmpty`           | Cell array is empty/null         | None          | Must-have |
| `isNotEmpty`        | Cell array has items             | None          | Must-have |
| `containsAnyOf` 🆕  | Cell has any of filter values    | Multi select  | Noise     |
| `containsAll` 🆕    | Cell has all filter values       | Multi select  | Noise     |
| `equals` 🆕         | Exact array match                | Multi select  | Noise     |
| `startsWith` 🆕     | First element matches            | Single select | Noise     |

> Note: `isEmpty`/`isNotEmpty` exist for other column types; the implementation is new for arrays.

**V1 scope:** `contains`, `doesNotContain`, `isEmpty`, `isNotEmpty` (4 operators).

> `containsAnyOf`/`containsAll` are **not needed** - users can achieve the same with multiple `contains` filters combined with OR/AND logic in the filter panel.

---

### 5. Filter Panel Input (Must-have)

**Decisions:**

| Item            | Decision                                                              |
| --------------- | --------------------------------------------------------------------- |
| Input component | Reuse `GridFilterInputSingleSelect` (dropdown)                        |
| Operator labels | Lowercase: "contains", "does not contain", "is empty", "is not empty" |

**No new components needed** - existing infrastructure works.

---

### 6. Sorting (Must-have)

**Options:**

| Strategy                | Description                                | Use Case                    |
| ----------------------- | ------------------------------------------ | --------------------------- |
| **A. By length**        | `v1.length - v2.length`                    | "Most tags first"           |
| **B. By first value**   | Compare first elements                     | Alphabetical by primary tag |
| **C. By joined string** | `v1.join(',').localeCompare(v2.join(','))` | Deterministic ordering      |
| **D. Custom only**      | No default, require user to specify        | Maximum flexibility         |

**Recommendation:** Default to **length-based** sorting (most intuitive for tags/categories). Document how to customize.

```ts
// Default
sortComparator: (v1, v2) => (v1?.length ?? 0) - (v2?.length ?? 0);
```

---

### 7. Value Formatter (Must-have)

**Purpose:** Convert array to string for:

- Default cell display (if not using chips)
- CSV export
- Clipboard copy
- Accessibility (screen readers)

**Implementation:**

```ts
valueFormatter: (value, row, colDef) => {
  if (!Array.isArray(value) || value.length === 0) return '';
  const separator = colDef.separator ?? ', ';
  return value.map((v) => colDef.getOptionLabel!(v)).join(separator);
};
```

---

### 8. Copy/Paste (Must-have)

**Copy behavior:**

- Use `valueFormatter` output
- Tab-separated for multi-cell copy

**Paste behavior:**

- `pastedValueParser` splits by separator
- Validates each value against `valueOptions`
- Ignores invalid values (or shows warning?)

```ts
pastedValueParser: (value, row, column) => {
  const separator = column.separator ?? ', ';
  const values = value.split(separator).map((v) => v.trim());
  const validValues = values.filter((v) =>
    valueOptions.some((opt) => getOptionValue(opt) === v || getOptionLabel(opt) === v),
  );
  return validValues;
};
```

**Decision:** Silently ignore invalid values (match singleSelect behavior).

---

### 9. CSV Export (Must-have)

**Behavior:** Use `valueFormatter` output.

**Edge cases:**

- Values containing separator → wrap in quotes or use different separator
- Values containing quotes → escape quotes

**Recommendation:** Leverage existing export infrastructure; `valueFormatter` handles conversion.

---

### 10. Header Filters (Must-have for Pro/Premium)

**Pro/Premium feature**

**Decisions:**

| Item       | Decision                                   |
| ---------- | ------------------------------------------ |
| Input type | Single-select dropdown                     |
| Operator   | `contains` (filter rows containing option) |

**Implementation:** Should work with existing header filter infrastructure if filter operators are defined correctly.

---

### 11. Quick Filter (Nice-to-have)

**Behavior:** Search text matches if ANY array element contains the search term.

**Implementation:**

```ts
getApplyQuickFilterFn: (value) => {
  if (!value) return null;
  const search = value.toLowerCase();
  return (cellValue) => {
    if (!Array.isArray(cellValue)) return false;
    return cellValue.some((v) => String(getOptionLabel(v)).toLowerCase().includes(search));
  };
};
```

---

### 12. Excel Export (Nice-to-have)

**Premium feature**

**Options:**

- Single cell with joined values (simple)
- Data validation dropdown (complex, matches Excel behavior)

**Recommendation:** V1 uses joined values. Future: investigate Excel data validation lists.

---

### 13. Row Grouping (Nice-to-have)

**Premium feature**

**Challenge:** A row with `['A', 'B']` - does it appear in group A, group B, or both?

**Options:**
| Approach | Behavior |
|----------|----------|
| **A. First value only** | Groups by first array element |
| **B. Combined key** | `['A', 'B']` is its own group (Airtable behavior) |
| **C. Explode rows** | Row appears in multiple groups |

**Recommendation:** Defer to V2. If implemented, use **Combined key** (Airtable model) - simplest and no row duplication.

---

### 14. Aggregation (Noise)

**Unclear value proposition.** What does "sum" or "average" mean for arrays of tags?

Possible aggregations:

- Count: Total number of values across rows
- Unique: Distinct values across rows
- Most common: Mode of all values

**Recommendation:** Out of scope for V1. Users can implement custom `aggregationFunction` if needed.

---

### 15. Pivoting (Noise)

**Premium feature**

Pivoting on array values is complex and edge-case. Each array element would need to become a column.

**Recommendation:** Out of scope. Not supported by competitors either.

---

### 16. Server-side Data (Deferred)

**User responsibility.** We provide:

- Filter model structure (operator + value)
- Documentation on how to translate to SQL/API queries

**Example filter model:**

```ts
{
  field: 'tags',
  operator: 'contains',
  value: 'React'
}
// SQL: WHERE 'React' = ANY(tags)
// PostgreSQL: WHERE tags @> ARRAY['React']
```

---

## Scope Recommendations

### V1 (MVP) - Must-have

| Feature                   | Effort | Tier      | Notes                                                    |
| ------------------------- | ------ | --------- | -------------------------------------------------------- |
| 🆕 Column type definition | S      | Community | `type: 'multiSelect'`, mirror singleSelect API           |
| 🆕 Cell display (chips)   | M      | Community | Default `renderCell` with overflow handling              |
| 🆕 Edit cell              | M      | Community | `GridEditMultiSelectCell` using Autocomplete             |
| 🆕 Filter operators (4)   | S      | Community | `getGridMultiSelectOperators()`                          |
| Default sort comparator   | S      | Community | By array length (use existing `sortComparator` prop)     |
| Default value formatter   | S      | Community | Join with separator (use existing `valueFormatter` prop) |
| Copy/paste support        | S      | Community | Use existing `pastedValueParser` prop                    |
| CSV export                | S      | Community | Via valueFormatter (existing infra)                      |
| Quick filter support      | S      | Community | Implement `getApplyQuickFilterFn` for array search       |
| Header Filters            | S      | Pro       | Existing infra, just needs to work with new type         |
| Excel export              | S      | Premium   | Via valueFormatter (existing infra)                      |
| 🆕 TypeScript types       | S      | Community | `GridMultiSelectColDef`                                  |
| 🆕 CSS classes            | S      | Community | `multiSelectCell*` classes in `gridClasses.ts`           |
| Documentation             | M      | -         | Usage, examples, migration                               |

**Estimated total:** Medium-Large

---

## Tests

Test files follow the pattern `{feature}.DataGrid.test.tsx` in `packages/x-data-grid*/src/tests/`.

### Test File Locations

| Test Area       | File                                   | Package             |
| --------------- | -------------------------------------- | ------------------- |
| Filtering       | `filtering.DataGrid.test.tsx`          | x-data-grid         |
| Filter panel    | `filterPanel.DataGrid.test.tsx`        | x-data-grid         |
| Quick filter    | `quickFiltering.DataGrid.test.tsx`     | x-data-grid         |
| Keyboard        | `keyboard.DataGrid.test.tsx`           | x-data-grid         |
| Edit components | `editComponents.DataGridPro.test.tsx`  | x-data-grid-pro     |
| Header filters  | `filtering.DataGridPro.test.tsx`       | x-data-grid-pro     |
| Clipboard       | `clipboard.DataGridPremium.test.tsx`   | x-data-grid-premium |
| Excel export    | `exportExcel.DataGridPremium.test.tsx` | x-data-grid-premium |

### Test Cases

#### Column Type: multiSelect (filtering)

| Test                                  | Description                                 |
| ------------------------------------- | ------------------------------------------- |
| `contains` operator - simple options  | Filter rows where cell array contains value |
| `contains` operator - object options  | Filter with `{ value, label }` options      |
| `doesNotContain` operator             | Filter rows where cell array excludes value |
| `isEmpty` operator                    | Filter rows with empty/null arrays          |
| `isNotEmpty` operator                 | Filter rows with non-empty arrays           |
| Handle `undefined`/`null` cell values | Empty filter value shows all rows           |
| Handle empty filter value             | Should not filter when value is `''`        |
| Support `valueParser`                 | Custom value parsing works                  |
| Support function `valueOptions`       | Dynamic options based on row context        |
| Work without explicit `valueOptions`  | Infer from data (if supported)              |

#### Column Type: multiSelect (filter panel)

| Test                           | Description                              |
| ------------------------------ | ---------------------------------------- |
| Reset value on operator change | When switching to incompatible operator  |
| Reset value on column change   | When valueOptions differ between columns |
| Keep value if available        | When new column has same option          |
| Reflect filterModel in UI      | Filter panel shows correct state         |

#### Column Type: multiSelect (quick filter)

| Test                       | Description                                         |
| -------------------------- | --------------------------------------------------- |
| Match any array element    | Quick filter matches if ANY element contains search |
| Case-insensitive search    | Search should be case-insensitive                   |
| Object options with labels | Search against label, not value                     |

#### Column Type: multiSelect (edit components)

| Test                            | Description                                   |
| ------------------------------- | --------------------------------------------- |
| `setEditCellValue` with array   | Value should be array of selected options     |
| String array options            | Select multiple from string array             |
| Object array options            | Select multiple from `{ value, label }` array |
| Dynamic `valueOptions` function | Options from function should work             |
| Keyboard navigation             | Arrow keys, Enter to select, Escape to cancel |

#### Column Type: multiSelect (sorting)

| Test                    | Description                      |
| ----------------------- | -------------------------------- |
| Default sort by length  | Longer arrays sort after shorter |
| Custom `sortComparator` | User-provided comparator works   |
| Handle empty arrays     | Empty arrays sort correctly      |

#### Column Type: multiSelect (export)

| Test                 | Description                                 |
| -------------------- | ------------------------------------------- |
| CSV export           | Array formatted with separator              |
| Clipboard copy       | Uses `valueFormatter` output                |
| Clipboard paste      | Parses and validates against `valueOptions` |
| Paste invalid values | Invalid values silently ignored             |

#### Column Type: multiSelect (header filters - Pro)

| Test                          | Description                              |
| ----------------------------- | ---------------------------------------- |
| Reflect filterModel in header | Header filter shows current filter state |
| Apply filter on input change  | Typing in header filter applies filter   |
| Change operator from menu     | Operator menu works correctly            |
| Clear filter from menu        | Clear option removes filter              |
| Keyboard navigation           | Tab navigates through header filters     |

#### Cell Display

| Test                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| Render chips             | Displays array values as chips                |
| Overflow "+N" chip       | Shows overflow indicator when chips don't fit |
| Resize recalculates      | Visible chip count updates on column resize   |
| Empty array              | Renders empty cell                            |
| Expand popup on spacebar | Opens full list popup                         |
| Expand popup on +N click | Clicking overflow chip opens popup            |

---

## Documentation

### Location

Main docs: `docs/data/data-grid/column-definition/column-definition.md`

Add new section under "## Column types" after `singleSelect` (around line 338).

### Structure

```markdown
### Multi-select

The `multiSelect` column type is similar to `singleSelect`, but allows cells to contain
multiple values from the `valueOptions` list. Values are displayed as chips.

{{"demo": "MultiSelectColumn.js", "bg": "inline"}}

#### Value options

<!-- Same as singleSelect - string array or object array -->

{{"demo": "MultiSelectValueOptions.js", "bg": "inline"}}

#### Filtering

The following filter operators are available:

- **contains** – cell array includes the filter value
- **does not contain** – cell array excludes the filter value
- **is empty** – cell array is empty
- **is not empty** – cell array has items

{{"demo": "MultiSelectFiltering.js", "bg": "inline"}}

#### Customization

##### Colored tags

{{"demo": "MultiSelectColoredTags.js", "bg": "inline"}}
```

### Demos Required

| Demo File                     | Location             | Purpose                                                |
| ----------------------------- | -------------------- | ------------------------------------------------------ |
| `MultiSelectColumn.tsx`       | `column-definition/` | Basic usage with string valueOptions                   |
| `MultiSelectValueOptions.tsx` | `column-definition/` | Object options with value/label                        |
| `MultiSelectFiltering.tsx`    | `column-definition/` | Filter panel interaction                               |
| `MultiSelectColoredTags.tsx`  | `column-definition/` | Customization: per-option chip colors via `renderCell` |

### API Reference

Create new file: `docs/public/x/api/data-grid/grid-multi-select-col-def.md`

Pattern from: `docs/public/x/api/data-grid/grid-single-select-col-def.md`

### Cross-references

Update these pages to mention `multiSelect`:

| Page                          | Section                       | Update                              |
| ----------------------------- | ----------------------------- | ----------------------------------- |
| `column-definition.md`        | Column types table (line 263) | Add `'multiSelect'` row             |
| `filtering/index.md`          | Operators table               | Add multiSelect operators           |
| `filtering/quick-filter.md`   | Column types                  | Note on array value search          |
| `filtering/header-filters.md` | Supported types               | Mention multiSelect support         |
| `filtering/customization.md`  | Filter operators              | Add `getGridMultiSelectOperators()` |
| `editing/editing.md`          | Column types                  | Mention multiSelect edit cell       |
| `export/export.md`            | Column types                  | Note on array formatting            |
| `clipboard/clipboard.md`      | Paste behavior                | Note on array parsing               |
| `sorting/sorting.md`          | Comparators                   | Note default array length sorting   |

### Navigation

Add to sidebar in `docs/data/data-grid/column-definition/column-definition.md` frontmatter if needed.

### Out of Scope

| Feature                       | Reason                               |
| ----------------------------- | ------------------------------------ |
| Row grouping by array         | Complex, unclear UX                  |
| Aggregation functions         | Unclear use case                     |
| Pivoting                      | Edge case, complex                   |
| Configurable chip display     | Users can customize via `renderCell` |
| `freeSolo` mode               | Users can implement custom edit cell |
| Colored tags (built-in)       | Provide customization demo instead   |
| `containsAnyOf`/`containsAll` | Achievable via AND/OR filter logic   |

---

## CSS Classes

New classes to add in `gridClasses.ts`:

| Class                          | Purpose                      |
| ------------------------------ | ---------------------------- |
| `multiSelectCell`              | Root element of display cell |
| `multiSelectCellChip`          | Individual chip in cell      |
| `multiSelectCellOverflow`      | The "+N" overflow chip       |
| `multiSelectCellPopup`         | Expand popup container       |
| `multiSelectCellPopperContent` | Content inside expand popup  |
| `editMultiSelectCell`          | Root element of edit cell    |

> Pattern follows `longTextCell*` classes.

---

## Icon Slots

If expand popup is needed (same as `longText`), consider reusing existing icons:

| Slot                          | Reuse from                 | Notes              |
| ----------------------------- | -------------------------- | ------------------ |
| `multiSelectCellExpandIcon`   | `longTextCellExpandIcon`   | Or reuse same slot |
| `multiSelectCellCollapseIcon` | `longTextCellCollapseIcon` | Or reuse same slot |

**Decision:** Reuse `longText` icon slots to avoid duplication (both use same expand/collapse pattern).

---

## Implementation Files

### Files to Create

| File                                          | Package     | Purpose                 |
| --------------------------------------------- | ----------- | ----------------------- |
| `colDef/gridMultiSelectColDef.tsx`            | x-data-grid | Column type definition  |
| `colDef/gridMultiSelectOperators.ts`          | x-data-grid | Filter operators        |
| `components/cell/GridEditMultiSelectCell.tsx` | x-data-grid | Edit cell component     |
| `components/cell/GridMultiSelectCell.tsx`     | x-data-grid | Display cell with chips |

### Files to Modify

| File                                                  | Package         | Change                                        |
| ----------------------------------------------------- | --------------- | --------------------------------------------- |
| `colDef/gridDefaultColumnTypes.ts`                    | x-data-grid     | Register `multiSelect` type                   |
| `colDef/index.ts`                                     | x-data-grid     | Export new files                              |
| `models/colDef/gridColType.ts`                        | x-data-grid     | Add to `GridColumnTypes` interface            |
| `models/colDef/gridColDef.ts`                         | x-data-grid     | Add `GridMultiSelectColDef` type              |
| `constants/gridClasses.ts`                            | x-data-grid     | Add `multiSelectCell*` CSS classes            |
| `components/headerFiltering/GridHeaderFilterCell.tsx` | x-data-grid-pro | Add multiSelect to `DEFAULT_INPUT_COMPONENTS` |

---

## Decisions Summary

### API Decisions

| Question               | Decision            | Notes                                                     |
| ---------------------- | ------------------- | --------------------------------------------------------- |
| Tier placement         | **Community**       | High demand, basic feature                                |
| `valueOptions`         | **Required**        | Mirror singleSelect                                       |
| Async valueOptions     | **Supported**       | Function returning options (mirror singleSelect)          |
| Filter operators in V1 | **4 operators**     | `containsAnyOf`/`containsAll` achievable via AND/OR logic |
| Sorting default        | **By length**       | Most common use case                                      |
| Paste invalid values   | **Ignore silently** | Match singleSelect behavior                               |

### UX Decisions

| Question            | Decision                   | Notes                                    |
| ------------------- | -------------------------- | ---------------------------------------- |
| Chip size           | **small**                  | Compact, fits more in cell               |
| Chip variant        | **filled**                 | Solid background                         |
| Chip color          | **default**                | Gray/neutral, theme-aware                |
| Overflow indicator  | **+N chip (outlined)**     | Clickable to expand                      |
| Visible chip count  | **Auto-calculated**        | Based on cell width, recalc on resize    |
| Expand trigger      | **Spacebar / click +N**    | Same pattern as `longText`               |
| Empty state         | **Empty cell**             | Show nothing                             |
| Edit dropdown       | **Below cell**             | Standard Autocomplete behavior           |
| Operator labels     | **Lowercase**              | "contains", "does not contain", etc.     |
| Header filter input | **Single-select dropdown** | Filter by `contains`                     |
| Filter priority     | **Filtered value first**   | When filtering, show matched value first |

---

## Design Review Checklist

All decisions have been finalized. The following mockups are needed from design:

### Cell Display

| Item           | Decision                                             |
| -------------- | ---------------------------------------------------- |
| Chip size      | `small`                                              |
| Chip variant   | `filled`                                             |
| Chip color     | `default`                                            |
| Overflow       | `+N` chip with `variant="outlined"`                  |
| Visible count  | Auto-calculated based on cell width (ResizeObserver) |
| Expand trigger | Spacebar or click "+N more" (same as `longText`)     |
| Empty state    | Empty cell                                           |

**Mockups needed:**

- [ ] Cell with chips that fit (no overflow)
- [ ] Cell with overflow (+N chip visible)
- [ ] Same cell after column resize (showing recalculated chips)
- [ ] Expand popup (triggered by spacebar or +N click)
- [ ] Very narrow column (only +N visible)

### Edit Cell (Autocomplete)

| Item              | Decision                       |
| ----------------- | ------------------------------ |
| Dropdown position | Below cell                     |
| Selected chips    | Inside input (MUI default)     |
| Chip delete       | Yes (X button)                 |
| Search/filter     | Yes (MUI Autocomplete default) |
| Max height        | 300px (match singleSelect)     |

**Mockups needed:**

- [ ] Edit mode with dropdown open
- [ ] Multiple options selected

### Filter Panel

| Item            | Decision                                                              |
| --------------- | --------------------------------------------------------------------- |
| Input component | Dropdown (reuse singleSelect)                                         |
| Operator labels | Lowercase: "contains", "does not contain", "is empty", "is not empty" |

**Mockups needed:**

- [ ] Filter panel with `contains` operator selected

### Header Filters (Pro)

| Item       | Decision               |
| ---------- | ---------------------- |
| Input type | Single-select dropdown |
| Operator   | `contains`             |

**Mockups needed:**

- [ ] Header filter dropdown open
- [ ] Header filter with active filter

### Keyboard Navigation (Spec)

| Action           | Key                     | Behavior                        |
| ---------------- | ----------------------- | ------------------------------- |
| Open edit mode   | Enter / F2              | Focus input, open dropdown      |
| Close edit mode  | Escape                  | Discard changes, close dropdown |
| Confirm edit     | Tab / Click outside     | Save changes                    |
| Navigate options | Arrow Up/Down           | Move through dropdown           |
| Select option    | Enter / Click           | Add to selection (don't close)  |
| Remove last chip | Backspace (empty input) | Remove last selected value      |
| Expand popup     | Spacebar (view mode)    | Open full list popup            |

### Accessibility (Spec)

| Item             | Requirement                      |
| ---------------- | -------------------------------- |
| Screen reader    | Announce "X of Y selected"       |
| ARIA labels      | Proper labeling for autocomplete |
| Focus management | Return focus to cell after edit  |
| Color contrast   | Chips meet WCAG AA contrast      |

---

---

## Appendix: Competitor Feature Matrix

| Feature               | Notion | Airtable      | AG Grid         | MUI X (proposed)   |
| --------------------- | ------ | ------------- | --------------- | ------------------ |
| Multi-select cell     | ✅     | ✅            | ✅ (Enterprise) | ✅ (Community)     |
| Colored tags          | ✅     | ✅            | ❌              | Customization demo |
| Filter: contains      | ✅     | ✅            | ✅              | ✅                 |
| Filter: containsAnyOf | ✅     | ✅            | ✅              | ✅ (via OR logic)  |
| Filter: containsAll   | ✅     | ✅            | ✅              | ✅ (via AND logic) |
| Filter: isEmpty       | ✅     | ✅            | ✅              | ✅                 |
| Quick filter          | ✅     | ✅            | ✅              | ✅                 |
| Sort by value         | ✅     | ✅            | ✅              | ✅                 |
| Inline option create  | ✅     | ✅            | ❌              | V2 (freeSolo)      |
| Grouping              | ✅     | ✅ (combined) | ✅              | Out of scope       |
| Formula support       | ✅     | ✅            | N/A             | N/A                |
