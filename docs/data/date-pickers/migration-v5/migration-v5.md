# Migration from v5 to v6

<p class="description">This guide describes the changes needed to migrate from v5 to v6.</p>

## Start using the alpha release

In `package.json`, change the version of the data grid package to `next`.

```diff
-"@mui/x-date-pickers": "latest",
+"@mui/x-date-pickers": "next",
```

Using `next` ensures that it will always use the latest v6 alpha release, but you can also use a fixed version, like `6.0.0-alpha.0`.

## Breaking changes

Since v6 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v5 to v6.

### Update the format of the `value` prop

The `value` prop of the pickers now expects a parsed value.
Until now, it was possible to provide any format that your date management library was able to parse.
For instance, you could pass `value={new Date()}` when using `AdapterDayjs`.

This brought a lot of confusion so we decided to remove this behavior.
The format expected by the `value` prop is now the same as for any other prop holding a date.
Here is the syntax to initialize a date picker at the current date for each adapter:

```tsx
// Date-fns
<DatePicker value={new Date()} />

// Dayjs
import dayjs from 'dayjs';
<DatePicker value={dayjs()} />

// Moment
import moment from 'moment';
<DatePicker value={moment()} />

// Luxon
import { DateTime } from 'luxon';
<DatePicker value={DateTime.now()} />
```

### Rename the `LeftArrowButton` slot

The component slot `LeftArrowButton` has been renamed `PreviousIconButton` on all pickers:

```diff
<DatePicker
  components={{
-   LeftArrowButton: CustomButton,
+   PreviousIconButton: CustomButton,
  }}

  componentsProps={{
-   leftArrowButton: {},
+   previousIconButton: {},
  }}
/>
```

### Rename the `RightArrowButton` slot

The component slot `RightArrowButton` has been renamed `NextIconButton` on all pickers:

```diff
// Same on all pickers.
<DatePicker
  components={{
-   RightArrowButton: CustomButton,
+   NextIconButton: CustomButton,
  }}

  componentsProps={{
-   rightArrowButton: {},
+   nextIconButton: {},
  }}
/>
```

### Replace the `DialogProps` prop

The `DialogProps` prop has been replaced by a `dialog` component props slot on all responsive and mobile pickers:

```diff
// Same on all mobile and responsive pickers.
<DatePicker
-  DialogProps={{ backgroundColor: 'red' }}
+  componentsProps={{ dialog: { backgroundColor: 'red }}}
/>
```

### Replace the `PaperProps` prop

The `PaperProps` prop has been replaced by a `desktopPaper` component props slot on all responsive and desktop pickers:

```diff
// Same on all desktop and responsive pickers.
<DatePicker
-  PaperProps={{ backgroundColor: 'red' }}
+  componentsProps={{ desktopPaper: { backgroundColor: 'red }}}
/>
```

### Replace the `PopperProps` prop

The `PopperProps` prop has been replaced by a `popper` component  props slot on all responsive and desktop pickers:

```diff
// Same on all desktop and responsive pickers.
<DatePicker
-  PopperProps={{ onClick: handleClick }}
+  componentsProps={{ popper: { onClick: handleClick }}}
/>
```

### Replace the `TransitionComponent` prop

The `TransitionComponent` prop has been replaced by a `desktopTransition` component slot on all responsive and desktop pickers:

```diff
// Same on all desktop and responsive pickers.
<DatePicker
-  TransitionComponent={Fade}
+  components={{ desktopTransition: Fade }}
/>
```

### Replace the `TrapFocusProps` prop

The `TrapFocusProps` prop has been replaced by a `desktopTrapFocus` component props slot on all responsive and desktop pickers:

```diff
// Same on all desktop and responsive pickers.
<DatePicker
-  TrapFocusProps={{ isEnabled: () => false }}
+  componentsProps={{ desktopTrapFocus: { isEnabled: () => false }}}
/>
```

### Replace the `renderDay` prop

The `renderDay` prop has been replaced by a `Day` component slot on all date, date time and date range pickers:

```diff
// Same on all date, date time and date range pickers.
<DatePicker
-  renderDay={(_, dayProps) => <CustomDay {...dayProps} />}
+  components={{ Day: CustomDay }}
/>
```

### Rename the localization props

The props used to set the text displayed in the pickers have been replaced by keys inside the `localeText` prop:

| Removed prop                 | Property in the new `localText` prop                                              |
|------------------------------|-----------------------------------------------------------------------------------|
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

The `locale` prop of the `LocalizationProvider` component have been renamed `adapterLcoale`:

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

The view components allowing to pick a date or parts of a date without an input have been renamed to better fit their usage:

```diff
-<CalendarPicker {...props} />
+<DateCalendar  {...props} />
```

```diff
-<DayPicker {...props} />
+<DayCalendar  {...props} />
```

```diff
-<CalendarPickerSkeleton {...props} />
+<DayCalendarSkeleton  {...props} />
```

```diff
-<MonthPicker {...props} />
+<MonthCalendar  {...props} />
```

```diff
-<YearPicker {...props} />
+<YearCalendar  {...props} />
```

Component names in the theme have changed as well:

```diff
-MuiCalendarPicker: {
+MuiDateCalendar: {
```

```diff
-MuiDayPicker: {
+MuiDayCalendar: {
```

```diff
-MuiCalendarPickerSkeleton: {
+MuiDayCalendarSkeleton: {
```

```diff
-MuiMonthPicker: {
+MuiMonthCalendar: {
```

```diff
-MuiYearPicker: {
+MuiYearCalendar: {
```

### Rename `date` prop to `value` on view components

The `date` prop has been renamed `value` on  `MonthPicker`, `YearPicker`, `ClockPicker` and `CalendarPicker`:

```diff
- <MonthPicker date={dayjs()} onChange={handleMonthChange} />
+ <MonthPicker value={dayjs()} onChange={handleMonthChange} />

- <YearPicker date={dayjs()} onChange={handleYearChange} />
+ <YearPicker value={dayjs()} onChange={handleYearChange} />

- <ClockPicker date={dayjs()} onChange={handleTimeChange} />
+ <ClockPicker value={dayjs()} onChange={handleTimeChange} />

- <CalendarPicker date={dayjs()} onChange={handleDateChange} />
+ <CalendarPicker value={dayjs()} onChange={handleDateChange} />
```