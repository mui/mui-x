# MUI X density overrides — scope and porting log

Companion to `unstable_enhanceDensity` in every package that ships one (`packages/x-data-grid*/src/density/`, `x-date-pickers*`, `x-tree-view*`, `x-charts*`; shared helpers in `x-internals/src/densityTheme/`). It lives in the grid package because the grid was ported first. The checklist below lists the components whose static size/spacing the enhancers port, with the decision per line; the fix log records what broke under the Material UI density chain and how each was fixed.

Derived by reading every non-deprecated component's styled bodies and their JavaScript consumers on this branch. A line is **KEEP** when a theme `styleOverrides` change of that property is plain CSS with no JavaScript reading or producing the value, and it affects density (padding, margin, gap, control/icon/item sizes). **DYNAMIC → defaultProps** lines are density-relevant but JavaScript-owned (row/header/item heights fed to a virtualizer, prop-driven vars) — the enhancer must set them through `defaultProps`, never CSS. Everything else (layout fills, popover widths, overlays, fillers, skeletons, handles, SVG geometry, JavaScript-set vars) is listed in the appendix with its reason.

Totals: **85 components in scope** (5 DYNAMIC → defaultProps lines), 41 components excluded. Re-scanned 2026-11-24 after the Material UI 9.6.0 bump: the only new components were the Premium computed columns panel (6).

## Decisions

- **Icons keep material's small size (2026-11-24).** The grid hardcodes `fontSize="small"` on its icons (84 uses in 44 files across the grid tiers, pickers and Charts Pro), and several parts put icons in a small `IconButton`. Under density these render material's small glyph, `iconSize - xxSmall` (12px at the default scale). The enhancers no longer restate them to `iconSize`: a rule like `.slot svg { fontSize }` outranks the `MuiSvgIcon` class, so a user's icon override or `sx` stopped working inside those slots, and every new part needed another rule. Theme `defaultProps` can't change them either, because an explicit prop always wins over a default. Cost: icons in medium buttons (toolbar, column menu rows) are 12px in a 32px box. To enlarge X icons, scope an override to the grid:

  ```js
  const largerIcons = { '& .MuiSvgIcon-fontSizeSmall': { fontSize: 'var(--mui-iconSize)' } };
  createTheme({
    components: {
      MuiDataGrid: { styleOverrides: { root: largerIcons, menu: largerIcons, panel: largerIcons } },
    },
  });
  ```

  `menu` and `panel` are needed because they render outside the grid root.

- **The charts' SVG drawing stays out of density (2026-11-26).** The Charts enhancers cover the HTML parts only: legends, tooltips, the toolbar, axis value labels. A trial of every SVG size a theme can reach found that the sizes that would carry density can't move: the axis band size (`DEFAULT_AXIS_SIZE_*` and the per-chart `xAxis`/`yAxis` config) and the 3px tick label gap have no theme path, so a longer `tickSize` pushes the tick labels out of the SVG at low; line chart marks have no size path. What a theme can reach is partial (plot `margin`, scatter marker `r`, which would make a line and a scatter chart disagree) or changes weight rather than density (line and pie stroke widths). At low density a larger margin also takes area from the plot. Following density in the drawing needs theme-settable axis band size, tick label gap and mark size first, which is new API.
- **No source changes in this PR unless there is no other way (2026-11-24).** The PR adds enhancers, tests, this file and the density docs page. It does not convert `sx` or inline styles to `styled`, and adds no slots, class keys or props, unless no theme path can reach the value; those cases go to the follow-ups below. A value set through `sx` on an element with no theme slot of its own is reached with a nested selector from the nearest ancestor that has one: an existing stable class if the element has one, otherwise a selector with the element type (`'& > div'`). `'& > *'` ties with the `sx` class and loses. Moving the value into an unnamed `styled()` does not help either: a wrapper's styles land after the wrapped component's theme overrides, as `sx` does (measured on the Charts Pro zoom slider tooltip).

## Accepted tradeoffs

- A few emissions reach a material child through a nested selector, so a user's override of that child's own slot loses inside the X part: picker small-field adornment `IconButton` size, columns panel `FormControlLabel` gap, date range `DayCalendar` min height, tree loader icon container width, charts tooltip `caption` and `span`, header `Badge` top. Material avoids this with a private variable on the parent; these are kept because the child has no X-owned slot to put a plain declaration on.
- Header sort and filter counter badges keep material's standard badge (24px). The badge `top` is moved down so the 40px header doesn't clip it.
- Under `modularCssLayers`, values set through `sx` keep master's size (accepted 2026-11-26). An `sx` value lives in the `mui.sx` layer, above every theme rule, so the nested selectors that reach `sx` (Decisions, "No source changes in this PR") only apply without layers or with the single `@layer mui`. Affected: the desktop date time and date time range pickers' clocks and the shortcuts list keep master's caps (336, 360) next to a calendar of 300px at the default scale and 432px at low, and the Charts Pro zoom slider tooltip keeps `paddingX: 0.5` (4px instead of 8px at low). Fixing it would mean moving those values out of `sx`, a source change this PR does not make.

## Follow-ups (need source changes, not part of the enhancers)

- Sizes set as inline styles, which no theme rule can override without `!important`: prompt pending spinner (`size={20}` on `CircularProgress`), tree loader skeleton checkbox (`<Skeleton width={24} height={24}>`).
- Row reorder column width (50px, no prop; see the checkbox column entry below).
- Mobile date-time-range picker: its clock keeps master's `sx` caps (359px, 320 wide). Master doesn't match its day and clock views either (614 vs 638 at the default scale), and the range calendar's height has no emitted formula to match.
- ~~Computed columns parts with no class key (list item button, editor body, reference search and lists) can't be reached from the theme.~~ Wrong (2026-11-26): a slot with no class key still resolves `styleOverrides` by its slot name, so the enhancer emits them under loosely typed keys. Ported.
- Tree data depth indent: `GridTreeDataGroupingCell` sets `marginLeft: vars.spacing(depth * offsetMultiplier)` inline and ignores `--DataGrid-cellOffsetMultiplier`, so it stays 16px per level. A source change would read the variable as the row grouping cells do.
- Chart type illustrations in the charts panel: `style={{ width: 32, height: 32 }}` inline.
- Under `modularCssLayers`: the prompt entry's template-literal `styled` (needed for its keyframes) lands directly in `@layer mui`, above `mui.theme`, so its `padding` beats the theme (10px instead of `small`); the edit multi-select's unnamed `styled(GridMultiSelectChips)` lands in `mui.custom` and keeps `0 10px`. Both render as the theme says without layers or with a single layer.
- Not scanned: `x-chat`, `x-scheduler`, `x-scheduler-premium`.

## Fixes uncovered (chain-only breakage, fixed in the enhancers)

- ~~toolbar, boolean cell, actions, edit cell, search field and pivot icons restated to `iconSize`~~ (2026-11-24): removed, see Decisions. They render material's small glyph.
- panels came out spacious: the earlier playground prototype maps master one step UP (8→small, 16→large); copied into batches 1-6. fix: same-size map (criterion 3) + actionable rows at `touchTarget` (criterion 11), all panel rows remapped 2026-10-09. prototype = which slots, not which step.
- checkbox / reorder columns 50px wide. width is a colDef number → `computedWidth` → inline `--width`; no CSS lever. checkbox: `checkboxColDef` is a root prop spread over the built-in definition (`useGridRowSelectionPreProcessors.ts`), so the community enhancer sets `defaultProps.checkboxColDef: { width, minWidth }` = `touchTarget + 2 * xxSmall`, the row height (40 at the default scale; master's 50px column leaves 4px each side of the 42px checkbox, so the cell is square; `minWidth` moves too, the inherited 50px floor would clamp it). A `checkboxColDef` passed as a prop replaces the theme one, as any prop does. reorder: `GRID_REORDER_COL_DEF` takes no prop (`useGridRowReorderPreProcessors.ts` builds the column from the constant alone), so it stays 50px; a follow-up would add a `rowReorderColDef`-style root prop to the grid.
- playground vars fell back to literals. nested `ThemeProvider` reusing the outer prefix (`mui`) skips its style sheet. fix: enhanced theme gets `cssVarPrefix: 'density'`.
- ~~Premium: `chartsPanel*` (19 styled slots), `formulaEditor`/`formulaEditable`/`formulaAutocompletePopper` have NO `GridClasses` key → no theme override surface at all. port blocked until upstream adds keys.~~ Wrong (2026-11-26, measured): `styled(…, { name: 'MuiDataGrid', slot })` resolves `styleOverrides[<slot>]` whether or not `GridClasses` lists the key; the missing key only blocks TypeScript. The Premium enhancer types these keys loosely (`SlotWithoutClassKey`) and ports the charts panel and the computed columns list, editor body and reference pane. They have no utility class, so nested selectors still can't target them. Formula bar inner parts are unnamed `styled('div')`s and stay unreachable.
- multi-select overflow measured with the wrong gap (2026-11-26). The overflow measurer renders a hidden `MultiSelectChipsRoot` without the `multiSelectCell` class and reads its computed `gap` (GridMultiSelectMeasurer.tsx:61), so it measured master's 4px while the cells used `xxSmall` (8px low, 2px high). fix: the gap moved from the root-nested `multiSelectCell` / `editMultiSelectCell` rules to the `multiSelectChips` slot key, which reaches the cells and the measurer.
- grouping indent fixed at 16px per level. row grouping cells and the grouping footer cell indent by `calc(var(--DataGrid-cellOffsetMultiplier) * depth * spacingUnit)`. fix (2026-11-26): the Pro root sets the unitless multiplier to `medium / spacingUnit` from the px scale, so one level is the `medium` step (master's 16px at the default scale; 24 low, 8 high). Tree data ignores the variable (follow-up above).
- modular layers (2026-11-26): the theme layer beats the grid's own nested rules, so `cell--editing` lost its 1px inset and the edit input got material's block padding and auto height. fix: `cell` restates `&.cell--editing { padding: 1 }`; `editInputCell` restates `& input { padding: 0 xSmall; height: 100% }`. Identical without layers.
- adapter `FormControlLabel` gap fixed at 4px in panels (2026-11-26): the adapter's internal unnamed `styled` lands after the theme. fix: nested from the named owner (`pivotPanelField`, `chartsPanelDataField`: gap only, so the checkbox's `-xSmall` pull survives; `chartsPanelSection`, `computedColumnsPanelEditorBody`: gap + `margin: 0`).
- 4 keys silently dropped: `columnHeader--filter`, `rowReorderIcon`, `multiSelectCell`, `editMultiSelectCell` exist in `GridClasses` but not in `gridClassesOverrides` (root resolver list) and have no styled slot of their own → `styleOverrides.<key>` ignored, no error. fix: nest `& .MuiDataGrid-<key>` under `root`. check list before trusting a key.
- header filter row: prototype's `paddingBlock: small` = 16px left for a 28px input in the 40px row. fix: `xxSmall` (same inset the row formula uses).
- checkbox column got `0 8px`. `cell` emission lands after master's `cellCheckbox { padding: 0 }` reset (same specificity). fix: restate `paddingInline: 0` on `cellCheckbox` + `columnHeaderCheckbox`. same class of leak: any master reset that follows the rule we override — grep the master file for later resets of the same prop (Pro: `rowReorderCellContainer`).
- footer stayed 52. grid's internal `GridPagination` rule `.MuiToolbar-root { minHeight: 51 }` outranks a nested `& .MuiTablePagination-toolbar` by sheet order. fix: nest `.MuiTablePagination-root .MuiTablePagination-toolbar` (one class more). footer lands 49 = 1px border + toolbar 48 (content), 1px over the 48 bar; same late-correction quirk master's 51 comments on.
- search clear button pull. grid internal adornment rule (0,3,0) holds a fixed `-6px`. fix: owning slot restates material 9.6.0's small edge-end pull, `(iconSize - smallBox) / 2` (-6 at the default scale), with `.MuiIconButton-edgeEnd` in the selector, so it follows the scale. (Corrected 2026-11-24: the earlier `touchTarget / -4` was material's medium formula.)
- quick filter trigger 36→16px. slot `width/height: min-content`, box came from IconButton padding; material: explicit box + `padding: 0`. fix: slot `width/height: touchTarget`. `--trigger-width` followed.

- pickers calendar kept a blank band. `DateCalendar` hardcodes `height: VIEW_HEIGHT` (336); with the day grid shrunk to `touchTarget` the content ends 36px short. fix: emit the view height as the same sum master hardcodes (header block + 7 rows), and the year list `maxHeight` as 7 rows (master's 280).
- pickers calendar cut off at low density (touchTarget 44, xxSmall 8): the last week row was hidden and the days shrank to 37.7px. `PickerViewRoot` still applied master's `maxHeight: 336` and `width: 320`, so the 432px view was capped, and 7 day columns of 52px (364px) did not fit in 320px. The month and year grids wrapped at the same width (3 pills of 88px plus 2 gaps of 32px = 328px). fix: `MuiDateCalendar.root` takes `maxHeight: none` and `width: max(320px, (touchTarget + xxSmall) * 7 + 2 * large)`, and `MuiMonthCalendar.root` / `MuiYearCalendar.root` take the same width. Measured in Chromium with Material UI's low, medium and high recipes: low is 428 × 432 with 44px days, three months and three or four years per row, nothing clipped; medium (320 × 300) and high (320 × 216) are unchanged.
- pickers day gutters: the 2px day margin maps to half the smallest step (`xxSmall / 2`). A full step would make each column 40px again and cancel the smaller day.
- pickers year fillers (`YearCalendarButtonFiller`) have a styled slot but no class key in `YearCalendarClasses`, so the key does not typecheck. fix: nest `& > div:empty` under `MuiYearCalendar.root`.
- pickers toolbar values clipped. `PickersToolbarButton = styled(Button)` holds h3/h4 headline text; material's enhancer sizes medium Buttons `height: touchTarget`, so the value overflowed its box and sat below the `:` separator (am/pm stack 53→64). fix: `MuiPickersToolbarButton.root { minHeight: 0 }` (9.6.0 sizes Buttons with `minHeight`, so the earlier `height: auto` stopped working; measured am/pm stack 53.4).
- picker field labels lost their position (rendered at 0,0 inside the field). material's enhancer places every `InputLabel` with `translate(var(--_inlinePad), var(--_restY))`, read with no fallback, and only its own `OutlinedInput`/`FilledInput`/`Input` write the vars (`.MuiInputLabel-root:has(~ &)`). fix: each picker input writes the same values for its label, and its sections container takes material's input padding, so a picker field and a `TextField` of the same variant and size measure the same (outlined 32/28, filled 48/44, standard 32/28).
- small picker fields grew to 32. the open picker button is a medium `IconButton` whatever the field size (master: 40 = the small field). fix: small `PickersInputBase` sizes adornment IconButtons with `minWidth/minHeight: touchTarget - xxSmall` (9.6.0 uses min sizes, which beat a smaller `width/height`) and the small edge pull. Measured: small field 28, same as a small `TextField`.
- picker adornments touched the field value. 9.6.0 moves the adornment spacing from `InputAdornment` margins to `MuiInputBase.root { gap }`; `PickersInputBase` is not an InputBase. fix: `MuiPickersInputBase.root { gap: xSmall }`, `xxSmall` when small.
- filled picker start adornment offset. 9.6.0 reads `--_filledInputPadTop/Bottom`, which only `MuiFilledInput` writes. fix: `MuiPickersFilledInput.root` writes both from its own paddings.
- clock am/pm buttons became 36×32 ovals (`padding: 0` + `minHeight: touchTarget`). fix: `MuiClock.amButton/pmButton { minWidth: 0, minHeight: 0, height: 36 }` (the clock face stays fixed).
- picker action bar 64px (DialogActions `padding: medium`, `gap: small`). fix: `MuiPickersLayout.actionBar { padding: xSmall, gap: xSmall }`, a `touchTarget + medium` bar (48).
- arrow switcher buttons drifted apart: the edge pull shrank to `(iconSize - touchTarget) / 2`. fix: spacer `width: touchTarget - iconSize`, so the two boxes touch as in master.
- header filter row trailing icon sat 16px from the cell edge (8 + the small button's air). fix: `paddingRight: xSmall + (iconSize - smallBox) / 2`, so it lines up with the header menu icon; selector `.columnHeader.columnHeader--filter` to beat the community `columnHeader` inset.
- multi-select editor tags 24 vs cell chips 28 (Autocomplete is medium, its input small). fix: `--_height` and `--_tagHeight` set to `smallBox` under `editMultiSelectCellPopperContent`.
- long text expand button ended 1px outside the cell (`right: -9` assumed master's 10px inset). fix: `right: 1px - xSmall` under `&.longTextCell` (one class more than the button's own rule).
- small bespoke clickables had no 24px hit area (long text corner buttons 20px, prompt changes toggle about 20px, tree item expand icon 16px). fix: material's `::before` target on each. The tree item checkbox grows its hidden `input` instead, because a click on a pseudo-element of the checkbox root does not toggle selection.
- header badges clipped 2.6px at the top of the 40px header. fix: badge `top: (1lh - xxSmall + 1px) / 2`.
- columns panel footer label gap stayed `theme.spacing(0.5)`. fix: same `xxSmall` gap as the body rows.
- Charts Pro zoom slider tooltip padding is set through `sx` (`paddingX: 0.5`, on master too), which outranks `MuiChartsTooltip.paper`. Moving it into an unnamed `styled()` would not help: a wrapper's styles also land after the wrapped component's theme overrides (measured). fix: `MuiChartsZoomSliderTooltip.root { '& > div': { paddingInline: xxSmall } }`. The paper has no stable class, and `& > *` ties with the `sx` class (0,1,0) and loses on insertion order; `& > div` is (0,1,1). Measured 4px at the default scale, 8px with `xxSmall: 8`.
- long text and multi-select view popups sat 2px left of the cell: their Popper `offset` is a fixed `-10` (master's cell inset), passed in JavaScript, and the enhancer moves the inset to `xSmall`. fix: popup content `marginLeft: 10px - xSmall` (physical, as the offset is; in RTL the popup aligns by its right edge, so the margin has no effect there). Measured 0px from both cell edges.
- the long text corner buttons' 24px target first extended 1px past the cell, which made the `overflow: hidden` cell scroll 1px when the button took focus (`scrollLeft`/`scrollTop` 1). fix: the `::before` target is anchored to the button's bottom-right corner and grows up and left only.
- tree item loading icon fixed at 12px (`size` from `getLoadingContainerProps`). fix: `MuiTreeItem.defaultProps.slotProps.loadingIcon.size = iconSize - xxSmall`, the small icon size (12 at the default scale, as master; 16 at low, 10 at high). `slotProps.loadingIcon` is typed as `div` props upstream, so the enhancer types this one default with `CircularProgressProps`.
- header filter row taller than the grid allots once the `density` prop is set. The grid multiplies `headerFilterHeight` by the density factor (0.7 / 1.3), writes it as each cell's inline `height` and places the body with the same number, so the height is JavaScript-owned: a cell that grows through CSS (master's `minHeight: 'min-content'`) overlaps the first data row (measured 4px at medium compact, 7px at high). The enhancer first used the row height (`touchTarget + 2 * xxSmall`, 40), which left no room in compact: 37px of content in a 28px slot. The filter labels and master's compact input (`height: 20` + 2px padding) are fixed px that don't follow the scale, so a compact row needs master's 39px whatever the scale. fix: Pro `defaultProps.headerFilterHeight = max(touchTarget + 2 * xSmall, DATA_GRID_PROPS_DEFAULT_VALUES.columnHeaderHeight)`: `touchTarget + 2 * xSmall` is the minimum, and master's 56 keeps the compact row at 39. Medium 56 / 39 / 72 (standard / compact / comfortable, master's exact numbers), low 68 / 47 / 88, high 56 / 39 / 72. The cell also takes `minHeight: 0` and its `IconButton`s size to the cell (`height: min(100%, smallBox)`, square, no block margin), so a custom smaller `headerFilterHeight` clips instead of overlapping. Measured at every scale and density: no overlap, controls inside the cell, labels fully visible (screenshots, light and dark).
- scale check (2026-11-25): the review pages accept `?scale=low|high` and `?layers=modular`; every X element's padding, margin, gap and size was compared at low vs high, and any non-zero value equal at both scales was reviewed. Misses found: the pivot panel switch's label gap (the grid adapter's `FormControlLabel` hardcodes `theme.spacing(0.5)`; fix: `pivotPanelSwitch` `&.MuiDataGrid-pivotPanelSwitch { gap: xxSmall }`, one class above the adapter's), and the charts gradient legend thickness (`MuiChartsLabelGradient.defaultProps.thickness = iconSize - xxSmall`, 12 at the default scale as master). Everything else equal at both scales is text height, clock face geometry, scrollbars, handles, structural widths or material's own fixed values (`MuiList` `paddingBlock: 8`, the outlined notch padding).
- range calendar did not resize in single-layer CSS (the docs app and an app without layers): inside `DateRangeCalendar`, `MuiDayCalendar.styleOverrides.slideTransition` is not applied (verified with a plain theme override, no density), so the week container kept master's 240px: 24px of blank space at medium, six 52px rows in 240px at low. fix: `MuiDateRangeCalendar.monthContainer` nests `& .MuiDayCalendar-slideTransition { minHeight }`. Measured 300 / 432 / 220 (medium / low / high), equal to the single calendar.
- desktop date-time-range clock capped at master's 360px through `sx` next to a range calendar that grows to 432px at low. fix (Pro): `MuiPickersLayout.root` `&:has(.MuiDateRangeCalendar-root)` caps the clock at `max(360px, calendar view height)`. Measured: clock = calendar at every scale.
- modular CSS layers (`modularCssLayers`): material's density rules sit in the theme layer, above X's component styles, so X values that win by specificity in a single layer lost to them. Master itself renders identically in both modes (0 differences), so each case is restated in the X enhancers: picker toolbar buttons `padding: 0` and `textTransform: 'none'` (the toolbar was 116px wider), clock am/pm `paddingInline: 4`, `DigitalClock` list and `MultiSectionDigitalClockSection` root `padding: 0`, `DigitalClock` first item `marginTop: 4` (scroll code), grid label rows `margin: 0`, pivot switch `margin: 0` + `marginRight: auto`, right-aligned header menu icon `marginRight: auto`. After: X components render the same in single-layer and modular mode, except the grid adapter's compact checkbox padding (4px vs 0 inside an unchanged box, no visible change).
- picker clock columns and the shortcuts list kept master's `sx` caps (`maxHeight: VIEW_HEIGHT` = 336, mobile/static clock `width: DIALOG_WIDTH` = 320), so they stopped matching the resized calendar: desktop date-time clock 336 next to a 300px calendar at medium (432 at low, 216 at high); static/mobile date-time with digital clock views jumped in size when switching to the time view; shortcuts stretched the row past the calendar. fix: `MuiPickersLayout.root` caps them at the calendar view height (and the static/mobile clock at the calendar view width) from nested selectors, scoped with `:has()`: `&:has(.MuiDateCalendar-root)` for the desktop row and the shortcuts, `&:has(.MuiDateTimePickerTabs-root)` for the static/mobile date-time layout (not the toolbar class: the date-time-range toolbar carries `MuiDateTimePickerToolbar-root` too, and the community package can't name Pro's range classes to exclude it). (0,3,0) beats the `sx` rules (0,2,0). Measured at medium, low and high: the clock equals the calendar and the layout no longer jumps; the desktop and static time pickers, range shortcuts and the desktop date-time-range picker are unchanged. If a static/mobile date-time picker hides its tabs, the rule does not match and master's caps apply.
- `MuiTimeRangePickerTabs` / `MuiTimeRangePickerToolbar` resolve theme overrides by name (`styled(..., { name })`) but are missing from `x-date-pickers-pro`'s theme augmentation, so `components.MuiTimeRange*` does not typecheck. fixed upstream: master added both to the augmentation (#24284), so the Pro enhancer no longer types them locally.
- tree item checkbox box 24→32 squeezed to 25.5. `TreeItemCheckbox = styled(MuiCheckbox)` with `padding: 0` (box = glyph); material's enhancer sizes every Checkbox to `touchTarget`. fix: `MuiTreeItem.checkbox { width/height: iconSize }`.
- charts components missing from the theme augmentation: `MuiChartsAxisHighlightValue`, `MuiChartsLabelMark`, `MuiContinuousColorLegend`, `MuiPiecewiseColorLegend`, `MuiChartsToolbar`, `MuiChartsHeatmapTooltip` resolve overrides by name but `components.<name>` does not typecheck. fix: `ChartsDensityComponents` types them loosely in the enhancer. The charts enhancer imports `../themeAugmentation` so the typed keys (`MuiChartsLegend`, `MuiChartsTooltip`) resolve when the Premium package compiles it.

## Porting steps (one per checkbox below)

Pattern source of truth: `@mui/material` 9.6.0 (from mui/material-ui#48749), `packages/mui-material/src/styles/enhanceDensity.ts` + `densityScale.ts`. Any new case not covered by the rules → look there first, copy the pattern, then add it to the rules list in the PR description.

1. **Pick the component.** Open its KEEP lines below and the master rule in source. Confirm the line is still KEEP after any rebase.
2. **Decide the slot.** Slot = the `gridClasses` key the master selector targets (`cell`, `columnHeader`, …). A key only works if the element has its own `styled(..., { slot })` OR the key is in `gridClassesOverrides` (`gridClasses.ts`, root resolver list) — otherwise the override is dropped silently: nest `& .MuiDataGrid-<key>` under `root` (in-root elements only; portaled ones need their own slot). Compound master selector → one slot per call. Component rendered by Pro/Premium → that tier's enhancer, even when the CSS sits in community `GridRootStyles.ts`.
3. **Decide the property.** Logical property of the axis density changes (`paddingInline`, `paddingBlock`, `marginInlineEnd`), not master's shorthand. Physical only when JavaScript reads the physical value.
4. **Decide the value.** Spacing: master px → the step of the SAME size (2-4 → `xxSmall`, 5-8 → `xSmall`, 10-12 → `small`, 16 → `medium`, 20-24 → `large`); most insets/gaps land on `xSmall`/`xxSmall`, never one step up (the prototype did; corrected 2026-10-09). Sizing: boxes → `calc()` off `touchTarget`, glyphs → `iconSize` (`getDensitySizing(theme)`); actionable rows (triggers, field rows, drop zones, editable bars) → `height: touchTarget`, no block padding; bars that only hold controls → `touchTarget + medium`. Zero resets, `auto`/`unset`, UNRELATED, DYNAMIC → skip (DYNAMIC → `defaultProps`).
   4c. **Check later resets.** Grep master for a zero/auto of the same property on a sibling selector that comes AFTER the rule you override (`cellCheckbox { padding: 0 }` after `cell { padding }`). Your emission lands last and leaks into it; restate the reset on that slot.
   4a. **Check `min-content` boxes.** Grep the component for `min-content`. An icon button sized that way carried its box through padding; under the material enhancer (explicit box, `padding: 0`) it collapses to the glyph. Restate `width`/`height: touchTarget` on that slot.
   4d. **Check `sx`.** Grep the component for `sx=` with literal values. `sx` outranks the element's own theme slot; reach it from a named ancestor (see Decisions), don't move it into `styled`.
   4b. ~~**Check the icons.**~~ Superseded 2026-11-24 (see Decisions): icons with `fontSize="small"` keep material's small glyph; add no icon-size rule.
5. **Write it.** `addStyleOverride(components, 'MuiDataGrid', '<slot>', { <prop>: spacing('<key>') })` with `const { spacing } = theme` — keyed spacing from material's enhancer, no formatter in X. Master nested under a state class → nest the same selector inside the slot object. One `addStyleOverride` call per slot per enhancer.
6. **Record.** Add the row to the mapping table in the PR description (slot, master, emission, tier). Extend the community test (vars + plain expectation) or the tier's test.
7. **Check.** From the repo root: ESLint on the density dirs, prettier via `node -e "require('child_process').execSync('pnpm exec prettier --write <dirs>',{stdio:'ignore'})"`, `tsc --noEmit` in each of the three grid packages, vitest `--config packages/x-data-grid/vitest.config.jsdom.mts src/density`.
8. **Measure.** Render the component under an enhanced theme next to a plain one (the density docs demo at `/x/common-concepts/density/` covers the main parts; anything else needs a temporary page) and measure the slot AND every interactive child (trigger buttons, inputs, their open states) with Playwright, at the low and high recipes. Measured values must equal the emitted step px, and the enhanced render must look right (nothing clipped or overlapping, controls aligned): a number that matches with a broken picture is a failed step.
9. **Tick.** Check the box below with the date.

## Data Grid

### Data Grid Community (`x-data-grid`) — 15 in scope, 14 excluded

- [x] [GridEditInputCell](/packages/x-data-grid/src/components/cell/GridEditInputCell.tsx) — ported 2026-10-09: `& input { paddingInline: xSmall }` (aligned to the cell inset; master's 16 vs 10 made the value jump on edit entry); since 2026-11-26 `& input { padding: 0 xSmall; height: 100% }` so modular layers keep master's block values. Root `1px 0` is a focus-outline inset, no emission
  - `(root)` → padding — KEEP: static `1px 0` on the edit input root; nothing measures the edit cell
  - `& input` → padding — KEEP: static `0 16px` inner padding of the edit input; cell box is JavaScript-sized but input padding only squeezes content
- [x] [GridOverlay](/packages/x-data-grid/src/components/containers/GridOverlay.tsx) — ported 2026-11-26: `overlay` gap xSmall (loading and no-rows content gap; master 8)
- [x] [GridEditLongTextCell](/packages/x-data-grid/src/components/cell/GridEditLongTextCell.tsx) — ported 2026-10-09: value paddingInline xSmall; popper content paddingInline `xSmall - 1px`, paddingBlock `(rowHeight - 1px - 1lh) / 2` (master 15.5 = (52 - 1 - 20) / 2). Textarea `0` reset: no emission
  - `(root)` → padding — KEEP: static `0` reset on the textarea slot (`EditLongTextCellTextarea`); no measurement
  - `(root)` → paddingInline — KEEP: static `10` on the value slot and `9` on the popper content slot; mirrors cell padding, nothing reads it
  - `(root)` → paddingBlock — KEEP: static `15.5` on the popper content slot; nothing reads it
- [x] [GridLongTextCell](/packages/x-data-grid/src/components/cell/GridLongTextCell.tsx) — ported 2026-10-09: popper content same inset as the edit popup. Corner button `padding: 2`: its slot (`LongTextCellCornerButton`) has no `gridClasses` key, so no override surface; hairline inset, no emission
  - `(root)` → paddingBlock, paddingInline — KEEP: static `15.5` / `9` on the popper content slot; nothing measures it
  - `(root)` → padding — KEEP: static `2` on the corner button slot (icon button padding); no measurement
- [x] [GridColumnsManagement](/packages/x-data-grid/src/components/columnsManagement/GridColumnsManagement.tsx) — ported 2026-10-09 (body/header/footer/emptyText; header carries the search-field clear-pull rule; footer label gap 2026-11-24)
  - `(root)` → padding — KEEP: static `vars.spacing(...)` on body, header, footer and empty-text slots; panel is portaled, nothing measures it
- [x] [GridFooterContainer](/packages/x-data-grid/src/components/containers/GridFooterContainer.tsx) — ported 2026-10-09: `minHeight: calc(touchTarget + medium)` (material's TablePagination bar) + nested pagination toolbar at `- 1px`
  - `(root)` → minHeight — KEEP: static `52`; grid dimensions come from a ResizeObserver on the root/main (x-virtualizer/src/features/dimensions.ts:742), so a smaller footer just yields a taller measured viewport. Paired constant: GridPagination's `& .MuiToolbar-root { minHeight: 51 }` and MUI TablePagination's own toolbar `minHeight: 52` must be overridden together or the footer stays 52
- [x] [GridRootStyles](/packages/x-data-grid/src/components/containers/GridRootStyles.ts) — community rows ported 2026-10-09 (`cell`, `columnHeader`, `columnHeaderTitleContainer`, `menuIcon` + alignRight twin, `actionsCell`, checkbox-column resets restated); Pro rows ported in the Pro enhancer (header filter, reorder, toggles, multi-select)
  - `(root)` → paddingTop, paddingBottom — PORTED as `paddingBlock: xxSmall` root-nested (prototype's `small` would leave 16px for a 28px input in the 40px row). KEEP: flattened from `columnHeader--filter` (lines 322-323, `8`) and `root--densityCompact .columnHeader--filter` (lines 329-330, `4`); static. Row height itself is JavaScript-set (`headerFilterHeight`, x-data-grid-pro/src/hooks/features/columnHeaders/useGridColumnHeaders.tsx:165) so padding only squeezes the input. An override must also target the `root--densityCompact` rule or the built-in density prop wins there
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
  - `& .MuiToolbar-root` → minHeight — KEEP: static `51`; paired with GridFooterContainer `minHeight: 52` (footer border) and MUI TablePagination toolbar `minHeight: 52`; override all three together, no JavaScript reads it
- [x] [GridRowCount](/packages/x-data-grid/src/components/GridRowCount.tsx) — ported 2026-10-09 (`marginInline: large`)
  - `(root)` → margin — KEEP: static `vars.spacing(0, 2)`; footer text, no measurement
- [x] [GridSelectedRowCount](/packages/x-data-grid/src/components/GridSelectedRowCount.tsx) — ported 2026-10-09 (`marginInline: large`)
  - `(root)` → margin — KEEP: static `vars.spacing(0, 2)`; footer text, no measurement
- [x] [GridFilterFormBase](/packages/x-data-grid/src/components/panel/filterPanel/GridFilterFormBase.tsx) — ported 2026-10-09: `filterForm` gap medium
  - `(root)` → gap — KEEP: static `vars.spacing(1.5)` between filter form fields; portaled panel, no measurement
- [x] [GridPanelContent](/packages/x-data-grid/src/components/panel/GridPanelContent.tsx) — ported 2026-10-09 nested under `panel` (the `panelContent` key also resolves on GridPanel's shell slot)
  - `(root)` → padding, gap — KEEP: static `vars.spacing(2.5, 1.5, 2, 1)` / `vars.spacing(2.5)`; portaled panel, no measurement
- [x] [GridPanelFooter](/packages/x-data-grid/src/components/panel/GridPanelFooter.tsx) — ported 2026-10-09 (`padding: medium`); GridPanelHeader (same `su(1)` padding) is exported but rendered by no grid panel, no emission
  - `(root)` → padding — KEEP: static `vars.spacing(1)`; no measurement
- [x] [GridToolbar](/packages/x-data-grid/src/components/toolbarV8/GridToolbar.tsx) — ported 2026-10-09 (`toolbarDivider`, `toolbarLabel` marginInline xSmall)
  - `(root)` → margin — KEEP: static `vars.spacing(0, 0.5)` on the divider and label slots; no measurement
- [x] [Toolbar](/packages/x-data-grid/src/components/toolbarV8/Toolbar.tsx) — ported 2026-10-09
- [x] [GridBooleanCell](/packages/x-data-grid/src/components/cell/GridBooleanCell.tsx) — glyph only (`fontSize="small"` on the cell icon), not in the original scan; no emission since 2026-11-24 (see Decisions)
- [x] [GridActionsCell](/packages/x-data-grid/src/components/cell/GridActionsCell.tsx) — `actionsCell` gap lives in GridRootStyles (`gridGap: su(1)` → small), 2026-10-09
- [x] [GridToolbarQuickFilter](/packages/x-data-grid/src/components/toolbar/GridToolbarQuickFilter.tsx) — trigger box restated off touchTarget 2026-10-09 (criterion 10); not in the original scan (its sizes are `min-content` / a var, which the rubric read as non-static)
  - `(root)` → minHeight — KEEP: static `52`; the toolbar sits above the main container and is outside `topContainerHeight` (headers only), root size is re-measured by ResizeObserver (x-virtualizer/src/features/dimensions.ts:742), so a shorter toolbar just yields a taller viewport
  - `(root)` → gap, padding — KEEP: `calc(var(--DataGrid-t-spacing-unit, <theme unit>) * n)`; the var is a static theme-derived definition (packages/x-data-grid/src/material/variables.ts:46), not JavaScript state; no measurement
- [x] [material/index](/packages/x-data-grid/src/material/index.tsx) — 2026-10-09; internal slots (no keys), each emitted at its owning grid slot:
  - `&.${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}` → marginRight — KEEP: static `theme.spacing(-0.75)` pull on the end adornment icon button; no measurement. PORTED at `columnsManagementHeader` + `toolbarQuickFilterControl` as `calc(touchTarget / -4)` (material's edge pull); selector adds `.MuiIconButton-edgeEnd` to outrank the internal rule
  - `(root)` → gap — KEEP: static `theme.spacing(0.5)` on FormControlLabel and `theme.spacing(1)` on ToggleButton; no measurement. FormControlLabel PORTED under `columnsManagement` (gap xSmall). ToggleButton renders only in Premium's charts panel → Premium batch
  - `(root)` → margin — KEEP: static `0` reset on FormControlLabel; no measurement. NO EMISSION: zero reset; it also cancels material's label pull-in, but the panel padding + box air already align the glyph with the search field edge (measured 24px both)
  - `(root)` → padding — KEEP: static `theme.spacing(0.5)` on the Checkbox `density: 'compact'` variant (passed only by GridColumnsManagement.tsx:313,335); an override must target that variant's specificity. NO EMISSION: material's enhancer gives the Checkbox an explicit border-box (`touchTarget`), so the padding no longer sizes anything (measured 32×32 with padding 4)

### Data Grid Pro (`x-data-grid-pro`) — 4 in scope, 2 excluded

- [x] [GridEditMultiSelectCell](/packages/x-data-grid-pro/src/components/cell/GridEditMultiSelectCell.tsx) — ported 2026-10-09: edit chip row `paddingInline: xSmall` + gap (root-nested, key unlisted); autocomplete `paddingBlock: xxSmall` and tag height `smallBox` under `editMultiSelectCellPopperContent`; measured on the docs demo 2026-11-24 (tags 28 = cell chips)
  - `(root)` → padding — KEEP: static `0 10px`; `calculateVisibleCount` budgets from the chips root border-box width and never subtracts padding (GridMultiSelectChips.tsx:154,194-199), so the +N math does not read it — an override only shifts the pre-existing clipping tolerance of the last visible chip by the padding delta; keep the value modest
  - `& .${inputBaseClasses.root}.${inputBaseClasses.sizeSmall}` → paddingBlock — KEEP: literal 4, input internal padding, nothing measures it
- [x] [GridMultiSelectCell](/packages/x-data-grid-pro/src/components/cell/GridMultiSelectCell.tsx) — ported 2026-10-09 (`multiSelectCellPopperContent` padding xSmall, gap xxSmall); popover not measured live
  - `(root)` → padding, gap — KEEP: `theme.spacing(1)` / `theme.spacing(0.5)` on the popover chip list; popper offset at :274 mirrors the cell's 10px padding, not this padding
- [x] [GridMultiSelectChips](/packages/x-data-grid-pro/src/components/cell/GridMultiSelectChips.tsx) — ported 2026-10-09, moved 2026-11-26: gap xxSmall on the `multiSelectChips` slot key (no class key, typed loosely), so the hidden overflow measurer reads the same gap as the cells
  - `(root)` → gap — KEEP: literal 4; overflow math reads the computed gap (packages/x-data-grid-pro/src/components/cell/GridMultiSelectMeasurer.tsx:61 `getComputedStyle(container).gap`) from the same `MultiSelectChips` slot, so a CSS override is followed
- [x] [GridHeaderFilterCell](/packages/x-data-grid-pro/src/components/headerFiltering/GridHeaderFilterCell.tsx) — ported 2026-10-09: input marginRight xSmall / marginBottom -xxSmall, operator label marginRight xSmall; the compact-density input height row stays dormant (grid `density` prop unset), no emission
  - `(root)` → height — KEEP: literal 20 on the compact-density input only; the cell box height comes from the `height` prop (JavaScript), the inner input is not measured
  - `(root)` → marginRight, marginBottom, paddingTop, paddingBottom — KEEP: `vars.spacing(...)` on the filter input and operator label, nothing measures them

### Data Grid Premium (`x-data-grid-premium`) — 24 in scope, 6 excluded

- [x] [GridAiAssistantPanel](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanel.tsx) — ported 2026-10-09: header `height: calc(touchTarget + medium)`, `padding: 0 xSmall 0 large`; title marginTop xxSmall; conversation title -xxSmall; footer gap/padding small. Width 380 not a KEEP row, untouched. NOT measured live: the trigger toggles `aria-expanded` but no panel element mounts in the harness; verify on the docs demo
  - `(root)` → height — KEEP: header literal 52 is a static bar height, nothing measures it; body literal 260 — UNRELATED: structural empty-state body height
  - `(root)` → padding, marginTop, gap — KEEP: `vars.spacing(...)` on header, title, footer
- [x] [GridAiAssistantPanelConversation](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanelConversation.tsx) — zero resets only, no emission
  - `(root)` → padding, margin — KEEP: literal 0 list reset; `scrollHeight` read at :56 is only for scroll-to-bottom and adapts
- [x] [GridAiAssistantPanelSuggestions](/packages/x-data-grid-premium/src/components/aiAssistantPanel/GridAiAssistantPanelSuggestions.tsx) — ported 2026-10-09: suggestions gap xSmall; list gap xSmall / padding small / margin -small; label gap small / paddingLeft xSmall
  - `(root)` → gap, padding, margin, paddingLeft — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [GridChartsPanelChart](/packages/x-data-grid-premium/src/components/chartsPanel/chart/GridChartsPanelChart.tsx) — ported 2026-11-26 through untyped slot keys: `chartTypeRoot` gap/padding xSmall; `chartTypeSelectorButton` gap xxSmall, `padding: small xSmall xSmall`. The 32px illustration is an inline style (follow-up)
  - `(root)` → gap, padding — KEEP: `vars.spacing(...)` on chart-type grid and buttons, nothing measures
- [x] [GridChartsPanelCustomize](/packages/x-data-grid-premium/src/components/chartsPanel/customize/GridChartsPanelCustomize.tsx) — ported 2026-11-26: `chartsPanelCustomizeSection` margin `xxSmall xSmall`; `chartsPanelSection` `padding: medium small`, gap large, adapter `FormControlLabel` gap xxSmall
  - `(root)` → margin, padding, gap — KEEP: `vars.spacing(...)` on section / panel, nothing measures
- [x] [GridChartsPanelDataBody](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataBody.tsx) — ported 2026-11-26, same map as the pivot panel: section margin `xxSmall xSmall`; section title marginRight small, gap xSmall; field list `paddingBlock: xxSmall`; placeholder `minHeight: touchTarget`, paddingInline xSmall
  - `(root)` → minHeight — UNRELATED: structural region minimums (84 available fields, 158 resizable sections); placeholder minHeight 38 — KEEP: static drop-zone row height, resize JavaScript only writes inline `height` (packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx:99) and CSS min clamps
  - `(root)` → margin, marginRight, gap, padding — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [GridChartsPanelDataField](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataField.tsx) — ported 2026-11-26, same map as the pivot field: `height: touchTarget`, `padding: 0 xSmall 0 medium`, gap xxSmall, label gap xxSmall; drag icon width iconSize; checkbox marginLeft -xSmall
  - `(root)` → height — KEEP: literal 32 item height; drop position reads the live rect (:294) so it adapts
  - `(root)` → width — KEEP: literal 16 drag-icon box, nothing measures
  - `(root)` → padding, gap, margin — KEEP: `vars.spacing(...)` and `-1px 0` border collapse, static
- [x] [GridChartsPanelDataSearch](/packages/x-data-grid-premium/src/components/chartsPanel/data/GridChartsPanelDataSearch.tsx) — ported 2026-11-26: padding xSmall plus the search-field clear pull
  - `(root)` → padding — KEEP: `vars.spacing(1)` static
- [x] [GridChartsPanel](/packages/x-data-grid-premium/src/components/chartsPanel/GridChartsPanel.tsx) — ported 2026-11-26: header gap `xxSmall / 2`, `padding: xSmall xxSmall 0 (xxSmall * 1.5)`; title marginLeft xxSmall; chart selection gap `xxSmall / 2`, `padding: (xxSmall * 1.5) xxSmall`. The material ToggleButton gap is material's (reported)
  - `(root)` → gap, padding, marginLeft — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [CollapsibleTrigger](/packages/x-data-grid-premium/src/components/collapsible/CollapsibleTrigger.tsx) — ported 2026-10-09: `height: calc(touchTarget + 2 * xxSmall)`, `paddingInline: medium`
  - `(root)` → height — KEEP: literal 40 trigger height, no collapse animation measures it
  - `(root)` → padding — KEEP: `vars.spacing(0, 1.5)` static
- [x] [FormulaBar](/packages/x-data-grid-premium/src/components/formulaBar/FormulaBar.tsx) — ported 2026-10-09 root only: minHeight row-high, paddingInline xSmall, gap small. Address/preview are class-less inner `styled('div')`s (no key, no class), unreachable; address minWidth 64 structural. Not measured live: the bar needs the `formula` feature dependency wired
  - `(root)` → minHeight — KEEP: literal 40 toolbar-row height; rendered inside the toolbar, no JavaScript reads it
  - `(root)` → minWidth — KEEP: literal 64 address cell width, static
  - `(root)` → padding, gap, paddingInline — KEEP: `vars.spacing(...)` static
- [x] [GridAggregationHeader](/packages/x-data-grid-premium/src/components/GridAggregationHeader.tsx) — `marginTop: -1` hairline nudge, no emission
  - `(root)` → marginTop — KEEP: literal -1 label nudge, static; header box height is JavaScript-owned but the label is not measured
- [x] [GridFormulaColumnHeaderLetter](/packages/x-data-grid-premium/src/components/GridFormulaColumnHeaderLetter.tsx) — ported 2026-10-09 (`marginInlineEnd: xSmall`); not rendered in the harness
  - `(root)` → marginInlineEnd — KEEP: `theme.spacing(0.75)` static
- [x] [GridFormulaEditable](/packages/x-data-grid-premium/src/components/GridFormulaEditable.tsx) — NO OVERRIDE SURFACE: the editable root is a class-less `styled('div')`, the popper slot `FormulaAutocompletePopper` has no key
  - `(root)` → padding — KEEP: editable `0 10px` inline padding mirrors the cell's 10px for alignment; JavaScript only writes `paddingBlock` inline in wrap mode (packages/x-data-grid-premium/src/components/GridFormulaEditor.tsx:475) and re-measures scroll sizes live; option/signature/list paddings static
  - `(root)` → margin — KEEP: literal 0 list reset
  - `(root)` → gap — KEEP: literal 8 option gap, static
- [x] [GridFormulaEditor](/packages/x-data-grid-premium/src/components/GridFormulaEditor.tsx) — NO OVERRIDE SURFACE: `FormulaEditor` / `FormulaEditorSurface` slots have no key
  - `(root)` → paddingInline — KEEP: literal 10 on the anchor value, mirrors cell padding, nothing measures it
- [x] [GridPivotPanelBody](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelBody.tsx) — ported 2026-10-09: section margin `xSmall small`, title marginRight medium / gap small, field list paddingBlock xSmall, placeholder `minHeight: calc(touchTarget + xxSmall)` / paddingInline small; region minimums structural
  - `(root)` → minHeight — UNRELATED: structural region minimums (84 available fields, 158 resizable sections); placeholder minHeight 38 — KEEP: static drop-zone row height, resize JavaScript only writes inline `height` (packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx:99) and CSS min clamps
  - `(root)` → margin, marginRight, gap, padding — KEEP: `vars.spacing(...)` static, nothing measures
- [x] [GridPivotPanelField](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelField.tsx) — ported 2026-10-09: `height: touchTarget`, `padding: 0 small 0 large`, gap xSmall, `marginInlineStart: xSmall` (prototype's drag-handle room), drag icon `width: iconSize`, checkbox `marginLeft: -small`; `-1px 0` border collapse untouched
  - `(root)` → height — KEEP: literal 32 item height; drop position reads the live rect (:259) so it adapts
  - `(root)` → width — KEEP: literal 16 drag-icon box, nothing measures
  - `(root)` → padding, gap, margin — KEEP: `vars.spacing(...)` and `-1px 0` border collapse, static
- [x] [GridPivotPanelHeader](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelHeader.tsx) — ported 2026-10-09: `height: calc(touchTarget + medium)`, gap small, `padding: 0 xSmall 0 small`
  - `(root)` → height — KEEP: literal 52 header bar height, nothing measures it
  - `(root)` → gap, padding — KEEP: `vars.spacing(...)` static
- [x] [GridPivotPanelSearch](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelSearch.tsx) — ported 2026-10-09: `padding: 0 small small` + search-field clear pull
  - `(root)` → padding — KEEP: `vars.spacing(0, 1, 1)` static
- [x] [GridPrompt](/packages/x-data-grid-premium/src/components/prompt/GridPrompt.tsx) — ported 2026-10-09: `padding: small small`; icon container `touchTarget + xxSmall` box, marginRight medium; change list gap xSmall / marginTop small; toggle gap xxSmall and a 24px hit area. Not rendered in the harness (needs a conversation)
  - `(root)` → width, height — KEEP: literal 36 icon box, static
  - `(root)` → padding, marginRight, gap, marginTop — KEEP: `vars.spacing(...)` static, nothing measures

- [x] [GridComputedColumnsPanelHeader](/packages/x-data-grid-premium/src/components/computedColumnsPanel/GridComputedColumnsPanelHeader.tsx) — ported 2026-11-24: `height: calc(touchTarget + medium)` (same bar as the pivot and AI headers), gap xSmall, `padding: 0 xSmall 0 small`. Measured 52 → 48
  - `(root)` → height — KEEP: literal 52 header bar, nothing measures it
  - `(root)` → gap, padding — KEEP: `vars.spacing(...)` static
- [x] [GridComputedColumnsPanelList](/packages/x-data-grid-premium/src/components/computedColumnsPanel/GridComputedColumnsPanelList.tsx) — ported 2026-11-24: `computedColumnsPanelListItem` gap xxSmall / `padding: 0 xSmall 0 xxSmall`, `computedColumnsPanelEmpty` padding medium. 2026-11-26 through untyped slot keys: list items `paddingBlock: xSmall`, item button gap xSmall / `padding: (xxSmall * 1.5) xSmall`, item text gap `xxSmall / 2`, list footer padding small
  - `(root)` → margin, padding, gap — KEEP: `vars.spacing(...)` static
  - `(root)` → width — KEEP: literal 20 formula badge box, static (no key)
- [x] [GridComputedColumnsPanelEditor](/packages/x-data-grid-premium/src/components/computedColumnsPanel/GridComputedColumnsPanelEditor.tsx) — ported 2026-11-24: field gap xSmall, formula `paddingBlock: xSmall`, preview gap xxSmall / `padding: xSmall small`, validation `paddingLeft: medium`, footer gap xSmall / padding small; panel root carries the search-field clear pull. 2026-11-26 through untyped slot keys: editor body gap medium / `padding: medium small` with the adapter `FormControlLabel` gap, field row gap xSmall. Measured on the docs demo and the coverage page
  - `(root)` → gap, padding — KEEP: `vars.spacing(...)` static
  - `(root)` → minHeight — KEEP: literal 72 formula box, a three-line editing area; left as is
- [x] [GridComputedColumnHeaderBadge](/packages/x-data-grid-premium/src/components/GridComputedColumnHeaderBadge.tsx) — ported 2026-11-24: `marginInlineEnd: xSmall`
  - `(root)` → marginInlineEnd — KEEP: `theme.spacing(0.75)` static

## Date Pickers

### Date Pickers Community (`x-date-pickers`) — 21 in scope, 10 excluded

- [x] [DateCalendar](/packages/x-date-pickers/src/DateCalendar/DateCalendar.tsx) — ported 2026-10-18: root `height: small + touchTarget + xxSmall + (touchTarget + xxSmall) * 7` (header block plus weekday row plus six weeks, the same sum as master's 336); `maxHeight: none` and `width: max(320px, (touchTarget + xxSmall) * 7 + 2 * large)` so the view grows past master's 336 × 320 box at low density
  - `(root)` → height — KEEP (moved from the appendix 2026-10-18): VIEW_HEIGHT is reused by DesktopDateTimePicker.tsx:55 and MobileDateTimePicker.tsx:124 only as `maxHeight` caps on the sibling clock columns, so a shorter calendar leaves that row at the clock height without tearing; standalone, a fixed 336 left a blank band under the shrunk day grid
- [x] [DayCalendar](/packages/x-date-pickers/src/DateCalendar/DayCalendar.tsx) — ported 2026-10-18: `weekDayLabel` / `weekNumberLabel` width `touchTarget`, height `touchTarget + xxSmall`, `marginInline` half xxSmall; `weekNumber` `touchTarget` box; `weekContainer` `marginBlock` half xxSmall; `slideTransition` + `loadingContainer` `minHeight: (touchTarget + xxSmall) * 6`
  - `(root)` → width, height — KEEP: literal 36/40 on weekDayLabel/weekNumberLabel and DAY_SIZE (36) on weekNumber; CSS-only, no JavaScript reads them; must move together with PickerDay `--PickerDay-size`
  - `(root)` → minHeight — KEEP: slideTransition/loadingContainer minHeight = (DAY_SIZE + 2*DAY_MARGIN)*6 = 240 is a build-time literal consumed by CSS only (PickersSlideTransition measures nothing); override alongside the day size or six rows no longer fill the box
  - `(root)` → margin — KEEP: weekContainer `2px 0`, labels `0 2px`, weekNumber `0 ${DAY_MARGIN}px`; static literals, no JavaScript consumer
  - `(root)` → padding — KEEP: weekNumber padding 0, static
- [x] [DatePickerToolbar](/packages/x-date-pickers/src/DatePicker/DatePickerToolbar.tsx) — ported 2026-10-18: `title` landscape variant `marginRight: medium`
  - `(root)` → margin — KEEP: title slot landscape `auto 16px auto auto`, static literal, no JavaScript consumer
- [x] [DateTimePickerToolbar](/packages/x-date-pickers/src/DateTimePicker/DateTimePickerToolbar.tsx) — ported 2026-10-18: root `paddingInline: medium`, desktop portrait variant `paddingLeft: large` + `paddingRight: 0` restated; `timeContainer` desktop portrait `gap: xSmall`, `marginRight: xxSmall`; `separator` mobile variant `marginLeft: xxSmall / 2`, `marginRight: xxSmall`; `ampmSelection` `marginLeft: small`, landscape variant `marginTop: xxSmall` + `marginLeft: 0` restated; `timeDigitsContainer` gap 1.5 left (sub-step hairline)
  - `(root)` → paddingLeft, paddingRight — KEEP: root 16/16 and desktop-portrait 24/0, static literals
  - `(root)` → gap — KEEP: timeContainer 9 (desktop portrait) and timeDigitsContainer 1.5 (desktop), static literals
  - `(root)` → marginRight — KEEP: timeContainer 4 (desktop portrait), static
  - `(root)` → margin — KEEP: separator `0 4px 0 2px` (0 on desktop) and ampmSelection landscape `4px 0 auto`, static
  - `(root)` → marginLeft — KEEP: ampmSelection 12, static (the hour/minute button `width` is a JavaScript `sx` prop at :356/:442, not a styled value, so it is outside this line)
- [x] [DigitalClock](/packages/x-date-pickers/src/DigitalClock/DigitalClock.tsx) — ported 2026-10-18: `MuiDigitalClock.item` (a MenuItem): `minHeight: touchTarget`, `paddingBlock: 0`, `paddingInline: medium`, `marginBlock: xxSmall / 2`, `marginInline: xxSmall`; first-item `marginTop: 4` left alone (DYNAMIC, the scroll code subtracts it as a literal); list `maxHeight` 232 left as the scroll viewport (denser items show more of the list)
  - `(root)` → maxHeight — KEEP: DIGITAL_CLOCK_VIEW_HEIGHT (232) literal; scroll-to-selected at :232-239 reads runtime `offsetTop`, not the constant
  - `(root)` → padding — KEEP: list 0, item `8px 16px`, static literals
  - `(root)` → margin — KEEP: item `2px 4px`, static; scroll uses measured offsetTop
- [x] [PickersArrowSwitcher](/packages/x-date-pickers/src/internals/components/PickersArrowSwitcher/PickersArrowSwitcher.tsx) — ported 2026-10-18: `spacer` width `large`
  - `(root)` → width — KEEP: spacer slot `theme.spacing(3)`, gap between the two arrow buttons, no JavaScript consumer
- [x] [PickersToolbar](/packages/x-date-pickers/src/internals/components/PickersToolbar.tsx) — ported 2026-10-18: root `padding: medium large`, landscape variant restates `padding: medium` (it resets the portrait padding after the base rule)
  - `(root)` → padding — KEEP: `theme.spacing(2, 3)` portrait, 16 landscape, static
- [x] [PickersToolbarButton](/packages/x-date-pickers/src/internals/components/PickersToolbarButton.tsx) — ported 2026-10-18, revised 2026-11-24: root `minHeight: 0` — material's enhancer gives every medium Button a `touchTarget` min height, which clipped the headline value and dropped it below the separator; padding/minWidth unchanged
  - `(root)` → minWidth — KEEP: literal 16, static (a JavaScript `width` prop may add `sx.width` on top, but minWidth stays CSS-owned)
  - `(root)` → padding — KEEP: literal 0, static
- [x] [MonthCalendar](/packages/x-date-pickers/src/MonthCalendar/MonthCalendar.tsx) — ported 2026-10-18: `rowGap: medium`, `paddingBlock: xSmall`, three-per-row `columnGap: large` (variant); `width` = the DateCalendar view width
  - `(root)` → width — KEEP: DIALOG_WIDTH (320) literal, CSS only; follows the DateCalendar view width or the pills wrap at low density
  - `(root)` → rowGap — KEEP: literal 16 (columnGap 24/0 per monthsPerRow), static, no JavaScript measurement in MonthCalendar
  - `(root)` → padding — KEEP: `8px 0`, static
- [x] [MonthCalendarButton](/packages/x-date-pickers/src/MonthCalendar/MonthCalendarButton.tsx) — ported 2026-10-18: `MuiMonthCalendar.button` pill: height `touchTarget`, width `2 * touchTarget`, radius `touchTarget / 2`
  - `(root)` → height, width — KEEP: literal 36×72 button box (borderRadius 18 pairs), static, no JavaScript consumer
- [x] [MultiSectionDigitalClockSection](/packages/x-date-pickers/src/MultiSectionDigitalClock/MultiSectionDigitalClockSection.tsx) — ported 2026-10-18: `item`: same actionable row as the digital clock with `paddingInline: xSmall`, first item `marginTop: xxSmall`; section and item widths stay (DYNAMIC, toolbar `sx` pairs)
  - `(root)` → maxHeight — KEEP: DIGITAL_CLOCK_VIEW_HEIGHT (232) literal; centering scroll at :209-224 reads runtime clientHeight/scrollHeight/offsetTop, not the constant
  - `(root)` → padding — KEEP: root 0, item 8, static
  - `(root)` → margin — KEEP: item `2px 4px`, static; scroll centering is runtime-measured
  - `&:first-of-type` → marginTop — KEEP: literal 4, no literal offset in the section scroll logic (unlike DigitalClock)
- [x] [PickerDay](/packages/x-date-pickers/src/PickerDay/PickerDay.tsx) — ported 2026-10-18: `--PickerDay-size: touchTarget`, `--PickerDay-horizontalMargin: xxSmall / 2` (the 2px gutter is half the smallest step; a full step would cancel the density gain)
  - `(root)` → --PickerDay-size — KEEP: defined as `${DAY_SIZE}px` literal; read only by CSS (width/height/borderRadius here, DateRangePickerDay pseudo-elements); no JavaScript reads it (grep `PickerDay-size` hits only styled bodies); pair with DayCalendar label widths and slideTransition minHeight
  - `(root)` → width, height — KEEP: `var(--PickerDay-size)`, CSS-only
  - `(root)` → --PickerDay-horizontalMargin — KEEP: `${DAY_MARGIN}px` literal, read only by CSS (margins here, DateRangePickerDay :88/:98 pseudo insets)
  - `(root)` → padding — KEEP: literal 0
  - `(root)` → marginLeft, marginRight — KEEP: `var(--PickerDay-horizontalMargin)`, CSS-only
- [x] [PickersCalendarHeader](/packages/x-date-pickers/src/PickersCalendarHeader/PickersCalendarHeader.tsx) — ported 2026-10-18: root `min/maxHeight: touchTarget` (the bar is as high as its arrow buttons), margins `small`/`xxSmall`, padding `large`/`small`; `label` `marginRight: xSmall`
  - `(root)` → maxHeight, minHeight — KEEP: literal 40/40 header row height, static, no JavaScript consumer
  - `(root)` → marginTop, marginBottom, paddingLeft, paddingRight — KEEP: 12/4/24/12 literals, static
  - `(root)` → marginRight — KEEP: label slot 6 literal (labelContainer/switchViewButton `auto` are layout, ignore)
- [x] [PickersFilledInput](/packages/x-date-pickers/src/PickersTextField/PickersFilledInput/PickersFilledInput.tsx) — ported 2026-10-18: root writes `--_restY` = mid of the padding, `--_shrinkY` 6px/4px, `--_inlinePad`; adornment `paddingLeft/Right: small`; `sectionsContainer` `paddingTop: medium + (touchTarget - 1lh) / 2` (small: `/ 4`), `paddingBottom` input pad, `paddingInline: small`, adornment zeros and hiddenLabel variants restated
  - `(root)` → paddingLeft, paddingRight, paddingTop, paddingBottom — KEEP: root adornment 12/12 and sectionsContainer 25/12/8/12 (small 21/4, hiddenLabel 16/17, 8/9) literals; range active-bar math at PickersInputBase.tsx:264/:289 measures offsetWidth/offsetLeft at runtime so it follows any padding; pair paddingTop with the Material InputLabel filled transform
- [x] [PickersInput](/packages/x-date-pickers/src/PickersTextField/PickersInput/PickersInput.tsx) — ported 2026-10-18: root `label + & { marginTop: small }`, writes `--_restY: small + input pad`
  - `label + &` → marginTop — KEEP: literal 16, static
- [x] [PickersInputBase](/packages/x-date-pickers/src/PickersTextField/PickersInputBase/PickersInputBase.tsx) — ported 2026-10-18: `sectionsContainer` `paddingBlock: (touchTarget - 1lh) / 2` (small: `(touchTarget - xxSmall - 1lh) / 2`), material's input padding; small root sizes adornment IconButtons to `touchTarget - xxSmall` (in master a medium button is exactly as high as a small field)
  - `(root)` → padding — KEEP: root 0 and sectionsContainer `4px 0 5px` literals; active-bar/offset math (:264, :289) is runtime-measured
  - `(root)` → paddingTop — KEEP: sectionsContainer small 1, static
- [x] [PickersOutlinedInput](/packages/x-date-pickers/src/PickersTextField/PickersOutlinedInput/PickersOutlinedInput.tsx) — ported 2026-10-18: root `paddingInline: small`, writes the label's `--_restY` (`(touchTarget - 1lh) / 2`, small variant) and `--_inlinePad` (`small`, negated under rtl); `sectionsContainer` `paddingBlock` as the base, small variant scoped
  - `(root)` → padding — KEEP: root `0 14px` and sectionsContainer `16.5px 0` (small `8.5px 0`) literals, static; runtime-measured active bar follows; pair horizontal padding with the InputLabel outlined transform
- [x] [Clock](/packages/x-date-pickers/src/TimeClock/Clock.tsx) — ported 2026-10-18: root `margin: medium`; face geometry stays (DYNAMIC)
  - `(root)` → margin — KEEP: root `theme.spacing(2)`, static, outside the measured face
- [x] [TimePickerToolbar](/packages/x-date-pickers/src/TimePicker/TimePickerToolbar.tsx) — ported 2026-10-18: `separator` `marginLeft: xxSmall / 2`, `marginRight: xxSmall`; `ampmSelection` as the date time toolbar
  - `(root)` → margin — KEEP: separator `0 4px 0 2px` and ampmSelection landscape `4px 0 auto`, static
  - `(root)` → marginLeft — KEEP: ampmSelection 12, static
- [x] [YearCalendar](/packages/x-date-pickers/src/YearCalendar/YearCalendar.tsx) — ported 2026-10-18: `rowGap: small`, `maxHeight: (touchTarget + xxSmall) * 7`; three-per-row `columnGap: large` + `paddingBlock: xSmall`, four-per-row `paddingInline: xxSmall / 2` (variants, the four-per-row reset comes after the base); fillers (slot without class key) nested as `& > div:empty`; `width` = the DateCalendar view width
  - `(root)` → width — KEEP: DIALOG_WIDTH (320) literal, CSS only; follows the DateCalendar view width or the pills wrap at low density
  - `(root)` → maxHeight — KEEP: MAX_CALENDAR_HEIGHT (280) literal; scroll-into-view at :295-308 measures clientHeight/offsetHeight at runtime
  - `(root)` → rowGap — KEEP: literal 12 (columnGap 24/0 per yearsPerRow), static
  - `(root)` → padding — KEEP: `6px 0` / `0 2px` literals, static
- [x] [YearCalendarButton](/packages/x-date-pickers/src/YearCalendar/YearCalendarButton.tsx) — ported 2026-10-18: `MuiYearCalendar.button`, same pill as the month button
  - `(root)` → height, width — KEEP: literal 36×72 button box (borderRadius 18 and YearCalendar buttonFiller 36×72 pair), static; scroll math reads runtime offsetHeight

### Date Pickers Pro (`x-date-pickers-pro`) — 8 in scope, 1 excluded

- [x] [createMultiInputRangeField](/packages/x-date-pickers-pro/src/internals/utils/createMultiInputRangeField/createMultiInputRangeField.tsx) — ported 2026-11-26: the root `Stack` has `spacing={2}` (16px between the inputs and the separator), overridable by the `spacing` prop, so the Pro enhancer sets `defaultProps.spacing = medium` on `MuiMultiInputDateRangeField`, `MuiMultiInputTimeRangeField` and `MuiMultiInputDateTimeRangeField` (a theme's own `spacing` wins)
- [x] [DateRangeCalendar](/packages/x-date-pickers-pro/src/DateRangeCalendar/DateRangeCalendar.tsx) — ported 2026-10-18: `monthContainer` nests `& .MuiDayCalendar-root { minHeight: (touchTarget + xxSmall) * 6 }` (the internal range DayCalendar has no key)
  - `(root)` → minHeight — KEEP: literal 240 = (DAY_RANGE_SIZE + 2·DAY_MARGIN)·6, CSS-only; the "internal" wrapper is the `monthContainer` slot (DateRangeCalendar.tsx:83 `overridesResolver: styles.monthContainer`, :620 `className={classes.monthContainer}`), so target `MuiDateRangeCalendar.styleOverrides.monthContainer` and move it together with `--PickerDay-size`
- [x] [DateRangePickerDay](/packages/x-date-pickers-pro/src/DateRangePickerDay/DateRangePickerDay.tsx) — ported 2026-10-18: root `--PickerDay-size: touchTarget`, `--PickerDay-horizontalMargin: xxSmall / 2`, as the community day; highlight/preview pseudo-elements read the vars
  - `(root)` → --PickerDay-size — KEEP: literal `36px`, read only by CSS (width/height/borderRadius); no JavaScript consumer; pair with DayCalendar labels and DateRangeCalendar minHeight
  - `(root)` → width, height — KEEP: `var(--PickerDay-size)`, CSS-only
  - `(root)` → --PickerDay-horizontalMargin — KEEP: literal `2px`, read by CSS only (margins and the :88/:98 highlight/preview pseudo insets)
  - `(root)` → padding — KEEP: literal 0
  - `(root)` → marginLeft, marginRight — KEEP: `var(--PickerDay-horizontalMargin)`, CSS-only
- [x] [DateTimeRangePickerTabs](/packages/x-date-pickers-pro/src/DateTimeRangePicker/DateTimeRangePickerTabs.tsx) — ported 2026-10-18: root `minHeight: touchTarget + small` (the strip holds a large Button, material's large box); `filler` width `touchTarget` (stands in for a navigation IconButton, 40 → the enhanced IconButton); 2026-11-26 `tabButton { textTransform: 'none' }` restated (material's enhancer copies `typography.button` into the Button override, which wins under modular layers and widened the button 18px)
  - `(root)` → minHeight — KEEP: literal 48 tab bar height, static, no JavaScript consumer
- [x] [DateTimeRangePickerToolbar](/packages/x-date-pickers-pro/src/DateTimeRangePicker/DateTimeRangePickerToolbar.tsx) — ported 2026-10-18: the community `DateTimePickerToolbar` desktop-portrait variant sets the inline padding (`paddingLeft: large`, `paddingRight: 0`). 2026-11-26: `startToolbar { paddingBottom: 0 }` restated, since under modular layers the `PickersToolbar` padding emission beat it
  - `(root)` → paddingBottom — KEEP: startToolbar literal 0 (gap between the stacked start/end toolbars), static
- [x] [PickersRangeCalendarHeader](/packages/x-date-pickers-pro/src/PickersRangeCalendarHeader/PickersRangeCalendarHeader.tsx) — ported 2026-10-18: `MuiDateRangeCalendar.monthContainer` nests `& > .MuiPickersArrowSwitcher-root { padding: small medium xxSmall }`
  - `(root)` → padding — KEEP: literal `12px 16px 4px 16px` on a `slot: 'internal'` wrapper that IS the header root (styled(PickersArrowSwitcher), rendered as the direct child of `monthContainer` in multi-calendar mode, DateRangeCalendar.tsx:620-626); no own key, and a `MuiPickersArrowSwitcher.root` override loses to the wrapper class (same specificity, injected later) — emit under `MuiDateRangeCalendar.styleOverrides.monthContainer: { "& > .MuiPickersArrowSwitcher-root": {…} }` (0,2,0 wins; single-calendar mode has PickersCalendarHeader as the child, so it is not hit)
- [x] [TimeRangePickerTabs](/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerTabs.tsx) — ported 2026-10-18: `tab` `minHeight: touchTarget` (material's Tab height), `gap: xSmall`
  - `(root)` → minHeight — KEEP: tab slot literal `48px`, static
  - `(root)` → gap — KEEP: tab slot `theme.spacing(1)`, static
- [x] [TimeRangePickerToolbar](/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerToolbar.tsx) — ported 2026-10-18: root `paddingTop: small`, `paddingBottom: xSmall`, `& .MuiPickersToolbar-title { paddingLeft: small }`, and since 2026-11-26 master's `paddingInline: 0` restated (modular layers gave it the `PickersToolbar` 24px); `container` mobile variant `rowGap: xSmall`; desktop `gap: 1` left (hairline)
  - `(root)` → padding — KEEP: `12px 0px 8px 0px` literal, static
  - `(root)` → rowGap — KEEP: container mobile 8, static
  - `(root)` → gap — KEEP: container desktop 1, static
  - `& .${pickersToolbarClasses.title}` → paddingLeft — KEEP: literal 12, static

## Tree View

### Tree View Community (`x-tree-view`) — 3 in scope, 3 excluded

- [x] [TreeItem](/packages/x-tree-view/src/TreeItem/TreeItem.tsx) — ported 2026-10-18: `content`: `minHeight: var(--TreeView-itemHeight, touchTarget)` (the row is the interactive box; a set `itemHeight` stays the floor so CSS never disagrees with the Pro virtualizer), `paddingBlock: 0`, `paddingRight: xSmall`, `paddingLeft: calc(xSmall + indentation * depth)` (indentation term kept), `gap: xSmall`; `iconContainer` width + glyph `iconSize`; `checkbox` box `iconSize` with its input grown to a 24px target (master sizes it to its glyph, material's enhancer gave it a `touchTarget` box the row squeezed to 25.5px); `label` editable variant `paddingLeft: xxSmall / 2`; indentation → `defaultProps.itemChildrenIndentation: small` (px number, the Pro reordering parses the prop) on `MuiSimpleTreeView` / `MuiRichTreeView`
  - `(root)` → padding, gap — KEEP: Content slot `padding: theme.spacing(0.5, 1)` and `gap: theme.spacing(1)` are static; with `itemHeight` unset (community default) the row height derives from padding + body1 line box, nothing measures it (only reorder DnD reads `rect.height` at drag time and adapts, itemPlugin.ts:118)
  - `(root)` → paddingLeft (Label, editable) — KEEP: static `2px`, pairs with TreeItemLabelInput `padding: 0 2px` so label and inline input align, override both together
  - `(root)` → width (IconContainer) — KEEP: static constant 16px (packages/x-tree-view/src/internals/constants.ts:6); TreeItemLoader iconContainer uses the same constant for alignment (TreeItemLoader.tsx:36), override both together
  - `(root)` → paddingLeft — DYNAMIC → defaultProps: Content `paddingLeft: calc(spacing(1) + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`; the indent var is set from the `itemChildrenIndentation` prop in packages/x-tree-view/src/internals/hooks/useTreeViewRootProps.ts:30 and the reorder plugin parses that same prop to compute the `move-to-parent` cursor threshold (packages/x-tree-view-pro/src/internals/plugins/itemsReordering/utils.ts:44-60, :91); the 8px base offset is a static literal and safe only if the var term is preserved, indent itself must change via `itemChildrenIndentation`
  - `(root)` → height — DYNAMIC → defaultProps: Content `height: var(--TreeView-itemHeight, unset)`; var set per item from the `itemHeight` prop in packages/x-tree-view/src/useTreeItem/useTreeItem.ts:231; in Pro the same store value feeds the virtualizer `rowHeight` (packages/x-tree-view-pro/src/components/RichTreeViewVirtualizedItems.tsx:49,65, default 32 from RichTreeViewProStore.utils.ts:20), so CSS alone would tear virtual row positioning
- [x] [TreeItemLabelInput](/packages/x-tree-view/src/TreeItemLabelInput/TreeItemLabelInput.tsx) — ported 2026-10-18: `MuiTreeItem.labelInput` `paddingInline: xxSmall / 2`, paired with the editable label
  - `(root)` → padding — KEEP: static `0 2px`, inline-edit input inset; pairs with TreeItem Label editable `paddingLeft: 2px`
- [x] [TreeItemLoader](/packages/x-tree-view/src/TreeItemLoader/TreeItemLoader.tsx) — ported 2026-10-18: root takes the same row as `TreeItem.content`, `& .MuiTreeItemLoader-iconContainer { width: iconSize }`; key typed locally (missing from the theme augmentation). NOT measured live: no loader row mounted in the harness (lazy children show the parent spinner)
  - `(root)` → padding, gap — KEEP: static `theme.spacing(0.5, 1)` / `theme.spacing(1)` mirroring TreeItem Content so loading rows match item height; override together with TreeItem
  - `& .${treeItemLoaderClasses.iconContainer}` → width — KEEP: static constant 16px (constants.ts:6), mirrors TreeItem IconContainer; override together
  - `(root)` → paddingLeft — DYNAMIC → defaultProps: same indent formula as TreeItem Content (`var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth, 0)`), var set from the `itemChildrenIndentation` prop in packages/x-tree-view/src/internals/hooks/useTreeViewRootProps.ts:30
  - `(root)` → height — DYNAMIC → defaultProps: `var(--TreeView-itemHeight, unset)` set in packages/x-tree-view/src/TreeItemLoader/TreeItemLoader.tsx:90 from the `itemHeight` store value (packages/x-tree-view/src/internals/components/RichTreeViewLoading.tsx:182); same value drives the Pro virtualizer row height

### Tree View Pro (`x-tree-view-pro`) — 0 in scope, 1 excluded

- Pro enhancer (2026-10-18): `MuiRichTreeViewPro.defaultProps` `itemHeight: touchTarget` (the virtualizer's row height, default 32) and `itemChildrenIndentation: small`; no styled slot of its own.

## Charts

### Charts Community (`x-charts`) — 7 in scope, 4 excluded

- [x] [ChartsAxisHighlightValueItem](/packages/x-charts/src/ChartsAxisHighlightValue/ChartsAxisHighlightValueItem.tsx) — ported 2026-10-18: `MuiChartsAxisHighlightValue.root` `padding: xxSmall xSmall`
  - `(root)` → padding — KEEP: static `theme.spacing(0.5, 1)`; the JavaScript-set `--min/--max/--space` vars only clamp the `translate` offset and use `100%` of the element's own box, so a padding change is absorbed (ChartsAxisHighlightValueItem.tsx:18,70-78)
- [x] [ChartsLabelMark](/packages/x-charts/src/ChartsLabel/ChartsLabelMark.tsx) — ported 2026-10-18: glyph sizes off `iconSize`: base `iconSize - 2px`, line `iconSize x iconSize / 2`, square `iconSize - 3px`, circle `iconSize - 1px` (master's 14 / 16x8 / 13 / 15 at the default 16)
  - `(root)` → width, height — KEEP: static `14px` legend/tooltip mark; nothing measures it, the tooltip `markContainer` is sized independently in CSS
  - `&.${labelMarkClasses.line}` → width, height — KEEP: static `16 x 8`
  - `&.${labelMarkClasses.square}` → height, width — KEEP: static `13 x 13`
  - `&.${labelMarkClasses.circle}` → height, width — KEEP: static `15 x 15`
- [x] [ChartsLegend](/packages/x-charts/src/ChartsLegend/ChartsLegend.tsx) — ported 2026-10-18: root `gap: medium`, `marginBlock/Inline: xSmall`, `& .MuiChartsLegend-series { gap: xSmall }`; `paddingInlineStart: 0` / button `padding: 0` are resets, skipped
  - `(root)` → gap, paddingInlineStart, marginBlock, marginInline — KEEP: static `theme.spacing(2)` / `0` (ul reset) / `theme.spacing(1)` / `theme.spacing(1)`; the legend occupies an `auto` grid track of ChartsWrapper and the drawing area is re-measured by ResizeObserver on the layer container (useChartDimensions.ts:140), no legend measurement exists in `packages/x-charts/src`
  - `button.${legendClasses.series}` → padding — KEEP: static `0` button reset; clickable series item inset
  - `& .${legendClasses.series}` → gap — KEEP: static `theme.spacing(1)` between mark and label
- [x] [ContinuousColorLegend](/packages/x-charts/src/ChartsLegend/ContinuousColorLegend.tsx) — ported 2026-10-18: root `gap: xxSmall`, `marginBlock/Inline: xSmall`
  - `(root)` → gap, paddingInlineStart, marginBlock, marginInline — KEEP: static `theme.spacing(0.5)` / `0` (ul reset) / `theme.spacing(1)` / `theme.spacing(1)`; same grid-track/ResizeObserver reasoning as ChartsLegend
- [x] [PiecewiseColorLegend](/packages/x-charts/src/ChartsLegend/PiecewiseColorLegend.tsx) — ported 2026-10-18: root `gap: xxSmall`, margins `xSmall`; `.item { gap: xxSmall }`; horizontal inline-start/end `gap: small` (same nesting as master)
  - `(root)` → gap, paddingInlineStart, marginBlock, marginInline — KEEP: static `theme.spacing(0.5)` / `0` (ul reset) / `theme.spacing(1)` / `theme.spacing(1)`; same grid-track/ResizeObserver reasoning as ChartsLegend
  - `button.${classes.item}` → padding — KEEP: static `0` button reset; clickable item inset
  - `.${classes.item}` → gap — KEEP: static `theme.spacing(0.5)` between mark and label
  - `&.${classes.horizontal} > &.${classes.inlineStart}, &.${classes.inlineEnd}` → gap — KEEP: static `theme.spacing(1.5)` between inline items
- [x] [ChartsTooltipTable](/packages/x-charts/src/ChartsTooltip/ChartsTooltipTable.ts) — ported 2026-10-18: `MuiChartsTooltip.table`: markContainer width `iconSize + xxSmall + small`, caption `padding: xxSmall small` + span `marginRight: small`; `row`: first/last `td` block inset `xxSmall`; `cell`: `.cell` `paddingInline: xSmall`, `.valueCell` `small`, first/last cell `small` (master's selector order kept so the first/last insets still win)
  - `& .${chartsTooltipClasses.markContainer}` → width — KEEP: static `calc(20px + theme.spacing(1.5))` cell gutter that holds the mark (max 16px); tooltip is positioned by Popper from a zero-size pointer anchor (packages/x-charts/src/ChartsTooltip/ChartsTooltipContainer.tsx:273) and re-measures the popper itself on update
  - `& caption` → padding — KEEP: static `theme.spacing(0.5, 1.5)`
  - `& caption > & span` → marginRight — KEEP: static `theme.spacing(1.5)`
  - `tr:first-of-type& td` → paddingTop — KEEP: static `theme.spacing(0.5)`
  - `tr:last-of-type& td` → paddingBottom — KEEP: static `theme.spacing(0.5)`
  - `&.${chartsTooltipClasses.cell}` → paddingLeft, paddingRight — KEEP: static `theme.spacing(1)`
  - `&.${chartsTooltipClasses.valueCell}` → paddingLeft, paddingRight — KEEP: static `theme.spacing(1.5)`
  - `td:first-of-type&, th:first-of-type&` → paddingLeft — KEEP: static `theme.spacing(1.5)`
  - `td:last-of-type&, th:last-of-type&` → paddingRight — KEEP: static `theme.spacing(1.5)`
- [x] [Toolbar](/packages/x-charts/src/Toolbar/Toolbar.tsx) — ported 2026-10-18: `MuiChartsToolbar.root` `gap: xxSmall / 2`, `padding: xxSmall`, `marginBottom: small`, `minHeight: touchTarget + 2 * xxSmall` (the bar is its IconButtons plus its block padding; 44 → 40)
  - `(root)` → minHeight — KEEP: static `44px` control-bar height; ChartsWrapper gives the toolbar an `auto` grid row (ChartsWrapper.tsx:166) and the drawing area is ResizeObserver-driven, the export plugin only looks the element up by class (packages/x-charts-pro/src/internals/plugins/useChartProExport/defaults.ts:5), no measurement
  - `(root)` → gap, padding, marginBottom — KEEP: static `theme.spacing(0.25)` / `theme.spacing(0.5)` / `theme.spacing(1.5)`

### Charts Pro (`x-charts-pro`) — 3 in scope, 0 excluded

- [x] [ChartsToolbarPro](/packages/x-charts-pro/src/ChartsToolbarPro/ChartsToolbarPro.tsx) — ported 2026-10-18: nothing to emit: the range buttons' `minWidth: unset` is a reset; the ToggleButtons ride material's emission
  - `& .MuiToggleButton-root` → minWidth — KEEP: static `unset` on the range ToggleButtons (styled name `MuiChartsToolbarRangeButtons`), control min-width, nothing measures it
- [x] [ChartsToolbarDivider](/packages/x-charts-pro/src/ChartsToolbarPro/internals/ChartsToolbarDivider.tsx) — ported 2026-10-18: `MuiChartsToolbar.divider` `marginInline: xxSmall` (Pro enhancer)
  - `(root)` → margin — KEEP: static `theme.spacing(0, 0.5)` horizontal spacing between toolbar groups (styled name `MuiChartsToolbar`, slot `Divider`)
- [x] [HeatmapTooltipAxesValue](/packages/x-charts-pro/src/Heatmap/HeatmapTooltip/HeatmapTooltipAxesValue.tsx) — ported 2026-10-18: `MuiChartsHeatmapTooltip.axesValue` `padding: xxSmall small`, `& span { marginRight: small }`. NOT measured live: the heatmap tooltip did not open under hover in the harness
  - `(root)` → padding — KEEP: static `theme.spacing(0.5, 1.5)`, mirrors ChartsTooltipTable caption padding; override together
  - `& span` → marginRight — KEEP: static `theme.spacing(1.5)`, mirrors ChartsTooltipTable caption span

### Charts Premium (`x-charts-premium`) — 1 in scope, 0 excluded

- [x] [PaletteOption](/packages/x-charts-premium/src/ChartsRenderer/components/PaletteOption.tsx) — ported 2026-10-18: `MuiDataGrid.paletteOptionRoot` `gap: xSmall`, `paletteOptionIcon` `iconSize` box (Premium charts enhancer; renders inside the grid's charts panel). measured 2026-11-26 on the coverage page (charts panel customize tab), clean at low and high
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
  - `(root)` → --DataGrid-width, --DataGrid-scrollbarSize, --DataGrid-rowWidth, --DataGrid-columnsTotalWidth, --DataGrid-leftPinnedWidth, --DataGrid-rightPinnedWidth, --DataGrid-headerHeight, --DataGrid-headersTotalHeight, --DataGrid-topContainerHeight, --DataGrid-bottomContainerHeight — UNRELATED: `0px` placeholders mirroring JavaScript state; overwritten inline by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:217-232
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
  - `(root)` → width, height — UNRELATED: 0×0 sticky overlay anchor; inner size is JavaScript-set from dimensions (GridOverlays.tsx:71-96)
- [GridIconButtonContainer](/packages/x-data-grid/src/components/columnHeaders/GridIconButtonContainer.tsx) — EXCLUDED: all lines UNRELATED (show/hide toggle)
  - `(root)` → width — UNRELATED: `0` paired with `visibility: hidden`, flipped to `auto` by GridRootStyles hover/sorted rules; a visibility toggle, not spacing
- [GridOverlay](/packages/x-data-grid/src/components/containers/GridOverlay.tsx) — in scope since 2026-11-26 (`overlay` gap xSmall, see the Community list); these lines are not:
  - `(root)` → width, height — UNRELATED: layout fill (`100%`)
- [GridRowDragAndDropOverlay](/packages/x-data-grid/src/components/GridRowDragAndDropOverlay.tsx) — EXCLUDED: all lines UNRELATED (drag placeholder)
  - `&::before` → height — UNRELATED: 2px drop-position indicator line
  - `&::after` → height — UNRELATED: 2px drop-position indicator line
- [GridScrollArea](/packages/x-data-grid/src/components/GridScrollArea.tsx) — EXCLUDED: all lines UNRELATED (drag autoscroll zone)
  - `(root)` → width, height — UNRELATED: 20px edge hot-zones for column/row drag autoscroll; JavaScript reads their rect for scroll speed (GridScrollArea.tsx:185-187, 256-258)
- [GridScrollShadows](/packages/x-data-grid/src/components/GridScrollShadows.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `(root)` → inset — UNRELATED: `0` positional anchoring of the shadow overlay; variant insets use JavaScript-set `--DataGrid-*` vars (useGridDimensions.ts:222-227)
- [GridShadowScrollArea](/packages/x-data-grid/src/components/GridShadowScrollArea.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `&::after` → width, height — UNRELATED: 4px sticky scroll-shadow strip
- [GridSkeletonLoadingOverlay](/packages/x-data-grid/src/components/GridSkeletonLoadingOverlay.tsx) — EXCLUDED: all lines UNRELATED (skeleton)
  - `(root)` → minWidth, width, height — UNRELATED: skeleton overlay layout fill; cell sizes are JavaScript-driven from `dimensions` and `--width` (GridSkeletonLoadingOverlay.tsx:166-177, 235-240)
- [GridColumnMenuContainer](/packages/x-data-grid/src/components/menu/columnMenu/GridColumnMenuContainer.tsx) — EXCLUDED: all lines UNRELATED (popover width)
  - `(root)` → minWidth — UNRELATED: structural popover width (`248`) of the column menu list
- [GridPanel](/packages/x-data-grid/src/components/panel/GridPanel.tsx) — EXCLUDED: all lines UNRELATED (popover width)
  - `(root)` → maxWidth — UNRELATED: structural popover cap (`calc(100vw - spacing(2))`)
- [GridMainContainer](/packages/x-data-grid/src/components/virtualization/GridMainContainer.tsx) — EXCLUDED: all lines UNRELATED (anchor)
  - `(root)` → width — UNRELATED: panel-anchor width `calc(100% - hasScrollY * scrollbarSize)`, positional anchoring from JavaScript-set vars (useGridDimensions.ts:218-219)
- [GridVirtualScrollbar](/packages/x-data-grid/src/components/virtualization/GridVirtualScrollbar.tsx) — EXCLUDED: all lines UNRELATED (scrollbar)
  - `(root)` → --size — UNRELATED: `calc(max(var(--DataGrid-scrollbarSize), 14px))` mirrors measured scrollbar size (useGridDimensions.ts:219)
  - `(root)` → width, height — DYNAMIC: `var(--size)` plus `--DataGrid-headersTotalHeight` / `--DataGrid-hasScroll*` from packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:217-225; the content size is also computed in JavaScript at GridVirtualScrollbar.tsx:113-118
  - `& > div` → width, height — DYNAMIC: `var(--size)`, same source
- [GridVirtualScroller](/packages/x-data-grid/src/components/virtualization/GridVirtualScroller.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → height — UNRELATED: layout fill (`100%`) on the scroller
  - `(root)` → marginTop — UNRELATED: `auto` on the infinite-loading trigger positioner, positional anchoring
- [GridVirtualScrollerFiller](/packages/x-data-grid/src/components/virtualization/GridVirtualScrollerFiller.tsx) — EXCLUDED: all lines DYNAMIC or UNRELATED (filler)
  - `(root)` → width — DYNAMIC: `var(--DataGrid-rowWidth)` set by packages/x-data-grid/src/hooks/features/dimensions/useGridDimensions.ts:220
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → height — UNRELATED: layout fill (`100%`) on pinned filler slots; filler row height is JavaScript-set from `scrollbarSize` (GridVirtualScrollerFiller.tsx:66-79)

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
- [GridDetailPanel](/packages/x-data-grid-pro/src/components/GridDetailPanel.tsx) — EXCLUDED: all lines DYNAMIC (JavaScript-set vars)
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
  - `(root)` → width, height — UNRELATED: layout fill (100%); surface width/height are JavaScript-written (:555, :517)
  - `(root)` → boxSizing — UNRELATED: boxSizing
- [GridPivotPanelBody](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelBody.tsx) — in scope above; these lines are not:
  - `(root)` → height — UNRELATED: layout fill (100%)
- [GridPivotPanelHeader](/packages/x-data-grid-premium/src/components/pivotPanel/GridPivotPanelHeader.tsx) — in scope above; these lines are not:
  - `(root)` → boxSizing — UNRELATED: boxSizing
  - `(root)` → marginRight — UNRELATED: layout fill (`auto`)
- [GridFormulaReferenceOverlay](/packages/x-data-grid-premium/src/components/GridFormulaReferenceOverlay.tsx) — EXCLUDED: all lines UNRELATED (overlay)
  - `(root)` → width, height, boxSizing — UNRELATED: 0×0 overlay anchor and JavaScript-positioned rects
- [GridFormulaRowNumberCell](/packages/x-data-grid-premium/src/components/GridFormulaRowNumberCell.tsx) — EXCLUDED: all lines UNRELATED (layout fill)
  - `(root)` → width — UNRELATED: layout fill (100%)
- [ResizablePanelHandle](/packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx) — EXCLUDED: all lines UNRELATED (resize handle)
  - `(root)` → height, width — UNRELATED: resize handle (8px strip / 100% fill)
- [Sidebar](/packages/x-data-grid-premium/src/components/sidebar/Sidebar.tsx) — EXCLUDED: all lines UNRELATED (structural container width)
  - `(root)` → width, minWidth, maxWidth — UNRELATED: structural resizable container width; drag writes inline `width` (packages/x-data-grid-premium/src/components/resizablePanel/ResizablePanelHandle.tsx:97)

- [GridComputedColumnsPanel](/packages/x-data-grid-premium/src/components/computedColumnsPanel/GridComputedColumnsPanel.tsx) — EXCLUDED: all lines UNRELATED (layout)
  - `(root)` → minHeight — UNRELATED: flex min-height reset (0)
- [GridComputedColumnsPanelReferencePane](/packages/x-data-grid-premium/src/components/computedColumnsPanel/GridComputedColumnsPanelReferencePane.tsx) — ported 2026-11-26 through untyped slot keys: search `padding: xSmall xSmall xxSmall` plus the clear pull; lists paddingBottom xxSmall; group title `padding: (xxSmall * 1.5) small (xxSmall / 2)`; item gap xSmall / `padding: xxSmall small`; no-results `padding: xSmall small`. These lines are not:
  - `(root)` → maxHeight, width, minWidth, maxWidth — UNRELATED: list scroll clamp (240) and label clamps

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
  - `(root)` → boxSizing — UNRELATED:
- [DayCalendarSkeleton](/packages/x-date-pickers/src/DayCalendarSkeleton/DayCalendarSkeleton.tsx) — EXCLUDED: all lines UNRELATED (skeleton)
  - `(root)` → margin — UNRELATED: skeleton placeholder (week `2px 0`, day `0 2px`; day size is a JavaScript `width`/`height` prop at :103)
- [PickersModalDialog](/packages/x-date-pickers/src/internals/components/PickersModalDialog.tsx) — EXCLUDED: all lines UNRELATED (structural dialog; unnamed internal slot, no theme key). Its content's `&:first-of-type { padding: 0 }` lost to material's density `DialogContent` padding under modular layers (the mobile dialogs grew 32px); since 2026-11-26 the community enhancer writes `MuiDialogContent.root { '&:has(> .MuiPickersLayout-root)': { padding: 0 } }`, the only material key an X enhancer writes, scoped to dialogs that hold a picker layout
  - `& .${dialogClasses.paper}` → minWidth — UNRELATED: DIALOG_WIDTH structural dialog width
  - `&:first-of-type` → padding — UNRELATED: resets DialogContent padding to 0 so the fixed-width view fills the paper
- [PickerViewRoot](/packages/x-date-pickers/src/internals/components/PickerViewRoot/PickerViewRoot.tsx) — EXCLUDED: all lines UNRELATED (unnamed internal slot, structural view box)
  - `(root)` → width — UNRELATED: DIALOG_WIDTH structural view width (MobileDateTimePicker.tsx:119 re-sets it via sx)
  - `(root)` → maxHeight — UNRELATED: VIEW_HEIGHT structural view box; no theme name to target (see DateCalendar for the JavaScript pairing)
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
  - `(root)` → marginLeft — UNRELATED: drag-and-drop placeholder overlay; `calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))` where `--TreeView-indentMultiplier` is defined nowhere in `packages/` (consumed only here), `--TreeView-itemDepth` is JavaScript-set (useTreeItem.ts:230)

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
- [ChartsLabelGradient](/packages/x-charts/src/ChartsLabel/ChartsLabelGradient.tsx) — EXCLUDED from `styleOverrides`: thickness is a prop, emitted since 2026-11-25 as `defaultProps.thickness = iconSize - xxSmall`; rest are fills
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
