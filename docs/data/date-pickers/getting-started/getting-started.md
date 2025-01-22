---
productId: x-date-pickers
title: Date and Time Pickers - Quickstart
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
---

# Date and Time Pickers - Quickstart

<p class="description">Install the MUI X Date and Time Pickers package and set up your date library to start building.</p>

## Installation

Install the base package (which can either be the free Community version or the paid Pro version) along with a required third-party date library.
The Pickers currently support [Day.js](https://day.js.org/), [date-fns](https://date-fns.org/), [Luxon](https://moment.github.io/luxon/#/), and [Moment.js](https://momentjs.com/).

Choose your packages and manager through the toggles below, then run the commands as provided to install:

<!-- #default-branch-switch -->

{{"component": "modules/components/PickersInstallationInstructions.js"}}

:::success
Not sure which date library to choose?
If you're starting from scratch with no other date libraries in your app, we recommend Day.js because of its small bundle size.
:::

### Peer dependencies

#### Material UI

The Date and Time Pickers have a peer dependency on `@mui/material`.
If you're not already using it, install it with the following command:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
```

</codeblock>

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Rendering a Date Picker

Import a Date Picker component:

```js
import { DatePicker } from '@mui/x-date-pickers';
```

### Set up date library adapter

Adapters are provided for each of the supported date libraries, and all are exported by both the Community and Pro versions—for example,`AdapterDayjs`, which is used throughout this documentation for [Day.js](https://day.js.org/) integration:

```tsx
// Pro users: add `-pro` suffix to package name
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
```

### Set up Localization Provider

To integrate your chosen date library with the Date and Time Pickers, you must plug the corresponding adapter into a Localization Provider that wraps your Picker components.

The Localization Provider is exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

```tsx
// Pro users: add `-pro` suffix to package name
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
```

:::warning
For practical purposes, each demo in the documentation has its own Localization Provider wrapper.
**We _do not_ recommend reproducing this pattern as-is.**
For almost all use cases, you should wrap your entire app with a single Localization Provider to avoid repeating boilerplate code in multiple places.
:::

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::info
To use the Date and Time Pickers with a custom locale, see [Date and format localization](/x/react-date-pickers/adapters-locale/).
:::

### Render the component

With the components, adapters, and providers properly configured, you're now ready to render a Date Picker as shown below:

{{"demo": "FirstComponent.js"}}

## TypeScript

### Theme augmentation

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// Pro users: add `-pro` suffix to package name
import type {} from '@mui/x-date-pickers/themeAugmentation';

const theme = createTheme({
  components: {
    MuiDatePicker: {
      defaultProps: {
        displayWeekNumber: true,
      },
    },
    MuiDateRangeCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f0f0f0',
        },
      },
    },
  },
});
```

### Date and time types

The Date and Time Pickers components are compatible with several date libraries
that use different formats to represent their dates
(`Date` object for `date-fns`, `daysjs.Dayjs` object for `days-js`, etc.).
To correctly type all the props that are date-related, the adapters override a global type named `PickerValidDate`
to allow the usage of their own date format.
This allows TypeScript to throw an error if you try to pass `value={new Date()}` to a component using `AdapterDayjs` for instance.

If you are not sure your adapter is set up correctly to infer the type of date-related props, you can import the `PickerValidDate` type and check its current value.

If its equal to the format used by your date library, then you don't have to do anything:

<img src="/static/x/date-pickers/picker-valid-date-configured.png" alt="PickerValidDate correctly configured" />

If it's equal to `any`, you can fix it by manually importing the adapter in some file of your project as show below:

<img src="/static/x/date-pickers/picker-valid-date-not-configured.png" alt="PickerValidDate not correctly configured" />

```ts
// Replace `AdapterDayjs` with the adapter you are using.
import type {} from '@mui/x-date-pickers/AdapterDayjs';
```

:::info
Before version 7.19.0, TypeScript was throwing an error such as `DesktopDatePickerProps<Date> error Type 'Date' does not satisfy the constraint 'never'`
when you were not importing the adapter in the same TypeScript project as the rest of your codebase.

The fix described above should also solve the problem.
:::
