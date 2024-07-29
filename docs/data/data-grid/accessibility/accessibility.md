# Data Grid - Accessibility

<p class="description">Learn how the Data Grid implements accessibility features and guidelines, including keyboard navigation that follows international standards.</p>

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://ec.europa.eu/social/main.jsp?catId=1202) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what we aim to support.

The [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) provide valuable information on how to optimize the accessibility of a data grid.

## Density

You can change the density of the rows and the column header.

### Density selection from the toolbar

To enable the density selection from the toolbar, you can do one of the following:

1. Enable the default toolbar component by passing the `slots.toolbar` prop to the Data Grid.
2. Create a specific toolbar containing only the `GridToolbarDensitySelector` component and apply it using the `toolbar` property in the Data Grid's `slots` prop.

The user can then change the density of the Data Grid by using the density selection menu from the toolbar, as the following demo illustrates:

{{"demo": "DensitySelectorGrid.js", "bg": "inline"}}

To disable the density selection menu, pass the `disableDensitySelector` prop to the Data Grid.

### Set the density programmatically

The Data Grid exposes the `density` prop which supports the following values:

- `standard` (default)
- `compact`
- `comfortable`

You can set the density programmatically in one of the following ways:

1. Uncontrolled – initialize the density with the `initialState.density` prop.

   ```tsx
   <DataGrid
     initialState={{
       density: 'compact',
     }}
   />
   ```

2. Controlled – pass the `density` and `onDensityChange` props. For more advanced use cases, you can also subscribe to the `densityChange` grid event.

   ```tsx
   const [density, setDensity] = React.useState<GridDensity>('compact');

   return (
     <DataGrid
       density={density}
       onDensityChange={(newDensity) => setDensity(newDensity)}
     />
   );
   ```

The `density` prop applies the values determined by the `rowHeight` and `columnHeaderHeight` props, if supplied.
The user can override this setting with the optional toolbar density selector.

The following demo shows a Data Grid with the controlled density set to `compact` and outputs the current density to the console when the user changes it using the density selector from the toolbar:

{{"demo": "DensitySelectorSmallGrid.js", "bg": "inline"}}

## Keyboard navigation

The Data Grid listens for keyboard interactions from the user and emits events in response to key presses within cells.

### Tab sequence

According to [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), only one of the focusable elements contained by a composite widget should be included in the page tab sequence.
For an element to be included in the tab sequence, it needs to have a `tabIndex` value of zero or greater.

When a user focuses on a Data Grid cell, the first inner element with `tabIndex={0}` receives the focus.
If there is no element with `tabIndex={0}`, the focus is set on the cell itself.

The two Data Grids below illustrate how the user experience is impacted by improper management of the page tab sequence, making it difficult to navigate through the data set:

{{"demo": "FocusManagement.js", "bg": "inline", "defaultCodeOpen": false}}

If you customize cell rendering with the [`renderCell`](/x/react-data-grid/column-definition/#rendering-cells) method, you become responsible for removing focusable elements from the page tab sequence.
Use the `tabIndex` prop passed to the `renderCell` params to determine if the rendered cell has focus and if, as a result, the inner elements should be removed from the tab sequence:

```jsx
renderCell: (params) => (
  <div>
    <Link tabIndex={params.tabIndex} href="/#">
      more info
    </Link>
  </div>
);
```

### Navigation

:::info
The key assignments in the table below apply to Windows and Linux users.

On macOS replace:

- <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>
- <kbd class="key">Alt</kbd> with <kbd class="key">⌥ Option</kbd>

Some devices may lack certain keys, requiring the use of key combinations. In this case, replace:

- <kbd class="key">Page Up</kbd> with <kbd class="key">Fn</kbd>+<kbd class="key">Arrow Up</kbd>
- <kbd class="key">Page Down</kbd> with <kbd class="key">Fn</kbd>+<kbd class="key">Arrow Down</kbd>
- <kbd class="key">Home</kbd> with <kbd class="key">Fn</kbd>+<kbd class="key">Arrow Left</kbd>
- <kbd class="key">End</kbd> with <kbd class="key">Fn</kbd>+<kbd class="key">Arrow Right</kbd>

:::

|                                                               Keys | Description                                                 |
| -----------------------------------------------------------------: | :---------------------------------------------------------- |
|                                  <kbd class="key">Arrow Left</kbd> | Navigate between cell elements                              |
|                                  <kbd class="key">Arrow Down</kbd> | Navigate between cell elements                              |
|                                 <kbd class="key">Arrow Right</kbd> | Navigate between cell elements                              |
|                                    <kbd class="key">Arrow Up</kbd> | Navigate between cell elements                              |
|                                        <kbd class="key">Home</kbd> | Navigate to the first cell of the current row               |
|                                         <kbd class="key">End</kbd> | Navigate to the last cell of the current row                |
| <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Home</kbd></kbd> | Navigate to the first cell of the first row                 |
|  <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">End</kbd></kbd> | Navigate to the last cell of the last row                   |
|                                       <kbd class="key">Space</kbd> | Navigate to the next scrollable page                        |
|                                     <kbd class="key">Page Up</kbd> | Navigate to the previous scrollable page                    |
|                                   <kbd class="key">Page Down</kbd> | Navigate to the next scrollable page                        |
|                                       <kbd class="key">Space</kbd> | Toggle row children expansion when grouping cell is focused |

### Selection

|                                                                         Keys | Description                                                          |
| ---------------------------------------------------------------------------: | :------------------------------------------------------------------- |
|         <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Select the current row                                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Select the current row and the row above or below                    |
|                                  <kbd class="key">Shift</kbd>+ Click on cell | Select the range of rows between the first and the last clicked rows |
|              <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd></kbd> | Select all rows                                                      |
|              <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">C</kbd></kbd> | Copy the currently selected rows                                     |
|                                   <kbd class="key">Ctrl</kbd>+ Click on cell | Enable multi-selection                                               |
|                         <kbd class="key">Ctrl</kbd>+ Click on a selected row | Deselect the row                                                     |

### Sorting

|                                                                 Keys | Description                                        |
| -------------------------------------------------------------------: | :------------------------------------------------- |
|                         <kbd class="key">Ctrl</kbd>+ Click on header | Enable multi-sorting                               |
|                        <kbd class="key">Shift</kbd>+ Click on header | Enable multi-sorting                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Enter</kbd></kbd> | Enable multi-sorting when column header is focused |
|                                         <kbd class="key">Enter</kbd> | Sort column when column header is focused          |
|  <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> | Open column menu when column header is focused     |

### Group and pivot

|                                                                Keys | Description                      |
| ------------------------------------------------------------------: | :------------------------------- |
| <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> | Toggle the detail panel of a row |

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
