---
title: Data Grid - Accessibility
---

# Data Grid - Accessibility

<p class="description">The Data Grid has complete accessibility support. For instance, every cell is accessible using the keyboard.</p>

## Guidelines

The most commonly encountered conformance guidelines for accessibility are:

- [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) - Globally accepted standard
- [ADA](https://www.ada.gov/) - US Department of Justice
- [Section 508](https://www.section508.gov/) - US federal agencies

WCAG 2.0 has three levels of conformance; A, AA, and AAA (in order of conformance).
As meeting WCAG 2.0 level AA guidelines also meets the ADA and Section 508 standards, it's likely the standard that most organizations will want to target.

The [WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices/#grid) provides valuable insight on how to make the grid highly accessible.

## Density

You can change the density of the rows and the column header.

### Density selector

To enable the density selector, you need to compose a toolbar containing the `GridToolbarDensitySelector` component and apply it using the `Toolbar` property in the grid `components` prop.

The user can change the density of the data grid by using the density selector from the toolbar.

{{"demo": "pages/components/data-grid/accessibility/DensitySelectorGrid.js", "bg": "inline"}}

To hide the density selector add the `disableDensitySelector` prop to the data grid.

### Density prop

The vertical density of the data grid can be set using the `density` prop.
The `density` prop applies the values determined by the `rowHeight` and `headerHeight` props if supplied.
The user can override this setting with the toolbar density selector if provided.

{{"demo": "pages/components/data-grid/accessibility/DensitySelectorSmallGrid.js", "bg": "inline"}}

## Keyboard navigation

The grid responds to keyboard interactions from the user and emits events when key presses happen on the grid cells.

### Navigation

Use the arrow keys to move the focus.

|                                                               Keys | Description                                                 |
| -----------------------------------------------------------------: | :---------------------------------------------------------- |
|                                  <kbd class="key">Arrow Left</kbd> | Navigate between cell elements                              |
|                                <kbd class="key">Arrow Bottom</kbd> | Navigate between cell elements                              |
|                                 <kbd class="key">Arrow Right</kbd> | Navigate between cell elements                              |
|                                    <kbd class="key">Arrow Up</kbd> | Navigate between cell elements                              |
|                                        <kbd class="key">Home</kbd> | Navigate to the first cell of the current row               |
|                                         <kbd class="key">End</kbd> | Navigate to the last cell of the current row                |
| <kbd><kbd class="key">CTRL</kbd>+<kbd class="key">Home</kbd></kbd> | Navigate to the first cell of the first row                 |
|  <kbd><kbd class="key">CTRL</kbd>+<kbd class="key">End</kbd></kbd> | Navigate to the last cell of the last row                   |
|                                       <kbd class="key">Space</kbd> | Navigate to the next scrollable page                        |
|                                     <kbd class="key">Page Up</kbd> | Navigate to the next scrollable page                        |
|                                   <kbd class="key">Page Down</kbd> | Navigate to the previous scrollable page                    |
|                                       <kbd class="key">Space</kbd> | Toggle row children expansion when grouping cell is focused |

### Selection

|                                                                         Keys | Description                                                          |
| ---------------------------------------------------------------------------: | :------------------------------------------------------------------- |
|         <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Select the current row                                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Select the current row and the row above or below                    |
|                                  <kbd class="key">Shift</kbd>+ Click on cell | Select the range of rows between the first and the last clicked rows |
|              <kbd><kbd class="key">CTRL</kbd>+<kbd class="key">A</kbd></kbd> | Select all rows                                                      |
|              <kbd><kbd class="key">CTRL</kbd>+<kbd class="key">C</kbd></kbd> | Copy the currently selected row(s)                                   |
|               <kbd><kbd class="key">ALT</kbd>+<kbd class="key">C</kbd></kbd> | Copy the currently selected row(s) including headers                 |
|                                   <kbd class="key">CTRL</kbd>+ Click on cell | Enable multi-selection                                               |
|                         <kbd class="key">CTRL</kbd>+ Click on a selected row | Deselect the row                                                     |

### Sorting

|                                                                 Keys | Description                                        |
| -------------------------------------------------------------------: | :------------------------------------------------- |
|                         <kbd class="key">CTRL</kbd>+ Click on header | Enable multi-sorting                               |
|                        <kbd class="key">Shift</kbd>+ Click on header | Enable multi-sorting                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Enter</kbd></kbd> | Enable multi-sorting when column header is focused |
|                                         <kbd class="key">Enter</kbd> | Sort column when column header is focused          |
|  <kbd><kbd class="key">CTRL</kbd>+<kbd class="key">Enter</kbd></kbd> | Open column menu when column header is focused     |

### Key assignment conventions

The above key assignments are for Windows and Linux.
On macOS, replace <kbd class="key">CTRL</kbd> with <kbd class="key">⌘ Command</kbd>.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
