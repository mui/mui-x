---
product: date-pickers
title: Date Picker, Time Picker React components
components: DatePicker,DateTimePicker,TimePicker
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
packageName: '@mui/x-date-pickers'
---

# Date / Time Pickers

<p class="description">Date pickers and Time pickers allow selecting a single value from a pre-determined set.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

- On mobile, pickers are best suited for display in a confirmation dialog.
- For inline display, such as on a form, consider using compact controls such as segmented dropdown buttons.

## React components

{{"demo": "MaterialUIPickers.js"}}

## Installation

You need to install 2 different types of package to make the pickers work:

1. **The component** (`@mui/x-date-pickers` or `@mui/x-date-pickers-pro`) manages the rendering.
2. **The date-library** ([Day.js](https://day.js.org/), [date-fns](https://date-fns.org/), ...) manages the date manipulation.

First you have to install the date-library you want to use to manage dates, and the component package:

{{"component": "modules/components/PickersInstallationInstructions.js"}}

:::info
If you need help to choose and install your date-library, have a look at the [Choosing a date library](/x/react-date-pickers/adapters/#choosing-a-date-library) section.
:::

## Code setup

After the installation is completed, you have to pass the adapter of your date library to `LocalizationProvider`.
The supported adapters as well as `LocalizationProvider` are exported from both the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages.

All the pickers rendered inside this provider will have access to the adapter through a React context.
For that reason, we recommend you to wrap your entire application with a `LocalizationProvider` to be able to use the Date and Time Pickers everywhere.

{{"component": "modules/components/PickersRenderingInstructions.js"}}

:::info
If you need to use the Date and Time Pickers with a custom locale, have a look at the [Localized dates](/x/react-date-pickers/adapters-locale/) page.
:::

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

## Native pickers

:::warning
Native input controls support by browsers [isn't perfect](https://caniuse.com/#feat=input-datetime).
:::

Native date (`type="date"`), time (`type="time"`) and date&time (`type="datetime-local"`) pickers.

{{"demo": "NativePickers.js"}}

## Testing caveats

:::info
Some test environments (i.e. `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
:::

Be aware that running tests in headless browsers might not pass the default mediaQuery (`pointer: fine`).
In such case you can [force pointer precision](https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311) via browser flags or preferences.
