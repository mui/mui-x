# Data Grid - Accessibility

Learn how the Data Grid implements accessibility features and guidelines, including keyboard navigation that follows international standards.

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what we aim to support.

The [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) provide valuable information on how to optimize the accessibility of a Data Grid.

## Density

The Data Grid exposes the `density` prop which supports the following values:

- `standard` (default)
- `compact`
- `comfortable`

### Set the density programmatically

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

You can create a custom toolbar with a density selector that allows users to change the density of the Data Grid, as shown in the demo below.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridDensity,
  gridDensitySelector,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';

const DENISTY_OPTIONS: { label: string; value: GridDensity }[] = [
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const [densityMenuOpen, setDensityMenuOpen] = React.useState(false);
  const densityMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Toolbar>
      <Tooltip title="Settings">
        <ToolbarButton
          ref={densityMenuTriggerRef}
          id="density-menu-trigger"
          aria-controls="density-menu"
          aria-haspopup="true"
          aria-expanded={densityMenuOpen ? 'true' : undefined}
          onClick={() => setDensityMenuOpen(true)}
        >
          <SettingsIcon fontSize="small" sx={{ ml: 'auto' }} />
        </ToolbarButton>
      </Tooltip>

      <Menu
        id="density-menu"
        anchorEl={densityMenuTriggerRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={densityMenuOpen}
        onClose={() => setDensityMenuOpen(false)}
        slotProps={{
          list: {
            'aria-labelledby': 'density-menu-trigger',
          },
        }}
      >
        {DENISTY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              apiRef.current.setDensity(option.value);
              setDensityMenuOpen(false);
            }}
          >
            <ListItemIcon>
              {density === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Toolbar>
  );
}

export default function DensitySelectorGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}

```

See the [Toolbar component—Settings menu](/x/react-data-grid/components/toolbar/#settings-menu) for an example of how to create a settings menu that stores user preferences in local storage.

## Keyboard navigation

The Data Grid listens for keyboard interactions from the user and emits events in response to key presses within cells.

### Tab sequence

According to [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), only one of the focusable elements contained by a composite widget should be included in the page tab sequence.
For an element to be included in the tab sequence, it needs to have a `tabIndex` value of zero or greater.

When a user focuses on a Data Grid cell, the first inner element with `tabIndex={0}` receives the focus.
If there is no element with `tabIndex={0}`, the focus is set on the cell itself.

The two Data Grids below illustrate how the user experience is impacted by improper management of the page tab sequence, making it difficult to navigate through the data set:

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function CorrectRenderLink(props: GridRenderCellParams) {
  return (
    <Link tabIndex={props.tabIndex} href="/#tab-sequence">
      more info
    </Link>
  );
}

function WrongRenderLink() {
  return <Link href="/#tab-sequence">more info</Link>;
}

const correctColumns: GridColDef[] = [
  { field: 'link', renderCell: CorrectRenderLink, width: 200 },
];
const wrongColumns: GridColDef[] = [
  { field: 'link', renderCell: WrongRenderLink, width: 200 },
];

const rows: GridRowsProp = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export default function FocusManagement() {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2">Without focus management</Typography>
        <Box sx={{ height: 300 }}>
          <DataGrid rows={rows} columns={wrongColumns} hideFooterSelectedRowCount />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2">Correct focus management</Typography>
        <Box sx={{ height: 300 }}>
          <DataGrid
            rows={rows}
            columns={correctColumns}
            hideFooterSelectedRowCount
          />
        </Box>
      </Grid>
    </Grid>
  );
}

```

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

- <kbd class="key">Page Up</kbd> with <kbd><kbd class="key">Fn</kbd>+<kbd class="key">Arrow Up</kbd></kbd>
- <kbd class="key">Page Down</kbd> with <kbd><kbd class="key">Fn</kbd>+<kbd class="key">Arrow Down</kbd></kbd>
- <kbd class="key">Home</kbd> with <kbd><kbd class="key">Fn</kbd>+<kbd class="key">Arrow Left</kbd></kbd>
- <kbd class="key">End</kbd> with <kbd><kbd class="key">Fn</kbd>+<kbd class="key">Arrow Right</kbd></kbd>

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
|         <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Select/Deselect the current row                                      |
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
