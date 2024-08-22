---
productId: x-date-pickers
---

# Migration from v6 to v7

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v6 to v7.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-date-pickers` from v6 to v7.
To read more about the changes from the new major, check out [the blog post about the release of MUI X v7](https://mui.com/blog/mui-x-v7-beta/).

## Start using the new release

In `package.json`, change the version of the date pickers package to `^7.0.0`.

```diff
-"@mui/x-date-pickers": "6.x.x",
+"@mui/x-date-pickers": "^7.0.0",
```

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v6 to v7.

## Update `@mui/material` package

To have the option of using the latest API from `@mui/material`, the package peer dependency version has been updated to `^5.15.14`.
It is a change in minor version only, so it should not cause any breaking changes.
Please update your `@mui/material` package to this or a newer version.

## Update the license package

If you're using the commercial version of the Pickers ([Pro](/x/introduction/licensing/#pro-plan) plan), you need to update the import path:

```diff
-import { LicenseInfo } from '@mui/x-license-pro';
+import { LicenseInfo } from '@mui/x-license';
```

If you have `@mui/x-license-pro` in the `dependencies` section of your `package.json`, rename and update the license package to the latest version:

```diff
-"@mui/x-license-pro": "6.x.x",
+"@mui/x-license": "^7.0.0",
```

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v7. You can run `v7.0.0/pickers/preset-safe` targeting only Date and Time Pickers or `v7.0.0/preset-safe` to target Data Grid as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #default-branch-switch -->

```bash
// Date and Time Pickers specific
npx @mui/x-codemod@latest v7.0.0/pickers/preset-safe <path>

// Target Data Grid as well
npx @mui/x-codemod@latest v7.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for pickers](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-pickers-v700) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v7.0.0/pickers/preset-safe` (or `v7.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DatePicker {...pickerProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## Breaking changes

Since v7 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.

### Drop the legacy bundle

The support for IE 11 has been removed from all MUI X packages.
The `legacy` bundle that used to support old browsers like IE 11 is no longer included.

:::info
If you need support for IE 11, you will need to keep using the latest version of the `v6` release.
:::

### Drop Webpack 4 support

Dropping old browsers support also means that we no longer transpile some features that are natively supported by modern browsers – like [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) and [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

These features are not supported by Webpack 4, so if you are using Webpack 4, you will need to transpile these features yourself or upgrade to Webpack 5.

Here is an example of how you can transpile these features on Webpack 4 using the `@babel/preset-env` preset:

```diff
 // webpack.config.js

 module.exports = (env) => ({
   // ...
   module: {
     rules: [
       {
         test: /\.[jt]sx?$/,
-        exclude: /node_modules/,
+        exclude: [
+          {
+            test: path.resolve(__dirname, 'node_modules'),
+            exclude: [
+              // Covers @mui/x-date-pickers and @mui/x-date-pickers-pro
+              path.resolve(__dirname, 'node_modules/@mui/x-date-pickers'),
+              path.resolve(__dirname, 'node_modules/@mui/x-license'),
+            ],
+          },
+        ],
       },
     ],
   },
 });
```

## Component slots

### Rename `components` to `slots`

The `components` and `componentsProps` props are renamed to `slots` and `slotProps` props respectively.
This is a slow and ongoing effort between all the different libraries maintained by MUI.
To smooth the transition, they were deprecated during the [v6](/x/migration/migration-pickers-v5/#rename-components-to-slots-optional).
And are removed from the v7.

If not already done, this modification can be handled by the codemod

```bash
npx @mui/x-codemod@latest v7.0.0/pickers/ <path>
```

Take a look at [the RFC](https://github.com/mui/material-ui/issues/33416) for more information.

:::warning
If this codemod is applied on a component with both a `slots` and a `components` prop, the output will contain two `slots` props.
You are then responsible for merging those two props manually.

For example:

```tsx
// Before running the codemod
<DatePicker
  slots={{ textField: MyTextField }}
  components={{ toolbar: MyToolbar }}
/>

// After running the codemod
<DatePicker
  slots={{ textField: MyTextField }}
  slots={{ toolbar: MyToolbar }}
/>
```

The same applies to `slotProps` and `componentsProps`.
:::

### ✅ Rename slots types

The slot interfaces got renamed to match with `@mui/base` naming convention.
Suffix `SlotsComponent` is replaced by `Slots` and `SlotsComponentsProps` is replaced by `SlotProps`.
If you are not relying on the codemod, consider checking all the renamed types in [this file](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/src/v7.0.0/pickers/rename-slots-types/index.ts).
Here is an example on the `DateCalendar` typing.

```diff
-DateCalendarSlotsComponent
+DateCalendarSlots
-DateCalendarSlotsComponentsProps
+DateCalendarSlotProps
```

### Add new parameters to the `shortcuts` slot `onChange` callback

:::warning
The following breaking change only impacts you if you are overriding the `shortcuts` slot to create your own custom UI.
If you are just passing shortcuts to the default UI using `slotProps={{ shortcuts: [...] }}` then you can safely skip this section.
:::

The `onChange` callback fired when selecting a shortcut now requires two new parameters (previously they were optional):

- The [`changeImportance`](/x/react-date-pickers/shortcuts/#behavior-when-selecting-a-shortcut) of the shortcut.
- The `item` containing the entire shortcut object.

```diff
 const CustomShortcuts = (props) => {
   return (
     <React.Fragment>
       {props.items.map(item => {
         const value = item.getValue({ isValid: props.isValid });
         return (
           <button
-            onClick={() => onChange(value)}
+            onClick={() => onChange(value, props.changeImportance ?? 'accept', item)}
           >
             {value}
           </button>
         )
       }}
     </React.Fragment>
   )
 }

 <DatePicker slots={{ shortcuts: CustomShortcuts }} />
```

### Change the imports of the `calendarHeader` slot

The imports related to the `calendarHeader` slot have been moved from `@mui/x-date-pickers/DateCalendar` to `@mui/x-date-pickers/PickersCalendarHeader`:

```diff
 export {
   pickersCalendarHeaderClasses,
   PickersCalendarHeaderClassKey,
   PickersCalendarHeaderClasses,
   PickersCalendarHeader,
   PickersCalendarHeaderProps,
   PickersCalendarHeaderSlotsComponent,
   PickersCalendarHeaderSlotsComponentsProps,
   ExportedPickersCalendarHeaderProps,
-} from '@mui/x-date-pickers/DateCalendar';
+} from '@mui/x-date-pickers/PickersCalendarHeader';
```

## Removed props

### Replace `shouldDisableClock` with `shouldDisableTime`

The deprecated `shouldDisableClock` prop has been removed in favor of the more flexible `shouldDisableTime` prop.
The `shouldDisableClock` prop received `value` as a `number` of hours, minutes, or seconds.
Instead, the `shouldDisableTime` prop receives the date object (based on the used adapter).
You can read more about the deprecation of this prop in [v6 migration guide](/x/migration/migration-pickers-v5/#%E2%9C%85-rename-or-refactor-shoulddisabletime-prop).

```diff
 <DateTimePicker
-  shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12}
+  shouldDisableTime={(value, view) => view === 'hours' && value.hour() < 12}
 />
```

### ✅ Replace `defaultCalendarMonth` with `referenceDate`

The deprecated `defaultCalendarMonth` prop has been removed in favor of the more flexible `referenceDate` prop.

:::info
The new `referenceDate` prop is not limited to the default month.
It will also impact year, day, and time.

See [Date Calendar—Choose the initial year / month](/x/react-date-pickers/date-calendar/#choose-the-initial-year-month) or [Base concepts—Reference date when no value is defined](/x/react-date-pickers/base-concepts/#reference-date-when-no-value-is-defined) for more details.
:::

```diff
-<DateCalendar defaultCalendarMonth={dayjs('2022-04-01')};
+<DateCalendar referenceDate={dayjs('2022-04-01')} />
```

## Modified props

### Remove the string argument of the `dayOfWeekFormatter` prop

The string argument of the `dayOfWeekFormatter` prop has been replaced in favor of the date object to allow more flexibility.

```diff
 <DateCalendar
   // If you were still using the day string, you can get it back with your date library.
-  dayOfWeekFormatter={dayStr => `${dayStr}.`}
+  dayOfWeekFormatter={day => `${day.format('dd')}.`}

   // If you were already using the day object, just remove the first argument.
-  dayOfWeekFormatter={(_dayStr, day) => `${day.format('dd')}.`
+  dayOfWeekFormatter={day => `${day.format('dd')}.`}
 />
```

### Strict typing of the date-related props

All the date-related props are now strictly typed to only accept the date format supported by your adapter
(`Date` object for `date-fns`, `daysjs.Dayjs` object for `days-js`, etc.).

:::info
See [Base concepts—Typing of the date](/x/react-date-pickers/base-concepts/#typing-of-the-date) for more details.
:::

## Field components

### Update the format of `selectedSections`

The `selectedSections` prop no longer accepts start and end indexes.
When selecting several — but not all — sections,
the field components were not behaving correctly, you can now only select one or all sections:

```diff
 <DateField
-  selectedSections={{ startIndex: 0, endIndex: 0 }}
+  selectedSections={0}

   // If the field has 3 sections
-  selectedSections={{ startIndex: 0, endIndex: 2 }}
+  selectedSections="all"
 />
```

### Replace the section `hasLeadingZeros` property

:::success
This only impacts you if you are using the `unstableFieldRef` prop to imperatively access the section object.
:::

The property `hasLeadingZeros` has been removed from the sections in favor of the more precise `hasLeadingZerosInFormat` and `hasLeadingZerosInInput` properties.
To keep the same behavior, you can replace it by `hasLeadingZerosInFormat`

```diff
 const fieldRef = React.useRef<FieldRef<FieldSection>>(null);

 React.useEffect(() => {
   const firstSection = fieldRef.current!.getSections()[0];
-  console.log(firstSection.hasLeadingZeros);
+  console.log(firstSection.hasLeadingZerosInFormat);
 }, []);

 return <DateField unstableFieldRef={fieldRef} />;
```

### Headless fields

:::success
The following breaking changes only impact you if you are using hooks like `useDateField` to build a custom UI.

If you are just using the regular field components, then you can safely skip this section.
:::

#### Move `inputRef` inside the props passed to the hook

The field hooks now only receive the props instead of an object containing both the props and the `inputRef`.

```diff
-const { inputRef, ...otherProps } = props
-const fieldResponse = useDateField({ props: otherProps, inputRef });
+const fieldResponse = useDateField(props);
```

If you are using a multi input range field hook, the same applies to `startInputRef` and `endInputRef` params

```diff
- const { inputRef: startInputRef, ...otherStartTextFieldProps } = startTextFieldProps
- const { inputRef: endInputRef, ...otherEndTextFieldProps } = endTextFieldProps

  const fieldResponse = useMultiInputDateRangeField({
    sharedProps,
-   startTextFieldProps: otherStartTextFieldProps,
-   endTextFieldProps: otherEndTextFieldProps,
-   startInputRef
-   endInputRef,
+   startTextFieldProps,
+   endTextFieldProps
  });
```

#### Rename the ref returned by the hook to `inputRef`

When used with the v6 TextField approach (where the input is an `<input />` HTML element), the field hooks return a ref that needs to be passed to the `<input />` element.
This ref was previously named `ref` and has been renamed `inputRef` for extra clarity.

```diff
  const fieldResponse = useDateField(props);

- return <input ref={fieldResponse.ref} />
+ return <input ref={fieldResponse.inputRef} />
```

If you are using a multi input range field hook, the same applies to the ref in the `startDate` and `endDate` objects

```diff
  const fieldResponse = useDateField(props);

  return (
    <div>
-     <input ref={fieldResponse.startDate.ref} />
+     <input ref={fieldResponse.startDate.inputRef} />
      <span>–</span>
-     <input ref={fieldResponse.endDate.ref} />
+     <input ref={fieldResponse.endDate.inputRef} />
    </div>
  )
```

#### Restructure the API of `useClearableField`

The `useClearableField` hook API has been simplified to now take a `props` parameter instead of a `fieldProps`, `InputProps`, `clearable`, `onClear`, `slots` and `slotProps` parameters.

You should now be able to directly pass the returned value from your field hook (e.g: `useDateField`) to `useClearableField`

```diff
  const fieldResponse = useDateField(props);

- const { InputProps, onClear, clearable, slots, slotProps, ...otherFieldProps } = fieldResponse
- const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } = useClearableField({
-   fieldProps: otherFieldProps,
-   InputProps,
-   clearable,
-   onClear,
-   slots,
-   slotProps,
- });
-
-  return <MyCustomTextField {...processedFieldProps} InputProps={ProcessedInputProps} />

+ const processedFieldProps = useClearableField(fieldResponse);
+
+ return <MyCustomTextField {...processedFieldProps} />
```

:::info
If your custom field is based on one of the examples of the [Custom field](/x/react-date-pickers/custom-field/) page,
then you can look at the page to see all the examples improved and updated to use the new simplified API.
:::

#### Do not forward the `enableAccessibleFieldDOMStructure` prop to the DOM

The headless field hooks (e.g.: `useDateField`) now return a new prop called `enableAccessibleFieldDOMStructure`.
This is used to know if the current UI expected is built using the accessible DOM structure or not.

:::info
See [Fields—Accessible DOM structure](/x/react-date-pickers/fields/#accessible-dom-structure) for more details.
:::

When building a custom UI, you are most-likely only supporting one DOM structure, so you can remove `enableAccessibleFieldDOMStructure` before it is passed to the DOM:

```diff
  function MyCustomTextField(props) {
    const {
+     // Should be ignored
+     enableAccessibleFieldDOMStructure,

      // ... rest of the props you are using
    }

    return ( /* Some UI to edit the date */ )
  }

  function MyCustomField(props) {
    const fieldResponse = useDateField<Dayjs, false, typeof textFieldProps>({
      ...props,
+     // If you only support one DOM structure, we advise you to hardcode it
+     // here to avoid unwanted switches in your application.
+     enableAccessibleFieldDOMStructure: false,
    });

    return <MyCustomTextField ref={ref} {...fieldResponse} />;
  }

  function App() {
    return <DatePicker slots={{ field: MyCustomField }} />;
  }
```

## Date management

### Use localized week with luxon

The `AdapterLuxon` now uses the localized week when Luxon `v3.4.4` or higher is installed.
This improvement aligns `AdapterLuxon` with the behavior of other adapters.

If you want to keep the start of the week on Monday even if your locale says otherwise.
You can hardcode the week settings as follows:

```ts
import { Settings, Info } from 'luxon';

Settings.defaultWeekSettings = {
  firstDay: 1,
  minimalDays: Info.getMinimumDaysInFirstWeek(),
  weekend: Info.getWeekendWeekdays(),
};
```

### Remove the `monthAndYear` format

The `monthAndYear` format has been removed.
It was used in the header of the calendar views.
You can replace it with the new `format` prop of the `calendarHeader` slot:

```diff
 <LocalizationProvider
   adapter={AdapterDayJS}
-  formats={{ monthAndYear: 'MM/YYYY' }}
 />
   <DatePicker
+    slotProps={{ calendarHeader: { format: 'MM/YYYY' }}}
   />
   <DateRangePicker
+    slotProps={{ calendarHeader: { format: 'MM/YYYY' }}}
   />
 <LocalizationProvider />
```

## Renamed variables

### ✅ Rename the `dayPickerClasses` variable to `dayCalendarClasses`

The `dayPickerClasses` variable has been renamed `dayCalendarClasses` to be consistent with the new name of the `DayCalendar` component introduced in v6.0.0.

```diff
-import { dayPickerClasses } from '@mui/x-date-pickers/DateCalendar';
+import { dayCalendarClasses } from '@mui/x-date-pickers/DateCalendar';
```

## Usage with Day.js

### Use UTC with the Day.js adapter

The `dateLibInstance` prop of `LocalizationProvider` does not work with `AdapterDayjs` anymore.
This prop was used to set the pickers in UTC mode before the implementation of a proper timezone support in the components.

:::info
See [Timezone](/x/react-date-pickers/timezone/) for more details.
:::

```diff
 // When a `value` or a `defaultValue` is provided
 <LocalizationProvider
   adapter={AdapterDayjs}
-  dateLibInstance={dayjs.utc}
 >
   <DatePicker value={dayjs.utc('2022-04-17')} />
 </LocalizationProvider>

 // When no `value` or `defaultValue` is provided
 <LocalizationProvider
   adapter={AdapterDayjs}
-  dateLibInstance={dayjs.utc}
 >
-  <DatePicker />
+  <DatePicker timezone="UTC" />
 </LocalizationProvider>
```

### Usage with `customParseFormat`

The call to `dayjs.extend(customParseFormatPlugin)` has been moved to the `AdapterDayjs` constructor. This allows users
to pass custom options to this plugin before the adapter uses it.

If you are using this plugin before the rendering of the first `LocalizationProvider` component and did not call
`dayjs.extend` in your own codebase, you will need to manually extend `dayjs`:

```tsx
import dayjs from 'dayjs';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormatPlugin);
```

The other plugins are still added before the adapter initialization.

## Remove root level `locales` export

The `locales` export has been removed from the root of the packages.
In an effort to reduce the bundle size, the locales are now only available from the `@mui/x-date-pickers/locales` or `@mui/x-date-pickers-pro/locales` paths.
If you were still relying on the root level export, please update your code.

Before v7, it was possible to import locales from the package root (that is `import { frFR } from '@mui/x-date-pickers'`).

```diff
-import { frFR } from '@mui/x-date-pickers';
+import { frFR } from '@mui/x-date-pickers/locales';
```

## Remove `dateTimeViewRenderers` export

The `dateTimeViewRenderers` export has been removed in favor of reusing existing time view renderers (`renderTimeViewClock`, `renderDigitalClockTimeView` and `renderMultiSectionDigitalClockTimeView`) and date view renderer (`renderDateViewCalendar`) to render the `DesktopDateTimePicker`.

If you were relying on this import, you can refer to the implementation of the `DesktopDateTimePicker` to see how to combine the renderers yourself.

:::info
The additional side-effect of this change is that passing `renderTimeViewClock` to time view renderers will no longer revert to the old behavior of rendering only date or time view.
:::

## Adapters internal changes

:::success
The following breaking changes only impact you if you are using the adapters outside the pickers like displayed in the following example:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const adapter = new AdapterDays();
adapter.isValid(dayjs('2022-04-17T15:30'));
```

If you are just passing an adapter to `LocalizationProvider`, then you can safely skip this section.
:::

### Removed methods

<details>
  <summary>Show breaking changes</summary>

#### Remove the `dateWithTimezone` method

The `dateWithTimezone` method has been removed and its content has been moved the `date` method.
You can use the `date` method instead:

```diff
-adapter.dateWithTimezone(undefined, 'system');
+adapter.date(undefined, 'system');
```

#### Remove the `getDiff` method

The `getDiff` method has been removed.
You can directly use your date library:

```diff
 // For Day.js
-const diff = adapter.getDiff(value, comparing, unit);
+const diff = value.diff(comparing, unit);

 // For Luxon
-const diff = adapter.getDiff(value, comparing, unit);
+const getDiff = (value: DateTime, comparing: DateTime | string, unit?: AdapterUnits) => {
+  const parsedComparing = typeof comparing === 'string'
+    ? DateTime.fromJSDate(new Date(comparing))
+    : comparing;
+  if (unit) {
+    return Math.floor(value.diff(comparing).as(unit));
+  }
+  return value.diff(comparing).as('millisecond');
+};
+
+const diff = getDiff(value, comparing, unit);

 // For DateFns
-const diff = adapter.getDiff(value, comparing, unit);
+const getDiff = (value: Date, comparing: Date | string, unit?: AdapterUnits) => {
+  const parsedComparing = typeof comparing === 'string' ? new Date(comparing) : comparing;
+  switch (unit) {
+    case 'years':
+      return dateFns.differenceInYears(value, parsedComparing);
+    case 'quarters':
+      return dateFns.differenceInQuarters(value, parsedComparing);
+    case 'months':
+      return dateFns.differenceInMonths(value, parsedComparing);
+    case 'weeks':
+      return dateFns.differenceInWeeks(value, parsedComparing);
+    case 'days':
+      return dateFns.differenceInDays(value, parsedComparing);
+    case 'hours':
+      return dateFns.differenceInHours(value, parsedComparing);
+    case 'minutes':
+      return dateFns.differenceInMinutes(value, parsedComparing);
+    case 'seconds':
+      return dateFns.differenceInSeconds(value, parsedComparing);
+    default: {
+      return dateFns.differenceInMilliseconds(value, parsedComparing);
+    }
+  }
+};
+
+const diff = getDiff(value, comparing, unit);

 // For Moment
-const diff = adapter.getDiff(value, comparing, unit);
+const diff = value.diff(comparing, unit);
```

#### Remove the `getFormatHelperText` method

The `getFormatHelperText` method has been removed.
You can use the `expandFormat` instead:

```diff
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format);
```

And if you need the exact same output.
You can apply the following transformation:

```diff
 // For Day.js
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();

 // For Luxon
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();

 // For DateFns
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/(aaa|aa|a)/g, '(a|p)m').toLocaleLowerCase();

 // For Moment
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();
```

#### Remove the `getMeridiemText` method

The `getMeridiemText` method has been removed.
You can use the `setHours`, `date` and `format` methods to recreate its behavior:

```diff
-const meridiem = adapter.getMeridiemText('am');
+const getMeridiemText = (meridiem: 'am' | 'pm') => {
+  const date = adapter.setHours(adapter.date()!, meridiem === 'am' ? 2 : 14);
+  return utils.format(date, 'meridiem');
+};
+
+const meridiem = getMeridiemText('am');
```

#### Remove the `getMonthArray` method

The `getMonthArray` method has been removed.
You can use the `startOfYear` and `addMonths` methods to recreate its behavior:

```diff
-const monthArray = adapter.getMonthArray(value);
+const getMonthArray = (year) => {
+  const firstMonth = utils.startOfYear(year);
+  const months = [firstMonth];
+
+  while (months.length < 12) {
+    const prevMonth = months[months.length - 1];
+    months.push(utils.addMonths(prevMonth, 1));
+  }
+
+  return months;
+}
+
+const monthArray = getMonthArray(value);
```

#### Remove the `getNextMonth` method

The `getNextMonth` method has been removed.
You can use the `addMonths` method instead:

```diff
-const nextMonth = adapter.getNextMonth(value);
+const nextMonth = adapter.addMonths(value, 1);
```

#### Remove the `getPreviousMonth` method

The `getPreviousMonth` method has been removed.
You can use the `addMonths` method instead:

```diff
-const previousMonth = adapter.getPreviousMonth(value);
+const previousMonth = adapter.addMonths(value, -1);
```

#### Remove the `getWeekdays` method

The `getWeekdays` method has been removed.
You can use the `startOfWeek` and `addDays` methods instead:

```diff
-const weekDays = adapter.getWeekdays(value);
+const getWeekdays = (value) => {
+  const start = adapter.startOfWeek(value);
+  return [0, 1, 2, 3, 4, 5, 6].map((diff) => utils.addDays(start, diff));
+};
+
+const weekDays = getWeekdays(value);
```

#### Remove the `isNull` method

The `isNull` method has been removed.
You can replace it with a very basic check:

```diff
-const isNull = adapter.isNull(value);
+const isNull = value === null;
```

#### Remove the `mergeDateAndTime` method

The `mergeDateAndTime` method has been removed.
You can use the `setHours`, `setMinutes`, and `setSeconds` methods to recreate its behavior:

```diff
-const result = adapter.mergeDateAndTime(valueWithDate, valueWithTime);
+const mergeDateAndTime = <TDate>(
+   dateParam,
+   timeParam,
+ ) => {
+   let mergedDate = dateParam;
+   mergedDate = utils.setHours(mergedDate, utils.getHours(timeParam));
+   mergedDate = utils.setMinutes(mergedDate, utils.getMinutes(timeParam));
+   mergedDate = utils.setSeconds(mergedDate, utils.getSeconds(timeParam));
+
+   return mergedDate;
+ };
+
+const result = mergeDateAndTime(valueWithDate, valueWithTime);
```

#### Remove the `parseISO` method

The `parseISO` method has been removed.
You can directly use your date library:

```diff
 // For Day.js
-const value = adapter.parseISO(isoString);
+const value = dayjs(isoString);

 // For Luxon
-const value = adapter.parseISO(isoString);
+const value = DateTime.fromISO(isoString);

 // For DateFns
-const value = adapter.parseISO(isoString);
+const value = dateFns.parseISO(isoString);

 // For Moment
-const value = adapter.parseISO(isoString);
+const value = moment(isoString, true);
```

#### Remove the `toISO` method

The `toISO` method has been removed.
You can directly use your date library:

```diff
 // For Day.js
-const isoString = adapter.toISO(value);
+const isoString = value.toISOString();

 // For Luxon
-const isoString = adapter.toISO(value);
+const isoString = value.toUTC().toISO({ format: 'extended' });

 // For DateFns
-const isoString = adapter.toISO(value);
+const isoString = dateFns.formatISO(value, { format: 'extended' });

 // For Moment
-const isoString = adapter.toISO(value);
+const isoString = value.toISOString();
```

The `getYearRange` method used to accept two params and now accepts a tuple to be consistent with the `isWithinRange` method:

```diff
-adapter.getYearRange(start, end);
+adapter.getYearRange([start, end])
```

</details>

### Modified methods

<details>
  <summary>Show breaking changes</summary>

#### Restrict the input format of the `date` method

The `date` method now have the behavior of the v6 `dateWithTimezone` method.
It no longer accept `any` as a value but only `string | null | undefined`

```diff
-adapter.date(new Date());
+adapter.date();

-adapter.date(new Date('2022-04-17');
+adapter.date('2022-04-17');

-adapter.date(new Date(2022, 3, 17, 4, 5, 34));
+adapter.date('2022-04-17T04:05:34');

-adapter.date(new Date('Invalid Date'));
+adapter.getInvalidDate();
```

#### Restrict the input format of the `isEqual` method

The `isEqual` method used to accept any type of value for its two input and tried to parse them before checking if they were equal.
The method has been simplified and now only accepts an already-parsed date or `null` (ie: the same formats used by the `value` prop in the pickers)

```diff
 const adapterDayjs = new AdapterDayjs();
 const adapterLuxon = new AdapterLuxon();
 const adapterDateFns = new AdapterDateFns();
 const adapterMoment = new AdapterMoment();

 // Supported formats
 const isEqual = adapterDayjs.isEqual(null, null); // Same for the other adapters
 const isEqual = adapterLuxon.isEqual(DateTime.now(), DateTime.fromISO('2022-04-17'));
 const isEqual = adapterMoment.isEqual(moment(), moment('2022-04-17'));
 const isEqual = adapterDateFns.isEqual(new Date(), new Date('2022-04-17'));

 // Non-supported formats (JS Date)
-const isEqual = adapterDayjs.isEqual(new Date(), new Date('2022-04-17'));
+const isEqual = adapterDayjs.isEqual(dayjs(), dayjs('2022-04-17'));

-const isEqual = adapterLuxon.isEqual(new Date(), new Date('2022-04-17'));
+const isEqual = adapterLuxon.isEqual(DateTime.now(), DateTime.fromISO('2022-04-17'));

-const isEqual = adapterMoment.isEqual(new Date(), new Date('2022-04-17'));
+const isEqual = adapterMoment.isEqual(moment(), moment('2022-04-17'));

 // Non-supported formats (string)
-const isEqual = adapterDayjs.isEqual('2022-04-16', '2022-04-17');
+const isEqual = adapterDayjs.isEqual(dayjs('2022-04-17'), dayjs('2022-04-17'));

-const isEqual = adapterLuxon.isEqual('2022-04-16', '2022-04-17');
+const isEqual = adapterLuxon.isEqual(DateTime.fromISO('2022-04-17'), DateTime.fromISO('2022-04-17'));

-const isEqual = adapterMoment.isEqual('2022-04-16', '2022-04-17');
+const isEqual = adapterMoment.isEqual(moment('2022-04-17'), moment('2022-04-17'));

-const isEqual = adapterDateFns.isEqual('2022-04-16', '2022-04-17');
+const isEqual = adapterDateFns.isEqual(new Date('2022-04-17'), new Date('2022-04-17'));
```

#### Restrict the input format of the `isValid` method

The `isValid` method used to accept any type of value and tried to parse them before checking their validity.
The method has been simplified and now only accepts an already-parsed date or `null`.
Which is the same type as the one accepted by the components `value` prop.

```diff
 const adapterDayjs = new AdapterDayjs();
 const adapterLuxon = new AdapterLuxon();
 const adapterDateFns = new AdapterDateFns();
 const adapterMoment = new AdapterMoment();

 // Supported formats
 const isValid = adapterDayjs.isValid(null); // Same for the other adapters
 const isValid = adapterLuxon.isValid(DateTime.now());
 const isValid = adapterMoment.isValid(moment());
 const isValid = adapterDateFns.isValid(new Date());

 // Non-supported formats (JS Date)
-const isValid = adapterDayjs.isValid(new Date('2022-04-17'));
+const isValid = adapterDayjs.isValid(dayjs('2022-04-17'));

-const isValid = adapterLuxon.isValid(new Date('2022-04-17'));
+const isValid = adapterLuxon.isValid(DateTime.fromISO('2022-04-17'));

-const isValid = adapterMoment.isValid(new Date('2022-04-17'));
+const isValid = adapterMoment.isValid(moment('2022-04-17'));

 // Non-supported formats (string)
-const isValid = adapterDayjs.isValid('2022-04-17');
+const isValid = adapterDayjs.isValid(dayjs('2022-04-17'));

-const isValid = adapterLuxon.isValid('2022-04-17');
+const isValid = adapterLuxon.isValid(DateTime.fromISO('2022-04-17'));

-const isValid = adapterMoment.isValid('2022-04-17');
+const isValid = adapterMoment.isValid(moment('2022-04-17'));

-const isValid = adapterDateFns.isValid('2022-04-17');
+const isValid = adapterDateFns.isValid(new Date('2022-04-17'));
```

</details>

## Removed internal types

The following internal types were exported by mistake and have been removed from the public API:

- `UseDateFieldDefaultizedProps`
- `UseTimeFieldDefaultizedProps`
- `UseDateTimeFieldDefaultizedProps`
- `UseSingleInputDateRangeFieldComponentProps`
- `UseSingleInputTimeRangeFieldComponentProps`
- `UseSingleInputDateTimeRangeFieldComponentProps`
