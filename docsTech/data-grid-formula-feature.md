# Data Grid Premium — Formula (Excel-like) support

This document records the locked design decisions for the formula feature so that every iteration
implements against the same contracts. The feature lets cells whose row-data value starts with `=`
be parsed and evaluated; the evaluated value flows through rendering, sorting, filtering, export and
aggregation, while the formula source remains the canonical stored value in row data.

The code lives in `packages/x-data-grid-premium/src/hooks/features/formula/`, with the pure engine
(no React, no grid imports) in its `engine/` subfolder.

The feature ships in 6 independently mergeable iterations:

- **I1** — pure engine: tokenizer, parser, serializer, dependency extraction/binding, function
  registry, evaluator, graph utilities. The full grammar parses (including ranges and positional
  selectors), but ranges and positional refs evaluate to `#REF!` until I3. AST and resolver types
  freeze at the end of I1.
- **I2** — grid adapter: state/cache/selectors, value overlay, editing, invalidation, public API.
  Ships a usable computed-column feature with same-row and stable cross-row references.
- **I3** — ranges + position context: `COLUMN_VALUES`/range evaluation, rebind machinery,
  `#REF!` propagation on row/column removal, re-grouping/re-spanning on evaluated values
  (the two D18 deferrals from I2).
- **I4** — A1 editor syntax (explicitly cuttable): bidirectional A1 ↔ canonical transform,
  commit-time freezing of relative refs.
- **I5** — formula-editor autocomplete: completion vocabulary + caret context engine, adapter token
  sourcing, the suggestion dropdown (headless `useAutocomplete` + `Popper`), and signature help (D20).
- **I6** — polish: docs expansion, a11y, generated artifacts.
- **I7** — fill-handle reference adjustment: dragging (or Ctrl+D/Ctrl+R filling) a formula copies it
  with its relative references shifted for each target cell, Excel-style (D21).
- **I8** — Excel formula export: with `escapeFormulas: false`, live formula cells export as real
  Excel formulas with references re-anchored to the exported sheet's coordinates (D22).
- **I9** — grow-with-content floating editor: the formula editor floats over the cell in a
  statically-positioned row-portaled surface and grows inline-end with the formula (D24).
- **I10** — live column-resize sync: the reference rectangles and the floating surface track a column's drag-resize per `columnResize` event, and the edit survives the gesture (D25).
- **I11** — vertical growth: once the width ratchet reaches its clamp the formula wraps and the
  surface grows by whole lines, bounded, so the whole formula stays visible (D27).
- **I12** — dialect-aware completion analysis: the autocomplete reads the caret in the dialect the
  editor is actually showing, so a formula built from A1 ranges completes and helps correctly (D28).
- **I13** — injectable feature: the formula runtime moves behind a `@mui/x-data-grid-premium/formula`
  entry point injected through the `featureDependencies` prop, so grids that do not use formulas do
  not bundle the engine, evaluation glue or editor components (D29).

## Locked design decisions

**D1. Layout.** `packages/x-data-grid-premium/src/hooks/features/formula/` with a pure `engine/`
subfolder (no React, no grid imports; engine files import only from `engine/`). Engine files use the
bare `formula*` prefix; adapter files use the repo's `gridFormula*` / `useGridFormula*` prefixes.
The engine defines its own `FormulaRowId = string | number` (structural twin of `GridRowId`) to stay
extractable; the engine is **not** exported from the public barrel — internal seam only (future
pluggable-engine escape hatch). The engine deliberately does **not** live in `@mui/x-internals`:
that package is MIT-licensed while the engine is premium IP, and a shared package adds release
coordination for no benefit. The zero-grid-imports purity rule means relocating it later is a
mechanical import-path change.

**D2. Grammar.** Operators with Excel precedence: comparison < `&` < `+ -` < `* /` < `^`
(left-associative, `2^3^2 = 64`) < unary (`-2^2 = 4` — Excel behavior). Unary `+` is an identity
operation (no coercion, Excel behavior); only unary `-` coerces numerically. Literals: number
(finite only — out-of-range literals are parse errors), double-quoted string with `""` escape,
TRUE/FALSE. Bare identifier = same-row field ref, always (existence checked at evaluation →
`#REF!`); `FIELD("unit price")` is the escape hatch for arbitrary field names. Function names are
case-insensitive; fields are case-sensitive. en-US only (`,` argument separator, `.` decimal).
Hand-written recursive descent; every AST node carries a source `span` (parenthesized expressions
span their parentheses). Parser recursion depth and AST height are bounded (`MAX_FORMULA_DEPTH`),
so hostile inputs become ordinary parse errors instead of stack overflows — this is what upholds
the never-throws contracts of `evaluateFormula` and `serializeFormulaAst` downstream. `'=foo`
apostrophe-escape stores a literal `=` string.

**D3. Canonical special forms are dedicated AST nodes, not registry functions** — `REF`, `COLUMN`,
`ROW`, `COLUMN_POSITION`, `ROW_POSITION`, `FIELD`, `RANGE_REF` (with its axis labels `COLUMN_FROM`/
`ROW_FROM`/`COLUMN_TO`/`ROW_TO`, the `FIXED` wrapper and the `ANCHOR` offset form), `COLUMN_VALUES`
with **literal-only
arguments enforced by the parser** (computed refs → parse error; a sign before a numeric `ROW()` id
is still a literal). This keeps static dependency extraction decidable. The registry rejects
reserved names and names the parser can never produce as calls. Unified `cellRef` node with
per-axis selectors (`FormulaColumnSelector = field | position`, `FormulaRowSelector = id |
position`) — separate node types cannot encode mixed-axis refs like `A$1`.

**D4. Position-context policy (applies from I3).** Position context = `gridFilteredSortedRowIdsSelector`
order **excluding autogenerated (group/footer) and pinned rows** × visible column order. **One-shot,
no fixpoint:** sorting/filtering consume formula values as of when the comparator ran; after
`sortedRowsSet`/`filteredRowsSet`, position-dependent formulas rebind and re-evaluate exactly once;
the grid never auto re-sorts/re-filters in response. Deterministic, loop-free, Excel-consistent
(Excel never auto-resorts after recalc). Documented remedy: re-apply the sort. Stable refs and field
refs (the dominant cases) are unaffected. Relative A1 refs freeze to **stable** refs at commit (I4).
_Amended during I3 (implementation specifics):_

- **Rebind triggers** are `sortedRowsSet`, `filteredRowsSet`, `columnVisibilityModelChange` and
  `columnsChange` — NOT the drafted `columnOrderChange`: programmatic `setColumnIndex` never fires
  it (only `columnIndexChange` + `columnsChange`), while drag reorder funnels through
  `setGridColumnsState` → `columnsChange` on every step. Conversely `setColumnVisibilityModel`
  replaces the columns state directly without `columnsChange`, so the visibility model event is
  subscribed separately. The rebind pass itself compares the previous row-id/field-order snapshot
  and exits cheaply when nothing moved (also making the `columnsChange` noise from width changes
  harmless), and exits before building a snapshot when no record uses positions.
- The position context is **built lazily** (first position-dependent record binds it), cached on
  the formula cache, and replaced only by rebind passes — every consumer within a pass sees one
  snapshot, so bind-time and eval-time resolution can never disagree.
- The **column axis excludes utility columns** (selection checkbox, detail panel toggle, row
  reorder handle, tree-data and row-grouping columns), mirroring the row-side autogenerated
  exclusion — otherwise enabling `checkboxSelection` would shift every positional column
  reference by one, and I4's A1 sugar would map column `A` to the checkbox column.
- **Initialization order**: sorting and filtering states initialize after the formula state, so
  the initial evaluation binds against the row-tree order; the mount-time sorting/filtering
  cascade publishes `sortedRowsSet`/`filteredRowsSet` and rebinds before interaction. During the
  mount window, filtering applies before the first `applySorting`, so `sortedRows` can still be
  empty while rows exist — the snapshot builder detects that window and falls back to the
  row-tree order (matching the initial snapshot), so the `filteredRowsSet` rebind compares equal
  and the single real rebind happens on the mount `sortedRowsSet`.
- After a rebind pass that changed cells, the hook calls `applyAggregation()` (aggregation read
  values earlier in the same cascade); row spanning resets itself on the same events, registered
  after the formula hook.

**D5. References.** `A1` → `REF(COLUMN("fieldAtA"), ROW("rowIdAt1"))`; `$A1` → positional column;
`A$1` → positional row; `$A$1` → both positional. Same-row: bare field ref.

**I4 amendment.** The `$`-axis semantics are intentionally **inverted from Excel** so the grid stays
loop-free under re-sort — a **relative** (no-`$`) axis **freezes** to the stable identity currently at
that position (`A`→`COLUMN("fieldAtA")`, `1`→`ROW(idAt1)`) and shifts by the paste offset; an
**absolute** (`$`) axis stays **positional** (`$A`→`COLUMN_POSITION`, `$1`→`ROW_POSITION`) and never
shifts. A1 is **editor-only and never stored** (row data, copy, export, `getCellFormula` always
canonical). Same-row references have **no A1 cell-address form** — they display as the bare field
name in both dialects ("Keep D5", confirmed 2026-06-15): `=price * quantity` edits as
`=price * quantity`, not `=B3*C3` (a `fieldRef` cannot round-trip through `B3`, which would freeze
to a specific row).

**D6-B+ amendment (2026-08-18, review request on PR 22807).** The `$` inversion is scoped to
**single-cell refs**. On a range endpoint, `$` is uniform with spreadsheets: **absolute** — a
`FIXED(...)` axis is a view position that never adjusts, on fill or on view-order changes. A
**plain** endpoint typed from a cell **inside the data band** freezes to `ANCHOR(delta)`, a signed
offset from the committing cell (the Sheets storage model): the window moves with the formula
under sort/filter/reorder and copies **verbatim** on fill/paste. A plain endpoint typed from a
**pinned row** (or committed without an anchor) freezes to a non-`FIXED` view position — the
pre-B+ form, which stays put under sorting and shifts by fill arithmetic. So `A1:B5` in-band →
four `ANCHOR` axes; `$A$1:$B$5` → four `FIXED` axes; `$A$1:A1` → the running total that survives
both fill and sort.

**D6. Ranges (rewritten 2026-08, Option B of the PR 22807 RFC — supersedes the original
identity-anchored `RANGE(REF, REF)`, which is removed).**
`RANGE_REF(COLUMN_FROM(c1), ROW_FROM(r1), COLUMN_TO(c2), ROW_TO(r2))` = an inclusive window over
the current view; the stored text never mutates. Each axis is a union:
`{kind:'position', index, fixed}` (a view position; `FIXED(...)` = `$` = absolute, never adjusts)
or `{kind:'anchor', delta}` (`ANCHOR(delta)` = a signed offset from the owner cell — the plain-A1
in-band form; `FIXED(ANCHOR(...))` is a parse error). Resolution
(`resolveFormulaRangeRectangle(range, context, anchor)`, anchor = the owner's view positions from
`getFormulaRangeAnchor`) resolves anchor axes to `ownerPosition + delta`, then normalizes min/max
and **auto-clips position axes**: rows clamp to the pinned-row-free data band, columns to
`[1, columnCount]`; an entirely out-of-view positional window is empty (SUM = 0). **Anchor axes
are strict instead**: an owner without a position on a needed axis (own row filtered out, own
column hidden), or a resolved endpoint outside the band/columns, makes the whole range `#REF!` —
clipping would silently aggregate cells the user never anchored to, and Sheets/Excel error here
too. Consequently a sort can never sweep an anchored window over its own cell (`#CYCLE!` from
sorting is gone for plain in-band ranges — it turns into `#REF!` when the geometry stops
fitting), and the deferred view-order auto-adjustment follow-up is obsolete for anchored windows
(offsets need no rewriting — the write-back problem never arises). Windows never grow/shrink on
row add/remove. Identity-anchored rectangles are no longer expressible;
`RANGE` is no longer reserved (legacy text degrades to `#NAME?` unknown function).
`COLUMN_VALUES("field")` = the field's values over the current **sorted+filtered** row set
(consistent with `aggregationRowsScope: 'filtered'`) — the recommended, sort-proof "sum the column"
form; editor sugar `A:A` (`$` has no effect on it). Ranges legal only as args to `acceptsRanges`
functions (enforced on both the eager and lazy argument paths); range in scalar position →
`#VALUE!`. Dev warning above ~100k materialized cells.

**D7. Range dependencies are interval records, never exploded edges.**
`FormulaBoundDependencies = { cells: Set<key>, columnIntervals: {field, fromIndex, toIndex}[],
wholeColumns, errors }` + reverse maps `dependents` and `rangeDependentsByField`. Range graph edges
connect only to **formula** cells inside bounds (raw cells can't create cycles), so
`SUM(COLUMN_VALUES("total"))` placed in column `total` → `#CYCLE!` (correct, Excel-consistent).
_Amended during I3 (implementation specifics):_

- Cache tiers: `rangeDependentsByField: Map<field, Map<dependentKey, { intervals, wholeColumn }>>`
  (reverse direction — what to dirty when a cell of `field` changes, position checked against the
  dependent's intervals) and `recordsByField: Map<field, Set<key>>` (forward direction — expands an
  interval into the formula cells it covers for `orderForRecompute`, restricted to rows that have a
  position). Both maintained by the record attach/detach path; `positionDependentKeys` tracks the
  rebind set.
- The graph callbacks passed to `collectAffectedCells`/`orderForRecompute` expand the interval tier
  in **both** directions — this is what makes a formula cell inside a range evaluate before its
  range consumer, and what turns a self-covering range into an unpeelable self-edge (`#CYCLE!`).
- Raw cells read through range materialization land in `trackedValues` like cell-edge reads (this
  is how single-cell edits inside a range dirty its consumers); when the **last** range dependent
  of a field detaches, the field's tracked values are swept, sparing entries that still serve a
  cell-edge dependent.
- Range materialization is row-major (left to right, then top to bottom); the first error value
  inside a range propagates (strict-propagation rule — uniform for SUM and COUNT alike, a deliberate
  simplification vs. Excel's error-ignoring COUNT). `COLUMN_VALUES` accepts hidden fields (values
  exist without a position); a positional `RANGE_REF` window auto-clips to the view (empty window
  = zero intervals, no error), while an anchored window with no resolvable anchor or an
  out-of-band endpoint binds/evaluates to `#REF!` (binding pushes the error into `bound.errors`,
  the evaluator's `evaluateRange` re-derives it from `context.currentCell` as defense in depth).
  Membership changes (row add/remove, filter flips) are NOT handled by
  per-cell dirtying — the rebind pass dirties every position-dependent record when the view order
  changes.
- Dev-mode warning when one formula materializes more than 100k range cells.

**D8. Evaluation & errors.** Resolver interface supplied by adapter; contract: side-effect free,
never recurses into the engine (topo order guarantees dep freshness). Coercion matrix in
`formulaValues.ts` (notable: string comparison case-insensitive like Excel, isolated in one
`compareScalars`; cross-type ordered comparison → `#VALUE!`; empty operands take a type-neutral
substitute in ordered comparisons — number → 0, string → `''`, boolean → FALSE, Date → epoch;
Dates via `getTime()`, invalid Dates → `#VALUE!` in ordered comparison and never equal in equality;
division-by-zero → `#DIV/0!`, other non-finite → `#VALUE!`, including function results — built-in
overflow like `SUM(1e308, 1e308)` and custom registry functions alike). Error codes: `#REF!
#DIV/0! #CYCLE! #NAME? #VALUE! #ERROR!`; strict left-to-right first-error propagation, except `lazy`
functions (IF/AND/OR — untaken branches never evaluated) and `acceptsErrors` (IFERROR, ISBLANK).
`#CYCLE!` is assigned only by the graph layer. Cycle detection: **single-pass Kahn** over the
affected subgraph (unpeeled nodes = cyclic); iterative implementations only (10k-deep dependency
chains must not blow the stack). Volatile policy: **zero volatile built-ins** (no NOW/RAND);
`volatile?: boolean` flag exists with defined semantics (always dirty per pass) for user registries.

**D9. Value overlay** in `hooks/features/rows/useGridParamsOverridableMethods.ts`: **aggregation →
formula → community** in all three methods; the formula branch is a **membership check**
(`gridCellFormulaResultSelector(...) != null`), returning `result.type === 'error' ? result.code :
result.value`. `getRowFormattedValue` returns the error code **bypassing `colDef.valueFormatter`**
for error results; value results flow through the formatter normally.

**D10. Re-render + filtering patches in `DataGridPremium.tsx`.** Extend the premium
`useCellAggregationResult` config hook to also subscribe to `gridCellFormulaResultSelector` (this is
what re-renders formula cells after each pass). Patch `useFilterValueGetter` to consult the formula
lookup first (quick filter inherits). _Amended during I2:_ no community-package change is needed —
`getCellParamsForRow` falls back to `getRowValue`/`getRowFormattedValue` (the overlay) whenever the
forced value is `undefined`, so the premium hook only adds a subscription and keeps returning the
aggregation result unchanged.

**D11. Invalidation.** Cache keeps `lastRowIdToModelLookup` (row-object **references**) +
`trackedValues` (last resolved value per non-formula dependency cell) + `dependentsByRowId`
(reverse index added during I2: row additions/removals dirty every formula referencing any cell of
that row — this is what lets a `#REF!` to a missing row recover when the row appears). On
`rowsSet`: reference-diff
new lookup vs snapshot → changed/added/removed ids; per changed row, rescan formula-enabled fields
for source changes and compare tracked dependency cells; dirty + transitive closure via
`dependents`/`rangeDependentsByField`; Kahn recompute; update snapshots; **one `setState`**
(copy-on-write) + publish `formulaEvaluated: { changedCells }`. The same pipeline covers editing
commits, `updateRows`, paste, undo/redo. Other triggers: `columnsChange` — guarded by **two**
equality checks (the `allowFormulas` field set, and a `field → valueGetter` signature of the whole
columns lookup, because `#REF!` for unknown fields and raw reads through `valueGetter` make results
depend on every column definition); `props.formulaFunctions` change (compared **per definition**,
not by record identity — inline props change identity every parent render); `reevaluateFormulas()`
(full rebuild). A pass that only removes rows still reports their formula cells as changed —
otherwise the lookup entries would survive and mask a later row reusing the same id. Initial
evaluation in
`formulaStateInitializer` registered **after** `rowsStateInitializer` (`caches.rows` is populated
synchronously at init — no first-paint flash of `=` strings). All passes synchronous in handlers;
dirty flushes once per loop.

**D12. Editing.** `hydrateColumns` pipe processor wraps `allowFormulas` columns. The wrapped
property set is **deliberately disjoint from aggregation's** (`renderCell`/`renderHeader`): two
features stacking wrappers on the same property cannot unwrap cleanly (the identity check skips a
wrapper that has another one on top, accumulating layers on every `hydrateColumns` pass). The
error-tooltip `renderCell` wrap drafted for I2 was therefore dropped — error codes display through
`getRowFormattedValue`; tooltip/a11y polish lands in I5 through a non-`renderCell` mechanism.
Typing `=` as the first character on a **plain** cell opens the formula text editor (recorded from
the `cellEditStart` keyboard event) — without this there is no way to enter a formula in a number
column, whose default editor rejects the character. `lastCellEditStart` is consumed on editor
mount and cleared on `cellEditStop`, so it cannot go stale and corrupt a later programmatic edit.

- `renderEditCell` → `GridFormulaEditCell`: seeds the edit state with the **source** via
  `setEditCellValue({ id, field, value: source, unstable_skipValueParser: true })` unless the edit
  started with a delete/printable/paste key. Falls back to the column type's default edit component
  for non-formula cells; renders a text input whenever the value is a formula.
- `valueParser` → strings starting with `=` bypass the original parser.
- `valueSetter` → formula sources write `{ ...row, [field]: source }` directly; **equality guard**:
  if the incoming value equals the current evaluated result and stored `row[field]` is a formula →
  return the row unchanged (data-loss protection on paths that bypass the custom editor).
- `preProcessEditCellProps` → **only wrapped when the column defines its own processor** (amended
  during I2: adding a processor unconditionally puts an async `isProcessingProps` gate on every
  commit, which blocks Enter pressed right after a keystroke). The wrap forces **`error: false`**
  for formula values (permissive commit). No validation metadata is attached — editor hints use
  `validateCellFormula()` directly (I5).
- `pastedValueParser` → `=`-strings become formulas.
  `getCellFormula(id, field)` reads the **raw** row value — never the overlay.

**I4 amendment (A1 editor mode — corrects the `valueParser`/`valueSetter` bullets above for A1).**
`valueParser` runs on **every keystroke** (`GridEditInputCell.handleChange` calls it and shows its
result), so it is **not** a commit hook: with `formulaA1Notation` on it passes the A1 text through
**unchanged** (converting there surfaced canonical `=REF(...)` to the user mid-edit — a found+fixed
bug). The A1→canonical **freeze happens in `valueSetter`** — the real commit hook
(`getRowWithUpdatedValuesFromCellEditing` calls only the setter) — via `convertA1ToCanonicalCommit`,
which restores the stored canonical on an unchanged commit (seed match) and re-freezes an edited
formula otherwise. `GridFormulaEditCell` seeds the A1 rendering of the canonical source
(`toDisplayFormula`) on edit-begin. `pastedValueParser` freezes with the Excel fill offset anchored
to the **focused (top-left) cell** (`gridFocusCellSelector`), not the first editable formula cell.
A1 UI when the prop is on: a dimmed header-letter adornment that **leads** the title (rendered inside
the non-reversed title content via a new community `useColumnHeaderAdornment` configuration hook) and
a leftmost autogenerated row-number column (utility field in `UTILITY_FIELDS`, pinned left, excluded
from export/print/letters).

**D13. Resolver value semantics.** Dependency on a non-formula cell: community `getRowValue` util
(valueGetter applied — formulas see what the user sees). Dependency on a formula cell: cached result
from the in-pass map. Formula column that itself defines `valueGetter`: ignored for formula cells
with a one-time dev warning.

**D14. Aggregation chaining.** Aggregation reads via `getRowValue` → sees formula values
automatically. Hook-registration order makes formula recompute run before filter/sort in the same
`rowsSet` cascade; aggregation defers to `filteredRowsSet`. For non-rows-driven passes, call private
`applyAggregation()` once after `setState`. Pivoting + formulas unsupported in v1 (evaluation
skipped while pivot is active, dev warning).

**D15. Public API & types.** _Amended 2026-07-03: the formula API methods are **private**
(`GridFormulaPrivateApi`) until a userland use case justifies exposing them — the former public
`GridFormulaApi` interface was merged into it and removed from `GridApiPremium` and the barrel;
tests reach the methods through `unwrapPrivateAPI`._ Methods: `setCellFormula`, `getCellFormula`,
`getCellFormulaResult`, `validateCellFormula`, `reevaluateFormulas`, plus
`applyFormulaEvaluation`. Event `formulaEvaluated: { changedCells: GridCellCoordinates[] }` in
`GridEventLookupPremium` (no model → no `registerControlState`). Types: `GridFormulaResult` union,
branded `GridFormulaCellKey` with the format `` `${id}�${field}` `` — **NUL separator**
(amended during I1 from the originally drafted space separator: `FIELD("unit price")` legalizes
space-containing field names, which makes a space-separated format ambiguous, while NUL cannot
appear in field names; numeric ids are stringified — row ids must be unique under string coercion).
`GridFormulaCellRef = GridCellCoordinates`; `FormulaValidationResult` defined in the engine. No
`unstable_` prefixes.

**D16. Props & colDef.** `GridColDefPremium.allowFormulas?: boolean` default **false** (opt-in —
implicit true would silently reinterpret `=`-prefixed data). `disableFormulas: boolean` default
false; `formulaFunctions: Record<string, FormulaFunctionDefinition>` default
`GRID_FORMULA_FUNCTIONS` (empty when `dataSource` is set, cf. aggregation). The prop has
**replacement semantics** like `aggregationFunctions`, and `createFormulaFunctionRegistry` mirrors
that: its argument is the complete function set (spread `FORMULA_BUILT_IN_FUNCTIONS` to extend).
The function definition is the **engine-pure** shape (`{ name, minArgs, maxArgs, lazy?,
acceptsRanges?, acceptsErrors?, volatile?, apply(args, ctx) }` — no `GridApiPremium` in `apply`).
Built-ins (23 + alias): SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, ROUND, ABS, MOD, POWER, IF, AND, OR,
NOT, IFERROR, ISBLANK, CONCAT/CONCATENATE, LEN, UPPER, LOWER, TRIM, LEFT, RIGHT.

**I4 amendment.** `formulaA1Notation: boolean` default **false** — opt-in A1 editor dialect (header
letters + row-number column + A1 editing), gated by `!disableFormulas && !dataSource`; off ⇒ zero
behavior/UI change. (I5 adds `disableFormulaAutocomplete: boolean` default false — see D20.)

**D17. Performance.** Intern parsed ASTs by source string (one parse per distinct formula).
Reference-based row diffing. One `setState` per pass, copy-on-write lookup. No lazy evaluation
(sort/filter/aggregation pull eagerly). Benchmark and document limits at 100k formula cells.
_Measured during I2_ (evaluation layer, M-series laptop, jsdom vitest): 100k rows × 1 formula
column (`=price * quantity`) — full pass ≈ 390 ms, single-cell edit diff pass ≈ 10 ms (dominated
by the O(rows) reference compare). The jsdom harness itself cannot render 100k rows (OOM with or
without formulas), so the numbers are for `computeFullFormulaPass`/`computeRowsDiffFormulaPass`
with a stubbed `apiRef`.
_Measured during I3_ (same harness, committed as
`createFormulaEvaluation.test.ts` with catastrophic-regression bounds): one
`=SUM(COLUMN_VALUES("price"))` over 100k rows — full pass ≈ 71 ms, single-cell edit diff pass
≈ 45 ms. The diff pass recomputes only the dirty subgraph (the sum cell), but the sum's
re-evaluation necessarily re-reads the 100k-cell column; "incremental" means
dirty-subgraph-only, not incremental aggregation.

**D18. Ecosystem semantics (v1).** Clipboard copy: evaluated value. Paste: `=`-strings into
`allowFormulas` columns become formulas; stable refs paste unadjusted. CSV export: evaluated values.
Excel export: evaluated values by default; with `escapeFormulas: false`, live formulas export as
real Excel formulas (I8/D22). `escapeFormulas: true` default retained. Undo/redo: free (raw row
replay). Row grouping:
keys from evaluated values. Tree data: works on data rows. `dataSource`: warn + disable. Errors
render as code strings; error results sort/filter as code strings. Only error codes are
user-visible strings (locale-neutral) — no `GridLocaleText` additions in v1. Formula bar:
originally out of scope (planned as a userland recipe on `getCellFormula` + `cellFocusIn`) —
superseded by the built-in `FormulaBar` component (D26), which also amended the no-`GridLocaleText`
stance with three bar label keys. _Amended during I3 (resolves the two I2 deferrals):_ **row grouping** groups by evaluated values:
`getCellGroupingCriteria` consults the formula lookup first (null-guarded — the initial tree build
runs before the formula state initializes); value results feed `groupingValueGetter` as its value
argument, error results group by their code string bypassing it (consistent with the
`valueFormatter` bypass). Because the tree is built inside the rows state computation — before the
formula pass in the same cascade — any pass whose changed cells intersect the sanitized grouping
model re-triggers the build via `publishEvent('activeStrategyProcessorChange', 'rowTreeCreation')`,
guarded by a `suppressRegroupTrigger` cache flag and gated on the active RowTree strategy being the
grouping one. The suppression is what bounds the cascade (one-shot, the D4 philosophy): the
rebuild's nested rowsSet/sortedRowsSet cascade usually produces zero formula changes, but
position-dependent formulas in grouped columns CAN change again when regrouping reorders the
leaves — that nested change does not re-trigger another rebuild, so in that (exotic) configuration
group keys may lag the displayed values by one rebind, exactly like D4's documented sort staleness.
A mount effect kicks one rebuild for the initial tree. **Row spanning**
compares evaluated values: the formula column wrapper additionally wraps `rowSpanValueGetter`
(formula result first, then the original getter, then the raw `getRowValue` fallback the spanning
util would have used). Spanning self-resets on `sortedRowsSet`/`filteredRowsSet`/`columnsChange`
(all ordered after the formula handlers); for passes outside those cascades (registry change,
enablement toggles, `reevaluateFormulas`, visibility-driven rebinds) the community
`useGridRowSpanning` hook now registers a private `resetRowSpanningState()` API method — the one
community-package change of I3 — which the formula hook calls after such passes.
Known editing trade-offs accepted in I2 (revisit in I5): converting an escaped literal
`'=x` to the live formula `=x` by deleting the apostrophe is silently undone by the escape
guard (workaround: clear the cell first or use `setCellFormula`); a formula whose result equals
the empty string cannot be cleared through the editor (the equality guard reads the commit as
unchanged).

**D19. Registration order in `useDataGridPremiumComponent.tsx`.** Pipe processor
`useGridFormulaPreProcessors` after `useGridAggregationPreProcessors`; `formulaStateInitializer`
**after `rowsStateInitializer`**; `useGridFormula` after `useGridAggregation` and **before
`useGridFilter`/`useGridSorting`** so the formula `rowsSet` handler runs before filtering/sorting
read values in the same cascade. State initializers must be StrictMode-idempotent.

**D20. Formula-editor autocomplete (I5; designed 2026-06-15).** A suggestion dropdown in
the formula text editor, **on by default** whenever the formula text input is shown (gated by
`!disableFormulas && !dataSource`), opt-out via `disableFormulaAutocomplete` (default `false`). The
opt-out exists because, while the popup is open, Enter/Tab/ArrowUp/Down are consumed by the
suggestion list instead of committing/navigating the cell (documented caveat).

- **Engine seam (pure, D1).** New `engine/formulaCompletion.ts`: `getFormulaCompletionTokens()`
  returns the static vocabulary — functions (name, arity, + new optional `signature`/`description`/
  `category`), operators (symbol/kind from `FORMULA_BINARY_PRECEDENCE`), special forms
  (`FORMULA_RESERVED_NAMES`), constants (TRUE/FALSE); `getFormulaCompletionContext(text, caret)`
  returns the partial token + `[replaceStart, replaceEnd]` span + a coarse `expectValue`/
  `expectOperator` context, built on `tokenizeFormula` (suppress inside an unterminated string
  literal). `FormulaFunctionDefinition` gains **optional** `signature?/description?/category?` —
  populated for the 23 built-ins; **custom functions from `formulaFunctions` appear too** (via
  `registry.names()`), surfacing whatever optional metadata the user supplied. Engine stays grid-free.
- **Adapter token sourcing.** Static vocabulary + column tokens: **bare field names in both modes**
  (same-row, D5/Keep-D5); A1 mode additionally offers **column letters** (A, B, C… via
  `columnIndexToLetters`) as a lower-weight category for cross-row addresses. Utility/row-number/
  grouping columns excluded (`gridFormulaVisibleDataFieldsSelector`); no suggestions for escaped
  `'=` literals.
- **Editor integration (chosen).** Headless `useAutocomplete` hook + a `Popper` anchored to the
  existing `GridEditInputCell` input — NOT the freeSolo `<Autocomplete>` component: the editor must
  **splice** a token at the caret into free text, not replace the whole value. On select,
  `text.slice(0, start) + token + text.slice(end)` → `setEditCellValue(..., unstable_skipValueParser:
true)` → reposition caret via `setSelectionRange`; function/special-form tokens insert a trailing
  `(` with the caret inside.
- **Keyboard conflict.** Popup-open is local React state. While open, the input's `onKeyDown`
  `stopPropagation()`s ArrowUp/Down (highlight), Enter/Tab (accept), Escape (close) so the grid's
  `cellKeyDown` (published from the cell's `onKeyDown`) never fires; closed → keys propagate.
- **Weighting.** prefix-match strength (exact-prefix > case-insensitive prefix > substring) × context
  tier (value-position → functions + same-row columns high, operators suppressed; operator-position →
  operators high). Frequency/recency deferred.
- **Signature help.** When the caret is inside a function's parens, surface its `signature`.

**D21. Fill-handle reference adjustment (I7).** Dragging a formula cell via the cell-selection fill
handle (`cellSelectionFillHandle`), or the Ctrl+D/Ctrl+R fill shortcuts, copies the formula with its
relative references shifted by the source→target positional delta (Excel semantics): `=A1*B1` filled
down becomes `=A2*B2`. Pure engine primitive `offsetFormulaReferences(ast, rowDelta, columnDelta,
context)` (`engine/formulaOffset.ts`) mirrors `buildColumnSelector`/`buildRowSelector`: stable
selectors (`COLUMN("f")`/`ROW(id)`, from relative refs) re-anchor to the field/row at
`position + delta`; positional selectors (`COLUMN_POSITION`/`ROW_POSITION`, from `$`-absolute) never
shift; same-row `fieldRef` and `COLUMN_VALUES` shift only on horizontal fill; overshoot past the last
row/column → positional selector → `#REF!`; underflow past position 1 keeps the original reference
(the 1-based store has no representable position < 1 — the parser rejects `ROW_POSITION(0)`).
_D6-B+ amendment:_ `RANGE_REF` axes: an `ANCHOR` axis copies **verbatim** (the offset is relative
to the owner cell, so moving the formula IS the adjustment — zero arithmetic); a non-`FIXED`
position axis shifts by `max(1, index + delta)` (pure arithmetic, no context lookup; overshoot
clips at resolve time, underflow clamps at 1 and may shrink the window); `FIXED` axes never move.
Adapter
glue `getFilledFormulaSource(apiRef, source, target)` (`gridFormulaFill.ts`) gates on eligibility:
the **target** column must be `allowFormulas` (else the caller copies the evaluated value — a `=…`
string must never land in a plain column), and the **source** must be a live formula
(`getCellFormulaResult(...) !== null`, which also rejects a literal `=text` in a non-formula column;
`getCellFormula` alone is naive). Deltas use the live `gridFormulaA1PositionContextSelector`
(sorted + filtered visible order), so offsets match A1 display, paste adjustment and `ROW_POSITION`.
The adjusted source is fully canonical, so feeding it back through the column's `pastedValueParser`
(`convertA1ToCanonicalPaste`) is a no-op — canonical formulas carry no A1 tokens — so there is no
double-adjustment whether `formulaA1Notation` is on or off. Always-on (no opt-out prop) and built-in
(no public fill callback) per the v1 product decision; wired at every fill site in
`useGridCellSelection.ts` (drag `applyFill` plus the six Ctrl+D/Ctrl+R sites), reusing the existing
`CellValueUpdater` write path so column editability, `valueSetter`, `processRowUpdate` and undo/redo
are unchanged.

**D22. Excel formula export (I8).** When `escapeFormulas: false`, live formula cells export as real
Excel formulas (`cell.value = { formula, result }`) instead of evaluated values; the default
(`escapeFormulas: true`) keeps the prior value-only export and the CSV-injection escaping. Reusing
`escapeFormulas` rather than adding a prop is consistent — that flag already governs whether
`=`-content may be live in the export. Pure engine converter `serializeFormulaAstToExcel(ast,
context)` (`engine/formulaExcel.ts`) walks the canonical AST to an Excel A1 string, mirroring the
serializer's minimal parenthesization. It cannot reuse the A1 display serializer, which renders
positional refs from their literal canonical index and emits the grid's inverted-`$` dialect.
References resolve in two stages: a positional (`$`-absolute) ref → identity via the live
`gridFormulaA1PositionContextSelector` (as `bindFormulaDependencies` resolves it), then identity →
**export** coordinate (export column order → `columnIndexToLetters`; export row index + header-row
offset). Mirrors the grid's relative/absolute distinction: stable → relative (`B2`), positional →
absolute (`$B$2`) — identical computed value, `$` only governs Excel copy/fill. _D6-B+ amendment:_ a
`RANGE_REF` window resolves through `resolveRangeWindow` on the serialize context (adapter resolves
via the shared `resolveFormulaRangeRectangle` with the owner's anchor, then maps corners to export
coordinates); each axis emits `$` exactly when `FIXED`, and `ANCHOR` axes emit relative A1 at their
anchored position — Excel stores relative endpoints as offsets from the formula cell, so exported
anchored windows copy/fill AND sort in Excel like they do in the grid; an empty (fully clipped) or
unresolvable (anchorless/out-of-band → `#REF!`) window makes `getCellExcelFormula` return `null` →
value-only export.
`COLUMN_VALUES` → a
bounded data range (`B2:B<lastDataRow>`, no header); a reference to a cell outside the export bakes
Excel's `#REF!` with the cached result `{ error: '#REF!' }`; engine-only error codes map to the
nearest Excel sentinel (`#CYCLE!`→`#REF!`, `#ERROR!`→`#VALUE!`). Adapter `gridFormulaExcelExport.ts`
builds a per-export layout (`createFormulaExcelExportLayout`, returns `null` when no exported column
is `allowFormulas` → zero overhead) and per-cell `getCellExcelFormula` (gated on
`getCellFormulaResult(...) !== null`). Wired in `serializeRowUnsafe` (additive — the existing value
path is the fallback) and applied in `addSerializedRowToWorksheet`, the single cell-writer shared by
the sync and web-worker paths, so the descriptor is computed on the main thread (where `apiRef`
lives) and travels in `SerializedRow.formulas` to the worker. The worker forces `includeHeaders:
true` and reads raw `includeColumnGroupsHeaders`, so its layout matches the sheet it writes. Parsing
reuses the grid's interning parser (`apiRef.current.caches.formula.parser`) so export is all cache
hits; date-valued results get the same local→UTC reconstruction as the plain date path (the sheet is
timezone-naive). _Limitations:_ header rows injected by `exceljsPreProcess` shift the baked A1 row
numbers; and `COLUMN_VALUES`/`RANGE_REF` emit a single contiguous A1 range over all exported rows, but
the cached aggregate covers data rows only (the position context excludes group/pinned rows) — when
the export interleaves group/pinned rows, a contiguous range cannot express the data-only set, so a
manual Excel recalc may diverge (the cached result stays correct), consistent with the
non-Excel-function recalc caveat.

**D23. Reference highlighting (Sheets-style visual cues).** While editing, each distinct reference is
colored in the editor and the cells it points to are outlined in the grid with a matching dashed
rectangle, in both the canonical and A1 dialects. **One shared model, two render halves** coupled
only by the model so colors can never disagree. The model is built in two layers mirroring the
`extractFormulaDependencies`/`bindFormulaDependencies` split: a pure engine producer
`buildFormulaReferences` (`engine/formulaReferences.ts`) emits dialect-agnostic `{ spans, node }[]` —
the A1 branch (`scanA1References`) is forked from the `toCanonicalFormula` scan loop and **shares its
tokenization primitives** (exported from `formulaA1.ts`) so highlight and commit can never disagree
about what is a reference, recording A1-source spans directly because `toCanonicalFormula` stamps
`ZERO_SPAN`; the canonical branch walks the parsed AST node spans. The grid adapter
`gridFormulaReferenceHighlights.ts` resolves each node against `gridFormulaA1PositionContextSelector`
to a currently-visible target (hidden column / filtered row / out-of-bounds / self-reference →
`unresolved`, no color, no rectangle), keys color on resolved identity (`createFormulaCellKey`;
ranges by corner pair), and cycles a shared palette. Exposes
`resolveFormulaRangeRectangle`/`FormulaRangeRectangle` from the engine barrel (additive). **Half A**
(`GridFormulaEditor`) is a **single-layer `contenteditable`** (AG Grid's approach) whose children _are_
the colored reference-token `<span>`s — so the caret, the native (colored) text selection, and the
colors share one element and there is nothing to keep aligned. It replaced the earlier dual-layer
editor (a transparent native `<input>` + an `aria-hidden` colored mirror `<div>` painted behind it):
keeping two text layers pixel-aligned across fonts/zoom/sub-pixel-rounding/DPR was structurally fragile
(it needed `letter-spacing`/ligature pinning for ~0.13px/char horizontal drift, an opaque `::selection`
that iOS Safari ignores entirely, and a measured `translateY` for a ~0.5px Retina vertical offset).
The single layer makes all of that inherent. The editable has **no React-controlled children**; they
are rebuilt imperatively in a `useEnhancedEffect` keyed on the memoized segments
(`buildFormulaTextSegments` + `renderSegments`), so React never fights the caret. The cost of
`contenteditable` is handled explicitly in a small pure-DOM module `formulaEditorCaret.ts`: caret
save/restore around every rebuild via the Selection/Range API (`getCaretOffset` measures the offset
with a range to `root.textContent`; `setCaretOffset` walks the text nodes — preserved on typing,
parked at the end on entry/seeding); `normalizeSingleLine` strips `\r\n`; an IME-composition guard
(`compositionstart` defers the rebuild, `compositionend` commits once) so DOM mutation never aborts a
composition; and an explicit `paste` handler (`contenteditable="true"`, **not** `plaintext-only` —
Firefox added that only in 136, below the FF 121 floor — inserting `text/plain` via
`execCommand('insertText')` with a Range-insert fallback). Enter `preventDefault`s the newline but keeps
propagating so the grid still commits; the autocomplete popup markup moved into this one component
(the listbox a11y is hand-rolled, dropping the `useAutocomplete` dependency), and
`disableFormulaAutocomplete`/`dataSource` render the same editor with coloring on and the popup off
(no separate plain-`<input>` fallback). The editor writes `textContent` back with no debounce
(`setEditCellValue({ unstable_skipValueParser: true })`), so the commit/`valueParser`/`valueSetter`
A1→canonical path is unchanged. In-editor undo is out of scope (single-line; row-level undo via the
commit path is unaffected). The editor replaces `GridEditInputCell`; since D24 it renders as an
in-cell anchor plus a floating surface that overlays the cell and grows with the formula (it was
inline in the cell before that). The editable is `text-align: start`, so a formula in a right-aligned
(`type: 'number'`) column reads from the start edge (left/RTL-right) like a string rather than being
flung to the far edge from the caret. The rebuild skips entirely on a no-op recolor (identical segments)
and preserves the full selection (both edges) across a recolor that does change the spans, snapping the
caret to the end only on the initial source seeding (and the focus effect collapses a stray select-all to
the end on entry). _The floating grow-with-content surface shipped as D24 (after two popper-based
prototypes were discarded — see D24 for the post-mortem)._ _Known minor caret
follow-up: a backward (anchor-after-focus) selection is re-applied forward after a recolor._
**Half B** (`GridFormulaReferenceOverlay`) is a `pointer-events:none`
overlay component mounted as a `GridRoot` child in `DataGridPremium.tsx` (sibling of
`GridMultiSelectMeasurer`, **no core change**) that **portals its DOM into `virtualScrollerRef.current`**
and positions each dashed rect in _content_ coordinates (`gridColumnPositionsSelector` for the left,
`topContainerHeight + rowsMeta.positions` for the top). Living inside the scroller, native scrolling
moves the rects in lockstep with the cells — **no scroll listener, no rAF, no lag** (the first attempt
was a viewport-fixed overlay repositioned on `scrollPositionChange`, which lagged the cells one frame;
content-space scrolling fixes it). It re-renders only on geometry changes (resize / reorder /
visibility / sort / filter) via its `useGridSelector` subscriptions, never on scroll, and sits in the
scroller's `z=0` layer so the sticky header (`z=40`) and pinned columns (`z=30`) paint over a rect
scrolled underneath them while it paints over normal cells. One rect per distinct target; survives the
editing cell being virtualized out (reads `gridEditCellStateSelector`, not the editor). Activation is grid state (`formula.activeEdit`,
set by the editor when it renders, cleared on `cellEditStop`), so a custom `renderEditCell`
gets no highlighting (it never reaches our editor) — the clean gate the prerequisite editor-routing fix
enables. The shared palette is CSS variables (`--DataGrid-formulaRefColor-*`, with a dark variant via
`applyStyles`) so both the editor tokens and the overlay rects map a `colorIndex` to one hue and a
theme can recolor; under forced-colors the system overrides the token `color` (the token text stays
readable — color is decorative) and the overlay hides itself. _Limitations
(fast-follow):_ a reference targeting a **pinned column** draws no rectangle (sticky sub-layers +
pin-seam straddle deferred); RTL non-pinned offsets ship but are browser-verified later; an off-screen
reference (scrolled away, on another page, or in a collapsed tree/group) still colors the editor token
but renders no rectangle, and a range straddling the current page is culled rather than partially
drawn (the position context ignores pagination/expansion while the overlay outlines only rendered
rows — the edge chip is the proper fast-follow); canonical mode colors the whole
`REF(...)`/`RANGE_REF(...)` chunk (inner-identity coloring deferred); a canonical form typed in A1 mode is
not scanned; and the in-grid overlay is disabled under the experimental
`experimentalFeatures.virtualizerLayoutMode: 'controlled'` (it is portaled into the scroller and
relies on the default native-scroll layout — the editor's coloring still works). The single-layer
`contenteditable` editor makes the text selection native and colored on every target **including iOS
Safari** (which ignores `::selection`), removing the dual-layer's iOS-selection limitation entirely.
**Prerequisite:** the I2 editing routing now respects a user `renderEditCell` even for
`=` values (built-in-renderer detection by identity, custom-editor-wins routing, canonical source
seeding for custom editors) — independently valuable and the gate the highlighting relies on.
_Scroll-safety addendum (PR review, comment `r3545780044`):_ wheel-scrolling away from the editing
cell used to snap the viewport back to it in a jitter loop. Root cause (verified with an instrumented
headed-Chrome reproduction): the grid keeps the focused/edited row mounted as a zero-size
"virtual focus row", but the selector deciding that (`gridFocusedVirtualCellSelector`) reads the
render context from grid state, which is synced from the virtualizer's own store one commit late
(`useStoreEffect` in `useGridVirtualizer.tsx`) — so on the scroll tick where the edited row leaves the
render window it unmounts for a commit and then remounts, and the editor's focus-restore effect
called `focus()` whose default scroll-into-view yanked the viewport back. Fix in the editor:
(1) `root.focus({ preventScroll: true })` (the `GridEditLongTextCell` defense — typing while scrolled
away still recalls the viewport via the browser's native caret reveal, matching Excel/Sheets);
(2) a **live session mirror** (`caches.formula.editorSession`: engaged flag + caret offset) written by
the focused editor on every interaction (input/keyup/mouseup/accept) and consumed on mount, so a
remounted editor resumes mid-edit instead of snapping the caret to the end — it must be a
continuously-written mirror, not an unmount-time capture, because the replacement instance can mount
before the old one unmounts and StrictMode runs synthetic cleanups. Clearing: `cellEditStop` clears it
immediately on the common cell-mode path, and a `cellModesModelChange`/`rowModesModelChange` prune
(drop the mirror when its cell is no longer in edit mode) is the authoritative clear — adversarial
review found `cellEditStop` alone insufficient (row edit mode and programmatic/controlled stops never
publish it, and with an async `processRowUpdate` the commit key's `keyup` re-writes the mirror after
the `cellEditStop` clear while the editor is still mounted and focused).
Residual gaps until the core tear is fixed (filed separately — the stock inline editors
`GridEditInputCell`/date/boolean/singleSelect have the same unguarded `focus()` and reproduce the
same jitter): keystrokes landing in the one-frame focus gap of a tear remount go to `<body>`, an IME
composition in flight aborts, and the `showFormulaInput` mount decision re-evaluates (a plain-cell
edit whose typed `=` was deleted can swap editors after a remount — cosmetic, self-heals).

**D24. Grow-with-content floating editor (I9) — longText-style surface with static geometry.**
The reviewer ask (#22807 review 4503329712): edit formulas in a popup that grows with the value, like
the `longText` column type. **Post-mortem first:** two popper-based attempts were discarded after live
testing — MUI Popper positions a row-portaled popup with an asynchronous post-paint `translate3d`, so
on every (re)mount the surface painted at the row's origin (visually, "the cells before the target")
until the transform landed; virtualization remounts re-flashed it, and the prototype's max-width
re-measure on `scrollPositionChange` resized the box mid-scroll. The lesson is structural: **no
positioning engine may own the surface's geometry.** The shipped design: `GridFormulaEditor` splits
into an in-cell **anchor** (live ellipsized draft, `aria-controls`/`aria-expanded`, row-edit
`tabIndex`) and a **surface** — a plain `div` portaled with `createPortal` into the row element. The
row is `position: relative` and spans the full content width, so the surface's geometry is pure grid
state applied as first-paint CSS: `insetInlineStart` from `gridColumnPositionsSelector` (the same
coordinate the row lays its cells out with, so the overlay is exact by construction, and column
resize mid-edit self-corrects through the selector), block position from
`gridRowsMetaSelector.positions` + `topContainerHeight` (the reference overlay's own coordinate
recipe, reactive to sort/row-height changes), and an opaque `background.base` so covered cells and
reference rectangles cannot bleed through. Nothing repositions asynchronously, ever: native scrolling
moves the surface with the rows, and a remounted surface paints at the correct position on its first
frame. **Portal target is the virtual SCROLLER, not the row** (Bilal's collision find): the render
zone carries an inline `translate3d` and is therefore a stacking context, so a row-portaled
surface's z-index can never beat the reference-highlight overlay — a later scroller child with
`z: auto` that paints above the whole render zone in DOM order, drawing dashed rectangles across the
editor. At scroller level the surface uses **`z-index: 30`** — above the render zone and the overlay
(both `z: auto`), below the sticky top/bottom containers (z 40: headers and pinned rows must keep
covering content scrolled beneath them; this also preserves the pre-existing surface-under-header
behavior). The scroller is a positioned scroll container, so a child absolutely positioned in
content coordinates scrolls natively with the rows — the static-geometry invariant is unchanged.
Pinned ROWS keep the row portal (their sticky containers sit at z 40 above the overlay already, and
they have no content-space position); pinned-COLUMN anchors measure their inline start into the
portal target's coordinate space (content space incl. `scrollLeft` in scroller mode). Pinned by a
browser regression test (`elementFromPoint` over a highlight rectangle the surface grew over →
resolves to the surface). **Width is a grow-only ratchet snapped to column gridlines** (locked decision):
minimum = column width + 1px (borders on the gridlines, interior and 10px text padding flush with the
cell — no jump on entry); when the single line overflows (`scrollWidth > clientWidth`, checked in the
rebuild layout effect that every text change flows through), the inline-end border steps to the next
column boundary (`computeSnappedWidth`) so growth reads as "the editor now covers the next cell" and
the border never moves per keystroke; it **never shrinks mid-edit** (deletions leave the box); the
ratchet rides in the `editorSession` mirror (`surfaceWidth`) so a virtualization remount reproduces
the identical box. The growth bound is measured once at open (`ensureClamp`: scroller rect minus the
surface's start edge, `rightPinnedWidth`, and the vertical scrollbar, RTL-mirrored) and re-measured
only on `gridDimensionsSelector` changes — **never on scroll**. At the clamp the line scrolls
internally with the browser keeping the caret visible (locked: A1; wrap-and-grow-down is the
fast-follow). **Open/close** = `hasFocus && anchor` (longText's row-edit gate: one open surface at a
time; unfocused formula cells show their live draft in the anchor; Tab-away/back remounts the
editable with the caret at the end). **Hidden state:** when the edited row leaves the render window,
the grid renders it as the zero-size virtual-focus row with `opacity: 0` — the surface inherits the
invisibility with focus preserved, for free; the editor additionally mirrors the virtualizer's
out-of-range predicate (row index vs `gridRenderContextSelector`) to set `pointer-events: none`, so
the invisible box cannot swallow clicks aimed at real cells. **Focus containment:** the portal keeps
the React tree, so keydown/mousedown inside the surface bubble to the cell (Enter/Tab/Escape and the
`cellMouseDown`/`lastClickedCell` outside-click protection are unchanged); the one DOM-level gap —
`useGridFocus.handleDocumentClick` compares the document-mouseup target against the _cell element_,
which no longer contains the editor — is closed with a formula-feature **`canUpdateFocus` pipe
processor** that vetoes focus updates for events landing inside
`.MuiDataGrid-formulaEditorSurface` (without it, a mouseup with no recorded cell mousedown — for
example a drag released over the editor — cleared the focus and stopped the edit mid-typing; pinned
by a jsdom regression test). Clicking the surface chrome outside the editable `preventDefault`s the mousedown so
the caret survives. **Accepted edge (locked decision):** a pinned formula column edited during a
horizontal scroll lets the surface glide away from the stuck cell until scrolled back (self-healing —
pinned cells are sticky/viewport-coupled while the surface is content-space; an event-driven position
sync remains a possible later polish). a11y: the surface is `role="dialog"` labeled with the column
header; the editable carries the same `aria-label`. No public API change; the only type change is the
private `editorSession.surfaceWidth`/`surfaceClamp`.
_Adversarial-review hardening (72-agent workflow, 2026-07-16/17):_ (1) entry/session-resume is
strictly **once per mount** (`enteredRef`) — the effect's callbacks re-key on `computedWidth`, and
without the guard a mid-edit column resize re-ran the resume on a live editor (selection collapse,
caret snap, IME abort); (2) the **clamp is measured once per edit session** and persisted in the
session mirror (`surfaceClamp`) — every later re-measure (grid-resize effect, remount restore) was
scroll-skewed and could shrink the box, so those paths were removed and the width restores verbatim;
(3) `showPopup` is gated on the hidden-state predicate (the body-portaled popup inherits neither the
row's `opacity: 0` nor the surface's `pointer-events: none`); (4) the `canUpdateFocus` veto is scoped
to this grid's own root element (multi-grid pages); (5) a **pinned** formula column's surface takes
its inline start from the sticky cell's measured rect (pre-paint, once) — content-space
`columnPositions` diverges from a stuck cell's visual position; (6) programmatic caret placement gets
an explicit reveal (`scrollCaretIntoView` — range-rect delta, direction-agnostic) after entry/resume,
since only native typing auto-reveals the caret; without it, entering a formula longer than the box
left the caret invisible past the internal scroll (Bilal's live find). _Accepted/known:_ the
row-child `role="dialog"` + attribute-carrying role-less anchor mirrors `GridEditLongTextCell`'s
shipped structure (longText parity, pinned by core a11y tests) — not diverged from premium-side; the
`rowIndex === lastRowIndex` one-row band where the virtualizer renders neither the real row nor the
zero-size keep-alive unmounts ANY editor (pre-existing core gap, same bucket as the render-context
tear; the session mirror recovers the formula editor on remount). _At-the-clamp behavior (A1, single line + inner horizontal scroll) was superseded by the wrap-down
upgrade — see D27._

**D25. Live column drag-resize sync (overlay rects + editor surface) and edit survival.** During a
column drag-resize the grid bypasses React per mousemove — `useGridColumnResize.updateWidth` mutates
cell `--width` vars, pinned offsets, `--DataGrid-rowWidth`, and the colDef object **in place**; state
commits only at pointer-up (`setColumnWidth`). So `gridColumnPositionsSelector` (both formula
surfaces' geometry source) is stale for the whole gesture and the reference rectangles and the
floating surface froze while cells moved. Fix mirrors the one
in-repo precedent for separate DOM tracking a live drag, `GridSkeletonLoadingOverlay`:
per-`columnResize`-event **imperative style writes derived from the event's `{colDef, width}` as a
delta against committed state** — never from the in-place-mutated colDefs (no repo precedent reads
those; an equivalent "re-sum mutated `computedWidth`" option was rejected for that reason). Mechanics
(`gridFormulaLiveGeometry.ts`): capture `{field, columnIndex, startWidth}` at `columnResizeStart`
(fires before the first mutation, so `computedWidth` is still committed); per `columnResize` event
`delta = width − startWidth`; clear at `columnResizeStop`. The overlay re-runs its existing
`computeOverlayRects` with delta-shifted positions (`applyResizeDeltaToPositions`) plus a one-field
width override and writes transform/width/height onto the rect nodes via a keyed ref map. The surface
shifts `insetInlineStart` by the delta when a column before the anchor is resized, re-runs the
pinned-cell measurement (live rect) for pinned anchors, and tracks
`max(ratchet, width + 1)` when the editing column itself is resized; the suggestion popup closes on
`columnResizeStart` (column-menu precedent — the body-portaled popper can't track an imperatively
moved anchor). Convergence needs no `columnResizeStop` bookkeeping: the last event's geometry equals
the committed geometry, and the pointer-up state commit re-renders canonical styles (flex
re-hydration included). **Edit survival:** the resize-ending document mouseup used to land outside
any cell → stock focus clear → the draft force-committed mid-formula. The separator's own mousedown
`preventDefault()`s (DOM focus never leaves the editable), so a second `canUpdateFocus` veto branch
is all it takes for the edit to continue seamlessly (Sheets/Excel behavior). The veto keys on
`gridResizingColumnFieldSelector` — NOT on the mouseup target: the drag has no pointer capture, so
the release often lands off the ~10px separator strip (vertical drift below the header, overshoot
past the min/max-width clamp, release outside the grid); the field is set at `columnResizeStart` and
cleared only in the post-mouseup `columnResizeStop` timeout, so it reliably covers every release
point (adversarial-review High). A separator-target fallback covers a no-drag separator click,
scoped by nearest-grid-root so a nested (detail-panel) grid's separator stays an outside click. The
gate checks the active-edit cell's actual `getCellMode === 'edit'`, not just `formula.activeEdit` —
that flag is only cleared by `cellEditStop`, which row edit mode and programmatic stops never
publish (review Medium). Plain (non-formula) edits keep stock semantics (changing those is a core
decision). The overlay's render-time rect derivation is also resize-session-aware (latest event
width kept in a ref): a mid-drag React re-render (for example a dynamic-row-height remeasure changing
`rowsMeta`) would otherwise rewrite the rects' single `transform` string from stale committed
positions over the imperative live styles; the session clears on the matching `columnWidthChange`
(published synchronously at commit, before the committed re-render) so the commit render derives
from pure committed state with no double-shift. _Accepted/known:_ an edit OPENED mid-drag (keyboard
edit start while holding the separator) captures no session and renders committed geometry until
pointer-up (self-healing, exotic gesture); `placePinnedSurface` still writes the pre-`2dfe6b050a`
`inlineStart − 1` while the non-pinned scheme dropped its −1 — flagged to Bilal (his pixel
experiment), not changed here. Non-issues verified: autosize, column reorder, pinning, and grid
resize all commit through state and re-render correctly; touch resize emits the same `columnResize`
stream. Tests: mid-drag geometry is browser-only (3 chromium tests, proven non-vacuous by stashing
the handlers); the focus veto is jsdom-pinned three ways (formula edit survives an on-separator
release AND an off-separator release; plain edit still stops).

**D26. Built-in formula bar (`FormulaBar`) and docs restructure (2026-07-19).** The formula bar was
originally planned as a userland docs recipe (D18), but a faithful Excel/Sheets bar would have
required ~5 public API additions (promoting the formula API, a canonical→A1 option, a draft
evaluation API, exporting the editor core, overlay plumbing) just to reassemble what the product
can do internally — so it shipped built-in (Bilal's decision, along with keeping the formula API
private). Architecture: **the bar is a permanently open formula editor for the focused cell**, not
an auto-started cell edit. Active cell tracked via `cellFocusIn` (fires on click and keyboard nav)
and retained across `cellFocusOut`. Three modes: display (canonical source, A1 display via
`convertCanonicalToA1Display` when `formulaA1Notation`, plain values otherwise, read-only for
non-editable cells); **view-mode draft** — local text, reference coloring via the shared editable,
in-grid outlines via a new optional `draft` on `formula.activeEdit` (the reference-model hook
resolves `valueOverride ?? activeEdit.draft ?? editCellState.value`; `setFormulaActiveEdit`'s
equality guard now compares `draft`), a ~150 ms-debounced result preview via
`previewFormulaResult`, and **nothing committed while typing**; **edit-mode mirror** — two-way sync
with the live edit session via `setEditCellValue` (safe: the A1 seed comparison is by string value,
and the cell editor's rebuild preserves the caret on external writes), read-only in row edit mode.
Enter commits + moves focus below, Tab right, blur/cell-change commits the dirty draft (Excel
Enter-mode), Escape is the only discard; the bar moves DOM focus itself (`focusElement` on the
target cell — `setCellFocus` never moves DOM focus to a different cell, and `GridCell`'s steal is
vetoed while the bar holds focus). **Commit path:** a programmatic one-cell paste — publish
`clipboardPasteStart` (re-arms the A1 paste origin → zero offset), `CellValueUpdater.updateCell` +
`applyUpdates` (wrapped `pastedValueParser` freezes A1, `valueSetter`, editability checks,
`processRowUpdate`, and via `clipboardPasteEnd` a single undo step). Accepted: bar commits are
observable as paste events, and the pre-existing paste/fill history race (a validation event firing
between the history push and the 50 ms-batched row flush drops the undo item) applies to the bar
too. **Preview evaluation** (`gridFormulaPreview.ts`): read-only resolver — formula deps from the
committed lookup, raw deps via `getRowValue`, live UI position context; self-reference detection
goes through dependency binding so `SUM(COLUMN_VALUES(ownField))`/interval coverage of the own cell
report `#CYCLE!` like the committed pass would (the evaluator alone would read the committed value
and preview a plausible-but-wrong number); uses `parseFormula`, deliberately NOT the interning
parser (a transient draft per keystroke would grow the intern map); writes nothing (pinned by
test). **Focus survival:** an instance-scoped registry of bar root elements on `caches.formula`
(`gridFormulaBarElements.ts`) — a bar may be portaled anywhere (`createPortal`), so root
containment cannot scope it; the `canUpdateFocus` processor vetoes for registered bars, community
`GridCell.tsx`'s view-mode focus-steal effect now consults the pipe with a pseudo-event
`{ target: activeElement }` (the one community behavioral change), and the floating editor's entry
effect skips focus/caret when a registered bar owns the focus (visual session restore still runs).
**Editable core extraction:** `GridFormulaEditable.tsx` (internal, controlled: `value`,
`onValueChange`, `onCommitKey`/`onCancelKey`, `onAfterRebuild`, `onInteraction`, imperative handle
with caret/engaged/closeSuggestions) now owns the contenteditable + rebuild/caret + IME/paste +
suggestion popup; `GridFormulaEditorFloating` keeps geometry/session and adapts edit state.
Extraction gotcha: a CHILD's layout effect runs before the PARENT's host refs attach, so the
first (seed) rebuild found `surfaceRef` null and the entry growth was lost — fixed with a
mount-time `growToFit` in the floating editor (grow-only, idempotent). **Wiring:**
`slotProps.toolbar.formulaBar` renders the bar below the default toolbar row (a sibling strip —
the v8 toolbar is a single-row flex); `FormulaBar` exported from the premium barrel;
`gridClasses.formulaBar`; `formulaBarLabel`/`formulaBarInputLabel`/`formulaBarAddressLabel` locale
keys; `formulaBar?: boolean` declared directly on community `GridToolbarProps` (the
`showHistoryControls` precedent — premium module augmentation of the internals-imported interface
does not resolve); `focusElement` exported from community internals; component API page registered
in `scripts/buildApiDocs/gridSettings`. **Docs restructure:** `formulas.md` split into Overview
(`/formulas`, all demos + the new Formula bar section), Syntax reference (`/formula-syntax`:
operators/refs/ranges/functions/errors + A1), and Formula engine (`/formula-engine`: How it works +
custom functions + selectors) under a `formulas-group` nav (pivoting-group pattern), plus a
`components/formula-bar` page. A planned Recipes page is deferred until a real recipe exists.

**D27. Vertical growth: wrap and grow by lines at the width clamp (I11).** Review ask (#22807 comment
5022417224, @noraleonte): let the editor grow both horizontally _and_ vertically, so the whole formula
stays visible instead of overflowing. Supersedes D24's "A1" at-the-clamp behavior (one line + inner
horizontal scroll). **Two-phase growth:** the width ratchet is unchanged (snapped to gridlines,
clamped at the viewport's visible inline-end edge, no readability soft-cap — wrapping earlier would
only make the box taller and hide more rows); when it reaches that clamp and the line still overflows,
`enterWrapMode` flips the editable to `white-space: pre-wrap; overflow-wrap: anywhere; overflow-y:
auto` and the same grow-only discipline takes over the block axis. This matches the convention:
OnlyOffice, Handsontable, Univer, Luckysheet and Sheets all grow horizontally first and wrap at the
viewport; a horizontal clamp that then scrolls horizontally (A1) had no precedent in an 11-product
survey. **The first line never moves:** the surface switches to `align-items: stretch` and the
editable takes `padding-block: (rowBox − borders − lineHeight) / 2`, reproducing the centring
`align-items: center` gave it at one line — so a one-line box is pixel-identical to before and every
new line extends the box away from the text already on screen. **Bounded at 5 lines**
(`FORMULA_EDITOR_MAX_WRAPPED_LINES`; ~400–600 characters, about two extra rows occluded), then the
wrapped text scrolls internally — unbounded growth is the one thing Sheets is actively criticized for,
and Microsoft's own patent (US20060224947A1) caps at 3–5 lines for the same reason. **Height is
grow-only**, like the width: at a wrap boundary a single keystroke would otherwise toggle the box
between N and N+1 lines. **Flip for a row with no room below:** the bound and the growth direction are
decided together, once, at the moment the surface first wraps — the same measure-once rule as
`ensureClamp`, and for the same reason (the surface lives in content space, so any later measurement
is scroll-skewed). A row that cannot gain a second line below it (`below < rowBox + 2 × lineHeight`,
that is, the last rows of the grid) welds its block-END to the row and grows upward instead; the choice is
invisible until the box is actually taller than the row, so nothing flips mid-edit. The band stops at
the sticky containers' inner edges (they are z 40, the surface z 30). _Growing up is a deliberate
divergence:_ no spreadsheet does it — but none has a finite last row, and capping-and-scrolling there
would leave exactly the case the review named unfixed. **Escaping the grid's bounds was rejected:**
`.MuiDataGrid-main` and `.MuiDataGrid-root` are both `overflow: hidden`, so it needs a portal outside
the root — viewport-fixed coordinates and scroll-synced repositioning, the architecture D24 was
built to avoid. **Reference tokens wrap only at natural break opportunities** (`overflow-wrap:
normal` on `.MuiDataGrid-formulaReferenceToken`): a canonical `REF(...)` may wrap at its internal
space, while its shared color keeps the reference's identity clear across lines; identifiers are
never split arbitrarily mid-word. A token with no natural break opportunity that is wider than the
whole box is left to overflow, which is why the wrapped editable keeps `overflow-x: auto`. **The
bounds follow a grid resize** (Bilal's find): both clamps bound the grid's visible box, so a grid
resized smaller has to pull the editor in with it — left alone, a grown box keeps a width that no
longer exists, spills past the grid's edge and inflates the scroller's scrollable width, which reads
as the grid itself getting wider (measured: narrowing a 600px grid to 380px left `scrollWidth` at 598
against a `clientWidth` of 378). The bounds are shifted by the **delta of `viewportInnerSize`**, never
re-measured: the surface sits in content space, so re-measuring the available room would fold in
however far the user has scrolled since, and could shrink the box for a reason unrelated to the resize
— the wobble that had D24's original re-clamp effect deleted. Delta-shifting is the same technique the
live column-resize sync (D25) uses for positions. This is not a violation of the grow-only ratchets:
those keep the box steady as the _content_ changes; the container is a different matter, and it is
symmetric — `surfaceWidthHighWater`/`surfaceHeightHighWater` record the largest box the content ever
asked for, so a grid widened back to its old size restores the box exactly instead of leaving it
cramped until the next keystroke. A width change additionally **re-derives** the height from scratch
(collapsing the box first, so the measurement reads the content and not the box): how many lines a
formula needs is a function of how wide the box is. Pinned rows sit in the sticky containers, whose
block box does not follow the viewport, so their height is left alone.
**Supporting changes:** `scrollCaretIntoView` gained a block-axis branch (no
margin — the visible box can be one line tall); the suggestion popup gets an explicit
`popperRef.forceUpdate()` after every rebuild, since popper.js observes scroll and window resize only,
never the anchor's own size; `editorSession` carries `surfaceWrapped`/`surfaceHeight`/
`surfaceHeightClamp`/`surfaceFlipped`/`surfaceWidthHighWater`/`surfaceHeightHighWater`/
`surfaceClampBasis`, and a remount replays `applyWrapStyles` (never `enterWrapMode`)
so the direction and bound are not re-decided. Caret offsets are string-based, so wrapping needed no
change to the caret/IME/paste machinery, and the value stays single-line (Enter still commits,
`aria-multiline` stays `false`). No public API change. _Two claims in D24's superseded A2 analysis were
wrong and are corrected here:_ a taller surface does **not** disturb the grid's scrollbar (the native
scroller's bars are hidden and `GridVirtualScrollbar`'s range comes from `dimensions.minimumSize`, not
`scrollHeight`), and `GridEditLongTextCell` is **not** a flip precedent — measured in Chromium, its
Popper `flip` never fires against the grid (its clipping boundary resolves against the window) and its
uncapped popup is simply clipped at the scroller's bottom edge, so a long value edited in the last row
shows about one row of text. That is the same gap this decision closes for the formula editor; worth a
separate core issue.

**D28. The completion analysis reads the dialect the editor is showing (I12).** Reported by Bilal on
#22807: with the caret at the end of a finished `=ROUND(AVERAGE(B5:D5))`, the popup still offered
`AVERAGE(value1, value2, …)` — signature help for a call that was closed two characters earlier.
**Root cause:** `getFormulaCompletionContext` tokenized A1 editor text with the canonical
tokenizer, which knows neither `:` nor `$` and stopped at the first one. The two closing
parentheses were never tokenized, so the enclosing-call stack never popped and reported `AVERAGE`
for every caret from the colon to the end of the line. The reported symptom was the mild half:
the same truncation left `expectOperator` reading a stale token, which suppressed the dropdown
entirely for the second half of every range being typed (`=SUM(A1:D` offered nothing), got
`argIndex` wrong across range arguments, and masked the unterminated-string guard behind the
colon's error. It is the mistake D26's syntax mask had already named — _do not reuse
`tokenizeFormula` on editor text_ — left unfixed one module over.
**Fix:** two opt-in `TokenizeFormulaOptions`, both off by default so the parser's tokenization is
unchanged byte for byte. `a1Notation` recognizes `$A$1`, `A1:B2` and `A:A` as single `reference`
tokens, and `:` as punctuation; `tolerant` never aborts — an unexpected character becomes an
`unknown` token and an unterminated string a flagged `string` token, so a stray character can no
longer blind everything after it. Completion passes both; nothing else passes either. The A1 scan
primitives moved to a leaf `engine/formulaA1Tokens.ts` (`formulaA1.ts` imports the parser, which
imports the tokenizer — a cycle otherwise), which also makes the sharing explicit: the commit
transform, the reference highlighter and now the completion tokenizer all read a reference the
same way, so what is colored, what is rewritten and what completion counts as one operand cannot
drift apart. **Signature help for a complete call is kept** while the caret is inside it
(`AVERAGE(B5:D5|)` → AVERAGE, `AVERAGE(B5:D5)|` → ROUND, past the last `)` → nothing): editing an
argument of a finished call is ordinary, and both Excel and Sheets help there. **Two refinements**
the correct token stream makes cheap: after a dangling range operator only column letters are
offered (`expectReference` — nothing else can close a range; Excel and Sheets offer nothing at all
there), and a caret parked strictly inside a complete reference offers nothing (`insideReference`
— the reference is whole, and the full function list was pure noise). Neither can fire while
typing left to right; both need a deliberate caret placement. No public API change.

**D29. The feature is injectable — the grid bundles seams, not the runtime (I13).** Prompted by
Andrew's bundle-size review of #22807 (+109KB parsed / +32.5KB gzip on the premium entry): every
guard in the feature was a runtime early-return inside an always-called hook, so even
`disableFormulas` grids parsed the whole ~11.5k-LOC runtime — the props-defaults module alone
dragged in the full engine through `GRID_FORMULA_FUNCTIONS`. The runtime now ships as a
`formulaFeature` object from the `@mui/x-data-grid-premium/formula` entry point (the existing
`"./*": "./src/*/index.ts"` export pattern — `src/formula/index.ts` is the whole subpath), passed
through the new `featureDependencies` prop and captured on the **first render** (the object carries
hooks, so its presence must not change; a dev warning fires if it does, and the change is ignored).
The `GridFormulaFeature` interface (`models/gridFeatureDependencies.ts`, type-only for the grid)
has seven members mapped to the load-bearing seams: `stateInitializer` /`usePreProcessors`/
`useFeature` fill the three order-critical slots in `useDataGridPremiumComponent` (noop fallbacks
otherwise — the absent-state initializer still writes `formula: { lookup: {}, activeEdit: null }`
so the bundled selectors read an empty slice, never `undefined`); `useColumnHeaderAdornment` rides
the existing `GridConfiguration.hooks` slot through a thin rootProps-reading passthrough;
`ReferenceOverlay` and `FormulaBar` are conditionally rendered by `DataGridPremium`/
`GridPremiumToolbar`; `transformProps` carries the A1 pinning override out of
`useDataGridPremiumProps`. The `formulaFunctions` default also moved into the feature
(`getEffectiveFormulaFunctions`: prop ?? built-ins, `{}` under `dataSource`) — the prop is now
optional on the processed props, which incidentally fixes the explicit-`undefined` crash. The
value seams (cell-selection fill, Excel export layout + per-cell formulas) became **optional
private API methods** (`getFilledFormulaSource`, `createFormulaExcelExportLayout`,
`getCellExcelFormula`) registered by `useGridFormula` and consumed via `?.()` with the existing
value fallbacks — `GridPrivateApiPremium` includes `Partial<GridFormulaPrivateApi>`, and
`GridApiCaches.formula` is optional (feature code asserts `!`; it only runs when installed). The
Excel worker needed no seam at all: rows are serialized on the main thread in both paths, the
worker only consumes the plain `SerializedRow.formulas` data. Public-API move: `FormulaBar`,
`GRID_FORMULA_FUNCTIONS` and the three selectors left the root barrel for `/formula`; the types
stayed on the root. Without the feature, `=` values render as raw strings (the `disableFormulas`
path) and a dev-only `warnOnce` (`useGridMissingFormulaFeatureWarning`, bundled, zero formula
imports) fires when formula-ish props are used. `disableFormulas` keeps its meaning as the
_runtime_ toggle when the feature is installed.

**Invariant (all iterations): formula source lives only in row data; every cache and state slice is
derived.** This is what keeps undo/redo, `processRowUpdate`, and controlled-rows scenarios working
for free. Never introduce non-row-data formula source state.
