---
title: Data Grid - Localization
components: DataGrid, XGrid
---

# Data Grid - Localization

<p class="description">The Date Grid will support users from different locale, with formating, RTL, and localized strings.</p>

The default locale of Material-UI is English (United States). If you want to use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
In the following example, the labels of the density selector are customized.

{{"demo": "pages/components/data-grid/localization/CustomLocaleTextGrid.js", "bg": "inline"}}

## Locale text

The default locale of Material-UI is English (United States).
You can find all the locales supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/locales) in the GitHub repository.

You can use the theme to configure the locale text:

```jsx
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { DataGrid, bgBG } from '@material-ui/data-grid';

const theme = createMuiTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG,
);

<ThemeProvider theme={theme}>
  <DataGrid />
</ThemeProvider>;
```

Note that `createMuiTheme` accepts any number of arguments.
If you are already using the translations of the core components, you can add `bgBG` as a new argument.
The same import works with `XGrid` as it's an extension of `DataGrid`.

### Supported locales

| Locale    | BCP 47 language tag | Import name |
| :-------- | :------------------ | :---------- |
| Bulgarian | bg-BG               | `bgBG`      |

The data grid will support dozens of locales with a simple import that includes all the translated messages.
You will be able to follow [this guide](/guides/localization/#locale-text) to use them.
