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

Install the Date and Time Pickers package that best suits your needs—Community or Pro—along with one of the supported third-party date libraries.
The Pickers currently support [Day.js](https://day.js.org/), [date-fns](https://date-fns.org/), [Luxon](https://moment.github.io/luxon/#/), and [Moment.js](https://momentjs.com/).

Choose your packages and manager through the toggles below, then run the commands as provided to install:

{{"component": "modules/components/PickersInstallationInstructions.js"}}

:::success
Not sure which date library to choose?
If you're starting from scratch with no other date libraries in your app, we recommend [Day.js](https://day.js.org/) because of its small bundle size.
:::

### Peer dependencies

#### Material UI

The Date and Time Pickers have a peer dependency on `@mui/material`.
If you're not already using it, install it now:

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

### Import the component

Import a Date Picker component and the Localization Provider:

```js
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
```

Next, import the adapter that corresponds to your chosen date library.
Adapters are provided for all supported libraries in both versions of the package.
The snippet below imports `AdapterDayjs`, which is used throughout this documentation for Day.js integration.

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
```

### Integrate provider and adapter

To integrate your chosen date library with the Date Pickers, wrap your app with the Localization Provider and pass the adapter to the Provider's `dateAdapter` prop as shown below:

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::info
To use the Date and Time Pickers with a custom locale, see [Date and format localization](/x/react-date-pickers/adapters-locale/).
:::

### Render the component

With the component, adapter, and provider properly configured, you're now ready to render a Date Picker as shown below:

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker />
    </LocalizationProvider>
  );
}
```

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

### Date value types

The Date and Time Pickers are compatible with several date libraries that each use different formats to represent their dates.
To correctly type all date-related props, the adapters override a global type named `PickerValidDate` to allow for the formatting of their corresponding libraries.
As a result, TypeScript will throw an error if you try to pass the wrong kind of value to the date library.

To determine whether your adapter is set up correctly, you can import the `PickerValidDate` type from `@mui/x-date-pickers/models` and check its current value.
If the type matches your chosen date library then it's correctly configured:

<img src="/static/x/date-pickers/picker-valid-date-configured.png" alt="PickerValidDate correctly configured" />

If the type is `any`, you can fix this by manually importing the adapter's types directly into your project as shown below:

```ts
// replace `AdapterDayjs` with the adapter you're using
import type {} from '@mui/x-date-pickers/AdapterDayjs';
```

:::info
Before version 7.19.0, TypeScript would throw the following error if you didn't import the adapter in the same TypeScript project as the rest of your codebase: `DesktopDatePickerProps<Date> error Type 'Date' does not satisfy the constraint 'never'`.
The solution described above should resolve this.
:::

## Using this documentation

### Localization Provider

For practical purposes, each demo in this documentation has its own Localization Provider wrapper.
**You should not reproduce this pattern as-is.**
For almost all use cases, you should wrap your entire app with a single Localization Provider to avoid repeating boilerplate code in multiple places.

### Demo Container and Demo Item

Throughout this documentation, the internal components `<DemoContainer />` and `<DemoItem />` are used in demos to display multiple components with a consistent layout.
**You should never use these components in your application.**
This helps avoid the repeated use of layout components such as `<Box />` or `<Stack />`, which would otherwise add irrelevant clutter to demos meant to illustrate specific features.
