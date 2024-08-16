---
productId: x-date-pickers
---

# Migration from the lab

<p class="description">Material UI Date and Time Pickers are now available on MUI X!</p>

## Introduction

This is a reference for migrating your site's pickers from `@mui/lab` to `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`.
This migration is about the npm packages used, it **does not** affect the behavior of the components in your application.
You can find why we are moving in this direction in the [announcement blog post](/blog/lab-date-pickers-to-mui-x/).

## License

Most of our components remains MIT and are accessible for free in `@mui/x-date-pickers`.

The range-picker components: `DateRangePicker`, `DateRangePickerDay`, `DesktopDateRangePicker`, `MobileDateRangePicker` and `StaticDateRangePicker`
were marked as "intended for MUI X Pro" in our documentation and are now part of MUI X Pro.

If you are using one of these components, you will have to take a Pro license in order to migrate to `@mui/x-date-pickers-pro` (see the [Pricing](https://mui.com/pricing/) page for more information).

:::info
If you already have a license for `@mui/x-data-grid-pro`, you can use the same one for `@mui/x-date-pickers-pro` with no additional fee!
:::

## Migration steps

### 1. Install MUI X packages

#### Community plan

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/x-date-pickers
```

```bash pnpm
pnpm add @mui/x-date-pickers
```

```bash yarn
yarn add @mui/x-date-pickers
```

</codeblock>

#### Pro plan

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/x-date-pickers-pro @mui/x-license-pro
```

```bash pnpm
pnpm add @mui/x-date-pickers-pro @mui/x-license-pro
```

```bash yarn
yarn add @mui/x-date-pickers-pro @mui/x-license-pro
```

</codeblock>

When you purchase a commercial license, you'll receive a license key by email.
You must set the license key before rendering the first component.

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

Learn more on [the Licensing page](/x/introduction/licensing/#license-key).

### 2. Run the code mod

We have prepared a codemod to help you migrate your codebase.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

```bash
npx @mui/codemod v5.0.0/date-pickers-moved-to-x <path>
```

Which will transform the imports like this:

```diff
-import DatePicker from '@mui/lab/DatePicker';
+import { DatePicker } from '@mui/x-date-pickers/DatePicker';

-import DateRangePicker from '@mui/lab/DateRangePicker';
+import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

-import { DatePicker, DateRangePicker } from '@mui/lab';
+import { DatePicker } from '@mui/x-date-pickers'; // DatePicker is also available in `@mui/x-date-pickers-pro`
+import { DateRangePicker } from '@mui/x-date-pickers-pro';
```

Components of the Community plan such as `<DatePicker />` can be imported from both `@mui/x-date-pickers-pro` and `@mui/x-date-pickers`.
[Date adapters](/x/react-date-pickers/getting-started/#installation) such as `AdapterDayjs` can only be imported from `@mui/x-date-pickers/[adapterName]`.

### 3. Handle breaking changes introduced in alpha

During the migration from `@mui/lab` to MUI X, we've focused on enhancing stability and developer experience.
Some APIs were improved to be more coherent and customizable.

Please check the complete list of the API changes before migrating from `@mui/x-date-pickers` 5.0.0-alpha.0 to the last v5.0.0.

#### Props renaming

The `disableCloseOnSelect` prop has been replaced by a new `closeOnSelect` prop which has the opposite behavior.
The default behavior remains the same (close after the last step on desktop but not on mobile).

```diff
 // If you don't want to close after the last step
-<DatePicker disableCloseOnSelect={false} />
+<DatePicker closeOnSelect />

 // If you want to close after the last step
-<DatePicker disableCloseOnSelect />
+<DatePicker closeOnSelect={false} />
```

The props of `MonthPicker`, `YearPicker` and `DayPicker` have been reworked to make them more consistent for a standalone usage.

- **MonthPicker**: The prop `onMonthChange` has been removed, you can use `onChange` instead since every change is a month change.
- **YearPicker**: The prop `onYearChange` has been removed, you can use `onChange` instead since every change is a year change.
- **DayPicker**: The prop `isDateDisabled` has been removed, you can now use the same validation props as for the other components (`maxDate`, `minDate`, `shouldDisableDate`, `disableFuture` and `disablePast`).

#### Translation

Props for translation have been either deprecated or removed in favor of a [global localization](/x/react-date-pickers/localization/) similar to the one used by the data grid.
We already have ten locales provided by the community. (Thank you!)

#### Use slot for `ActionBar`

The props related to the action bar buttons (`clearable`, `showTodayButton`, `cancelText`, `okText`) have been removed.

To decide which button must be displayed and in which order, you can now use the `actions` prop of the `actionBar` component slot props.

```jsx
<DatePicker
  componentsProps={{
    // The actions will be the same between desktop and mobile
    actionBar: {
      actions: ['clear'],
    },
    // The actions will be different between desktop and mobile
    actionBar: ({ wrapperVariant }) => ({
      actions: wrapperVariant === 'desktop' ? [] : ['clear'],
    }),
  }}
/>
```

The build-in `ActionBar` component supports 4 different actions: `'clear'`, `'cancel'`, `'accept'`, and `'today'`.
By default, the pickers will render the cancel and accept button on mobile and no action on desktop.

If you need other actions, you can provide your own component to the `ActionBar` component slot

```jsx
<DatePicker components={{ ActionBar: CustomActionBar }} />
```
