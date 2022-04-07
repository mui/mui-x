---
title: MUI X - Migration from the lab
---

# MUI X - Migration from the lab

<p class="description">MUI date and time pickers are now available on X!</p>

## Introduction

This is a reference for migrating your site's pickers from `@mui/lab` to `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`.
This migration only concerns packages and should do not affect the behavior of the components in your app.

We explored the reasons of this migration in a [blog post](https://mui.com/blog/lab-date-pickers-to-mui-x/)

## License

Most of our components remains MIT and are accessible for free in `@mui/x-date-pickers`.

The range-picker components: `DateRangePicker`, `DateRangePickerDay`, `DesktopDateRangePicker`, `MobileDateRangePicker` and `StaticDateRangePicker`
were marked as "intended for MUI X Pro" in our documentation and are now part of MUI X Pro.

If you are using one of these components, you will have to take a Pro license in order to migrate to `@mui/x-date-pickers-pro` (see the [Pricing](https://mui.com/pricing/) page for more information).

**Note**: If you already have a license for `@mui/x-data-grid-pro`, you can use the same one for `@mui/x-date-pickers-pro` with no additional fee!

## Migration steps

### 1. Install MUI X packages

#### Community Plan

```sh
// with npm
npm install @mui/x-date-pickers

// with yarn
yarn add @mui/x-date-pickers
```

#### Pro Plan

```sh
// with npm
npm install @mui/x-date-pickers-pro @mui/x-license-pro

// with yarn
yarn add @mui/x-date-pickers-pro @mui/x-license-pro
```

When you purchase a commercial license, you'll receive a license key by email.
You must set the license key before rendering the first component.

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);
```

More information [here](/x/advanced-components/#license-key-installation)

### 2. Run the code mod

We have prepared a codemod to help you migrate your codebase

```sh
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

Components of the Community Plan such as `<DatePicker />` can be imported from both `@mui/x-date-pickers-pro` and `@mui/x-date-pickers`.
Only [date adapters](/x/react-date-pickers/getting-started/#setup) such as `AdapterDayjs` can only be imported from `@mui/x-date-pickers/[adapterName]`.
