---
title: Data Grid - Localization
components: DataGrid, XGrid
---

# Data Grid - Localization

<p class="description">The Data Grid allows to support users from different locales, with formatting, RTL, and localized strings.</p>

The default locale of Material-UI is English (United States). If you want to use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
In the following example, the labels of the density selector are customized.

{{"demo": "pages/components/data-grid/localization/CustomLocaleTextGrid.js", "bg": "inline"}}

## Locale text

The default locale of Material-UI is English (United States).

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
If you are already using the [translations of the core components](/guides/localization/#locale-text), you can add `bgBG` as a new argument.
The same import works with `XGrid` as it's an extension of `DataGrid`.

### Supported locales

| Locale                  | BCP 47 language tag | Import name |
| :---------------------- | :------------------ | :---------- |
| Bulgarian               | bg-BG               | `bgBG`      |
| English (United States) | en-US               | `enUS`      |
| French                  | fr-FR               | `frFR`      |
| German                  | de-DE               | `deDE`      |
| Greek                   | el-GR               | `elGR`      |
| Japanese                | ja-JP               | `jaJP`      |
| Polish                  | pl-PL               | `plPL`      |
| Portuguese (Brazil)     | pt-BR               | `ptBR`      |

You can [find the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.

Please do consider contributing new translations back to Material-UI by opening a pull request. However, Material-UI aims to support the 100 most popular locales. We might not accept contributions for locales that are not frequently used, for instance, `gl-ES` that has "only" 2.5 million native speakers.
See the [Docs](https://material-ui.com/components/data-grid/localization/) for more details.
