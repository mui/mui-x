---
product: date-pickers
title: Date and Time Picker React components
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
---

# Date and Time Pickers

<p class="description">The Date and Time pickers let the user select date and time values.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Installation

To make the Date and Time Pickers, work, you need to install the following packages:

1. **The component library** (`@mui/x-date-pickers` or `@mui/x-date-pickers-pro`) to render the component.
2. **The date library** ([Day.js](https://day.js.org/), [date-fns](https://date-fns.org/), ...) to manipulate the date.

{{"component": "modules/components/PickersInstallationInstructions.js"}}

### Community or Pro Plan ?

The Date and Time Pickers comes in two packages:

- `@mui/x-date-pickers`, which is open-source contains all the components to edit a date and/or a time.
- `@mui/x-date-pickers-pro`, which is [commercially licensed](/x/introduction/licensing/#pro-plan) contains additional components to edit a range of date and/or time.

### Date library

Like most picker components available, the MUI Date and Time Pickers require a third-party library to format, parse, and mutate dates.

MUI's components let you choose which library you prefer for this purpose.
This gives you the flexibility to implement any date library you may already be using in your application, without adding an extra one to your bundle.

To achieve this, both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` export a set of **adapters** that expose the date manipulation libraries under a unified API.

#### Available libraries

The Date and Time Pickers currently support the following date libraries:

- [Day.js](https://day.js.org/)
- [date-fns](https://date-fns.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

:::info
If you are using a non-Gregorian calendar (such as Jalali or Hijri), please refer to the [Support for other calendar systems](/x/react-date-pickers/calendar-systems/) page.
:::

#### Recommended library

If you are already using one of the libraries listed above in your application, then you can keep using it with the Date and Time Pickers as well.
This will avoid bundling two libraries.

If you are starting a new project without any date manipulation outside of `@mui/x-date-pickers`, then we recommend using `dayjs` because it will have the smallest impact on your application's bundle size.

Here is the weight added to your gzipped bundle size by each of these libraries when used inside the Date and Time Pickers:

| **Library**       | **Gzipped size** |
| ----------------- | ---------------- |
| `dayjs@1.11.5`    | 6.77kb           |
| `date-fns@2.29.3` | 19.39kb          |
| `luxon@3.0.4`     | 23.26kb          |
| `moment@2.29.4`   | 20.78kb          |

:::info
The results above were obtained in October 2022 with the latest version of each library.
The bundling strategy was taken care of by a Create React App, and no locale was loaded for any of the libraries.

The results may vary in your application depending on the version of each library, the locale, and the bundling strategy used.
:::

### Other peer dependencies

The Date and Time Pickers package has a peer dependency on `@mui/material`.
If you are not already using it in your project, you can install it with:

```sh
// with npm
npm install @mui/material @emotion/react @emotion/styled

// with yarn
yarn add @mui/material @emotion/react @emotion/styled
```

<!-- #react-peer-version -->

Please note that [react](https://www.npmjs.com/package/react) >= 17.0.2 and [react-dom](https://www.npmjs.com/package/react-dom) >= 17.0.2 are peer dependencies.

MUI is using [emotion](https://emotion.sh/docs/introduction) as a styling engine by default. If you want to use [`styled-components`](https://styled-components.com/) instead, run:

```sh
// with npm
npm install @mui/material @mui/styled-engine-sc styled-components

// with yarn
yarn add @mui/material @mui/styled-engine-sc styled-components
```

## Code setup

Before trying to render any component, you have to make sure that there is a `LocalizationProvider` upper in the React tree.
This component receives your chosen date library's adapter and make it accessible to all the Date and Time Pickers component with a React context.

The most simple way to use `LocalizationProvider` is to wrap your entire application it.
You will then be able to use the Date and Time Pickers everywhere.

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::success

- All the adapters are exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

  ```tsx
  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import { AdapterDateFns } from '@mui/x-date-pickers-pro/`AdapterDayjs`';
  ```

- `LocalizationProvider` is exported by both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`:

  ```tsx
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { LocalizationProvider } from '@mui/x-date-pickers';
  import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
  import { LocalizationProvider } from '@mui/x-date-pickers-pro/';
  ```

:::

:::info
If you need to use the Date and Time Pickers with a custom locale, have a look at the [Localized dates](/x/react-date-pickers/adapters-locale/) page.
:::

## Commonly used components

Most applications only need a few of the components exposed by the Date and Time packages:

{{"demo": "CommonlyUsedComponents.js"}}

:::success
All the components exported by `@mui/x-date-pickers` are also exported by `@mui/x-date-pickers-pro` but not with nested imports.

For example, to use the `DatePicker` component, the three following imports are valid:

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers-pro';
```

:::

## Basic use cases

### Controlled value

All the components can be controlled using the `value` / `onChange` props:

{{"demo": "ControlledComponent.js"}}

### Custom format

All the components with an HTML input can receive a custom format using the [`format` prop](/x/react-date-pickers/adapters-locale/#custom-field-format):

{{"demo": "CustomFormat.js"}}

### Form props

All the components component can be disabled or read-only:

{{"demo": "FormProps.js"}}

### Validation

If you need to add validation to your component, you can check the [Validation page](/x/react-date-pickers/validation/):

{{"demo": "ValidatedComponent.js"}}

## Other components

### Keyboard or mouse editing

The first thing you want to decide, is how the user should be able to select their value:

- For keyboard and mouse editing, use the _Picker_ components:

{{"demo": "BasicDatePicker.js", "hideToolbar": true, "bg": "inline"}}

- For keyboard-only editing, use the _Field_ components:

{{"demo": "BasicDateField.js", "hideToolbar": true, "bg": "inline"}}

- For mouse-only editing, use the _Calendar / Clock_ components:

{{"demo": "BasicDateCalendar.js", "hideToolbar": true, "bg": "inline"}}

:::success
Each _Picker_ is the combination of one _Field_ and one or several _Calendar / Clock_ components.
For example, the `DatePicker` is the combination of the `DateField` and the `DateCalendar`.

The _Calendar / Clock_ components are rendered inside a _Popover_ on desktop and inside a _Modal_ on mobile.
:::

### Date or time editing ?

The Date and Time Pickers are divided into six families of components.
The demo below shows each one of them using their field component:

{{"demo": "ComponentFamilies.js"}}

### Responsiveness

Each _Picker_ is available in three responsive variants:

- The desktop component (e.g. `DesktopNextDatePicker`) which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The mobile component (e.g. `MobileNextDatePicker`) which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The responsive component (e.g. `NextDatePicker`) which renders the desktop component or the mobile one depending on the device it runs on.

{{"demo": "ResponsivePickers.js"}}

### Find your component

Use the form below to find component you need:

{{"demo": "ComponentExplorerNoSnap.js", "hideToolbar": true}}

## TypeScript

In order to benefit from the [CSS overrides](/material-ui/customization/theme-components/#global-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
// When using TypeScript 4.x and above
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-date-pickers-pro/themeAugmentation';
// When using TypeScript 3.x and below
import '@mui/x-date-pickers/themeAugmentation';
import '@mui/x-date-pickers-pro/themeAugmentation';

const theme = createTheme({
  components: {
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```

:::info
You don't have to import the theme augmentation from both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` when using `@mui/x-date-pickers-pro`.
Importing it from `@mui/x-date-pickers-pro` is enough.
:::

## Testing caveats

### Responsive components

:::info
Some test environments (i.e. `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
:::

Be aware that running tests in headless browsers might not pass the default mediaQuery (`pointer: fine`).
In such case you can [force pointer precision](https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311) via browser flags or preferences.

### Field components

:::info
To support RTL and some keyboard interactions, field components add some Unicode character that are invisible, but appears in the input value.
:::

To add tests about a field value without having to care about those characters, you can remove the specific character before testing the equality.
Here is an example about how to do it.

```js
// Helper removing specific characters
const cleanText = (string) =>
  string.replace(/\u200e|\u2066|\u2067|\u2068|\u2069/g, '');

// Example of a test using the helper
expect(cleanText(input.value)).to.equal('10-11-2021');
```
