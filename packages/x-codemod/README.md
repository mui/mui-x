# @mui/x-codemod

> Codemod scripts for MUI X

[![npm version](https://img.shields.io/npm/v/@mui/x-codemod.svg?style=flat-square)](https://www.npmjs.com/package/@mui/x-codemod)
[![npm downloads](https://img.shields.io/npm/dm/@mui/x-codemod.svg?style=flat-square)](https://www.npmjs.com/package/@mui/x-codemod)

This repository contains a collection of codemod scripts based for use with
[jscodeshift](https://github.com/facebook/jscodeshift) that help update MUI X APIs.

## Setup & run

<!-- #default-branch-switch -->

```bash
npx @mui/x-codemod@latest <codemod> <paths...>

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
  npx @mui/x-codemod@latest v7.0.0/preset-safe src
  npx @mui/x-codemod@latest v6.0.0/component-rename-prop src --
  --component=DataGrid --from=prop --to=newProp
```

### `jscodeshift` options

To pass more options directly to jscodeshift, use `--jscodeshift=...`. For example:

```bash
// single option
npx @mui/x-codemod@latest --jscodeshift=--run-in-band
// multiple options
npx @mui/x-codemod@latest --jscodeshift=--cpus=1 --jscodeshift=--print --jscodeshift=--dry --jscodeshift=--verbose=2
```

See all available options [here](https://github.com/facebook/jscodeshift#usage-cli).

### `Recast` Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through jscodeshift's `printOptions` command line argument

```bash
npx @mui/x-codemod@latest <transform> <path> --jscodeshift="--printOptions='{\"quote\":\"double\"}'"
```

## v7.0.0

### 🚀 `preset-safe` for v7.0.0

A combination of all important transformers for migrating v6 to v7.
⚠️ This codemod should be run only once.
It runs codemods for both Data Grid and Date and Time Pickers packages.
To run codemods for a specific package, refer to the respective section.

```bash
npx @mui/x-codemod@latest v7.0.0/preset-safe <path|folder>
```

The corresponding sub-sections are listed below

- [`preset-safe-for-pickers`](#preset-safe-for-pickers-v700)
- [`preset-safe-for-data-grid`](#preset-safe-for-data-grid-v700)
- [`preset-safe-for-tree-view`](#preset-safe-for-tree-view-v700)

### Pickers codemods

#### `preset-safe` for pickers v7.0.0

The `preset-safe` codemods for pickers.

```bash
npx @mui/x-codemod@latest v7.0.0/pickers/preset-safe <path|folder>
```

The list includes these transformers

- [`rename-components-to-slots-pickers`](#rename-components-to-slots-pickers)
- [`rename-default-calendar-month-to-reference-date`](#rename-default-calendar-month-to-reference-date)
- [`rename-day-picker-classes`](#rename-day-picker-classes)
- [`rename-slots-types`](#rename-slots-types)

#### `rename-components-to-slots-pickers`

Renames the `components` and `componentsProps` props to `slots` and `slotProps`, respectively.

This change only affects Date and Time Picker components.

```diff
 <DatePicker
-  components={{ Toolbar: CustomToolbar }}
-  componentsProps={{ actionBar: { actions: ['clear'] } }}
+  slots={{ toolbar: CustomToolbar }}
+  slotProps={{ actionBar: { actions: ['clear'] } }}
 />;
```

```bash
npx @mui/x-codemod@latest v7.0.0/pickers/rename-components-to-slots <path>
```

#### `rename-default-calendar-month-to-reference-date`

Replace the `defaultCalendarMonth` prop with the `referenceDate` prop.

```diff
-<DateCalendar defaultCalendarMonth={dayjs('2022-04-01')};
+<DateCalendar referenceDate{dayjs('2022-04-01')} />
```

```bash
npx @mui/x-codemod@latest v7.0.0/pickers/rename-default-calendar-month-to-reference-date <path>
```

#### `rename-day-picker-classes`

Rename the `dayPickerClasses` variable to `dayCalendarClasses`.

```diff
-import { dayPickerClasses } from '@mui/x-date-pickers/DateCalendar';
+import { dayCalendarClasses } from '@mui/x-date-pickers/DateCalendar';
```

```bash
npx @mui/x-codemod@latest v7.0.0/pickers/rename-day-picker-classes <path>
```

#### `rename-slots-types`

Replace types suffix `SlotsComponent` by `Slots` and `SlotsComponentsProps` by `SlotProps`.

```diff
-DateCalendarSlotsComponent
-DateCalendarSlotsComponentsProps
+DateCalendarSlots
+DateCalendarSlotProps
```

```bash
npx @mui/x-codemod@latest v7.0.0/pickers/rename-slots-types <path>
```

### Data Grid codemods

#### `preset-safe` for data grid v7.0.0

The `preset-safe` codemods for data grid.

```bash
npx @mui/x-codemod@latest v7.0.0/data-grid/preset-safe <path|folder>
```

The list includes these transformers

- [`rename-components-to-slots-data-grid`](#rename-components-to-slots-data-grid)
- [`rename-cell-selection-props`](#rename-cell-selection-props)
- [`remove-stabilized-v7-experimentalFeatures`](#remove-stabilized-v7-experimentalFeatures)

#### `rename-components-to-slots-data-grid`

Renames the `components` and `componentsProps` props to `slots` and `slotProps`, respectively.

This change only affects Data Grid components.

```diff
 <DataGrid
-  components={{ Toolbar: CustomToolbar }}
-  componentsProps={{ toolbar: { showQuickFilter: true }}}
+  slots={{ toolbar: CustomToolbar }}
+  slotProps={{ toolbar: { showQuickFilter: true }}}
 />;
```

```bash
npx @mui/x-codemod@latest v7.0.0/data-grid/rename-components-to-slots <path>
```

#### `rename-cell-selection-props`

Rename props related to `cellSelection` feature.

```diff
 <DataGridPremium
-  unstable_cellSelection
-  unstable_cellSelectionModel={{ 0: { id: true, currencyPair: true, price1M: false } }}
-  unstable_onCellSelectionModelChange={() => {}}
+  cellSelection
+  cellSelectionModel={{ 0: { id: true, currencyPair: true, price1M: false } }}
+  onCellSelectionModelChange={() => {}}
 />;
```

```bash
npx @mui/x-codemod@latest v7.0.0/data-grid/rename-cell-selection-props <path>
```

#### `remove-stabilized-v7-experimentalFeatures`

Remove feature flags for stabilized `experimentalFeatures`.

```diff
 <DataGrid
-  experimentalFeatures={{
-    lazyLoading: true,
-    ariaV7: true,
-    clipboardPaste: true,
-    columnGrouping: true,
-  }}
 />
```

```bash
npx @mui/x-codemod@latest v7.0.0/data-grid/remove-stabilized-experimentalFeatures <path>
```

### Tree View codemods

#### `preset-safe` for tree view v7.0.0

The `preset-safe` codemods for tree view.

```bash
npx @mui/x-codemod@latest v7.0.0/tree-view/preset-safe <path|folder>
```

The list includes these transformers

- [`rename-tree-view-simple-tree-view`](#rename-tree-view-simple-tree-view)
- [`rename-use-tree-item`](#rename-use-tree-item)
- [`rename-expansion-props`](#rename-expansion-props)
- [`rename-selection-props`](#rename-selection-props)
- [`replace-transition-props-by-slot`](#replace-transition-props-by-slot)
- [`rename-focus-callback`](#rename-focus-callback)
- [`rename-nodeid`](#rename-nodeid)

#### `rename-tree-view-simple-tree-view`

Renames the `TreeView` component to `SimpleTreeView`

```diff
-import { TreeView } from '@mui/x-tree-view';
+import { SimpleTreeView } from '@mui/x-tree-view';

-import { TreeView } from '@mui/x-tree-view/TreeView';
+import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

   return (
-    <TreeView>
+    <SimpleTreeView>
       <TreeItem itemId="1" label="First item" />
-    </TreeView>
+    </SimpleTreeView>
   );
```

#### `rename-use-tree-item`

Renames the `useTreeItem` hook to `useTreeItemState`

```diff
-import { TreeItem, useTreeItem } from '@mui/x-tree-view/TreeItem';
+import { TreeItem, useTreeItemState } from '@mui/x-tree-view/TreeItem';

 const CustomContent = React.forwardRef((props, ref) => {
-  const { disabled } = useTreeItem(props.itemId);
+  const { disabled } = useTreeItemState(props.itemId);

   // Render some UI
 });

 function App() {
   return (
     <SimpleTreeView>
       <TreeItem ContentComponent={CustomContent} />
     </SimpleTreeView>
   )
 }
```

#### `rename-expansion-props`

Rename the expansion props

```diff
 <TreeView
-  onNodeToggle={handleExpansionChange}
+  onExpandedItemsChange={handleExpansionChange}

-  expanded={expandedItems}
+  expandedItems={expandedItems}

-  defaultExpanded={defaultExpandedItems}
+  defaultExpandedItems={defaultExpandedItems}
 />
```

#### `rename-selection-props`

Rename the selection props

```diff
 <TreeView
-  onNodeSelect={handleSelectionChange}
+  onSelectedItemsChange={handleSelectionChange}

-  selected={selectedItems}
+  selectedItems={selectedItems}

-  defaultSelected={defaultSelectedItems}
+  defaultSelectedItems={defaultSelectedItems}
 />
```

#### `replace-transition-props-by-slot`

Replace the `TransitionComponent` and `TransitionProps` components with the `groupTransition` slot:

```diff
 <TreeItem
-  TransitionComponent={Fade}
+  slots={{ groupTransition: Fade }}

-  TransitionProps={{ timeout: 600 }}
+  slotProps={{ groupTransition: { timeout: 600 } }}
 />
```

#### `rename-focus-callback`

Replace the `onNodeFocus` callback with `onItemFocus`:

```diff
 <TreeView
-  onNodeFocus={onNodeFocus}
+  onItemFocus={onItemFocus}
 />
```

#### `rename-nodeid`

Rename nodeId to itemId

```diff
 <TreeItem
-  nodeId='unique-id'
+  itemId='unique-id'
```

## v6.0.0

### 🚀 `preset-safe` for v6.0.0

A combination of all important transformers for migrating v5 to v6.
⚠️ This codemod should be run only once.
It runs codemods for both Data Grid and Date and Time Pickers packages.
To run codemods for a specific package, refer to the respective section.

```bash
npx @mui/x-codemod@latest v6.0.0/preset-safe <path|folder>
```

The corresponding sub-sections are listed below

- [`preset-safe-for-pickers`](#preset-safe-for-pickers-v600)
- [`preset-safe-for-data-grid`](#preset-safe-for-data-grid-v600)

### Pickers codemods

#### `preset-safe` for pickers v6.0.0

The `preset-safe` codemods for pickers.

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/preset-safe <path|folder>
```

The list includes these transformers

- [`adapter-change-import`](#adapter-change-import)
- [`view-components-rename`](#view-components-rename)
- [`view-components-rename-value-prop`](#view-components-rename-value-prop)
- [`localization-provider-rename-locale`](#localization-provider-rename-locale)
- [`text-props-to-localeText`](#text-props-to-localeText)
- [`replace-tabs-props`](#replace-tabs-props)
- [`replace-toolbar-props-by-slot`](#replace-toolbar-props-by-slot)
- [`migrate-to-components-componentsProps`](#migrate-to-components-componentsProps)
- [`replace-arrows-button-slot`](#replace-arrows-button-slot)
- [`rename-should-disable-time`](#rename-should-disable-time)
- [`rename-inputFormat-prop`](#rename-inputFormat-prop)
- [`rename-default-toolbar-title-localeText`](#rename-default-toolbar-title-localeText)

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

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/localization-provider-rename-locale <path>
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

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/text-props-to-localeText <path>
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

You can find more details about Date and Time breaking changes in [the migration guide](https://mui.com/x/migration/migration-pickers-v5/).

#### `replace-tabs-props`

Replace props used for `Tabs` in DateTime pickers by `componentsProps.tabs` properties.

```diff
 <DateTimePicker
-  hideTabs={false}
-  dateRangeIcon={<LightModeIcon />}
-  timeIcon={<AcUnitIcon />}
+  componentsProps={{
+    tabs: {
+      hidden: false,
+      dateIcon: <LightModeIcon />,
+      timeIcon: <AcUnitIcon />,
+    }
+  }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/replace-tabs-props <path>
```

#### `replace-toolbar-props-by-slot`

Replace props used to customize the `Toolbar` in pickers by slots properties and `localeText`.

```diff
 <DatePicker
-  ToolbarComponent={MyToolbar}
+  components={{ Toolbar: MyToolbar }}
-  toolbarPlaceholder="__"
-  toolbarFormat="DD / MM / YYYY"
-  showToolbar
+  componentsProps={{
+    toolbar: {
+      toolbarPlaceholder: "__",
+      toolbarFormat: "DD / MM / YYYY",
+      hidden: false,
+    }
+  }}
-  toolbarTitle="Title"
+  localeText={{ toolbarTitle: "Title" }}
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/replace-toolbar-props-by-slot <path>
```

#### `migrate-to-components-componentsProps`

Replace customization props by their equivalent `components` and `componentsProps` properties.

```diff
 <DatePicker
-  PopperProps={{ onClick: handleClick }}
+  componentsProps={{ popper: { onClick: handleClick }}}
 />

 <DatePicker
-  TransitionComponent={Fade}
+  components={{ DesktopTransition: Fade }}
 />

 <DatePicker
-  DialogProps={{ backgroundColor: 'red' }}
+  componentsProps={{ dialog: { backgroundColor: 'red' }}}
 />

 <DatePicker
-  PaperProps={{ backgroundColor: 'red' }}
+  componentsProps={{ desktopPaper: { backgroundColor: 'red' }}}
 />

 <DatePicker
-  TrapFocusProps={{ isEnabled: () => false }}
+  componentsProps={{ desktopTrapFocus: { isEnabled: () => false }}}
 />

 <DatePicker
-  InputProps={{ color: 'primary' }}
+  componentsProps={{ textField: { InputProps: { color: 'primary' }}}}
 />

 <DatePicker
-  InputAdornmentProps={{ position: 'start' }}
+  componentsProps={{ inputAdornment: { position: 'start' }}}
 />

 <DatePicker
-  OpenPickerButtonProps={{ ref: buttonRef }}
+  componentsProps={{ openPickerButton: { ref: buttonRef }}}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/migrate-to-components-componentsProps <path>
```

#### `replace-arrows-button-slot`

Replace `LeftArrowButton` and `RightArrowButton` slots for navigation buttons by `PreviousIconButton` and `NextIconButton`.

```diff
 <DatePicker
   components={{
-    LeftArrowButton: CustomButton,
+    PreviousIconButton: CustomButton,
-    RightArrowButton: CustomButton,
+    NextIconButton: CustomButton,
   }}

   componentsProps={{
-    leftArrowButton: {},
+    previousIconButton: {},
-    rightArrowButton: {},
+    nextIconButton: {},
   }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/replace-arrows-button-slot <path>
```

#### `rename-should-disable-time`

Replace `shouldDisableTime` by `shouldDisableClock`.

```diff
  <DateTimePicker
-   shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12}
+   shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12}
  />
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/rename-should-disable-time <path>
```

#### `rename-inputFormat-prop`

Replace `inputFormat` prop with `format`.

```diff
 <DatePicker
-  inputFormat="YYYY"
+  format="YYYY"
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/rename-inputFormat-prop <path>
```

#### `rename-default-toolbar-title-localeText`

Rename toolbar related translation keys, removing `Default` part from them to better fit their usage.

```diff
 <LocalizationProvider
   localeText={{
-    datePickerDefaultToolbarTitle: 'Date Picker',
+    datePickerToolbarTitle: 'Date Picker',
-    timePickerDefaultToolbarTitle: 'Time Picker',
+    timePickerToolbarTitle: 'Time Picker',
-    dateTimePickerDefaultToolbarTitle: 'Date Time Picker',
+    dateTimePickerToolbarTitle: 'Date Time Picker',
-    dateRangePickerDefaultToolbarTitle: 'Date Range Picker',
+    dateRangePickerToolbarTitle: 'Date Range Picker',
   }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/rename-default-toolbar-title-localeText <path>
```

#### `rename-components-to-slots-pickers`

Renames the `components` and `componentsProps` props to `slots` and `slotProps`, respectively.

This change only affects Date and Time Pickers components.

```diff
 <DatePicker
-  components={{ Toolbar: CustomToolbar }}
-  componentsProps={{ actionBar: { actions: ['clear'] } }}
+  slots={{ toolbar: CustomToolbar }}
+  slotProps={{ actionBar: { actions: ['clear'] } }}
 />;
```

```bash
npx @mui/x-codemod@latest v6.0.0/pickers/rename-components-to-slots <path>
```

### Data Grid codemods

#### `preset-safe` for data grid v6.0.0

The `preset-safe` codemods for data grid.

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/preset-safe <path|folder>
```

The list includes these transformers

- [`column-menu-components-rename`](#column-menu-components-rename)
- [`row-selection-props-rename`](#row-selection-props-rename)
- [`rename-rowsPerPageOptions-prop`](#rename-rowsPerPageOptions-prop)
- [`remove-disableExtendRowFullWidth-prop`](#remove-disableExtendRowFullWidth-prop)
- [`rename-linkOperators-logicOperators`](#rename-linkOperators-logicOperators)
- [`rename-filter-item-props`](#rename-filter-item-props)
- [`rename-selectors-and-events`](#rename-selectors-and-events)
- [`remove-stabilized-experimentalFeatures`](#remove-stabilized-experimentalFeatures)
- [`replace-onCellFocusOut-prop`](#replace-onCellFocusOut-prop)

#### `column-menu-components-rename`

Replace column menu items that have been renamed.

```diff
 <CustomColumnMenu>
-  <GridFilterMenuItem column={column} onClick={hideMenu} />
+  <GridColumnMenuFilterItem colDef={column} onClick={hideMenu} />
-  <HideGridColMenuItem column={column} onClick={hideMenu} />
+  <GridColumnMenuHideItem colDef={column} onClick={hideMenu} />
-  <GridColumnsMenuItem column={column} onClick={hideMenu} />
+  <GridColumnMenuColumnsItem colDef={column} onClick={hideMenu} />
-  <SortGridMenuItems column={column} onClick={hideMenu} />
+  <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
-  <GridColumnPinningMenuItems column={column} onClick={hideMenu} />
+  <GridColumnMenuPinningItem colDef={column} onClick={hideMenu} />
 </CustomColumnMenu>
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/column-menu-components-rename <path>
```

If you are using `GridRowGroupingColumnMenuItems` and `GridRowGroupableColumnMenuItems` for grouping, consider fixing them manually as these imports are replaced by `GridColumnMenuGroupingItem` and may require some extra work to port.

#### `row-selection-props-rename`

Data Grid props that have been renamed.

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

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/row-selection-props-rename <path>
```

#### `rename-rowsPerPageOptions-prop`

Rename `rowsPerPageOptions` prop to `pageSizeOptions`.

```diff
 <DataGrid
-  rowsPerPageOptions={[5, 10, 20]}
+  pageSizeOptions={[5, 10, 20]}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/rename-rowsPerPageOptions-prop <path>
```

#### `remove-disableExtendRowFullWidth-prop`

Remove `disableExtendRowFullWidth` prop which is no longer supported.

```diff
 <DataGrid
-  disableExtendRowFullWidth
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/remove-disableExtendRowFullWidth-prop <path>
```

#### `rename-linkOperators-logicOperators`

Rename `linkOperators` related props to `logicOperators` and rename classes.

```diff
 const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
-   linkOperator: GridLinkOperator.Or,
-   quickFilterLogicOperator: GridLinkOperator.Or,
+   logicOperator: GridLogicOperator.Or,
+   quickFilterLogicOperator: GridLogicOperator.Or,
  });
- apiRef.current.setFilterLinkOperator('and')
- const localeText = apiRef.current.getLocaleText('filterPanelLinkOperator')
+ apiRef.current.setFilterLogicOperator('and')
+ const localeText = apiRef.current.getLocaleText('filterPanelLogicOperator')
 <DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [],
-       linkOperator: GridLinkOperator.Or,
-       quickFilterLogicOperator: GridLinkOperator.Or,
+       logicOperator: GridLogicOperator.Or,
+       quickFilterLogicOperator: GridLogicOperator.Or,
      },
    },
  }}
  filterModel={filterModel}
  componentsProps={{
    filter: {
-     linkOperators: [GridLinkOperator.And],
+     logicOperators: [GridLogicOperator.And],
      filterFormProps: {
-       linkOperatorInputProps: {
+       logicOperatorInputProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
    },
  }}
  sx={{
-   '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
-   '& .MuiDataGrid-withBorder': { borderColor: '#456' },
+   '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
+   '& .MuiDataGrid-withBorderColor': { borderColor: '#456' },
  }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/rename-linkOperators-logicOperators <path>
```

#### `rename-filter-item-props`

Rename filter item props to the new values.

```diff
 <DataGrid
  columns={columns}
  rows={rows}
  initialState={{
    filter: {
      filterModel: {
        items: [
          {
-           columnField: 'column',
-           operatorValue: 'contains',
+           field: 'column',
+           operator: 'contains',
            value: 'a',
          },
        ],
      },
    },
  }}
  filterModel={{
    items: [
      {
-       columnField: 'column',
-       operatorValue: 'contains',
+       field: 'column',
+       operator: 'contains',
        value: 'a',
      },
    ],
  }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/rename-filter-item-props <path>
```

#### `rename-selectors-and-events`

Rename selectors and events.

```diff
 function App() {
-  useGridApiEventHandler(apiRef, 'selectionChange', handleEvent);
-  apiRef.current.subscribeEvent('selectionChange', handleEvent);
-  const selection = useGridSelector(apiRef, gridSelectionStateSelector);
-  const sortedRowIds = useGridSelector(apiRef, gridVisibleSortedRowIdsSelector);
-  const sortedRowEntries = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
-  const rowCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
-  const sortedTopLevelRowEntries = useGridSelector(apiRef, gridVisibleSortedTopLevelRowEntriesSelector);
-  const topLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);
-  const allGridColumnsFields = useGridSelector(apiRef, allGridColumnsFieldsSelector);
-  const allGridColumns = useGridSelector(apiRef, allGridColumnsSelector);
-  const visibleGridColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
-  const filterableGridColumns = useGridSelector(apiRef, filterableGridColumnsSelector);
-  const getGridNumericColumn = useGridSelector(apiRef, getGridNumericColumnOperators);
+  useGridApiEventHandler(apiRef, 'rowSelectionChange', handleEvent);
+  apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
+  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
+  const sortedRowIds = useGridSelector(apiRef, gridExpandedSortedRowIdsSelector);
+  const sortedRowEntries = useGridSelector(apiRef, gridExpandedSortedRowEntriesSelector);
+  const rowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
+  const sortedTopLevelRowEntries = useGridSelector(apiRef, gridFilteredSortedTopLevelRowEntriesSelector);
+  const topLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
+  const allGridColumnsFields = useGridSelector(apiRef, gridColumnFieldsSelector);
+  const allGridColumns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
+  const visibleGridColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
+  const filterableGridColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
+  const getGridNumericColumn = useGridSelector(apiRef, getGridNumericOperators);
 }
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/rename-selectors-and-events <path>
```

#### `remove-stabilized-experimentalFeatures`

Remove feature flags for stabilized `experimentalFeatures`.

```diff
 <DataGrid
-  experimentalFeatures={{
-    newEditingApi: true,
-  }}
 />
```

```diff
 <DataGrid
  experimentalFeatures={{
-   newEditingApi: true,
    columnGrouping: true,
  }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/remove-stabilized-experimentalFeatures <path>
```

#### `replace-onCellFocusOut-prop`

Replace `onCellFocusOut` prop with `componentsProps.cell.onBlur`.

```diff
 <DataGrid
-  onCellFocusOut={handleBlur}
+  componentsProps={{
+    cell: {
+      onBlur: handleBlur,
+    },
+  }}
 />
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/replace-onCellFocusOut-prop <path>
```

#### `rename-components-to-slots-data-grid`

Renames the `components` and `componentsProps` props to `slots` and `slotProps`, respectively.

This change only affects Data Grid components.

```diff
 <DataGrid
-  components={{ Toolbar: CustomToolbar }}
-  componentsProps={{ actionBar: { actions: ['clear'] } }}
+  slots={{ toolbar: CustomToolbar }}
+  slotProps={{ actionBar: { actions: ['clear'] } }}
 />;
```

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/rename-components-to-slots <path>
```

You can find more details about Data Grid breaking change in [the migration guide](https://mui.com/x/migration/migration-data-grid-v5/).
