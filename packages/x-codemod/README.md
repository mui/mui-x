# @mui/x-codemod

> Codemod scripts for MUI X

[![npm version](https://img.shields.io/npm/v/@mui/x-codemod.svg?style=flat-square)](https://www.npmjs.com/package/@mui/x-codemod)
[![npm downloads](https://img.shields.io/npm/dm/@mui/x-codemod.svg?style=flat-square)](https://www.npmjs.com/package/@mui/x-codemod)

This repository contains a collection of codemod scripts based for use with
[jscodeshift](https://github.com/facebook/jscodeshift) that help update MUI X APIs.

## Setup & run

<!-- #default-branch-switch -->

```bash
npx @mui/x-codemod <codemod> <paths...>

Applies a `@mui/x-codemod` to the specified paths

Positionals:
  codemod  The name of the codemod                                [string]
  paths    Paths forwarded to `jscodeshift`                       [string]

Options:
  --version     Show version number                                 [boolean]
  --help        Show help                                           [boolean]
  --parser      which parser for jscodeshift to use.
                                                    [string] [default: 'tsx']
  --jscodeshift Pass options directly to jscodeshift                  [array]

Examples:
  npx @mui/x-codemod v6.0.0/preset-safe src
  npx @mui/x-codemod v6.0.0/component-rename-prop src --
  --component=DataGrid --from=prop --to=newProp
```

### `jscodeshift` options

To pass more options directly to jscodeshift, use `--jscodeshift=...`. For example:

```sh
// single option
npx @mui/x-codemod --jscodeshift=--run-in-band
// multiple options
npx @mui/x-codemod --jscodeshift=--cpus=1 --jscodeshift=--print --jscodeshift=--dry --jscodeshift=--verbose=2
```

See all available options [here](https://github.com/facebook/jscodeshift#usage-cli).

### `Recast` Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through jscodeshift's `printOptions` command line argument

```sh
npx @mui/x-codemod <transform> <path> --jscodeshift="--printOptions='{\"quote\":\"double\"}'"
```

## Included scripts

### v6.0.0

#### 🚀 `preset-safe`

A combination of all important transformers for migrating v5 to v6. ⚠️ This codemod should be run only once. It runs codemods for both Data Grid and Date and Time Pickers packages. To run codemods for a specific package, refer to the respective section.

```sh
npx @mui/x-codemod v6.0.0/preset-safe <path|folder>
```

The corresponding sub-sections are listed below

- [`preset-safe-for-pickers`](#preset-safe-for-pickers)
- [`preset-safe-for-data-grid`](#preset-safe-for-data-grid)

### Pickers codemods

#### `preset-safe` for pickers

The `preset-safe` codemods for pickers.

```sh
npx @mui/x-codemod v6.0.0/pickers/preset-safe <path|folder>
```

The list includes these transformers

- [`adapter-change-import`](#adapter-change-import)
- [`view-components-rename`](#view-components-rename)
- [`view-components-rename-value-prop`](#view-components-rename)
- [`localization-provider-rename-locale`](#localization-provider-rename-locale)
- [`text-props-to-localeText`](#text-props-to-localeText)

#### `adapter-change-import`

Import the adapters from `@mui/x-date-pickers` instead of `@date-io`.

```diff
-import AdapterJalaali from '@date-io/jalaali';
+import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
```

#### `view-components-rename`

Renames the view components.

```diff
-<CalendarPicker {...props} />
+<DateCalendar {...props} />

-<DayPicker {...props} />
+<DayCalendar {...props} />

-<CalendarPickerSkeleton {...props} />
+<DayCalendarSkeleton {...props} />

-<MonthPicker {...props} />
+<MonthCalendar {...props} />

-<YearPicker {...props} />
+<YearCalendar {...props} />

-<ClockPicker {...props} />
+<TimeClock {...props} />
```

#### `view-components-rename-value-prop`

Renames the `date` prop of the view components into `value`.

```diff
-<MonthPicker date={dayjs()} />
+<MonthCalendar value={dayjs()} />

-<YearPicker date={dayjs()} />
+<YearCalendar value={dayjs()} />

-<ClockPicker date={dayjs()} />
+<TimeClock value={dayjs()} />

-<CalendarPicker date={dayjs()} />
+<DateCalendar value={dayjs()} />
```

#### `localization-provider-rename-locale`

Renames the `locale` prop of the `LocalizationProvider` component into `adapterLocale`.

```diff
 <LocalizationProvider
   dateAdapter={AdapterDayjs}
-  locale="fr"
+  adapterLocale="fr"
 >
   {children}
 </LocalizationProvider

```

```sh
npx @mui/x-codemod v6.0.0/pickers/localization-provider-rename-locale <path>
```

#### `text-props-to-localeText`

Replace props used for localization such as `cancelText` to their corresponding `localeText` key on all the Date and Time Pickers components.

```diff
 <DatePicker
-  cancelText="Cancelar"
+  localeText={{
+    cancelButtonLabel: "Cancelar"
+  }}
 />
```

```sh
npx @mui/x-codemod v6.0.0/pickers/text-props-to-localeText <path>
```

If you were always using the same text value in all your components, consider moving those translation from the component to the `LocalizationProvider` by hand.

```diff
 <LocalizationProvider
   dateAdapter={AdapterDayjs}
+ localeText={{ cancelButtonLabel: "Cancelar" }}
 >
   <DatePicker
-    localeText={{ cancelButtonLabel: "Cancelar" }}
   />
   <DateTimePicker
-    localeText={{ cancelButtonLabel: "Cancelar" }}
   />
 </LocalizationProvider>
```

You can find more details about Date and Time breaking changes in [the migration guide](https://next.mui.com/x/migration/migration-pickers-v5/).

### Data grid codemods

#### `preset-safe` for data grid

The `preset-safe` codemods for data grid.

```sh
npx @mui/x-codemod v6.0.0/data-grid/preset-safe <path|folder>
```

The list includes these transformers

- [`column-menu-components-rename`](#column-menu-components-rename)
- [`row-selection-renamed-props`](#row-selection-renamed-props)

#### `column-menu-components-rename`

Replace column menu items that have been renamed.

```diff
  <CustomColumnMenu>
-   <GridFilterMenuItem column={column} onClick={hideMenu} />
+   <GridColumnMenuFilterItem colDef={column} onClick={hideMenu} />
-   <HideGridColMenuItem column={column} onClick={hideMenu} />
+   <GridColumnMenuHideItem colDef={column} onClick={hideMenu} />
-   <GridColumnsMenuItem column={column} onClick={hideMenu} />
+   <GridColumnMenuColumnsItem colDef={column} onClick={hideMenu} />
-   <SortGridMenuItems column={column} onClick={hideMenu} />
+   <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
-   <GridColumnPinningMenuItems column={column} onClick={hideMenu} />
+   <GridColumnMenuPinningItem colDef={column} onClick={hideMenu} />
  </CustomColumnMenu>
```

```sh
npx @mui/x-codemod v6.0.0/data-grid/column-menu-components-rename <path>
```

If you are using `GridRowGroupingColumnMenuItems` and `GridRowGroupableColumnMenuItems` for grouping, consider fixing them manually as these imports are replaced by `GridColumnMenuGroupingItem` and may require some extra work to port.

#### `row-selection-renamed-props`

Data grid props that have been renamed.

```diff
<DataGrid
-  selectionModel={model}
+  rowSelectionModel={model}
-  onSelectionModelChange={handler}
+  onRowSelectionModelChange={handler}
-  disableSelectionOnClick
+  disableRowSelectionOnClick
-  disableMultipleSelection
+  disableMultipleRowSelection
-  showCellRightBorder
+  showCellVerticalBorder
-  showColumnRightBorder
+  showColumnVerticalBorder
/>
```

```sh
npx @mui/x-codemod v6.0.0/data-grid/row-selection-props-rename <path>
```

You can find more details about Data Grid breaking changes in [the migration guide](https://next.mui.com/x/migration/migration-data-grid-v5/).
