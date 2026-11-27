# Density

<p class="description">Make MUI X components follow the density scale of your Material UI theme.</p>

:::warning
This API is at an unstable stage and is subject to change in the future.
:::

Material UI v9.6 adds a theme enhancer that sizes its components from one [density scale](https://mui.com/material-ui/experimental-api/enhance-density/).
Each MUI X package has a matching enhancer.
With both applied, the Data Grid, Date and Time Pickers, Tree View, and Charts use the same spacing steps, control heights, and icon size as the Material UI components around them.

Select a density and a component to compare how the scale resizes it:

{{"demo": "DensityDemo.js", "bg": "inline"}}

## Apply density

Apply the Material UI enhancer first, then the enhancer of each MUI X product you use:

```js
import {
  createTheme,
  unstable_enhanceDensity as enhanceMaterialDensity,
} from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceDataGridDensity } from '@mui/x-data-grid-premium/density';
import { unstable_enhanceDensity as enhancePickersDensity } from '@mui/x-date-pickers-pro/density';

const baseTheme = createTheme({ cssVariables: true });
const theme = enhancePickersDensity(
  enhanceDataGridDensity(enhanceMaterialDensity(baseTheme)),
);
```

The MUI X enhancers read the scale that the Material UI enhancer adds to the theme.
They need `@mui/material` v9.6.0 or later, and they throw an error when the theme has no scale.

Apply one enhancer per product, from the package of your plan.
The Premium enhancer includes the Pro one, and the Pro enhancer includes the community one.

| Product               | Enhancer entry points                                                                          |
| :-------------------- | :--------------------------------------------------------------------------------------------- |
| Data Grid             | `@mui/x-data-grid/density`, `@mui/x-data-grid-pro/density`, `@mui/x-data-grid-premium/density` |
| Date and Time Pickers | `@mui/x-date-pickers/density`, `@mui/x-date-pickers-pro/density`                               |
| Tree View             | `@mui/x-tree-view/density`, `@mui/x-tree-view-pro/density`                                     |
| Charts                | `@mui/x-charts/density`, `@mui/x-charts-pro/density`, `@mui/x-charts-premium/density`          |

:::info
Density is opt-in.
A theme that skips the enhancers renders exactly as it did before.
:::

## Change the scale

MUI X components follow the scale you pass to the Material UI enhancer, with no extra configuration.
To make the whole app denser or roomier, change the scale there, as described in [Customizing the scale](https://mui.com/material-ui/experimental-api/enhance-density/#customizing-the-scale) and [Density recipes](https://mui.com/material-ui/experimental-api/enhance-density/#density-recipes).

## What follows the scale

The enhancers change spacing and control sizes only.
Colors, typography, and behavior stay the same.

- Data Grid: cell, header, and footer insets, the toolbar, panels, menus, popups, and edit cells, the row and column header heights, and the checkbox column width.
  On the Pro and Premium plans, also the header filters, row grouping and tree data indentation, and the pivot, charts, computed columns, and AI assistant panels.
- Date and Time Pickers: day, month, and year cells, the calendar header, clocks, toolbars, the action bar, and the picker fields, which match a Text Field of the same variant and size.
- Tree View: the item height, indentation, and icon and checkbox sizes.
- Charts: legends, tooltips, the toolbar, and axis value labels.

The Data Grid row height, column header height, and checkbox column width come from theme default props (`rowHeight`, `columnHeaderHeight`, `checkboxColDef`), so you can override them in the theme too.

## Data Grid density prop

The Data Grid `density` prop still works with an enhanced theme.
Its factor multiplies the row and header heights that the theme sets.
The table compares the heights without the enhancer and with the enhancer at its default scale:

| `density` value      | Without the enhancer: row / column header | With the enhancer: row / column header |
| :------------------- | :---------------------------------------- | :------------------------------------- |
| `compact`            | 36px / 39px                               | 28px / 28px                            |
| `standard` (default) | 52px / 56px                               | 40px / 40px                            |
| `comfortable`        | 67px / 72px                               | 52px / 52px                            |

Use the theme scale to size the whole app, and the `density` prop for a choice that belongs to one grid, such as a compact grid in a dense dashboard.
The [Data Grid accessibility](/x/react-data-grid/accessibility/#density) page describes the prop itself.

## Customize an enhanced theme

Your customizations win over the enhancers:

- Style overrides that your theme sets for a component apply after the ones the enhancers add.
- Default props that your theme sets replace the enhancer defaults.
- Props that you pass to a component replace both.

Put your customizations in the theme you pass to the enhancers, so each enhancer sees them and keeps them last.

### Icon size

MUI X components pass `fontSize="small"` to most of their icons.
With the enhancers, these render at the Material UI small icon size, which is 12px with the default scale.
To render them at the regular icon size, scope an override to the MUI X component:

```js
const largerIcons = {
  '& .MuiSvgIcon-fontSizeSmall': { fontSize: 'var(--mui-iconSize)' },
};

const baseTheme = createTheme({
  cssVariables: true,
  components: {
    MuiDataGrid: {
      styleOverrides: { root: largerIcons, menu: largerIcons, panel: largerIcons },
    },
  },
});
const theme = enhanceDataGridDensity(enhanceMaterialDensity(baseTheme));
```

## Limitations

These parts keep their default size with an enhanced theme:

- The chart drawing: the plot, axes, marks, and slices.
  Only the parts around it follow the scale.
  The axis size, the gap between ticks and labels, and the line mark size are not theme options, so scaling the rest of the drawing would clip labels or mismatch charts on the same page.
- Sizes that a component sets as inline styles: the AI assistant pending spinner, the tree data indentation, the chart type icons in the charts panel, and the Tree View loading checkbox placeholder.
- The Data Grid row reorder column, which stays 50px wide.
