---
product: date-pickers
title: Date and Time Picker React components
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
---

# Date / Time Pickers

<p class="description">Date pickers and Time pickers allow selecting a single value from a pre-determined set.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

- On mobile, pickers are best suited for display in a confirmation dialog.
- For inline display, such as on a form, consider using compact controls such as segmented dropdown buttons.

## React components

{{"demo": "MaterialUIPickers.js"}}

## Installation

You need to install two different types of packages to make the pickers work:

1. **The component** (`@mui/x-date-pickers` or `@mui/x-date-pickers-pro`) manages the rendering.
2. **The date library** ([Day.js](https://day.js.org/), [date-fns](https://date-fns.org/), ...) manages the date manipulation.

{{"component": "modules/components/PickersInstallationInstructions.js"}}

### Why do you need a date library?

Like most picker components available, the MUI Date and Time Pickers require a third-party library to format, parse, and mutate dates.

MUI's components let you choose which library you prefer for this purpose.
This gives you the flexibility to implement any date library you may already be using in your application, without adding an extra one to your bundle.

To achieve this, both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` export a set of **adapters** that expose the date manipulation libraries under a unified API.

### Choosing a date library

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

## Code setup

After installation, you have to pass your chosen date library's adapter to `LocalizationProvider`.
The supported adapters—as well as `LocalizationProvider`—are exported from both the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages.

All the pickers rendered inside this provider will have access to the adapter through a React context.
For this reason, we recommend that you wrap your entire application with a `LocalizationProvider` so you can use the Date and Time Pickers everywhere.

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
Browser support for native input controls is somewhat limited, according to [Can I use...](https://caniuse.com/#feat=input-datetime).
:::

Native date (`type="date"`), time (`type="time"`) and date&time (`type="datetime-local"`) pickers.

{{"demo": "NativePickers.js"}}

## Testing caveats

:::info
Some test environments (i.e. `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
:::

Be aware that running tests in headless browsers might not pass the default mediaQuery (`pointer: fine`).
In such case you can [force pointer precision](https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311) via browser flags or preferences.
