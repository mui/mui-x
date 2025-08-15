# Data Grid - CSS Variables Customization

<p class="description">Customize the Data Grid appearance using CSS variables - the recommended approach for theming.</p>

## Overview

The Data Grid provides a comprehensive set of CSS variables that allow you to customize its appearance without modifying component styles directly. This approach offers better performance, maintainability, and consistency across your application.

## Customization Approaches (in order of preference)

1. **CSS Variables** (recommended) - Override CSS custom properties
2. **Material UI Theme** - Configure theme tokens that map to CSS variables
3. **sx prop** - Direct component styling (least recommended)

## Using CSS Variables

The simplest way to customize the Data Grid is by overriding CSS variables:

```css
.MuiDataGrid-root {
  --DataGrid-t-color-background-base: #f5f5f5;
  --DataGrid-t-header-background-base: #e0e0e0;
  --DataGrid-t-color-foreground-base: #333333;
}
```

Or using the sx prop:

```tsx
<DataGrid
  sx={{
    '--DataGrid-t-color-background-base': '#f5f5f5',
    '--DataGrid-t-header-background-base': '#e0e0e0',
    '--DataGrid-t-color-foreground-base': '#333333',
  }}
/>
```

## Complete CSS Variables Reference

| Category                        | CSS Variable                                      | Description                      | Usage                                                                                                             |
| ------------------------------- | ------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Spacing**                     | `--DataGrid-t-spacing-unit`                       | Base spacing unit (default: 8px) | Used for all spacing calculations throughout the grid. Multiply by factors (1, 2, 3, etc.) for consistent spacing |
| **Colors - Borders**            | `--DataGrid-t-color-border-base`                  | Main border color                | Cell borders, row dividers, column separators, header borders                                                     |
| **Colors - Foreground (Text)**  | `--DataGrid-t-color-foreground-base`              | Primary text color               | Cell content, column headers, footer text                                                                         |
|                                 | `--DataGrid-t-color-foreground-muted`             | Secondary text color             | Placeholder text, helper text, secondary labels, empty state messages                                             |
|                                 | `--DataGrid-t-color-foreground-accent`            | Accent text color                | Links, emphasized text, action buttons                                                                            |
|                                 | `--DataGrid-t-color-foreground-disabled`          | Disabled text color              | Disabled cells, inactive buttons, non-editable fields                                                             |
|                                 | `--DataGrid-t-color-foreground-error`             | Error text color                 | Validation errors, error messages, invalid input indicators                                                       |
| **Colors - Background**         | `--DataGrid-t-color-background-base`              | Main background color            | Grid container, cells, rows, default background                                                                   |
|                                 | `--DataGrid-t-color-background-overlay`           | Overlay background               | Dropdown menus, popovers, tooltips, floating panels                                                               |
|                                 | `--DataGrid-t-color-background-backdrop`          | Backdrop background              | Modal overlays, loading screens, disabled areas                                                                   |
| **Colors - Interactive States** | `--DataGrid-t-color-interactive-hover`            | Hover color                      | Row hover background, cell hover, button hover states                                                             |
|                                 | `--DataGrid-t-color-interactive-hover-opacity`    | Hover opacity                    | Transparency level for hover overlays                                                                             |
|                                 | `--DataGrid-t-color-interactive-focus`            | Focus color                      | Focus rings, focus outlines, keyboard navigation indicators                                                       |
|                                 | `--DataGrid-t-color-interactive-focus-opacity`    | Focus opacity                    | Transparency level for focus indicators                                                                           |
|                                 | `--DataGrid-t-color-interactive-disabled`         | Disabled color                   | Disabled row backgrounds, inactive areas                                                                          |
|                                 | `--DataGrid-t-color-interactive-disabled-opacity` | Disabled opacity                 | Transparency level for disabled overlays                                                                          |
|                                 | `--DataGrid-t-color-interactive-selected`         | Selection color                  | Selected rows, selected cells, checkbox selections                                                                |
|                                 | `--DataGrid-t-color-interactive-selected-opacity` | Selection opacity                | Transparency level for selection highlights                                                                       |
| **Headers**                     | `--DataGrid-t-header-background-base`             | Header background                | Column header row background, sticky header background                                                            |
| **Cells**                       | `--DataGrid-t-cell-background-pinned`             | Pinned cell background           | Background for pinned/frozen columns and rows                                                                     |
| **Border Radius**               | `--DataGrid-t-radius-base`                        | Border radius                    | Container corners, button corners, input fields, chips                                                            |
| **Typography - Fonts**          | `--DataGrid-t-typography-font-body`               | Body font                        | Cell content, standard text                                                                                       |
|                                 | `--DataGrid-t-typography-font-small`              | Small font                       | Footnotes, captions, helper text, pagination labels                                                               |
|                                 | `--DataGrid-t-typography-font-large`              | Large font                       | Headers, titles, emphasized content                                                                               |
|                                 | `--DataGrid-t-typography-font-family-base`        | Font family                      | All text elements in the grid                                                                                     |
| **Typography - Font Weights**   | `--DataGrid-t-typography-font-weight-light`       | Light weight                     | Subtle text, secondary information                                                                                |
|                                 | `--DataGrid-t-typography-font-weight-regular`     | Regular weight                   | Body text, cell content                                                                                           |
|                                 | `--DataGrid-t-typography-font-weight-medium`      | Medium weight                    | Column headers, emphasized text                                                                                   |
|                                 | `--DataGrid-t-typography-font-weight-bold`        | Bold weight                      | Important headers, selected items, strong emphasis                                                                |
| **Transitions**                 | `--DataGrid-t-transition-easing-ease-in`          | Ease-in curve                    | Entry animations                                                                                                  |
|                                 | `--DataGrid-t-transition-easing-ease-out`         | Ease-out curve                   | Exit animations                                                                                                   |
|                                 | `--DataGrid-t-transition-easing-ease-in-out`      | Ease-in-out curve                | State transitions, hover effects                                                                                  |
|                                 | `--DataGrid-t-transition-duration-short`          | Short duration                   | Quick interactions (hover, focus)                                                                                 |
|                                 | `--DataGrid-t-transition-duration-base`           | Base duration                    | Standard transitions                                                                                              |
|                                 | `--DataGrid-t-transition-duration-long`           | Long duration                    | Complex animations, panel slides                                                                                  |
| **Shadows**                     | `--DataGrid-t-shadow-base`                        | Base shadow                      | Elevated elements, cards, floating buttons                                                                        |
|                                 | `--DataGrid-t-shadow-overlay`                     | Overlay shadow                   | Dropdown menus, popovers, modal dialogs                                                                           |
| **Z-Index**                     | `--DataGrid-t-z-index-panel`                      | Panel z-index                    | Filter panel, column panel, floating panels                                                                       |
|                                 | `--DataGrid-t-z-index-menu`                       | Menu z-index                     | Context menus, dropdown menus, column menu                                                                        |

## Common Customization Examples

### Dark Mode Theme

```css
.MuiDataGrid-root {
  --DataGrid-t-color-background-base: #1e1e1e;
  --DataGrid-t-header-background-base: #2d2d2d;
  --DataGrid-t-cell-background-pinned: #262626;
  --DataGrid-t-color-foreground-base: #ffffff;
  --DataGrid-t-color-foreground-muted: #b0b0b0;
  --DataGrid-t-color-border-base: rgba(255, 255, 255, 0.12);
  --DataGrid-t-color-interactive-hover: rgba(255, 255, 255, 0.08);
  --DataGrid-t-color-interactive-selected: rgba(144, 202, 249, 0.16);
}
```

### High Contrast Theme

```css
.MuiDataGrid-root {
  --DataGrid-t-color-background-base: #ffffff;
  --DataGrid-t-color-foreground-base: #000000;
  --DataGrid-t-color-border-base: #000000;
  --DataGrid-t-color-interactive-hover: rgba(0, 0, 0, 0.1);
  --DataGrid-t-color-interactive-focus: #0066cc;
  --DataGrid-t-typography-font-weight-regular: 500;
  --DataGrid-t-typography-font-weight-bold: 900;
}
```

### Compact Density

```css
.MuiDataGrid-root {
  --DataGrid-t-spacing-unit: 4px;
  --DataGrid-t-typography-font-small: 0.75rem/1.5 Roboto;
  --DataGrid-t-typography-font-body: 0.8125rem/1.43 Roboto;
}
```

### Custom Brand Colors

```css
.MuiDataGrid-root {
  --DataGrid-t-header-background-base: #6200ea;
  --DataGrid-t-color-foreground-base: #6200ea;
  --DataGrid-t-color-interactive-selected: #6200ea;
  --DataGrid-t-color-interactive-focus: #6200ea;
  --DataGrid-t-color-foreground-accent: #03dac6;
  --DataGrid-t-radius-base: 12px;
}
```

## Performance Benefits

Using CSS variables provides several advantages:

1. **Runtime Updates** - Change themes without re-rendering React components
2. **CSS Cascade** - Leverage CSS inheritance and specificity
3. **Browser Optimization** - CSS variables are optimized by the browser
4. **Reduced Bundle Size** - No need for JavaScript theme objects in many cases

## Browser Support

CSS variables are supported in all modern browsers. For legacy browser support, consider using a CSS variables polyfill or fallback to Material UI theme configuration.

## Troubleshooting

### Variables Not Applied

Ensure your CSS has sufficient specificity:

```css
/* May not work due to low specificity */
:root {
  --DataGrid-t-color-background-base: #f5f5f5;
}

/* Better - targets Data Grid specifically */
.MuiDataGrid-root {
  --DataGrid-t-color-background-base: #f5f5f5;
}
```

### Finding Which Variable to Override

Use browser DevTools to inspect elements and see which CSS variables are being used:

1. Right-click on the element you want to customize
2. Select "Inspect"
3. Look for CSS variables starting with `--DataGrid-t-` in the computed styles
