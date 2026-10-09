# Data Grid density overrides — scope and porting log

Companion to `unstable_enhanceDensity` (`packages/x-data-grid*/src/density/`). The checklist below lists the components whose static size/spacing the enhancers port, with the decision per line; the fix log records what broke under the Material UI density chain and how each was fixed.

Derived by reading every non-deprecated component's styled bodies and their JS consumers on this branch. A line is **KEEP** when a theme `styleOverrides` change of that property is plain CSS with no JS reading or producing the value, and it affects density (padding, margin, gap, control/icon/item sizes). **DYNAMIC → defaultProps** lines are density-relevant but JS-owned (row/header/item heights fed to a virtualizer, prop-driven vars) — the enhancer must set them through `defaultProps`, never CSS. Everything else (layout fills, popover widths, overlays, fillers, skeletons, handles, SVG geometry, JS-set vars) is listed in the appendix with its reason.

Totals: **80 components in scope** (168 KEEP lines, 5 DYNAMIC → defaultProps lines), 40 components excluded.

## Fixes uncovered (chain-only breakage, fixed in the grid enhancer)

- toolbar icons 20→14px. grid hardcodes `fontSize="small"`, material maps small→`iconSize-2`. fix: slot `& svg { fontSize: iconSize }`.
- boolean cell icon 20→14px. `GridBooleanCell` class sits ON the svg, so `& svg` nesting misses; fix: `booleanCell { fontSize: iconSize }` direct.
- header sort/menu/actions icons 18→16px: no fix needed, `sortIcon { fontSize: inherit }` rides the IconButton's `iconSize`; actions/edit-cell icons need the glyph rule (`fontSize="small"` hardcoded).
- panels came out spacious: the earlier playground prototype maps master one step UP (8→small, 16→large); copied into batches 1-6. fix: same-size map (criterion 3) + actionable rows at `touchTarget` (criterion 11), all panel rows remapped 2026-10-09. prototype = which slots, not which step.
- checkbox / reorder columns stay 50px wide. width is a colDef number → `computedWidth` → inline `--width`; no CSS lever. decision (see the PR description): leave; follow-up = `checkboxColumnWidth` / `rowReorderColumnWidth` root props → `defaultProps`.
- playground vars fell back to literals. nested `ThemeProvider` reusing the outer prefix (`mui`) skips its style sheet. fix: enhanced theme gets `cssVarPrefix: 'density'`.
- Premium: `chartsPanel*` (19 styled slots), `formulaEditor`/`formulaEditable`/`formulaAutocompletePopper` have NO `GridClasses` key → no theme override surface at all. port blocked until upstream adds keys. formula bar inner parts are class-less `styled('div')`s.
- 4 keys silently dropped: `columnHeader--filter`, `rowReorderIcon`, `multiSelectCell`, `editMultiSelectCell` exist in `GridClasses` but not in `gridClassesOverrides` (root resolver list) and have no styled slot of their own → `styleOverrides.<key>` ignored, no error. fix: nest `& .MuiDataGrid-<key>` under `root`. check list before trusting a key.
- header filter row: prototype's `paddingBlock: small` = 16px left for a 28px input in the 40px row. fix: `xxSmall` (same inset the row formula uses).
- checkbox column got `0 8px`. `cell` emission lands after master's `cellCheckbox { padding: 0 }` reset (same specificity). fix: restate `paddingInline: 0` on `cellCheckbox` + `columnHeaderCheckbox`. same class of leak: any master reset that follows the rule we override — grep the master file for later resets of the same prop (Pro: `rowReorderCellContainer`).
- footer stayed 52. grid's internal `GridPagination` rule `.MuiToolbar-root { minHeight: 51 }` outranks a nested `& .MuiTablePagination-toolbar` by sheet order. fix: nest `.MuiTablePagination-root .MuiTablePagination-toolbar` (one class more). footer lands 49 = 1px border + toolbar 48 (content), 1px over the 48 bar; same late-correction quirk master's 51 comments on.
- search clear button pull -6 stays, material wants -8 (`edge="end"` = touchTarget/-4). grid internal adornment rule (0,3,0) outranks material's variant. fix: owning slot restates pull, selector + `.MuiIconButton-edgeEnd`.
- search field icons 14px (same glyph cause as toolbar). fix: `& svg { fontSize: iconSize }` on `columnsManagementHeader` + `toolbarQuickFilterControl`.
- quick filter trigger 36→16px. slot `width/height: min-content`, box came from IconButton padding; material: explicit box + `padding: 0`. fix: slot `width/height: touchTarget`. `--trigger-width` followed.

## Porting steps (one per checkbox below)

Pattern source of truth: mui/material-ui#48749, `packages/mui-material/src/styles/enhanceDensity.ts` + `densityScale.ts`. Any new case not covered by the rules → look there first, copy the pattern, then add it to the rules list in the PR description.

1. **Pick the component.** Open its KEEP lines below and the master rule in source. Confirm the line is still KEEP after any rebase.
2. **Decide the slot.** Slot = the `gridClasses` key the master selector targets (`cell`, `columnHeader`, …). A key only works if the element has its own `styled(..., { slot })` OR the key is in `gridClassesOverrides` (`gridClasses.ts`, root resolver list) — otherwise the override is dropped silently: nest `& .MuiDataGrid-<key>` under `root` (in-root elements only; portaled ones need their own slot). Compound master selector → one slot per call. Component rendered by Pro/Premium → that tier's enhancer, even when the CSS sits in community `GridRootStyles.ts`.
3. **Decide the property.** Logical property of the axis density changes (`paddingInline`, `paddingBlock`, `marginInlineEnd`), not master's shorthand. Physical only when JS reads the physical value.
4. **Decide the value.** Spacing: master px → the step of the SAME size (2-4 → `xxSmall`, 5-8 → `xSmall`, 10-12 → `small`, 16 → `medium`, 20-24 → `large`); most insets/gaps land on `xSmall`/`xxSmall`, never one step up (the prototype did; corrected 2026-10-09). Sizing: boxes → `calc()` off `touchTarget`, glyphs → `iconSize` (`getDensitySizing(theme)`); actionable rows (triggers, field rows, drop zones, editable bars) → `height: touchTarget`, no block padding; bars that only hold controls → `touchTarget + medium`. Zero resets, `auto`/`unset`, UNRELATED, DYNAMIC → skip (DYNAMIC → `defaultProps`).
   4c. **Check later resets.** Grep master for a zero/auto of the same property on a sibling selector that comes AFTER the rule you override (`cellCheckbox { padding: 0 }` after `cell { padding }`). Your emission lands last and leaks into it; restate the reset on that slot.
   4a. **Check `min-content` boxes.** Grep the component for `min-content`. An icon button sized that way carried its box through padding; under the material enhancer (explicit box, `padding: 0`) it collapses to the glyph. Restate `width`/`height: touchTarget` on that slot.
   4b. **Check the icons.** Icon `fontSize` is outside the scanner's property set, so the rows below never list it. If the slot renders icons with `fontSize="small"` (grep the component), add `'& svg': { fontSize: iconSize }` to the slot's object — without it the material enhancer shrinks the grid's default glyph to `iconSize - 2px`.
5. **Write it.** `addRootOverride(components, 'MuiDataGrid', { <prop>: spacing('<key>') }, '<slot>')` with `const { spacing } = theme` — keyed spacing from material's enhancer, no formatter in X. Master nested under a state class → nest the same selector inside the slot object. One `addRootOverride` call per slot per enhancer.
6. **Record.** Add the row to the mapping table in the PR description (slot, master, emission, tier). Extend the community test (vars + plain expectation) or the tier's test.
7. **Check.** From the repo root: eslint on the density dirs, prettier via `node -e "require('child_process').execSync('pnpm exec prettier --write <dirs>',{stdio:'ignore'})"`, `tsc --noEmit` in each of the three grid packages, vitest `--config packages/x-data-grid/vitest.config.jsdom.mts src/density`.
8. **Measure.** Run the docs experiment page (`docs/pages/x/density-experiment.js`; `pnpm docs:dev` → `/x/density-experiment/`, vanilla vs enhanced side by side) and measure the slot AND every interactive child (trigger buttons, inputs, their open states) with Playwright — snippet in the PR description. Measured values must equal the emitted step px, and the enhanced render must look right (nothing clipped or overlapping, controls aligned): a number that matches with a broken picture is a failed step. Known blind spots there: the multi-select edit popup and the AI assistant panel.
9. **Tick.** Check the box below with the date.

## Data Grid

### Data Grid Community (`x-data-grid`) — 15 in scope, 14 excluded

- [x] [GridEditInputCell](/packages/x-data-grid/src/components/cell/GridEditInputCell.tsx) — ported 2026-10-09: `& input { paddingInline: xSmall }` (aligned to the cell inset; master's 16 vs 10 made the value jump on edit entry), load-icon glyph rule. Root `1px 0` is a focus-outline inset, no emission
  - `(root)` → padding — KEEP: static `1px 0` on the edit input root; nothing measures the edit cell
  - `& input` → padding — KEEP: static `0 16px` inner padding of the edit input; cell box is JS-sized but input padding only squeezes content
- [x] [GridEditLongTextCell](/packages/x-data-grid/src/components/cell/GridEditLongTextCell.tsx) — ported 2026-10-09: value paddingInline xSmall; popper content paddingInline `xSmall - 1px`, paddingBlock `(rowHeight - 1px - 1lh) / 2` (master 15.5 = (52 - 1 - 20) / 2). Textarea `0` reset: no emission
  - `(root)` → padding — KEEP: static `0` reset on the textarea slot (`EditLongTextCellTextarea`); no measurement
  - `(root)` → paddingInline — KEEP: static `10` on the value slot and `9` on the popper content slot; mirrors cell padding, nothing reads it
  - `(root)` → paddingBlock — KEEP: static `15.5` on the popper content slot; nothing reads it
- [x] [GridLongTextCell](/packages/x-data-grid/src/components/cell/GridLongTextCell.tsx) — ported 2026-10-09: popper content same inset as the edit popup. Corner button `padding: 2`: its slot (`LongTextCellCornerButton`) has no `gridClasses` key, so no override surface; hairline inset, no emission
  - `(root)` → paddingBlock, paddingInline — KEEP: static `15.5` / `9` on the popper content slot; nothing measures it
  - `(root)` → padding — KEEP: static `2` on the corner button slot (icon button padding); no measurement
- [x] [GridColumnsManagement](/packages/x-data-grid/src/components/columnsManagement/GridColumnsManagement.tsx) — ported 2026-10-09 (body/header/footer/emptyText; header carries the search-field glyph + clear-pull rules)
  - `(root)` → padding — KEEP: static `vars.spacing(...)` on body, header, footer and empty-text slots; panel is portaled, nothing measures it
- [x] [GridFooterContainer](/packages/x-data-grid/src/components/containers/GridFooterContainer.tsx) — ported 2026-10-09: `minHeight: calc(touchTarget + medium)` (material's TablePagination bar) + nested pagination toolbar at `- 1px`
  - `(root)` → minHeight — KEEP: static `52`; grid dimensions come from a ResizeObserver on the root/main (x-virtualizer/src/features/dimensions.ts:742), so a smaller footer just yields a taller measured viewport. Paired constant: GridPagination's `& .MuiToolbar-root { minHeight: 51 }` and MUI TablePagination's own toolbar `minHeight: 52` must be overridden together or the footer stays 52
- [x] [GridRootStyles](/packages/x-data-grid/src/components/containers/GridRootStyles.ts) — community rows ported 2026-10-09 (`cell`, `columnHeader`, `columnHeaderTitleContainer`, `menuIcon` + alignRight twin, `actionsCell`, checkbox-column resets restated); Pro rows ported in the Pro enhancer (header filter, reorder, toggles, multi-select)
  - `(root)` → paddingTop, paddingBottom — PORTED as `paddingBlock: xxSmall` root-nested (prototype's `small` would leave 16px for a 28px input in the 40px row). KEEP: flattened from `columnHeader--filter` (lines 322-323, `8`) and `root--densityCompact .columnHeader--filter` (lines 329-330, `4`); static. Row height itself is JS-set (`headerFilterHeight`, x-data-grid-pro/src/hooks/features/columnHeaders/useGridColumnHeaders.tsx:165) so padding only squeezes the input. An override must also target the `root--densityCompact` rule or the built-in density prop wins there
  - `(root)` → paddingRight — PORTED `xSmall`, physical. KEEP: flattened from `columnHeader--filter` (line 324, `5`); autosize reads the computed value (packages/x-data-grid/src/hooks/features/columnResize/useGridColumnResize.tsx:290-291) so an override is picked up, not broken
  - `(root)` → marginLeft — PORTED at `columnHeader--alignRight` nesting `& .MuiDataGrid-menuIcon`. KEEP: flattened from `columnHeader--alignRight .menuIcon { marginLeft: -5 }` (line 385), the right-aligned twin of `menuIcon` marginRight; `columnHeader--alignCenter .menuIcon { marginLeft: auto }` (line 381) is alignment, UNRELATED
  - `& .${c.columnHeader}, & .${c.cell}` → padding — KEEP: static `0 10px`; autosize reads header padding via `getComputedStyle` (useGridColumnResize.tsx:261-263) and cell width via `getBoundingClientRect` under `max-content` (useGridColumnResize.tsx:244), so an override is folded into the measured width rather than breaking it; row-height auto measurement observes the row border box (x-virtualizer/src/features/dimensions.ts:669-675) and is horizontal-padding independent
  - `& .${c.columnHeaderCheckbox}, & .${c.cellCheckbox}` → padding — KEEP: static `0`; checkbox column width is a fixed colDef, padding only centres the control. RESTATED (`paddingInline: 0` on both slots): the `cell`/`columnHeader` emissions land after master's reset and leaked into the checkbox column (measured `0 8px`)
  - `& .${c.columnHeaderTitleContainer}` → gap — KEEP: static `vars.spacing(0.25)`; autosize reads the computed gap (useGridColumnResize.tsx:258-259) so an override is picked up
  - `& .${c.menuIcon}` → marginRight — PORTED as `(smallBox - iconSize) / -2` (= -6; master -5 cancelled the small button's padding). KEEP: static `-5` pull; autosize reads `menuContainer.clientWidth` (useGridColumnResize.tsx:281), which excludes margin, so no measurement depends on it
  - `& .${c.multiSelectCell}` → paddingTop — PORTED `xSmall`, root-nested with master's rowspan selector. KEEP: static `8` for row-spanned multi-select cells; the multi-select measurer reads chip widths and container `gap` only (x-data-grid-pro/src/components/cell/GridMultiSelectMeasurer.tsx:60-61)
  - `& .${c.rowReorderCellContainer}` → padding — RESTATED `paddingInline: 0` (same leak as the checkbox column). KEEP: static `0` cell-padding reset for the reorder handle cell; no measurement
  - `& .${c.treeDataGroupingCellToggle}` → marginRight — PORTED `large` + `flexBasis: calc(touchTarget - xxSmall)` (master `flex: 0 0 28px`, the small button box). KEEP: static `vars.spacing(2)`; depth offset uses `--DataGrid-cellOffsetMultiplier` on a sibling (x-data-grid-pro grouping cells), not this margin; nothing measures the toggle
  - `& .${c.groupingCriteriaCellToggle}` → marginRight — PORTED same as tree toggle. KEEP: static `vars.spacing(2)`; same reasoning as the tree-data toggle
  - `& .${c.cell}` → height — DYNAMIC → defaultProps: `var(--height)` set from `dimensions.rowHeight` at packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:232 and per row at packages/x-data-grid/src/components/GridRow.tsx:267 (feeds the virtualizer); change via the `rowHeight` prop
- [x] [GridPagination](/packages/x-data-grid/src/components/GridPagination.tsx) — ported 2026-10-09 under `footerContainer` (internal slot); selector `.MuiTablePagination-root .MuiTablePagination-toolbar` to outrank the internal `.MuiToolbar-root` rule
  - `& .MuiToolbar-root` → minHeight — KEEP: static `51`; paired with GridFooterContainer `minHeight: 52` (footer border) and MUI TablePagination toolbar `minHeight: 52`; override all three together, no JS reads it
- [x] [GridRowCount](/packages/x-data-grid/src/components/GridRowCount.tsx) — ported 2026-10-09 (`marginInline: large`)
  - `(root)` → margin — KEEP: static `vars.spacing(0, 2)`; footer text, no measurement
- [x] [GridSelectedRowCount](/packages/x-data-grid/src/components/GridSelectedRowCount.tsx) — ported 2026-10-09 (`marginInline: large`)
  - `(root)` → margin — KEEP: static `vars.spacing(0, 2)`; footer text, no measurement
- [x] [GridFilterFormBase](/packages/x-data-grid/src/components/panel/filterPanel/GridFilterFormBase.tsx) — ported 2026-10-09: `filterForm` gap medium + delete-icon glyph rule
  - `(root)` → gap — KEEP: static `vars.spacing(1.5)` between filter form fields; portaled panel, no measurement
- [x] [GridPanelContent](/packages/x-data-grid/src/components/panel/GridPanelContent.tsx) — ported 2026-10-09 nested under `panel` (the `panelContent` key also resolves on GridPanel's shell slot)
  - `(root)` → padding, gap — KEEP: static `vars.spacing(2.5, 1.5, 2, 1)` / `vars.spacing(2.5)`; portaled panel, no measurement
- [x] [GridPanelFooter](/packages/x-data-grid/src/components/panel/GridPanelFooter.tsx) — ported 2026-10-09 (`padding: medium`); GridPanelHeader (same `su(1)` padding) is exported but rendered by no grid panel, no emission
  - `(root)` → padding — KEEP: static `vars.spacing(1)`; no measurement
- [x] [GridToolbar](/packages/x-data-grid/src/components/toolbarV8/GridToolbar.tsx) — ported 2026-10-09 (`toolbarDivider`, `toolbarLabel` marginInline xSmall)
  - `(root)` → margin — KEEP: static `vars.spacing(0, 0.5)` on the divider and label slots; no measurement
- [x] [Toolbar](/packages/x-data-grid/src/components/toolbarV8/Toolbar.tsx) — ported 2026-10-09; also carries the glyph rule for its icons (criterion 9)
- [x] [GridBooleanCell](/packages/x-data-grid/src/components/cell/GridBooleanCell.tsx) — glyph only (`fontSize="small"` on the cell icon), not in the original scan; `booleanCell { fontSize: iconSize }` 2026-10-09
- [x] [GridActionsCell](/packages/x-data-grid/src/components/cell/GridActionsCell.tsx) — `actionsCell` gap lives in GridRootStyles (`gridGap: su(1)` → small) + glyph rule, 2026-10-09
- [x] [GridToolbarQuickFilter](/packages/x-data-grid/src/components/toolbar/GridToolbarQuickFilter.tsx) — trigger box restated off touchTarget 2026-10-09 (criterion 10); not in the original scan (its sizes are `min-content` / a var, which the rubric read as non-static)
  - `(root)` → minHeight — KEEP: static `52`; the toolbar sits above the main container and is outside `topContainerHeight` (headers only), root size is re-measured by ResizeObserver (x-virtualizer/src/features/dimensions.ts:742), so a shorter toolbar just yields a taller viewport
  - `(root)` → gap, padding — KEEP: `calc(var(--DataGrid-t-spacing-unit, <theme unit>) * n)`; the var is a static theme-derived definition (packages/x-data-grid/src/material/variables.ts:46), not JS state; no measurement
- [x] [material/index](/packages/x-data-grid/src/material/index.tsx) — 2026-10-09; internal slots (no keys), each emitted at its owning grid slot:
  - `&.${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}` → marginRight — KEEP: static `theme.spacing(-0.75)` pull on the end adornment icon button; no measurement. PORTED at `columnsManagementHeader` + `toolbarQuickFilterControl` as `calc(touchTarget / -4)` (material's edge pull); selector adds `.MuiIconButton-edgeEnd` to outrank the internal rule
  - `(root)` → gap — KEEP: static `theme.spacing(0.5)` on FormControlLabel and `theme.spacing(1)` on ToggleButton; no measurement. FormControlLabel PORTED under `columnsManagement` (gap xSmall). ToggleButton renders only in Premium's charts panel → Premium batch
  - `(root)` → margin — KEEP: static `0` reset on FormControlLabel; no measurement. NO EMISSION: zero reset; it also cancels material's label pull-in, but the panel padding + box air already align the glyph with the search field edge (measured 24px both)
  - `(root)` → padding — KEEP: static `theme.spacing(0.5)` on the Checkbox `density: 'compact'` variant (passed only by GridColumnsManagement.tsx:313,335); an override must target that variant's specificity. NO EMISSION: material's enhancer gives the Checkbox an explicit border-box (`touchTarget`), so the padding no longer sizes anything (measured 32×32 with padding 4)

### Data Grid Pro (`x-data-grid-pro`) — 4 in scope, 2 excluded

- [x] [GridEditMultiSelectCell](/packages/x-data-grid-pro/src/components/cell/GridEditMultiSelectCell.tsx) — ported 2026-10-09: edit chip row `paddingInline: xSmall` + gap (root-nested, key unlisted); autocomplete `paddingBlock: xxSmall` + glyph under `editMultiSelectCellPopperContent`. Popup NOT measured live: it never mounted in the harness (dblclick + typing), verify on the docs demo
  - `(root)` → padding — KEEP: static `0 10px`; `calculateVisibleCount` budgets from the chips root border-box width and never subtracts padding (GridMultiSelectChips.tsx:154,194-199), so the +N math does not read it — an override only shifts the pre-existing clipping tolerance of the last visible chip by the padding delta; keep the value modest
  - `& .${inputBaseClasses.root}.${inputBaseClasses.sizeSmall}` → paddingBlock — KEEP: literal 4, input internal padding, nothing measures it
- [x] [GridMultiSelectCell](/packages/x-data-grid-pro/src/components/cell/GridMultiSelectCell.tsx) — ported 2026-10-09 (`multiSelectCellPopperContent` padding xSmall, gap xxSmall); popover not measured live
  - `(root)` → padding, gap — KEEP: `theme.spacing(1)` / `theme.spacing(0.5)` on the popover chip list; popper offset at :274 mirrors the cell's 10px padding, not this padding
- [x] [GridMultiSelectChips](/packages/x-data-grid-pro/src/components/cell/GridMultiSelectChips.tsx) — ported 2026-10-09: its root carries the `multiSelectCell` / `editMultiSelectCell` class (its own slot `MultiSelectChips` has no key), gap xxSmall root-nested
  - `(root)` → gap — KEEP: literal 4; overflow math reads the computed gap (packages/x-data-grid-pro/src/components/cell/GridMultiSelectMeasurer.tsx:61 `getComputedStyle(container).gap`) from the same `MultiSelectChips` slot, so a CSS override is followed
- [x] [GridHeaderFilterCell](/packages/x-data-grid-pro/src/components/headerFiltering/GridHeaderFilterCell.tsx) — ported 2026-10-09: input marginRight xSmall / marginBottom -xxSmall, operator label marginRight xSmall; the compact-density input height row stays dormant (grid `density` prop unset), no emission
  - `(root)` → height — KEEP: literal 20 on the compact-density input only; the cell box height comes from the `height` prop (JS), the inner input is not measured
  - `(root)` → marginRight, marginBottom, paddingTop, paddingBottom — KEEP: `vars.spacing(...)` on the filter input and operator label, nothing measures them

### Data Grid Premium (`x-data-grid-premium`) — 20 in scope, 4 excluded

- [x] [GridAiAssistantPanel](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanel.tsx) — ported 2026-10-09: header `height: calc(touchTarget + medium)`, `padding: 0 xSmall 0 large`, glyph rule; title marginTop xxSmall; conversation title -xxSmall; footer gap/padding small. Width 380 not a KEEP row, untouched. NOT measured live: the trigger toggles `aria-expanded` but no panel element mounts in the harness; verify on the docs demo
  - `(root)` → height — KEEP: header literal 52 is a static bar height, nothing measures it; body literal 260 — UNRELATED: structural empty-state body height
  - `(root)` → padding, marginTop, gap — KEEP: `vars.spacing(...)` on header, title, footer
- [x] [GridAiAssistantPanelConversation](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanelConversation.tsx) — zero resets only, no emission
  - `(root)` → padding, margin — KEEP: literal 0 list reset; `scrollHeight` read at :56 is only for scroll-to-bottom and adapts
- [x] [GridAiAssistantPanelSuggestions](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanelSuggestions.tsx) — ported 2026-10-09: suggestions gap xSmall; list gap xSmall / padding small / margin -small; label gap small / paddingLeft xSmall
  - `(root)` → gap, padding, margin, paddingLeft — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [GridChartsPanelChart](/packages/x-data-grid-premium/src/components/chartsPanel/chart/GridChartsPanelChart.tsx) — NO OVERRIDE SURFACE: no `chartsPanel*` key exists in `GridClasses` (19 styled slots, zero keys); needs an upstream key before porting
  - `(root)` → gap, padding — KEEP: `vars.spacing(...)` on chart-type grid and buttons, nothing measures
- [x] [GridChartsPanelCustomize](/packages/x-data-grid-premium/src/components/chartsPanel/customize/GridChartsPanelCustomize.tsx) — no override surface (see GridChartsPanelChart)
  - `(root)` → margin, padding, gap — KEEP: `vars.spacing(...)` on section / panel, nothing measures
- [x] [GridChartsPanelDataBody](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataBody.tsx) — no override surface (see GridChartsPanelChart)
  - `(root)` → minHeight — UNRELATED: structural region minimums (84 available fields, 158 resizable sections); placeholder minHeight 38 — KEEP: static drop-zone row height, resize JS only writes inline `height` (packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx:99) and CSS min clamps
  - `(root)` → margin, marginRight, gap, padding — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [GridChartsPanelDataField](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataField.tsx) — no override surface (see GridChartsPanelChart)
  - `(root)` → height — KEEP: literal 32 item height; drop position reads the live rect (:294) so it adapts
  - `(root)` → width — KEEP: literal 16 drag-icon box, nothing measures
  - `(root)` → padding, gap, margin — KEEP: `vars.spacing(...)` and `-1px 0` border collapse, static
- [x] [GridChartsPanelDataSearch](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataSearch.tsx) — no override surface (see GridChartsPanelChart)
  - `(root)` → padding — KEEP: `vars.spacing(1)` static
- [x] [GridChartsPanel](/packages/x-data-grid-premium/src/components/chartsPanel/GridChartsPanel.tsx) — no override surface (see GridChartsPanelChart); the material ToggleButton gap row lives here too
  - `(root)` → gap, padding, marginLeft — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [CollapsibleTrigger](/packages/x-data-grid-premium/src/components/collapsible/CollapsibleTrigger.tsx) — ported 2026-10-09: `height: calc(touchTarget + 2 * xxSmall)`, `paddingInline: medium`
  - `(root)` → height — KEEP: literal 40 trigger height, no collapse animation measures it
  - `(root)` → padding — KEEP: `vars.spacing(0, 1.5)` static
- [x] [FormulaBar](/packages/x-data-grid-premium/src/components/formulaBar/FormulaBar.tsx) — ported 2026-10-09 root only: minHeight row-high, paddingInline xSmall, gap small. Address/preview are class-less inner `styled('div')`s (no key, no class), unreachable; address minWidth 64 structural. Not measured live: the bar needs the `formula` feature dependency wired
  - `(root)` → minHeight — KEEP: literal 40 toolbar-row height; rendered inside the toolbar, no JS reads it
  - `(root)` → minWidth — KEEP: literal 64 address cell width, static
  - `(root)` → padding, gap, paddingInline — KEEP: `vars.spacing(...)` static
- [x] [GridAggregationHeader](/packages/x-data-grid-premium/src/components/GridAggregationHeader.tsx) — `marginTop: -1` hairline nudge, no emission
  - `(root)` → marginTop — KEEP: literal -1 label nudge, static; header box height is JS-owned but the label is not measured
- [x] [GridFormulaColumnHeaderLetter](/packages/x-data-grid-premium/src/components/GridFormulaColumnHeaderLetter.tsx) — ported 2026-10-09 (`marginInlineEnd: xSmall`); not rendered in the harness
  - `(root)` → marginInlineEnd — KEEP: `theme.spacing(0.75)` static
- [x] [GridFormulaEditable](/packages/x-data-grid-premium/src/components/GridFormulaEditable.tsx) — NO OVERRIDE SURFACE: the editable root is a class-less `styled('div')`, the popper slot `FormulaAutocompletePopper` has no key
  - `(root)` → padding — KEEP: editable `0 10px` inline padding mirrors the cell's 10px for alignment; JS only writes `paddingBlock` inline in wrap mode (packages/x-data-grid-premium/src/components/GridFormulaEditor.tsx:475) and re-measures scroll sizes live; option/signature/list paddings static
  - `(root)` → margin — KEEP: literal 0 list reset
  - `(root)` → gap — KEEP: literal 8 option gap, static
- [x] [GridFormulaEditor](/packages/x-data-grid-premium/src/components/GridFormulaEditor.tsx) — NO OVERRIDE SURFACE: `FormulaEditor` / `FormulaEditorSurface` slots have no key
  - `(root)` → paddingInline — KEEP: literal 10 on the anchor value, mirrors cell padding, nothing measures it
- [x] [GridPivotPanelBody](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelBody.tsx) — ported 2026-10-09: section margin `xSmall small`, title marginRight medium / gap small, field list paddingBlock xSmall, placeholder `minHeight: calc(touchTarget + xxSmall)` / paddingInline small; region minimums structural
  - `(root)` → minHeight — UNRELATED: structural region minimums (84 available fields, 158 resizable sections); placeholder minHeight 38 — KEEP: static drop-zone row height, resize JS only writes inline `height` (packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx:99) and CSS min clamps
  - `(root)` → margin, marginRight, gap, padding — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [GridPivotPanelField](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelField.tsx) — ported 2026-10-09: `height: touchTarget`, `padding: 0 small 0 large`, gap xSmall, `marginInlineStart: xSmall` (prototype's drag-handle room), drag icon `width: iconSize`, checkbox `marginLeft: -small`, glyph rule; `-1px 0` border collapse untouched
  - `(root)` → height — KEEP: literal 32 item height; drop position reads the live rect (:259) so it adapts
  - `(root)` → width — KEEP: literal 16 drag-icon box, nothing measures
  - `(root)` → padding, gap, margin — KEEP: `vars.spacing(...)` and `-1px 0` border collapse, static
- [x] [GridPivotPanelHeader](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelHeader.tsx) — ported 2026-10-09: `height: calc(touchTarget + medium)`, gap small, `padding: 0 xSmall 0 small`, glyph rule
  - `(root)` → height — KEEP: literal 52 header bar height, nothing measures it
  - `(root)` → gap, padding — KEEP: `vars.spacing(...)` static
- [x] [GridPivotPanelSearch](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelSearch.tsx) — ported 2026-10-09: `padding: 0 small small` + search-field rules (glyph, clear pull)
  - `(root)` → padding — KEEP: `vars.spacing(0, 1, 1)` static
- [x] [GridPrompt](/packages/x-data-grid-premium/src/components/prompt/GridPrompt.tsx) — ported 2026-10-09: `padding: small small`, glyph rule; icon container `touchTarget + xxSmall` box, marginRight medium; change list gap xSmall / marginTop small; toggle gap xxSmall. Not rendered in the harness (needs a conversation)
  - `(root)` → width, height — KEEP: literal 36 icon box, static
  - `(root)` → padding, marginRight, gap, marginTop — KEEP: `vars.spacing(...)` static, nothing measures

## Date Pickers

### Date Pickers Community (`x-date-pickers`) — 20 in scope, 11 excluded

- [ ] [DayCalendar](/packages/x-date-pickers/src/DateCalendar/DayCalendar.tsx)
  - `(root)` → width, height — KEEP: literal 36/40 on weekDayLabel/weekNumberLabel and DAY_SIZE (36) on weekNumber; CSS-only, no JS reads them; must move together with PickerDay `--PickerDay-size`
  - `(root)` → minHeight — KEEP: slideTransition/loadingContainer minHeight = (DAY_SIZE + 2*DAY_MARGIN)*6 = 240 is a build-time literal consumed by CSS only (PickersSlideTransition measures nothing); override alongside the day size or six rows no longer fill the box
  - `(root)` → margin — KEEP: weekContainer `2px 0`, labels `0 2px`, weekNumber `0 ${DAY_MARGIN}px`; static literals, no JS consumer
  - `(root)` → padding — KEEP: weekNumber padding 0, static
- [ ] [DatePickerToolbar](/packages/x-date-pickers/src/DatePicker/DatePickerToolbar.tsx)
  - `(root)` → margin — KEEP: title slot landscape `auto 16px auto auto`, static literal, no JS consumer
- [ ] [DateTimePickerToolbar](/packages/x-date-pickers/src/DateTimePicker/DateTimePickerToolbar.tsx)
  - `(root)` → paddingLeft, paddingRight — KEEP: root 16/16 and desktop-portrait 24/0, static literals
  - `(root)` → gap — KEEP: timeContainer 9 (desktop portrait) and timeDigitsContainer 1.5 (desktop), static literals
  - `(root)` → marginRight — KEEP: timeContainer 4 (desktop portrait), static
  - `(root)` → margin — KEEP: separator `0 4px 0 2px` (0 on desktop) and ampmSelection landscape `4px 0 auto`, static
  - `(root)` → marginLeft — KEEP: ampmSelection 12, static (the hour/minute button `width` is a JS `sx` prop at :356/:442, not a styled value, so it is outside this line)
- [ ] [DigitalClock](/packages/x-date-pickers/src/DigitalClock/DigitalClock.tsx)
  - `(root)` → maxHeight — KEEP: DIGITAL_CLOCK_VIEW_HEIGHT (232) literal; scroll-to-selected at :232-239 reads runtime `offsetTop`, not the constant
  - `(root)` → padding — KEEP: list 0, item `8px 16px`, static literals
  - `(root)` → margin — KEEP: item `2px 4px`, static; scroll uses measured offsetTop
- [ ] [PickersArrowSwitcher](/packages/x-date-pickers/src/internals/components/PickersArrowSwitcher/PickersArrowSwitcher.tsx)
  - `(root)` → width — KEEP: spacer slot `theme.spacing(3)`, gap between the two arrow buttons, no JS consumer
- [ ] [PickersToolbar](/packages/x-date-pickers/src/internals/components/PickersToolbar.tsx)
  - `(root)` → padding — KEEP: `theme.spacing(2, 3)` portrait, 16 landscape, static
- [ ] [PickersToolbarButton](/packages/x-date-pickers/src/internals/components/PickersToolbarButton.tsx)
  - `(root)` → minWidth — KEEP: literal 16, static (a JS `width` prop may add `sx.width` on top, but minWidth stays CSS-owned)
  - `(root)` → padding — KEEP: literal 0, static
- [ ] [MonthCalendar](/packages/x-date-pickers/src/MonthCalendar/MonthCalendar.tsx)
  - `(root)` → rowGap — KEEP: literal 16 (columnGap 24/0 per monthsPerRow), static, no JS measurement in MonthCalendar
  - `(root)` → padding — KEEP: `8px 0`, static
- [ ] [MonthCalendarButton](/packages/x-date-pickers/src/MonthCalendar/MonthCalendarButton.tsx)
  - `(root)` → height, width — KEEP: literal 36×72 button box (borderRadius 18 pairs), static, no JS consumer
- [ ] [MultiSectionDigitalClockSection](/packages/x-date-pickers/src/MultiSectionDigitalClock/MultiSectionDigitalClockSection.tsx)
  - `(root)` → maxHeight — KEEP: DIGITAL_CLOCK_VIEW_HEIGHT (232) literal; centering scroll at :209-224 reads runtime clientHeight/scrollHeight/offsetTop, not the constant
  - `(root)` → padding — KEEP: root 0, item 8, static
  - `(root)` → margin — KEEP: item `2px 4px`, static; scroll centering is runtime-measured
  - `&:first-of-type` → marginTop — KEEP: literal 4, no literal offset in the section scroll logic (unlike DigitalClock)
- [ ] [PickerDay](/packages/x-date-pickers/src/PickerDay/PickerDay.tsx)
  - `(root)` → --PickerDay-size — KEEP: defined as `${DAY_SIZE}px` literal; read only by CSS (width/height/borderRadius here, DateRangePickerDay pseudo-elements); no JS reads it (grep `PickerDay-size` hits only styled bodies); pair with DayCalendar label widths and slideTransition minHeight
  - `(root)` → width, height — KEEP: `var(--PickerDay-size)`, CSS-only
  - `(root)` → --PickerDay-horizontalMargin — KEEP: `${DAY_MARGIN}px` literal, read only by CSS (margins here, DateRangePickerDay :88/:98 pseudo insets)
  - `(root)` → padding — KEEP: literal 0
  - `(root)` → marginLeft, marginRight — KEEP: `var(--PickerDay-horizontalMargin)`, CSS-only
- [ ] [PickersCalendarHeader](/packages/x-date-pickers/src/PickersCalendarHeader/PickersCalendarHeader.tsx)
  - `(root)` → maxHeight, minHeight — KEEP: literal 40/40 header row height, static, no JS consumer
  - `(root)` → marginTop, marginBottom, paddingLeft, paddingRight — KEEP: 12/4/24/12 literals, static
  - `(root)` → marginRight — KEEP: label slot 6 literal (labelContainer/switchViewButton `auto` are layout, ignore)
- [ ] [PickersFilledInput](/packages/x-date-pickers/src/PickersTextField/PickersFilledInput/PickersFilledInput.tsx)
  - `(root)` → paddingLeft, paddingRight, paddingTop, paddingBottom — KEEP: root adornment 12/12 and sectionsContainer 25/12/8/12 (small 21/4, hiddenLabel 16/17, 8/9) literals; range active-bar math at PickersInputBase.tsx:264/:289 measures offsetWidth/offsetLeft at runtime so it follows any padding; pair paddingTop with the Material InputLabel filled transform
- [ ] [PickersInput](/packages/x-date-pickers/src/PickersTextField/PickersInput/PickersInput.tsx)
  - `label + &` → marginTop — KEEP: literal 16, static
- [ ] [PickersInputBase](/packages/x-date-pickers/src/PickersTextField/PickersInputBase/PickersInputBase.tsx)
  - `(root)` → padding — KEEP: root 0 and sectionsContainer `4px 0 5px` literals; active-bar/offset math (:264, :289) is runtime-measured
  - `(root)` → paddingTop — KEEP: sectionsContainer small 1, static
- [ ] [PickersOutlinedInput](/packages/x-date-pickers/src/PickersTextField/PickersOutlinedInput/PickersOutlinedInput.tsx)
  - `(root)` → padding — KEEP: root `0 14px` and sectionsContainer `16.5px 0` (small `8.5px 0`) literals, static; runtime-measured active bar follows; pair horizontal padding with the InputLabel outlined transform
- [ ] [Clock](/packages/x-date-pickers/src/TimeClock/Clock.tsx)
  - `(root)` → margin — KEEP: root `theme.spacing(2)`, static, outside the measured face
- [ ] [TimePickerToolbar](/packages/x-date-pickers/src/TimePicker/TimePickerToolbar.tsx)
  - `(root)` → margin — KEEP: separator `0 4px 0 2px` and ampmSelection landscape `4px 0 auto`, static
  - `(root)` → marginLeft — KEEP: ampmSelection 12, static
- [ ] [YearCalendar](/packages/x-date-pickers/src/YearCalendar/YearCalendar.tsx)
  - `(root)` → maxHeight — KEEP: MAX_CALENDAR_HEIGHT (280) literal; scroll-into-view at :295-308 measures clientHeight/offsetHeight at runtime
  - `(root)` → rowGap — KEEP: literal 12 (columnGap 24/0 per yearsPerRow), static
  - `(root)` → padding — KEEP: `6px 0` / `0 2px` literals, static
- [ ] [YearCalendarButton](/packages/x-date-pickers/src/YearCalendar/YearCalendarButton.tsx)
  - `(root)` → height, width — KEEP: literal 36×72 button box (borderRadius 18 and YearCalendar buttonFiller 36×72 pair), static; scroll math reads runtime offsetHeight

### Date Pickers Pro (`x-date-pickers-pro`) — 7 in scope, 1 excluded

- [ ] [DateRangeCalendar](/packages/x-date-pickers-pro/src/DateRangeCalendar/DateRangeCalendar.tsx)
  - `(root)` → minHeight — KEEP: literal 240 = (DAY_RANGE_SIZE + 2·DAY_MARGIN)·6, CSS-only; the "internal" wrapper is the `monthContainer` slot (DateRangeCalendar.tsx:83 `overridesResolver: styles.monthContainer`, :620 `className={classes.monthContainer}`), so target `MuiDateRangeCalendar.styleOverrides.monthContainer` and move it together with `--PickerDay-size`
- [ ] [DateRangePickerDay](/packages/x-date-pickers-pro/src/DateRangePickerDay/DateRangePickerDay.tsx)
  - `(root)` → --PickerDay-size — KEEP: literal `36px`, read only by CSS (width/height/borderRadius); no JS consumer; pair with DayCalendar labels and DateRangeCalendar minHeight
  - `(root)` → width, height — KEEP: `var(--PickerDay-size)`, CSS-only
  - `(root)` → --PickerDay-horizontalMargin — KEEP: literal `2px`, read by CSS only (margins and the :88/:98 highlight/preview pseudo insets)
  - `(root)` → padding — KEEP: literal 0
  - `(root)` → marginLeft, marginRight — KEEP: `var(--PickerDay-horizontalMargin)`, CSS-only
- [ ] [DateTimeRangePickerTabs](/packages/x-date-pickers-pro/src/DateTimeRangePicker/DateTimeRangePickerTabs.tsx)
  - `(root)` → minHeight — KEEP: literal 48 tab bar height, static, no JS consumer
- [ ] [DateTimeRangePickerToolbar](/packages/x-date-pickers-pro/src/DateTimeRangePicker/DateTimeRangePickerToolbar.tsx)
  - `(root)` → paddingBottom — KEEP: startToolbar literal 0 (gap between the stacked start/end toolbars), static
- [ ] [PickersRangeCalendarHeader](/packages/x-date-pickers-pro/src/PickersRangeCalendarHeader/PickersRangeCalendarHeader.tsx)
  - `(root)` → padding — KEEP: literal `12px 16px 4px 16px` on a `slot: 'internal'` wrapper that IS the header root (styled(PickersArrowSwitcher), rendered as the direct child of `monthContainer` in multi-calendar mode, DateRangeCalendar.tsx:620-626); no own key, and a `MuiPickersArrowSwitcher.root` override loses to the wrapper class (same specificity, injected later) — emit under `MuiDateRangeCalendar.styleOverrides.monthContainer: { "& > .MuiPickersArrowSwitcher-root": {…} }` (0,2,0 wins; single-calendar mode has PickersCalendarHeader as the child, so it is not hit)
- [ ] [TimeRangePickerTabs](/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerTabs.tsx)
  - `(root)` → minHeight — KEEP: tab slot literal `48px`, static
  - `(root)` → gap — KEEP: tab slot `theme.spacing(1)`, static
- [ ] [TimeRangePickerToolbar](/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerToolbar.tsx)
  - `(root)` → padding — KEEP: `12px 0px 8px 0px` literal, static
  - `(root)` → rowGap — KEEP: container mobile 8, static
  - `(root)` → gap — KEEP: container desktop 1, static
  - `& .${pickersToolbarClasses.title}` → paddingLeft — KEEP: literal 12, static

## Tree View

### Tree View Community (`x-tree-view`) — 3 in scope, 3 excluded

- [ ] [TreeItem](/packages/x-tree-view/src/TreeItem/TreeItem.tsx)
  - `(root)` → padding, gap — KEEP: Content slot `padding: theme.spacing(0.5, 1)` and `gap: theme.spacing(1)` are static; with `itemHeight` unset (community default) the row height derives from padding + body1 line box, nothing measures it (only reorder DnD reads `rect.height` at drag time and adapts, itemPlugin.ts:118)
  - `(root)` → paddingLeft (Label, editable) — KEEP: static `2px`, pairs with TreeItemLabelInput `padding: 0 2px` so label and inline input align, override both together
  - `(root)` → width (IconContainer) — KEEP: static constant 16px (packages/x-tree-view/src/internals/constants.ts:6); TreeItemLoader iconContainer uses the same constant for alignment (TreeItemLoader.tsx:36), override both together
  - `(root)` → paddingLeft — DYNAMIC → defaultProps: Content `paddingLeft: calc(spacing(1) + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`; the indent var is set from the `itemChildrenIndentation` prop in packages/x-tree-view/src/internals/hooks/useTreeViewRootProps.ts:30 and the reorder plugin parses that same prop to compute the `move-to-parent` cursor threshold (packages/x-tree-view-pro/src/internals/plugins/itemsReordering/utils.ts:44-60, :91); the 8px base offset is a static literal and safe only if the var term is preserved, indent itself must change via `itemChildrenIndentation`
  - `(root)` → height — DYNAMIC → defaultProps: Content `height: var(--TreeView-itemHeight, unset)`; var set per item from the `itemHeight` prop in packages/x-tree-view/src/useTreeItem/useTreeItem.ts:231; in Pro the same store value feeds the virtualizer `rowHeight` (packages/x-tree-view-pro/src/components/RichTreeViewVirtualizedItems.tsx:49,65, default 32 from RichTreeViewProStore.utils.ts:20), so CSS alone would tear virtual row positioning
- [ ] [TreeItemLabelInput](/packages/x-tree-view/src/TreeItemLabelInput/TreeItemLabelInput.tsx)
  - `(root)` → padding — KEEP: static `0 2px`, inline-edit input inset; pairs with TreeItem Label editable `paddingLeft: 2px`
- [ ] [TreeItemLoader](/packages/x-tree-view/src/TreeItemLoader/TreeItemLoader.tsx)
  - `(root)` → padding, gap — KEEP: static `theme.spacing(0.5, 1)` / `theme.spacing(1)` mirroring TreeItem Content so loading rows match item height; override together with TreeItem
  - `& .${treeItemLoaderClasses.iconContainer}` → width — KEEP: static constant 16px (constants.ts:6), mirrors TreeItem IconContainer; override together
  - `(root)` → paddingLeft — DYNAMIC → defaultProps: same indent formula as TreeItem Content (`var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth, 0)`), var set from the `itemChildrenIndentation` prop in packages/x-tree-view/src/internals/hooks/useTreeViewRootProps.ts:30
  - `(root)` → height — DYNAMIC → defaultProps: `var(--TreeView-itemHeight, unset)` set in packages/x-tree-view/src/TreeItemLoader/TreeItemLoader.tsx:90 from the `itemHeight` store value (packages/x-tree-view/src/internals/components/RichTreeViewLoading.tsx:182); same value drives the Pro virtualizer row height

### Tree View Pro (`x-tree-view-pro`) — 0 in scope, 1 excluded

## Charts

### Charts Community (`x-charts`) — 7 in scope, 4 excluded

- [ ] [ChartsAxisHighlightValueItem](/packages/x-charts/src/ChartsAxisHighlightValue/ChartsAxisHighlightValueItem.tsx)
  - `(root)` → padding — KEEP: static `theme.spacing(0.5, 1)`; the JS-set `--min/--max/--space` vars only clamp the `translate` offset and use `100%` of the element's own box, so a padding change is absorbed (ChartsAxisHighlightValueItem.tsx:18,70-78)
- [ ] [ChartsLabelMark](/packages/x-charts/src/ChartsLabel/ChartsLabelMark.tsx)
  - `(root)` → width, height — KEEP: static `14px` legend/tooltip mark; nothing measures it, the tooltip `markContainer` is sized independently in CSS
  - `&.${labelMarkClasses.line}` → width, height — KEEP: static `16 x 8`
  - `&.${labelMarkClasses.square}` → height, width — KEEP: static `13 x 13`
  - `&.${labelMarkClasses.circle}` → height, width — KEEP: static `15 x 15`
- [ ] [ChartsLegend](/packages/x-charts/src/ChartsLegend/ChartsLegend.tsx)
  - `(root)` → gap, paddingInlineStart, marginBlock, marginInline — KEEP: static `theme.spacing(2)` / `0` (ul reset) / `theme.spacing(1)` / `theme.spacing(1)`; the legend occupies an `auto` grid track of ChartsWrapper and the drawing area is re-measured by ResizeObserver on the layer container (useChartDimensions.ts:140), no legend measurement exists in `packages/x-charts/src`
  - `button.${legendClasses.series}` → padding — KEEP: static `0` button reset; clickable series item inset
  - `& .${legendClasses.series}` → gap — KEEP: static `theme.spacing(1)` between mark and label
- [ ] [ContinuousColorLegend](/packages/x-charts/src/ChartsLegend/ContinuousColorLegend.tsx)
  - `(root)` → gap, paddingInlineStart, marginBlock, marginInline — KEEP: static `theme.spacing(0.5)` / `0` (ul reset) / `theme.spacing(1)` / `theme.spacing(1)`; same grid-track/ResizeObserver reasoning as ChartsLegend
- [ ] [PiecewiseColorLegend](/packages/x-charts/src/ChartsLegend/PiecewiseColorLegend.tsx)
  - `(root)` → gap, paddingInlineStart, marginBlock, marginInline — KEEP: static `theme.spacing(0.5)` / `0` (ul reset) / `theme.spacing(1)` / `theme.spacing(1)`; same grid-track/ResizeObserver reasoning as ChartsLegend
  - `button.${classes.item}` → padding — KEEP: static `0` button reset; clickable item inset
  - `.${classes.item}` → gap — KEEP: static `theme.spacing(0.5)` between mark and label
  - `&.${classes.horizontal} > &.${classes.inlineStart}, &.${classes.inlineEnd}` → gap — KEEP: static `theme.spacing(1.5)` between inline items
- [ ] [ChartsTooltipTable](/packages/x-charts/src/ChartsTooltip/ChartsTooltipTable.ts)
  - `& .${chartsTooltipClasses.markContainer}` → width — KEEP: static `calc(20px + theme.spacing(1.5))` cell gutter that holds the mark (max 16px); tooltip is positioned by Popper from a zero-size pointer anchor (packages/x-charts/src/ChartsTooltip/ChartsTooltipContainer.tsx:273) and re-measures the popper itself on update
  - `& caption` → padding — KEEP: static `theme.spacing(0.5, 1.5)`
  - `& caption > & span` → marginRight — KEEP: static `theme.spacing(1.5)`
  - `tr:first-of-type& td` → paddingTop — KEEP: static `theme.spacing(0.5)`
  - `tr:last-of-type& td` → paddingBottom — KEEP: static `theme.spacing(0.5)`
  - `&.${chartsTooltipClasses.cell}` → paddingLeft, paddingRight — KEEP: static `theme.spacing(1)`
  - `&.${chartsTooltipClasses.valueCell}` → paddingLeft, paddingRight — KEEP: static `theme.spacing(1.5)`
  - `td:first-of-type&, th:first-of-type&` → paddingLeft — KEEP: static `theme.spacing(1.5)`
  - `td:last-of-type&, th:last-of-type&` → paddingRight — KEEP: static `theme.spacing(1.5)`
- [ ] [Toolbar](/packages/x-charts/src/Toolbar/Toolbar.tsx)
  - `(root)` → minHeight — KEEP: static `44px` control-bar height; ChartsWrapper gives the toolbar an `auto` grid row (ChartsWrapper.tsx:166) and the drawing area is ResizeObserver-driven, the export plugin only looks the element up by class (packages/x-charts-pro/src/internals/plugins/useChartProExport/defaults.ts:5), no measurement
  - `(root)` → gap, padding, marginBottom — KEEP: static `theme.spacing(0.25)` / `theme.spacing(0.5)` / `theme.spacing(1.5)`

### Charts Pro (`x-charts-pro`) — 3 in scope, 0 excluded

- [ ] [ChartsToolbarPro](/packages/x-charts-pro/src/ChartsToolbarPro/ChartsToolbarPro.tsx)
  - `& .MuiToggleButton-root` → minWidth — KEEP: static `unset` on the range ToggleButtons (styled name `MuiChartsToolbarRangeButtons`), control min-width, nothing measures it
- [ ] [ChartsToolbarDivider](/packages/x-charts-pro/src/ChartsToolbarPro/internals/ChartsToolbarDivider.tsx)
  - `(root)` → margin — KEEP: static `theme.spacing(0, 0.5)` horizontal spacing between toolbar groups (styled name `MuiChartsToolbar`, slot `Divider`)
- [ ] [HeatmapTooltipAxesValue](/packages/x-charts-pro/src/Heatmap/HeatmapTooltip/HeatmapTooltipAxesValue.tsx)
  - `(root)` → padding — KEEP: static `theme.spacing(0.5, 1.5)`, mirrors ChartsTooltipTable caption padding; override together
  - `& span` → marginRight — KEEP: static `theme.spacing(1.5)`, mirrors ChartsTooltipTable caption span

### Charts Premium (`x-charts-premium`) — 1 in scope, 0 excluded

- [ ] [PaletteOption](/packages/x-charts-premium/src/ChartsRenderer/components/PaletteOption.tsx)
  - `(root)` → gap — KEEP: static `theme.spacing(1)` between swatch and label (styled name `MuiDataGrid`, slot `PaletteOptionRoot`)
  - `(root)` → width, height — KEEP: static `24 x 24` palette swatch (styled name `MuiDataGrid`, slot `PaletteOptionIcon`); nothing measures it

## Appendix — excluded, with reasons

### Data Grid Community (`x-data-grid`)

- [GridEditInputCell](/packages/x-data-grid/src/components/cell/GridEditInputCell.tsx) — in scope above; these lines are not:
  - `& input` → height — UNRELATED: layout fill (`100%`)
- [GridEditLongTextCell](/packages/x-data-grid/src/components/cell/GridEditLongTextCell.tsx) — in scope above; these lines are not:
  - `(root)` → width, height — UNRELATED: layout fill (`100%`) on root/value/textarea slots
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → width (`var(--_width)` on popper content) — DYNAMIC: packages/x-data-grid/src/components/cell/GridEditLongTextCell.tsx:205 sets `--_width` from `colDef.computedWidth`
- [GridLongTextCell](/packages/x-data-grid/src/components/cell/GridLongTextCell.tsx) — in scope above; these lines are not:
  - `(root)` → width, height — UNRELATED: layout fill (`100%`) on the root slot
  - `(root)` → maxHeight — UNRELATED: structural popover cap (`52 * 3`) on the popper content slot
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → width (`var(--_width)` on popper content) — DYNAMIC: packages/x-data-grid/src/components/cell/GridLongTextCell.tsx:280 sets `--_width` from `colDef.computedWidth`
- [GridColumnsManagement](/packages/x-data-grid/src/components/columnsManagement/GridColumnsManagement.tsx) — in scope above; these lines are not:
  - `(root)` → maxHeight — UNRELATED: structural scroll-area cap (`300`) on the scroll area slot
- [GridRootStyles](/packages/x-data-grid/src/components/containers/GridRootStyles.ts) — in scope above; these lines are not:
  - `(root)` → --DataGrid-width, --DataGrid-scrollbarSize, --DataGrid-rowWidth, --DataGrid-columnsTotalWidth, --DataGrid-leftPinnedWidth, --DataGrid-rightPinnedWidth, --DataGrid-headerHeight, --DataGrid-headersTotalHeight, --DataGrid-topContainerHeight, --DataGrid-bottomContainerHeight — UNRELATED: `0px` placeholders mirroring JS state; overwritten inline by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:217-232
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → height, minHeight, maxHeight — UNRELATED: structural container size driven by the `height` prop (`ownerState.height ?? '100%'`)
  - `(root)` → minWidth — UNRELATED: `0` flex-shrink fix
  - `(root)` → width — UNRELATED: flattened from `columnHeader--sorted/filtered .iconButtonContainer { width: auto }` (line 339), a visibility toggle
  - `(root)` → marginRight — UNRELATED: flattened from `columnHeader--alignRight .menuIcon { marginRight: auto }` (line 384), alignment
  - `(root)` → padding — UNRELATED: flattened from `cell--editing { padding: 1 }` (line 637, 1px focus-outline inset), `columnHeader--dragging { padding: '0 12px' }` (line 755) and `row--dragging { padding: '0 12px' }` (line 761), drag previews
  - `&.${c.autoHeight}` → height — UNRELATED: layout fill (`auto`)
  - `&.${c.autosizing} > @media (hover: hover) > & .${c.menuIcon}` → width — UNRELATED: `0 !important` measurement-mode toggle; class is added only during autosize (useGridColumnResize.tsx:235)
  - `&.${c.autosizing} > & .${c.cell}` → minWidth, maxWidth — UNRELATED: `max-content !important` measurement mode; cells are read by `getBoundingClientRect` in that state (useGridColumnResize.tsx:244)
  - `&.${c.autosizing} > & .${c.groupingCriteriaCell}` → width — UNRELATED: `unset` measurement mode
  - `&.${c.autosizing} > & .${c.treeDataGroupingCell}` → width — UNRELATED: `unset` measurement mode
  - `&.${c.autosizing}` → width — UNRELATED: `columnHeader--filter { width: unset !important }` measurement mode
  - `&.${c.autosizing} > & .${c.multiSelectCell}` → width — UNRELATED: `max-content` measurement mode
  - `& .${c.columnHeader}, & .${c.cell}` → boxSizing — UNRELATED: boxSizing
  - `& .${c.columnHeaderTitleContainer}` → minWidth — UNRELATED: `0` flex-shrink fix
  - `& .${c.columnSeparator}` → maxWidth — UNRELATED: resize separator hit target (`columnSeparatorTargetSize`)
  - `& .${c.columnHeaders}` → width — DYNAMIC: `var(--DataGrid-rowWidth)` set by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:220
  - `@media (hover: hover) > & .${c.columnHeader}:hover > & .${c.menuIcon}` → width — UNRELATED: `auto` visibility toggle
  - `@media (hover: hover) > & .${c.columnHeader}:hover > & .${c.iconButtonContainer}` → width — UNRELATED: `auto` visibility toggle
  - `@media (hover: none) > & .${c.columnHeader} .${c.menuIcon}` → width — UNRELATED: `auto` visibility toggle
  - `& .${c.menuIcon}` → width — UNRELATED: `0` hidden-state toggle paired with `visibility: hidden`
  - `.${c.menuOpen}` → width — UNRELATED: `auto` visibility toggle
  - `& .${c.headerFilterRow} > & .${c.columnHeader}, & .${c.scrollbarFiller}` → boxSizing — UNRELATED: boxSizing
  - `.${c.row}` → width — DYNAMIC: `var(--DataGrid-rowWidth)` set by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:220
  - `& .${c.cell}` → width — DYNAMIC: `var(--width)` set per cell at packages/x-data-grid/src/components/cell/GridCell.tsx:333 and on resize at useGridColumnResize.tsx:421
  - `& .${c.cell}` → boxSizing — UNRELATED: boxSizing
  - `& .${c.cellEmpty}` → height, padding — UNRELATED: filler cell (`unset` / `0`)
  - `& .MuiInputBase-root` → height — UNRELATED: layout fill (`100%`) inside `cell--editing`
  - `& .${c.editBooleanCell}` → height, width — UNRELATED: layout fill (`100%`)
  - `& .${c.cellSkeleton}` → height — UNRELATED: skeleton, layout fill
  - `& .${c.columnHeaderDraggableContainer}` → width, height — UNRELATED: layout fill (`100%`)
  - `& .${c.rowReorderCellPlaceholder}` → padding — UNRELATED: drag preview (`row--dragging` subtree, line 768)
  - `& .${c.treeDataGroupingCell}` → width — UNRELATED: layout fill (`100%`)
  - `& .${c.treeDataGroupingCellLoadingContainer}, .${c.groupingCriteriaCellLoadingContainer}` → height — UNRELATED: layout fill (`100%`)
  - `& .${c.groupingCriteriaCell}` → width — UNRELATED: layout fill (`100%`)
  - `.${c.scrollbarFiller}` → minWidth — UNRELATED: scrollbar filler; value is `calc(var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))` set by useGridDimensions.ts:218-219
  - `&::after` → width, height, insetInlineEnd — UNRELATED: fill-handle affordance (`cell--withFillHandle`), a drag handle not spacing
- [GridPagination](/packages/x-data-grid/src/components/GridPagination.tsx) — in scope above; these lines are not:
  - `(root)` → maxHeight — UNRELATED: layout fill (`calc(100% + 1px)`)
- [GridSelectedRowCount](/packages/x-data-grid/src/components/GridSelectedRowCount.tsx) — in scope above; these lines are not:
  - `(root)` → width, height — UNRELATED: `0` paired with `visibility: hidden` below the `sm` breakpoint, a show/hide toggle
  - `vars.breakpoints.up('sm')` → width, height — UNRELATED: `auto` half of the same show/hide toggle
- [GridFilterFormBase](/packages/x-data-grid/src/components/panel/filterPanel/GridFilterFormBase.tsx) — in scope above; these lines are not:
  - `(root)` → minWidth — UNRELATED: structural field widths on the logic-operator/column/operator/value input slots (`75`, `150`, `150`, `190`)
- [GridPanelContent](/packages/x-data-grid/src/components/panel/GridPanelContent.tsx) — in scope above; these lines are not:
  - `(root)` → maxHeight — UNRELATED: structural scroll cap (`400`)
- [GridToolbar](/packages/x-data-grid/src/components/toolbarV8/GridToolbar.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (`50%`) on the divider slot
- [Toolbar](/packages/x-data-grid/src/components/toolbarV8/Toolbar.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED: boxSizing
- [material/index](/packages/x-data-grid/src/material/index.tsx) — in scope above; these lines are not:
  - `(root)` → width — UNRELATED: layout fill (`100%`) in the FormControlLabel `fullWidth` variant
  - `(root)` → minWidth — UNRELATED: `fit-content` on the Tab slot
  - `& .${listItemTextClasses.primary}` → maxWidth — UNRELATED: structural text cap (`300px`) in the column menu
- [GridOverlays](/packages/x-data-grid/src/components/base/GridOverlays.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `(root)` → width, height — UNRELATED: 0×0 sticky overlay anchor; inner size is JS-set from dimensions (GridOverlays.tsx:71-96)
- [GridIconButtonContainer](/packages/x-data-grid/src/components/columnHeaders/GridIconButtonContainer.tsx) — EXCLUDED: all lines UNRELATED (show/hide toggle)
  - `(root)` → width — UNRELATED: `0` paired with `visibility: hidden`, flipped to `auto` by GridRootStyles hover/sorted rules; a visibility toggle, not spacing
- [GridOverlay](/packages/x-data-grid/src/components/containers/GridOverlay.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `(root)` → width, height — UNRELATED: layout fill (`100%`)
  - `(root)` → gap — UNRELATED: overlay content gap (no-rows / loading overlay)
- [GridRowDragAndDropOverlay](/packages/x-data-grid/src/components/GridRowDragAndDropOverlay.tsx) — EXCLUDED: all lines UNRELATED (drag placeholder)
  - `&::before` → height — UNRELATED: 2px drop-position indicator line
  - `&::after` → height — UNRELATED: 2px drop-position indicator line
- [GridScrollArea](/packages/x-data-grid/src/components/GridScrollArea.tsx) — EXCLUDED: all lines UNRELATED (drag autoscroll zone)
  - `(root)` → width, height — UNRELATED: 20px edge hot-zones for column/row drag autoscroll; JS reads their rect for scroll speed (GridScrollArea.tsx:185-187, 256-258)
- [GridScrollShadows](/packages/x-data-grid/src/components/GridScrollShadows.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `(root)` → inset — UNRELATED: `0` positional anchoring of the shadow overlay; variant insets use JS-set `--DataGrid-*` vars (useGridDimensions.ts:222-227)
- [GridShadowScrollArea](/packages/x-data-grid/src/components/GridShadowScrollArea.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `&::after` → width, height — UNRELATED: 4px sticky scroll-shadow strip
- [GridSkeletonLoadingOverlay](/packages/x-data-grid/src/components/GridSkeletonLoadingOverlay.tsx) — EXCLUDED: all lines UNRELATED (skeleton)
  - `(root)` → minWidth, width, height — UNRELATED: skeleton overlay layout fill; cell sizes are JS-driven from `dimensions` and `--width` (GridSkeletonLoadingOverlay.tsx:166-177, 235-240)
- [GridColumnMenuContainer](/packages/x-data-grid/src/components/menu/columnMenu/GridColumnMenuContainer.tsx) — EXCLUDED: all lines UNRELATED (popover width)
  - `(root)` → minWidth — UNRELATED: structural popover width (`248`) of the column menu list
- [GridPanel](/packages/x-data-grid/src/components/panel/GridPanel.tsx) — EXCLUDED: all lines UNRELATED (popover width)
  - `(root)` → maxWidth — UNRELATED: structural popover cap (`calc(100vw - spacing(2))`)
- [GridMainContainer](/packages/x-data-grid/src/components/virtualization/GridMainContainer.tsx) — EXCLUDED: all lines UNRELATED (anchor)
  - `(root)` → width — UNRELATED: panel-anchor width `calc(100% - hasScrollY * scrollbarSize)`, positional anchoring from JS-set vars (useGridDimensions.ts:218-219)
- [GridVirtualScrollbar](/packages/x-data-grid/src/components/virtualization/GridVirtualScrollbar.tsx) — EXCLUDED: all lines UNRELATED (scrollbar)
  - `(root)` → --size — UNRELATED: `calc(max(var(--DataGrid-scrollbarSize), 14px))` mirrors measured scrollbar size (useGridDimensions.ts:219)
  - `(root)` → width, height — DYNAMIC: `var(--size)` plus `--DataGrid-headersTotalHeight` / `--DataGrid-hasScroll*` from packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:217-225; the content size is also computed in JS at GridVirtualScrollbar.tsx:113-118
  - `& > div` → width, height — DYNAMIC: `var(--size)`, same source
- [GridVirtualScroller](/packages/x-data-grid/src/components/virtualization/GridVirtualScroller.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → height — UNRELATED: layout fill (`100%`) on the scroller
  - `(root)` → marginTop — UNRELATED: `auto` on the infinite-loading trigger positioner, positional anchoring
- [GridVirtualScrollerFiller](/packages/x-data-grid/src/components/virtualization/GridVirtualScrollerFiller.tsx) — EXCLUDED: all lines DYNAMIC or UNRELATED (filler)
  - `(root)` → width — DYNAMIC: `var(--DataGrid-rowWidth)` set by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:220
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → height — UNRELATED: layout fill (`100%`) on pinned filler slots; filler row height is JS-set from `scrollbarSize` (GridVirtualScrollerFiller.tsx:66-79)

### Data Grid Pro (`x-data-grid-pro`)

- [GridEditMultiSelectCell](/packages/x-data-grid-pro/src/components/cell/GridEditMultiSelectCell.tsx) — in scope above; these lines are not:
  - `(root)` → width — DYNAMIC: packages/x-data-grid-pro/src/components/cell/GridEditMultiSelectCell.tsx:321 sets `--_width` from `colDef.computedWidth`
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `& .${inputBaseClasses.root}.${inputBaseClasses.sizeSmall}` → minHeight — DYNAMIC: packages/x-data-grid-pro/src/components/cell/GridEditMultiSelectCell.tsx:322 sets `--_rowHeight` from `gridRowHeightSelector`
- [GridMultiSelectCell](/packages/x-data-grid-pro/src/components/cell/GridMultiSelectCell.tsx) — in scope above; these lines are not:
  - `(root)` → maxHeight — UNRELATED: popover scroll clamp (52 * 4)
  - `(root)` → width — DYNAMIC: packages/x-data-grid-pro/src/components/cell/GridMultiSelectCell.tsx:294 sets `--_width` from `colDef.computedWidth`
  - `(root)` → boxSizing — UNRELATED: boxSizing
- [GridMultiSelectChips](/packages/x-data-grid-pro/src/components/cell/GridMultiSelectChips.tsx) — in scope above; these lines are not:
  - `(root)` → width, height — UNRELATED: layout fill (100%)
- [GridDetailPanel](/packages/x-data-grid-pro/src/components/GridDetailPanel.tsx) — EXCLUDED: all lines DYNAMIC (JS-set vars)
  - `(root)` → width — DYNAMIC: calc of `--DataGrid-rowWidth` set by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:220 and `--DataGrid-scrollbarSize`
- [useGridInfiniteLoadingIntersection](/packages/x-data-grid-pro/src/hooks/features/serverSideLazyLoader/useGridInfiniteLoadingIntersection.tsx) — EXCLUDED: all lines UNRELATED (intersection sentinel)
  - `(root)` → width, height — UNRELATED: 0×0 intersection-observer trigger element

### Data Grid Premium (`x-data-grid-premium`)

- [GridAiAssistantPanel](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanel.tsx) — in scope above; these lines are not:
  - `(root)` → width — UNRELATED: structural panel width (380)
  - `(root)` → maxHeight — UNRELATED: layout (`none`)
  - `(root)` → boxSizing — UNRELATED: boxSizing
- [GridAiAssistantPanelConversation](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanelConversation.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (100%)
- [GridChartsPanelChart](/packages/x-data-grid-premium/src/components/chartsPanel/chart/GridChartsPanelChart.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (100%)
- [GridChartsPanelCustomize](/packages/x-data-grid-premium/src/components/chartsPanel/customize/GridChartsPanelCustomize.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (100%)
- [GridChartsPanelDataBody](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataBody.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (100%)
- [GridChartsPanel](/packages/x-data-grid-premium/src/components/chartsPanel/GridChartsPanel.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → marginRight — UNRELATED: layout fill (`auto`)
- [FormulaBar](/packages/x-data-grid-premium/src/components/formulaBar/FormulaBar.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → maxWidth — UNRELATED: layout (30% preview clamp)
- [GridAggregationHeader](/packages/x-data-grid-premium/src/components/GridAggregationHeader.tsx) — in scope above; these lines are not:
  - `(root)` → minWidth — UNRELATED: flex min-width reset (0)
- [GridFormulaEditable](/packages/x-data-grid-premium/src/components/GridFormulaEditable.tsx) — in scope above; these lines are not:
  - `(root)` → minWidth — UNRELATED: flex min-width reset (0) on editable; popover panel 220 structural width
  - `(root)` → maxWidth — UNRELATED: structural popover width (360)
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → maxHeight — UNRELATED: popover list scroll clamp (240)
- [GridFormulaEditor](/packages/x-data-grid-premium/src/components/GridFormulaEditor.tsx) — in scope above; these lines are not:
  - `(root)` → width, height — UNRELATED: layout fill (100%); surface width/height are JS-written (:555, :517)
  - `(root)` → boxSizing — UNRELATED: boxSizing
- [GridPivotPanelBody](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelBody.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (100%)
- [GridPivotPanelHeader](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelHeader.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → marginRight — UNRELATED: layout fill (`auto`)
- [GridFormulaReferenceOverlay](/packages/x-data-grid-premium/src/components/GridFormulaReferenceOverlay.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `(root)` → width, height, boxSizing — UNRELATED: 0×0 overlay anchor and JS-positioned rects
- [GridFormulaRowNumberCell](/packages/x-data-grid-premium/src/components/GridFormulaRowNumberCell.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → width — UNRELATED: layout fill (100%)
- [ResizablePanelHandle](/packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx) — EXCLUDED: all lines UNRELATED (resize handle)
  - `(root)` → height, width — UNRELATED: resize handle (8px strip / 100% fill)
- [Sidebar](/packages/x-data-grid-premium/src/components/sidebar/Sidebar.tsx) — EXCLUDED: all lines UNRELATED (structural container width)
  - `(root)` → width, minWidth, maxWidth — UNRELATED: structural resizable container width; drag writes inline `width` (packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx:97)

### Date Pickers Community (`x-date-pickers`)

- [DateTimePickerToolbar](/packages/x-date-pickers/src/DateTimePicker/DateTimePickerToolbar.tsx) — in scope above; these lines are not:
  - `(root)` → width — UNRELATED: ampmSelection landscape `width: 100%` layout fill
- [DigitalClock](/packages/x-date-pickers/src/DigitalClock/DigitalClock.tsx) — in scope above; these lines are not:
  - `(root)` → width — UNRELATED: `100%` layout fill (and MobileDateTimePicker.tsx:130 re-sets it via sx)
  - `&:first-of-type` → marginTop — DYNAMIC: packages/x-date-pickers/src/DigitalClock/DigitalClock.tsx:239 subtracts a literal 4 matching this margin when positioning the active item
- [PickersToolbar](/packages/x-date-pickers/src/internals/components/PickersToolbar.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: landscape `auto`
  - `(root)` → maxWidth — UNRELATED: landscape 160 structural toolbar column width
  - `(root)` → width — UNRELATED: content slot `100%` layout fill
- [MonthCalendar](/packages/x-date-pickers/src/MonthCalendar/MonthCalendar.tsx) — in scope above; these lines are not:
  - `(root)` → width — UNRELATED: DIALOG_WIDTH structural grid width
  - `(root)` → boxSizing — UNRELATED:
- [MultiSectionDigitalClockSection](/packages/x-date-pickers/src/MultiSectionDigitalClock/MultiSectionDigitalClockSection.tsx) — in scope above; these lines are not:
  - `(root)` → width — DYNAMIC: packages/x-date-pickers/src/DateTimePicker/DateTimePickerToolbar.tsx:356 and :442 set the toolbar hour/minute/meridiem button `sx.width` from the same MULTI_SECTION_CLOCK_SECTION_WIDTH (48) so digits align over the columns; packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerToolbar.tsx:143 likewise; packages/x-date-pickers-pro/src/DesktopTimeRangePicker/DesktopTimeRangePicker.tsx:59 sets item minWidth via sx
- [PickersInputBase](/packages/x-date-pickers/src/PickersTextField/PickersInputBase/PickersInputBase.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED:
  - `(root)` → width — UNRELATED: root `100%` fullWidth fill, sectionsContainer 182px intrinsic field width, sectionContent `fit-content`
  - `(root)` → height — UNRELATED: activeBar indicator height 2 (range underline decoration)
- [Clock](/packages/x-date-pickers/src/TimeClock/Clock.tsx) — in scope above; these lines are not:
  - `(root)` → height, width — DYNAMIC: clock face 220 and am/pm button width 36 mirror CLOCK_WIDTH/CLOCK_HOUR_WIDTH; packages/x-date-pickers/src/TimeClock/shared.ts:5-6 and :49 use CLOCK_WIDTH as the pointer-to-value center/inner-ring threshold on offsets taken from getBoundingClientRect at Clock.tsx:277; ClockNumber.tsx:124/:135 and ClockPointer.tsx:130 derive positions/height from it
- [TimePickerToolbar](/packages/x-date-pickers/src/TimePicker/TimePickerToolbar.tsx) — in scope above; these lines are not:
  - `(root)` → marginTop — UNRELATED: hourMinuteLabel landscape `auto`
  - `(root)` → marginRight — UNRELATED: ampmSelection `auto`
- [YearCalendar](/packages/x-date-pickers/src/YearCalendar/YearCalendar.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: root `100%` fill (buttonFiller 36 pairs with YearCalendarButton, see there)
  - `(root)` → width — UNRELATED: DIALOG_WIDTH structural grid width
  - `(root)` → boxSizing — UNRELATED:
- [DateCalendar](/packages/x-date-pickers/src/DateCalendar/DateCalendar.tsx) — EXCLUDED: only line is DYNAMIC (VIEW_HEIGHT paired in JS sx)
  - `(root)` → height — DYNAMIC: packages/x-date-pickers/src/DesktopDateTimePicker/DesktopDateTimePicker.tsx:55 and packages/x-date-pickers/src/MobileDateTimePicker/MobileDateTimePicker.tsx:124 re-assert the same VIEW_HEIGHT (336) via `sx` on the sibling clock columns, so a CSS-only change to the calendar height leaves the clock column at 336
- [DayCalendarSkeleton](/packages/x-date-pickers/src/DayCalendarSkeleton/DayCalendarSkeleton.tsx) — EXCLUDED: all lines UNRELATED (skeleton)
  - `(root)` → margin — UNRELATED: skeleton placeholder (week `2px 0`, day `0 2px`; day size is a JS `width`/`height` prop at :103)
- [PickersModalDialog](/packages/x-date-pickers/src/internals/components/PickersModalDialog.tsx) — EXCLUDED: all lines UNRELATED (structural dialog; unnamed internal slot, no theme key)
  - `& .${dialogClasses.paper}` → minWidth — UNRELATED: DIALOG_WIDTH structural dialog width
  - `&:first-of-type` → padding — UNRELATED: resets DialogContent padding to 0 so the fixed-width view fills the paper
- [PickerViewRoot](/packages/x-date-pickers/src/internals/components/PickerViewRoot/PickerViewRoot.tsx) — EXCLUDED: all lines UNRELATED (unnamed internal slot, structural view box)
  - `(root)` → width — UNRELATED: DIALOG_WIDTH structural view width (MobileDateTimePicker.tsx:119 re-sets it via sx)
  - `(root)` → maxHeight — UNRELATED: VIEW_HEIGHT structural view box; no theme name to target (see DateCalendar for the JS pairing)
  - `(root)` → margin — UNRELATED: `0 auto` centering
- [useStaticPicker](/packages/x-date-pickers/src/internals/hooks/useStaticPicker/useStaticPicker.tsx) — EXCLUDED: all lines UNRELATED (structural)
  - `(root)` → minWidth — UNRELATED: DIALOG_WIDTH structural static-layout width on an unnamed internal wrapper
- [MultiSectionDigitalClock](/packages/x-date-pickers/src/MultiSectionDigitalClock/MultiSectionDigitalClock.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → width — UNRELATED: `100%` layout fill (MobileDateTimePicker.tsx:119 re-sets it via sx)
- [PickersLayout](/packages/x-date-pickers/src/PickersLayout/PickersLayout.tsx) — EXCLUDED: all lines UNRELATED (grid layout)
  - `& .${pickersLayoutClasses.toolbar}` → maxWidth — UNRELATED: `max-content` grid placement
- [Outline](/packages/x-date-pickers/src/PickersTextField/PickersOutlinedInput/Outline.tsx) — EXCLUDED: all lines UNRELATED (notched-outline legend geometry synced to the label transform)
  - `(root)` → minWidth — UNRELATED: fieldset `0%`
  - `(root)` → width — UNRELATED: legend `auto` reset
  - `(root)` → height — UNRELATED: legend 11 synced to its 11px lineHeight (notch geometry)
  - `(root)` → maxWidth — UNRELATED: legend 0.01/100% notch open/close animation
  - `(root)` → margin — UNRELATED: fieldset reset 0
  - `(root)` → padding — UNRELATED: fieldset `0 8px` notch inset tied to the label translate, not a density axis
  - `& > span` → paddingLeft, paddingRight — UNRELATED: legend text 5/5 notch gap, same coupling
- [PickersTextField](/packages/x-date-pickers/src/PickersTextField/PickersTextField.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → maxWidth — UNRELATED: `100%`
- [ClockNumber](/packages/x-date-pickers/src/TimeClock/ClockNumber.tsx) — EXCLUDED: all lines DYNAMIC (clock geometry)
  - `(root)` → height, width — DYNAMIC: packages/x-date-pickers/src/TimeClock/ClockNumber.tsx:124 and :135 compute the number translate from CLOCK_HOUR_WIDTH; shared.ts:49 uses it for the inner-ring hit test
- [ClockPointer](/packages/x-date-pickers/src/TimeClock/ClockPointer.tsx) — EXCLUDED: all lines DYNAMIC/UNRELATED (clock geometry)
  - `(root)` → width — UNRELATED: hand thickness 2 / thumb 4 (thumb border derives from CLOCK_HOUR_WIDTH at :82)
  - `(root)` → height — DYNAMIC: packages/x-date-pickers/src/TimeClock/ClockPointer.tsx:130 sets the hand height inline from CLOCK_WIDTH
  - `(root)` → boxSizing — UNRELATED:

### Date Pickers Pro (`x-date-pickers-pro`)

- [DateRangeCalendar](/packages/x-date-pickers-pro/src/DateRangeCalendar/DateRangeCalendar.tsx) — in scope above; these lines are not:
  - `(root)` → minWidth — UNRELATED: 312 structural month-column width on the unnamed internal DayCalendar wrapper
- [useStaticRangePicker](/packages/x-date-pickers-pro/src/internals/hooks/useStaticRangePicker/useStaticRangePicker.tsx) — EXCLUDED: all lines UNRELATED (structural)
  - `(root)` → minWidth — UNRELATED: DIALOG_WIDTH structural static-layout width on an unnamed internal wrapper

### Tree View Community (`x-tree-view`)

- [TreeItem](/packages/x-tree-view/src/TreeItem/TreeItem.tsx) — in scope above; these lines are not:
  - `(root)` → width, boxSizing, minWidth, margin — UNRELATED: Content/Label `width: 100%` fill, `boxSizing: border-box`, Label `minWidth: 0` overflow fix, Root/GroupTransition `margin: 0; padding: 0` resets; ErrorIcon 7px dot is an indicator
- [TreeItemLabelInput](/packages/x-tree-view/src/TreeItemLabelInput/TreeItemLabelInput.tsx) — in scope above; these lines are not:
  - `(root)` → width, boxSizing — UNRELATED: `width: 100%` fill, `boxSizing: border-box`
- [TreeItemLoader](/packages/x-tree-view/src/TreeItemLoader/TreeItemLoader.tsx) — in scope above; these lines are not:
  - `(root)` → margin, boxSizing — UNRELATED: `margin: 0` list reset, `boxSizing: border-box`
- [RichTreeView](/packages/x-tree-view/src/RichTreeView/RichTreeView.tsx) — EXCLUDED: all lines UNRELATED (ul list reset to 0 on structural container)
  - `(root)` → padding, margin — UNRELATED: `padding: 0; margin: 0` list-style reset on the `ul` container, no spacing value to scale
- [SimpleTreeView](/packages/x-tree-view/src/SimpleTreeView/SimpleTreeView.tsx) — EXCLUDED: all lines UNRELATED (ul list reset to 0 on structural container)
  - `(root)` → padding, margin — UNRELATED: `padding: 0; margin: 0` list-style reset on the `ul` container, no spacing value to scale
- [TreeItemDragAndDropOverlay](/packages/x-tree-view/src/TreeItemDragAndDropOverlay/TreeItemDragAndDropOverlay.tsx) — EXCLUDED: all lines UNRELATED (drag placeholder)
  - `(root)` → marginLeft — UNRELATED: drag-and-drop placeholder overlay; `calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))` where `--TreeView-indentMultiplier` is defined nowhere in `packages/` (consumed only here), `--TreeView-itemDepth` is JS-set (useTreeItem.ts:230)

### Tree View Pro (`x-tree-view-pro`)

- [RichTreeViewPro](/packages/x-tree-view-pro/src/RichTreeViewPro/RichTreeViewPro.tsx) — EXCLUDED: all lines UNRELATED (container reset + virtualizer fill); row height is the `itemHeight` prop (DYNAMIC → defaultProps, default 32 at packages/x-tree-view-pro/src/internals/RichTreeViewProStore/RichTreeViewProStore.utils.ts:11-20, read by the virtualizer at packages/x-tree-view-pro/src/components/RichTreeViewVirtualizedItems.tsx:65)
  - `(root)` → padding, margin — UNRELATED: `padding: 0; margin: 0` list-style reset on the `ul` container
  - `&[data-virtualized]` → height, width — UNRELATED: `100%` fill of the virtualizer scroll container (containerProps from LayoutList, RichTreeViewVirtualizedItems.tsx:82-97)

### Charts Community (`x-charts`)

- [ChartsLabelMark](/packages/x-charts/src/ChartsLabel/ChartsLabelMark.tsx) — in scope above; these lines are not:
  - `& > *` → width, height — UNRELATED: `100%` fill of the mark box
- [PiecewiseColorLegend](/packages/x-charts/src/ChartsLegend/PiecewiseColorLegend.tsx) — in scope above; these lines are not:
  - `(root)` → width — UNRELATED: `fit-content` structural sizing
- [Toolbar](/packages/x-charts/src/Toolbar/Toolbar.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED: `border-box`
- [ChartsLabelGradient](/packages/x-charts/src/ChartsLabel/ChartsLabelGradient.tsx) — EXCLUDED: thickness is a prop (DYNAMIC → defaultProps `MuiChartsLabelGradient.thickness`), rest are fills
  - `&.${labelGradientClasses.horizontal}` → width — UNRELATED: `100%` fill of the legend grid cell
  - `&.${labelGradientClasses.horizontal} > .${labelGradientClasses.mask}` → height, width — DYNAMIC → defaultProps: `height: ownerState.thickness` from the `thickness` prop (default 12, packages/x-charts/src/ChartsLabel/ChartsLabelGradient.tsx:112); `width: 100%` fill
  - `&.${labelGradientClasses.vertical}` → height — UNRELATED: `100%` fill
  - `&.${labelGradientClasses.vertical} > .${labelGradientClasses.mask}` → width, height — DYNAMIC → defaultProps: `width: ownerState.thickness` from the `thickness` prop (ChartsLabelGradient.tsx:89,112); `height: 100%` fill
  - `&.${labelGradientClasses.vertical} > .${labelGradientClasses.mask} > > svg` → height — UNRELATED: `100%` fill of the mask
- [ChartsLayerContainer](/packages/x-charts/src/ChartsLayerContainer/ChartsLayerContainer.tsx) — EXCLUDED: drawing-area box, prop-driven and observed
  - `(root)` → width, height — DYNAMIC: `ownerState.width ?? '100%'` / `ownerState.height ?? '100%'` from the chart `width`/`height` props (ChartsLayerContainer.tsx:28-30,102) and this element is the ResizeObserver target that computes the drawing area in packages/x-charts/src/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.ts:140-149
- [ChartsSvgLayer](/packages/x-charts/src/ChartsSvgLayer/ChartsSvgLayer.tsx) — EXCLUDED: all lines UNRELATED (absolute fill)
  - `(root)` → width, height, inset — UNRELATED: `100%` / `100%` / `inset: 0` absolute fill of the layer container
- [ChartsWrapper](/packages/x-charts/src/ChartsWrapper/ChartsWrapper.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → height, minHeight — UNRELATED: `height: 100%; minHeight: 0` under the `extendVertically` variant, grid container fill

### Charts Pro (`x-charts-pro`)

- [ChartsToolbarDivider](/packages/x-charts-pro/src/ChartsToolbarPro/internals/ChartsToolbarDivider.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: `50%` relative to toolbar height
