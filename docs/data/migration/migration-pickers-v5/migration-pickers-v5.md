# Migration from v5 to v6

<p class="description">This guide describes the changes needed to migrate the Date & Time Pickers from v5 to v6.</p>

## Start using the alpha release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "latest",
+"@mui/x-date-pickers": "next",
```

Using `next` ensures that it will always use the latest v6 alpha release, but you can also use a fixed version, like `6.0.0-alpha.0`.

## Breaking changes

Since v6 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v5 to v6.

### Drop `clock` in desktop mode

In desktop mode, the `DateTimePicker` and `TimePicker` components will not display the clock.
This is the first step towards moving to a [better implementation](https://github.com/mui/mui-x/issues/4483).
The behavior on mobile mode is still the same.
If you were relying on Clock Picker in desktop mode for tests—make sure to check [testing caveats](/x/react-date-pickers/getting-started/#testing-caveats) to choose the best replacement for it.

### Extended `@date-io` adapters

In v5, it was possible to import adapters either from `@date-io` or `@mui/x-date-pickers` which were the same.
In v6, the adapters are extended by `@mui/x-date-pickers` to support [fields components](/x/react-date-pickers/fields/).
Which means adapters can not be imported from `@date-io` anymore. They need to be imported from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`. Otherwise, some methods will be missing.
If you do not find the adapter you were using—there probably was a reason for it, but you can raise an issue expressing interest in it.

```diff
-import AdapterJalaali from '@date-io/jalaali';
+import { AdapterMomentJalaali } from '@mui/x-date-pickers-pro/AdapterMomentJalaali';
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

### Rename the `LeftArrowButton` slot

The component slot `LeftArrowButton` has been renamed `PreviousIconButton` on all pickers:

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

### Rename the `RightArrowButton` slot

The component slot `RightArrowButton` has been renamed `NextIconButton` on all pickers:

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

### Replace the `DialogProps` prop

The `DialogProps` prop has been replaced by a `dialog` component props on all responsive and mobile pickers:

```diff
 <DatePicker
-  DialogProps={{ backgroundColor: 'red' }}
+  componentsProps={{ dialog: { backgroundColor: 'red }}}
 />
```

### Replace the `PaperProps` prop

The `PaperProps` prop has been replaced by a `desktopPaper` component props on all responsive and desktop pickers:

```diff
 <DatePicker
-  PaperProps={{ backgroundColor: 'red' }}
+  componentsProps={{ desktopPaper: { backgroundColor: 'red }}}
 />
```

### Replace the `PopperProps` prop

The `PopperProps` prop has been replaced by a `popper` component props on all responsive and desktop pickers:

```diff
 <DatePicker
-  PopperProps={{ onClick: handleClick }}
+  componentsProps={{ popper: { onClick: handleClick }}}
 />
```

### Replace the `TransitionComponent` prop

The `TransitionComponent` prop has been replaced by a `DesktopTransition` component slot on all responsive and desktop pickers:

```diff
 <DatePicker
-  TransitionComponent={Fade}
+  components={{ DesktopTransition: Fade }}
 />
```

### Replace the `TrapFocusProps` prop

The `TrapFocusProps` prop has been replaced by a `desktopTrapFocus` component props on all responsive and desktop pickers:

```diff
 <DatePicker
-  TrapFocusProps={{ isEnabled: () => false }}
+  componentsProps={{ desktopTrapFocus: { isEnabled: () => false }}}
 />
```

### Replace the `renderDay` prop

- The `renderDay` prop has been replaced by a `Day` component slot on all date, date time and date range pickers:

  ```diff
   <DatePicker
  -  renderDay={(_, dayProps) => <CustomDay {...dayProps} />}
  +  components={{ Day: CustomDay }}
   />
  ```

- The `selectedDays` prop have been removed from the `Day` component.
  If you need to access it, you can control the value and pass it to the slot using `componentsProps`:

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

### Rename the localization props

The props used to set the text displayed in the pickers have been replaced by keys inside the `localeText` prop:

| Removed prop                 | Property in the new `localText` prop                                              |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `endText`                    | `end`                                                                             |
| `getClockLabelText`          | `clockLabelText`                                                                  |
| `getHoursClockNumberText`    | `hoursClockNumberText`                                                            |
| `getMinutesClockNumberText`  | `minutesClockNumberText`                                                          |
| `getSecondsClockNumberText`  | `secondsClockNumberText`                                                          |
| `getViewSwitchingButtonText` | `calendarViewSwitchingButtonAriaLabel`                                            |
| `leftArrowButtonText`        | `openPreviousView` (or `previousMonth` when the button changes the visible month) |
| `rightArrowButtonText`       | `openNextView` (or `nextMonth` when the button changes the visible month)         |
| `startText`                  | `start`                                                                           |

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

### Rename the `locale` prop on `LocalizationProvider`

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

### Rename the view components

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

### Rename `date` prop to `value` on view components

The `date` prop has been renamed `value` on `MonthCalendar`, `YearCalendar`, `TimeClock`, and `DateCalendar` (components renamed in previous section):

```diff
-<MonthPicker date={dayjs()} onChange={handleMonthChange} />
+<MonthCalendar value={dayjs()} onChange={handleMonthChange} />

-<YearPicker date={dayjs()} onChange={handleYearChange} />
+<YearCalendar value={dayjs()} onChange={handleYearChange} />

-<ClockPicker date={dayjs()} onChange={handleTimeChange} />
+<TimeClock value={dayjs()} onChange={handleTimeChange} />

-<CalendarPicker date={dayjs()} onChange={handleDateChange} />
+<DateCalendar value={dayjs()} onChange={handleDateChange} />
```

### Rename remaining `private` components

Previously we had 4 component names with `Private` prefix in order to avoid breaking changes in v5.
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

### Replace `toolbar` props by slot

- The `ToolbarComponent` has been replaced by a `Toolbar` component slot. You can find more information about this pattern in the [MUI Base documentation](https://mui.com/base/getting-started/usage/#shared-props):

  ```diff
   // Same on all other pickers
   <DatePicker
  -  ToolbarComponent: MyToolbar,
  +  components={{ Toolbar: MyToolbar }}
   />
  ```

- The `toolbarPlaceholder` and `toolbarFormat` props have been moved to the `toolbar` component props slot:

  ```diff
   // Same on all other pickers
   <DatePicker
  -  toolbarPlaceholder="__"
  -  toolbarFormat="DD / MM / YYYY"
  +  componentsProps={{
  +    toolbar: {
  +      toolbarPlaceholder: "__",
  +      toolbarFormat: "DD / MM / YYYY",
  +    }
  +  }}
   />
  ```

- The `toolbarTitle` prop has been moved to the localization object:

  ```diff
   // Same on all other pickers
   <DatePicker
  -  toolbarTitle="Title"
  +  localeText={{ toolbarTitle: "Title" }}
   />
  ```

- The toolbar related translation keys have been renamed to better fit their usage:

  ```diff
   // Same on all other pickers
   <DatePicker
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

### Replace `tabs` props

- The `hideTabs` and `timeIcon` props have been moved to `tabs` component props. The `dateRangeIcon` prop has been renamed to `dateIcon` and moved to `tabs` component props.

  ```diff
   // Same on all other Date Time picker variations
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

### Remove the callback version of the `action` prop on the `actionBar` slot

The `action` prop of the `actionBar` slot is no longer supporting a callback.
Instead, you can pass a callback at the slot level

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
