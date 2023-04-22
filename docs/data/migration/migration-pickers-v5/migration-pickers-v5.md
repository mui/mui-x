# Migration from v5 to v6

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v5 to v6.</p>

## Introduction

To get started, check out [the blog post about the release of MUI X v6](https://mui.com/blog/mui-x-v6/).

## Start using the new release

In `package.json`, change the version of the date pickers package to `latest` or `^6.0.0`.

```diff
-"@mui/x-date-pickers": "5.X.X",
+"@mui/x-date-pickers": "^6.0.0",
```

Since v6 is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v5 to v6.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v6. You can run `v6.0.0/pickers/preset-safe` targeting only Date and Time Pickers or `v6.0.0/preset-safe` to target Data Grid as well.
It should be only applied **once per folder.**

```sh
// Date and Time Pickers specific
npx @mui/x-codemod v6.0.0/pickers/preset-safe <path>
// Target Data Grid as well
npx @mui/x-codemod v6.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for pickers](https://github.com/mui/mui-x/blob/master/packages/x-codemod/README.md#preset-safe-for-pickers) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v6.0.0/pickers/preset-safe` (or `v6.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

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

## Picker components

### ✅ Rename the `inputFormat` prop

The `inputFormat` prop has been renamed to `format` on all the pickers components.

```diff
 <DatePicker
-  inputFormat="YYYY"
+  format="YYYY"
 />
```

### Update expected values in tests

The value rendered in the input might have been modified.
If you are using RTL or if your date contains single digits sections, non-ASCII characters will be added.

If your tests are relying on the input values, you can clean them with the following method.

```ts
export const cleanString = (dirtyString: string) =>
  dirtyString
    .replace(/[\u2066\u2067\u2068\u2069]/g, '') // Remove non-ASCII characters
    .replace(/ \/ /g, '/'); // Remove extra spaces
```

### Update the format of the `value` prop

Previously, it was possible to provide any format that your date management library was able to parse.
For instance, you could pass `value={new Date()}` when using `AdapterDayjs`.
This behavior brought a lot of confusion.

In v6, the format expected by the `value` prop is the same as for any other prop holding a date.
Here is the syntax to initialize a date picker at the current date for each adapter:

```tsx
// Date-fns
<DatePicker value={new Date()} />;

// Dayjs
import dayjs from 'dayjs';
<DatePicker value={dayjs()} />;

// Moment
import moment from 'moment';
<DatePicker value={moment()} />;

// Luxon
import { DateTime } from 'luxon';
<DatePicker value={DateTime.now()} />;
```

### Stop rendering a clock on desktop

In desktop mode, the `DateTimePicker` and `TimePicker` components will not display the clock.
This is the first step towards moving to a [better implementation](https://github.com/mui/mui-x/issues/4483).
The behavior on mobile mode is still the same.
If you were relying on Clock Picker in desktop mode for tests—make sure to check [testing caveats](/x/react-date-pickers/base-concepts/#testing-caveats) to choose the best replacement for it.

You can manually re-enable the clock using the new `viewRenderers` prop.
The code below enables the `Clock` UI on all the `DesktopTimePicker` and `DesktopDateTimePicker` in your application.

Take a look at the [default props via theme documentation](/material-ui/customization/theme-components/#theme-default-props) for more information.

```tsx
const theme = createTheme({
  components: {
    MuiDesktopTimePicker: {
      defaultProps: {
        viewRenderers: {
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        },
      },
    },
    MuiDesktopDateTimePicker: {
      defaultProps: {
        viewRenderers: {
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        },
      },
    },
  },
});
```

:::success
If you are using TypeScript, please make sure to add the [theme augmentation](/x/react-date-pickers/base-concepts/#typescript) to your project.
:::

### Remove the keyboard view

The picker components no longer have a keyboard view to render the input inside the modal on mobile.

- If your date is easier to edit with the keyboard (e.g: a birthdate), you can directly use the new field components:

  ```diff
   function App() {
     return (
  -    <DatePicker />
  +    <DateField />
     )
   }
  ```

- If you want to keep the old keyboard view, you can pass a custom `Layout` component slot to re-introduce the keyboard view.

{{"demo": "MobileKeyboardView.js", "defaultCodeOpen": false}}

:::info
At some point, the mobile pickers should have a prop allowing to have an editable field without opening the modal.
:::

### ✅ Rename or refactor `shouldDisableTime` prop

The `shouldDisableTime` prop signature has been changed.
Previously it did receive `value` as a `number` of hours, minutes, or seconds. Now it will receive the date object (based on the used adapter).
This will allow more powerful usage and will be compatible with the future digital time selection view.

Either rename the prop to the newly added, but deprecated `shouldDisableClock` or refactor usage to account for the change in prop type.
The codemod will take care of renaming the prop to keep the existing functionality but feel free to update to the new `shouldDisableTime` prop on your own.

```diff
 <DateTimePicker
-  shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12}
+  shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12}
 />

 <DateTimePicker
-  shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12}
+  shouldDisableTime={(value, view) => view === 'hours' && value.hour() < 12}
 />
```

### Change the DOM structure

- The internal `CalendarOrClockPicker` component has been removed and all its element have been moved to the new `Layout` component slot.

  The DOM node containing the toolbar and the view content (the `root` slot of the `CalendarOrClockPicker` component) no longer exists.
  The closest equivalent is now the `contentWrapper` slot of the `PickersLayout` component, which do not contain the toolbar.
  If you need a DOM node containing the toolbar and the view content, you will have to pass a [custom `Layout` component slot](/x/react-date-pickers/custom-layout/#dom-customization).

  ```diff
   const theme = createTheme({
     components: {
  -    MuiCalendarOrClockPicker: {
  +    MuiPickersLayout: {
         styleOverrides: {
  -        root: {
  +        contentWrapper: {
             backgroundColor: 'red',
           },
         },
       },
     },
   });
  ```

- The internal `PickerStaticWrapper` component has been removed and all its element have been moved to the new `Layout` component slot.

  ```diff
   const theme = createTheme({
     components: {
  -    MuiPickerStaticWrapper: {
  +    MuiPickersLayout: {
         styleOverrides: {
           root: {
             opacity: 0.5,
           },
         },
       },
     },
   });
  ```

  The DOM node containing the toolbar and the view content (the `content` slot of the `PickerStaticWrapper` component) no longer exists.
  The closest equivalent is now the `contentWrapper` slot of the `PickersLayout` component, which do not contain the toolbar.
  If you need a DOM node containing the toolbar and the view content, you will have to pass a [custom `Layout` component slot](/x/react-date-pickers/custom-layout/#dom-customization).

  ```diff
   const theme = createTheme({
     components: {
  -    MuiPickerStaticWrapper: {
  +    MuiPickersLayout: {
         styleOverrides: {
  -        content: {
  +        contentWrapper: {
             opacity: 0.5,
           },
         },
       },
     },
   });
  ```

## Date library and adapters

### ✅ Do not import adapter from `@date-io`

In v5, it was possible to import adapters either from either `@date-io` or `@mui/x-date-pickers` which were the same.
In v6, the adapters are extended by `@mui/x-date-pickers` to support [fields components](/x/react-date-pickers/fields/).
Which means adapters can not be imported from `@date-io` anymore. They need to be imported from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`.
Otherwise, some methods will be missing.
If you do not find the adapter you were using—there probably was a reason for it, but you can raise an issue expressing interest in it.

```diff
-import AdapterJalaali from '@date-io/jalaali';
+import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
```

### Increase Luxon minimal version

The v6 `AdapterLuxon` now requires `luxon` version `3.0.2` or higher in order to work.

Take a look at the [Upgrading Luxon](https://moment.github.io/luxon/#/upgrading) guide if you are using an older version.

## View components

### ✅ Rename components

The view components allowing to pick a time, a date or parts of a date without an input have been renamed to better fit their usage:

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

Component names in the theme have changed as well:

```diff
-MuiCalendarPicker: {
+MuiDateCalendar: {

-MuiDayPicker: {
+MuiDayCalendar: {

-MuiCalendarPickerSkeleton: {
+MuiDayCalendarSkeleton: {

-MuiMonthPicker: {
+MuiMonthCalendar: {

-MuiYearPicker: {
+MuiYearCalendar: {

-MuiClockPicker: {
+MuiTimeClock: {
```

### ✅ Rename `date` prop to `value`

The `date` prop has been renamed to `value` on `MonthCalendar`, `YearCalendar`, `TimeClock`, and `DateCalendar` (components renamed in previous section):

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

### Use the 12h/24h format from the locale as the default value of the `ampm` prop on `TimeClock`

The default value of the `ampm` prop changed from `false` to `utils.is12HourCycleInCurrentLocale()`.
It means that the `TimeClock` component will use a 12h time format for locales where the time is usually displayed with a 12h format.

If you want to keep the previous behavior, you just have to set the `ampm` prop to `false` (components renamed in previous section):

```diff
- <ClockPicker />
+ <TimeClock ampm={false} />
```

### Stop using the responsive classes on `PickersMonth` and `PickersYear`

The `modeMobile` and `modeDesktop` classes have been removed from the `PickersMonth` and `PickersYear` internal components.

If you were using those classes on responsive components,
you can import `DEFAULT_DESKTOP_MODE_MEDIA_QUERY` from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro` (or use your custom media query if any):

```diff
 <GlobalStyles
   styles={{
-    [`.${pickersYearClasses.modeDesktop}`]: {
-      backgroundColor: 'red'
-    }
+    [DEFAULT_DESKTOP_MODE_MEDIA_QUERY]: {
+      [`.${pickersYearClasses.root}`]: {
+        backgroundColor: 'red'
+      }
+    }

-    [`.${pickersYearClasses.modeMobile}`]: {
-      backgroundColor: 'red'
-    }
+    [DEFAULT_DESKTOP_MODE_MEDIA_QUERY.replace('@media', '@media not')]: {
+      [`.${pickersYearClasses.root}`]: {
+        backgroundColor: 'red'
+      }
+    }
   }}
 />
```

:::info
Works exactly the same way for `PickersMonth`
:::

## Localization

### ✅ Rename localization props

The props used to set the text displayed in the pickers have been replaced by keys inside the `localeText` prop:

| Removed prop                 | Property in the new `localText` prop                                              |
| :--------------------------- | :-------------------------------------------------------------------------------- |
| `endText`                    | `end`                                                                             |
| `getClockLabelText`          | `clockLabelText`                                                                  |
| `getHoursClockNumberText`    | `hoursClockNumberText`                                                            |
| `getMinutesClockNumberText`  | `minutesClockNumberText`                                                          |
| `getSecondsClockNumberText`  | `secondsClockNumberText`                                                          |
| `getViewSwitchingButtonText` | `calendarViewSwitchingButtonAriaLabel`                                            |
| `leftArrowButtonText`        | `openPreviousView` (or `previousMonth` when the button changes the visible month) |
| `rightArrowButtonText`       | `openNextView` (or `nextMonth` when the button changes the visible month)         |
| `startText`                  | `start`                                                                           |
| `getOpenDialogAriaText`      | `openDatePickerDialogue` /(or `openTimePickerDialogue` for time pickers)          |

For instance if you want to replace the `startText` / `endText`

```diff
 <DateRangePicker
-  startText="From"
-  endText="To"
+  localeText={{
+    start: 'From',
+    end: 'To',
+  }}
 />
```

### ✅ Rename `locale` prop on `LocalizationProvider`

The `locale` prop of the `LocalizationProvider` component have been renamed `adapterLocale`:

```diff
 <LocalizationProvider
   dateAdapter={AdapterDayjs}
-  locale="fr"
+  adapterLocale="fr"
 >
   {children}
 </LocalizationProvider
```

## Component slots / component slot props

All the props used to pass props to parts of the UI (e.g: pass a prop to the input) have been replaced by component slot props.
All the props used to override parts of the UI (e.g: pass a custom day renderer) have been replaced by component slots.

You can find more information about this pattern in the [MUI Base documentation](https://mui.com/base/getting-started/usage/#shared-props).

These changes apply to all the components that had the prop.
For example, the `ToolbarComponent` has been replaced by a `Toolbar` component slot on all pickers.

### Input renderer (required in v5)

- The `renderInput` has been replaced by an `input` component slot props:

  ```diff
   <DatePicker
  -  renderInput={(inputProps) => <TextField {...props} variant="outlined" />}
  +  componentsProps={{ textField: { variant: 'outlined' } }}
   />

   <DateRangePicker
  -  renderInput={(startProps, endProps) => (
  -    <React.Fragment>
  -      <TextField {...startProps} variant="outlined" />
  -      <Box sx={{ mx: 2 }}> - </Box>
  -      <TextField {...endProps} variant="outlined" />
  -    </React.Fragment>
  -  )}
  +  componentsProps={{ textField: { variant: 'outlined' } }}
   />
  ```

- The Date Range Picker also have a new `fieldSeparator` component slot and component slot props to customize only this part of the UI:

  ```diff
   <DateRangePicker
  -  renderInput={(startProps, endProps) => (
  -    <React.Fragment>
  -      <TextField {...startProps} />
  -      <Box sx={{ mx: 2 }}> to </Box>
  -      <TextField {...endProps} />
  -    </React.Fragment>
  -  )}
  +  componentsProps={{ fieldSeparator: { children: 'to' } }}
   />
  ```

### Toolbar (`ToolbarComponent`)

- ✅ The `ToolbarComponent` has been replaced by a `Toolbar` component slot:

  ```diff
   <DatePicker
  -  ToolbarComponent={MyToolbar}
  +  components={{ Toolbar: MyToolbar }}
   />
  ```

- ✅ The `toolbarPlaceholder`, `toolbarFormat`, and `showToolbar` props have been moved to the `toolbar` component slot props:

  ```diff
   <DatePicker
  -  toolbarPlaceholder="__"
  -  toolbarFormat="DD / MM / YYYY"
  -  showToolbar
  +  componentsProps={{
  +    toolbar: {
  +      toolbarPlaceholder: '__',
  +      toolbarFormat: 'DD / MM / YYYY',
  +      hidden: false,
  +    }
  +  }}
   />
  ```

- ✅ The `toolbarTitle` prop has been moved to the localization object:

  ```diff
   <DatePicker
  -  toolbarTitle="Title"
  +  localeText={{ toolbarTitle: 'Title' }}
   />
  ```

- ✅ The toolbar related translation keys have been renamed to better fit their usage:

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

- The `onChange` / `openView` props on the toolbar have been renamed to `onViewChange` / `view`.

  ```diff
   const CustomToolbarComponent = props => (
     <div>
  -    <button onChange={() => props.onChange('day')}>Show day view</button>
  +    <button onClick={() => props.onViewChange('day')}>Show day view</button>
  -    <div>Current view: {props.openView}</div>
  +    <div>Current view: {props.view}</div>
     </div>
   )

   <DatePicker
  -  ToolbarComponent={CustomToolbarComponent}
  +  components={{
  +    Toolbar: CustomToolbarComponent
  +  }}
   />
  ```

- The `currentlySelectingRangeEnd` / `setCurrentlySelectingRangeEnd` props on the Date Range Picker toolbar have been renamed to `rangePosition` / `onRangePositionChange`.

  ```diff
   const CustomToolbarComponent = props => (
     <div>
  -    <button onChange={() => props.setCurrentlySelectingRangeEnd('end')}>Edit end date</button>
  +    <button onClick={() => props.onRangePositionChange('end')}>Edit end date</button>
  -    <div>Is editing end date: {props.currentlySelectingRangeEnd === 'end'}</div>
  +    <div>Is editing end date: {props.rangePosition === 'end'}</div>
     </div>
   )
   <DateRangePicker
  -  ToolbarComponent={CustomToolbarComponent}
  +  components={{
  +    Toolbar: CustomToolbarComponent
  +  }}
   />
  ```

### Tabs

- ✅ The `hideTabs` and `timeIcon` props have been moved to `tabs` component slot props.
  The `dateRangeIcon` prop has been renamed to `dateIcon` and moved to `tabs` component slot props:

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

- The `onChange` prop on `DateTimePickerTabs` component has been renamed to `onViewChange` to better fit its usage:

  ```diff
   <DateTimePickerTabs
  -  onChange={() => {}}
  +  onViewChange={() => {}}
   />
  ```

  ```diff
   const CustomTabsComponent = props => (
     <div>
  -    <button onClick={() => props.onChange('day')}>Show day view</button>
  +    <button onClick={() => props.onViewChange('day')}>Show day view</button>
     </div>
   )
   <DateTimePicker
     components={{
       Tabs: CustomTabsComponent
     }}
   />
  ```

### Action bar

- The `actions` prop of the `actionBar` component slot can no longer receive a callback.
  Instead, you can pass a callback at the component slot props level

  ```diff
   <DatePicker
     componentsProps={{
  -     actionBar: {
  -       actions: (variant) => (variant === 'desktop' ? [] : ['clear']),
  -     },
  +     actionBar: ({ wrapperVariant }) => ({
  +       actions: wrapperVariant === 'desktop' ? [] : ['clear'],
  +     }),
     }}
   />
  ```

### Day (`renderDay`)

- The `renderDay` prop has been replaced by a `Day` component slot:

  ```diff
   <DatePicker
  -  renderDay={(_, dayProps) => <CustomDay {...dayProps} />}
  +  components={{ Day: CustomDay }}
   />
  ```

- The `Day` component slot no longer receives a `selectedDays` prop.
  If you need to access it, you can control the value and pass it to the component slot props:

  ```tsx
  function CustomDay({ selectedDay, ...other }) {
    // do something with 'selectedDay'
    return <PickersDay {...other} />;
  }

  function App() {
    const [value, setValue] = React.useState(null);

    return (
      <DatePicker
        value={value}
        onChange={(newValue) => setValue(newValue)}
        components={{ Day: CustomDay }}
        componentsProps={{
          day: { selectedDay: value },
        }}
      />
    );
  }
  ```

### ✅ Popper (`PopperProps`)

- The `PopperProps` prop has been replaced by a `popper` component slot props:

  ```diff
   <DatePicker
  -  PopperProps={{ onClick: handleClick }}
  +  componentsProps={{ popper: { onClick: handleClick } }}
   />
  ```

### ✅ Desktop transition (`TransitionComponent`)

- The `TransitionComponent` prop has been replaced by a `DesktopTransition` component slot:

  ```diff
   <DatePicker
  -  TransitionComponent={Fade}
  +  components={{ DesktopTransition: Fade }}
   />
  ```

### ✅ Dialog (`DialogProps`)

- The `DialogProps` prop has been replaced by a `dialog` component slot props:

  ```diff
   <DatePicker
  -  DialogProps={{ backgroundColor: 'red' }}
  +  componentsProps={{ dialog: { backgroundColor: 'red' }}}
   />
  ```

### ✅ Desktop paper (`PaperProps`)

- The `PaperProps` prop has been replaced by a `desktopPaper` component slot props:

  ```diff
   <DatePicker
  -  PaperProps={{ backgroundColor: 'red' }}
  +  componentsProps={{ desktopPaper: { backgroundColor: 'red' } }}
   />
  ```

### ✅ Desktop TrapFocus (`TrapFocusProp`)

- The `TrapFocusProps` prop has been replaced by a `desktopTrapFocus` component slot props:

  ```diff
   <DatePicker
  -  TrapFocusProps={{ isEnabled: () => false }}
  +  componentsProps={{ desktopTrapFocus: { isEnabled: () => false } }}
   />
  ```

### Paper Content

- The `PaperContent` / `paperContent` component slot and component slot props have been removed.

  You can use the new [`Layout` component slot](/x/react-date-pickers/custom-layout/).
  The main difference is that you now receive the various parts of the UI instead of a single `children` prop:

  ```diff
  +import { usePickerLayout } from '@mui/x-date-pickers/PickersLayout';

   function MyCustomLayout(props) {
  -  const { children } = props;
  -
  -  return (
  -    <React.Fragment>
  -      {children}
  -      <div>Custom component</div>
  -    </React.Fragment>
  -  );
  +  const { toolbar, tabs, content, actionBar} = usePickerLayout(props);
  +
  +  return (
  +    <PickersLayoutRoot>
  +      {toolbar}
  +      {content}
  +      {actionBar}
  +      <div>Custom component</div>
  +    </PickersLayoutRoot>
  +  );
   }

   function App() {
     return (
       <DatePicker
          components={{
  -         PaperContent: MyCustomLayout,
  +         Layout: MyCustomLayout,
          }}
       />
     );
   }
  ```

### ✅ Left arrow button

- The component slot `LeftArrowButton` has been renamed to `PreviousIconButton`:

```diff
 <DatePicker
   components={{
-    LeftArrowButton: CustomButton,
+    PreviousIconButton: CustomButton,
   }}

   componentsProps={{
-    leftArrowButton: {},
+    previousIconButton: {},
   }}
 />
```

### ✅ Right arrow button

- The component slot `RightArrowButton` has been renamed to `NextIconButton`:

  ```diff
   <DatePicker
     components={{
  -    RightArrowButton: CustomButton,
  +    NextIconButton: CustomButton,
     }}

     componentsProps={{
  -    rightArrowButton: {},
  +    nextIconButton: {},
     }}
   />
  ```

### ✅ Input

- The `InputProps` prop has been removed.
  You can use the `InputProps` of the `textField` component slot props instead:

  ```diff
   <DatePicker
  -  InputProps={{ color: 'primary' }}
  +  componentsProps={{ textField: { InputProps: { color: 'primary' } } }}
   />
  ```

### ✅ Input adornment

- The `InputAdornmentProps` prop has been replaced by an `inputAdornment` component slot props:

  ```diff
   <DatePicker
  -  InputAdornmentProps={{ position: 'start' }}
  +  componentsProps={{ inputAdornment: { position: 'start' } }}
   />
  ```

### ✅ Open Picker Button

- The `OpenPickerButtonProps` prop has been replaced by an `openPickerButton` component slot props:

  ```diff
   <DatePicker
  -  OpenPickerButtonProps={{ ref: buttonRef }}
  +  componentsProps={{ openPickerButton: { ref: buttonRef } }}
   />
  ```

## Rename remaining `private` components

The four components prefixed with `Private` are now stable.
These components were renamed:

- `PrivatePickersMonth` -> `MuiPickersMonth`
- `PrivatePickersSlideTransition` -> `MuiPickersSlideTransition`
- `PrivatePickersToolbarText` -> `MuiPickersToolbarText`
- `PrivatePickersYear` -> `MuiPickersYear`

Manual style overriding will need to use updated classes:

```diff
-.PrivatePickersMonth-root {
+.MuiPickersMonth-root {

-.PrivatePickersSlideTransition-root {
+.MuiPickersSlideTransition-root {

-.PrivatePickersToolbarText-root {
+.MuiPickersToolbarText-root {

-.PrivatePickersYear-root {
+.MuiPickersYear-root {
```

Component name changes are also reflected in `themeAugmentation`:

```diff
 const theme = createTheme({
   components: {
-    PrivatePickersMonth: {
+    MuiPickersMonth: {
       // overrides
     },
-    PrivatePickersSlideTransition: {
+    MuiPickersSlideTransition: {
       // overrides
     },
-    PrivatePickersToolbarText: {
+    MuiPickersToolbarText: {
       // overrides
     },
-    PrivatePickersYear: {
+    MuiPickersYear: {
       // overrides
     },
   },
 });
```

## Rename `components` to `slots` (optional)

The `components` and `componentsProps` props are being renamed to `slots` and `slotProps` props respectively.
This is a slow and ongoing effort between the different MUI libraries.
To smooth the transition, pickers support both the `components` props which are deprecated, and the new `slots` props.

If you would like to use the new API and do not want to see deprecated prop usage, consider running `rename-components-to-slots` codemod handling the prop renaming.

```sh
npx @mui/x-codemod v6.0.0/pickers/rename-components-to-slots <path>
```

Take a look at [the RFC](https://github.com/mui/material-ui/issues/33416) for more information.
