---
title: Data Grid - Accessibility
components: DataGrid, XGrid
---

# Data Grid - Accessibility

<p class="description">The Data Grid has complete accessibility support. For instance, every cell is accessible using the keyboard.</p>

## Guidelines

The most commonly encountered conformance guidelines for accessibility are:

- [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) - Globally accepted standard
- [ADA](https://www.ada.gov/) - US Department of Justice
- [Section 508](https://www.section508.gov/) - US federal agencies

WCAG 2.0 has 3 levels of conformance; A, AA and AAA (in order of conformance).
As meeting WCAG 2.0 level AA guidelines also meets the ADA and Section 508 standards, it's likely the standard that most organizations will want to target.

The [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices/#grid) provides valuable insight on how to make the grid highly accessible.

## Density

You can change the density of the rows and the column header.

### Density selector

To enable the density selector you need to compose a toolbar containing the `GridDensitySelector` component, and apply it using the `Toolbar` property in the grid `components` prop.

The user can change the density of the data grid by using the density selector from the toolbar.

{{"demo": "pages/components/data-grid/accessibility/DensitySelectorGrid.js", "bg": "inline"}}

To hide the density selector add the `disableDensitySelector` prop to the data grid.

### Density prop

The vertical density of the data grid can be set using the `density` prop. The `density` prop applies the values determined by the `rowHeight` and `headerHeight` props, if supplied. The user can override this setting with the toolbar density selector, if provided.

{{"demo": "pages/components/data-grid/accessibility/DensitySelectorSmallGrid.js", "bg": "inline"}}

## Keyboard navigation

The grid responds to keyboard interactions from the user as well as emitting events when key presses happen on the grid cells.

### Navigation

Use the arrow keys to move the focus.

|                              Keys | Description                                   |
| --------------------------------: | :-------------------------------------------- |
|             <kbd>Arrow Left</kbd> | Navigate between cell elements                |
|           <kbd>Arrow Bottom</kbd> | Navigate between cell elements                |
|            <kbd>Arrow Right</kbd> | Navigate between cell elements                |
|               <kbd>Arrow Up</kbd> | Navigate between cell elements                |
|                   <kbd>Home</kbd> | Navigate to the first cell of the current row |
|                    <kbd>End</kbd> | Navigate to the last cell of the current row  |
| <kbd>CTRL</kbd> + <kbd>Home</kbd> | Navigate to the first cell of the first row   |
|  <kbd>CTRL</kbd> + <kbd>End</kbd> | Navigate to the last cell of the last row     |
|                  <kbd>Space</kbd> | Navigate to the next scrollable page          |
|                <kbd>Page Up</kbd> | Navigate to the next scrollable page          |
|              <kbd>Page Down</kbd> | Navigate to the previous scrollable page      |

### Selection

|                                                           Keys | Description                                       |
| -------------------------------------------------------------: | :------------------------------------------------ |
|                            <kbd>Shift</kbd> + <kbd>Space</kbd> | Select the current row                            |
| <kbd>Shift</kbd> + <kbd>Space</kbd> + <kbd>Arrow Up/Down</kbd> | Select the current row and the row above or below |
|                                 <kbd>CTRL</kbd> + <kbd>A</kbd> | Select all rows                                   |
|                                 <kbd>CTRL</kbd> + <kbd>C</kbd> | Copy the currently selected row                   |
|                                <kbd>CTRL</kbd> + Click on cell | Enable multi-selection                            |
|                                               <kbd>Enter</kbd> | Sort column when column header is focused         |
|                             <kbd>CTRL</kbd> + <kbd>Enter</kbd> | Open column menu when column header is focused    |

### Sorting

|                              Keys | Description          |
| --------------------------------: | :------------------- |
| <kbd>CTRL</kbd> + Click on header | Enable multi-sorting |

### Key assignment conventions

The above key assignments are for Windows and Linux.
On macOS, replace <kbd>CTRL</kbd> with <kbd>⌘ Command</kbd>.
