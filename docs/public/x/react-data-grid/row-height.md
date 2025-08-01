# Data Grid - Row height

Customize the height of your rows.

## Static row height

By default, the rows have a height of 52 pixels.
This matches the normal height in the [Material Design guidelines](https://m2.material.io/components/data-tables).

Use the `rowHeight` prop to change this default value, as shown below:

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DenseHeightGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rowHeight={25} {...data} loading={loading} />
    </div>
  );
}

```

## Variable row height

If you need some rows to have different row heights, this can be achieved using the `getRowHeight` prop.
This function is called for each visible row and if the return value is a `number` then that `number` will be set as that row's `rowHeight`.
If the return value is `null` or `undefined`, then the `rowHeight` prop will take effect for the given row.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridRowHeightParams,
  GridColDef,
  GridDensity,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
  gridDensitySelector,
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';

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
        open={densityMenuOpen}
        onClose={() => setDensityMenuOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'density-menu-trigger',
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

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return { id: idCounter, username: randomUserName(), age: randomInt(10, 80) };
};

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
];

export default function VariableRowHeightGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={({ id, densityFactor }: GridRowHeightParams) => {
          if ((id as number) % 2 === 0) {
            return 100 * densityFactor;
          }

          return null;
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}

```

:::warning
Changing the Data Grid density does not affect the rows with variable row height.
You can access the density factor from the params provided to the `getRowHeight` prop
:::

:::warning
Always memoize the function provided to `getRowHeight`.
The Data Grid bases on the referential value of these props to cache their values and optimize the rendering.
:::

```tsx
const getRowHeight = React.useCallback(() => { ... }, []);

<DataGridPro getRowHeight={getRowHeight} />
```

## Dynamic row height

Instead of a fixed row height, you can let the Data Grid calculate the height of each row based on its content.
To do so, return `"auto"` on the function passed to the `getRowHeight` prop.

```tsx
<DataGrid getRowHeight={() => 'auto'} />
```

The following demo shows this feature in action:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
  { field: 'bio', width: 400 },
];

const rows: object[] = [];

for (let i = 0; i < 200; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(1, 5); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({
    id: i,
    username: randomUserName(),
    age: randomInt(10, 80),
    bio: bio.join(' '),
  });
}

export default function DynamicRowHeightGrid() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => 'auto'}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }}
      />
    </Box>
  );
}

```

The dynamic row height implementation is based on a lazy approach, which means that the rows are measured as they are rendered.
Because of this, you may see the size of the scrollbar thumb changing during scroll.
This side effect happens because a row height estimation is used while a row is not rendered, then this value is replaced once the true measurement is obtained.
You can configure the estimated value used by passing a function to the `getEstimatedRowHeight` prop.
If not provided, the default row height of `52px` is used as estimation.
It's recommended to pass this prop if the content deviates too much from the default value.

```tsx
<DataGrid getRowHeight={() => 'auto'} getEstimatedRowHeight={() => 200} />
```

```tsx
import * as React from 'react';
import { DataGrid, GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

function ExpandableCell({ value }: GridRenderCellParams) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      {expanded ? value : value.slice(0, 200)}&nbsp;
      {value.length > 200 && (
        <Link
          type="button"
          component="button"
          sx={{ fontSize: 'inherit', letterSpacing: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username' },
  { field: 'age', type: 'number' },
  {
    field: 'bio',
    width: 400,
    renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
  },
];

const rows: object[] = [];

for (let i = 0; i < 10; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(3, 8); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({
    id: i,
    username: randomUserName(),
    age: randomInt(10, 80),
    bio: bio.join(' '),
  });
}

export default function ExpandableCells() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getEstimatedRowHeight={() => 100}
        getRowHeight={() => 'auto'}
        showToolbar
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
        }}
      />
    </div>
  );
}

```

:::warning
When the height of a row is set to `"auto"`, the final height will follow exactly the content size and ignore the density.
Add padding to the cells to increase the space between the content and the cell borders.

```tsx
<DataGrid
  sx={{
    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
  }}
/>
```

:::

### Column virtualization

By default, the virtualization of the columns is disabled to force all columns to be rendered at the same time and calculate the row height correctly.
However, this can lead to poor performance when rendering a lot of columns.

If you need column virtualization, you can set the `virtualizeColumnsWithAutoRowHeight` prop to `true`.
With this approach, the Data Grid measures the row height based on the visible columns.
However, the row height might change during horizontal scrolling.

```tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';

export interface DataRowModel {
  id: GridRowId;
  [price: string]: number | string;
}

export interface GridData {
  columns: GridColDef[];
  rows: DataRowModel[];
}

function useData(rowLength: number, columnLength: number) {
  const [data, setData] = React.useState<GridData>({ columns: [], rows: [] });

  React.useEffect(() => {
    const rows: DataRowModel[] = [];

    for (let i = 0; i < rowLength; i += 1) {
      const row: DataRowModel = {
        id: i,
      };

      for (let j = 1; j <= columnLength; j += 1) {
        row[`price${j}M`] = `${i.toString()}, ${j} `;
      }

      rows.push(row);
    }

    const columns: GridColDef[] = [];

    for (let j = 1; j <= columnLength; j += 1) {
      columns.push({ field: `price${j}M`, headerName: `${j}M`, width: 55 });
    }

    setData({
      rows,
      columns,
    });
  }, [rowLength, columnLength]);

  return data;
}

export default function VirtualizeColumnsWithAutoRowHeight() {
  const data = useData(100, 100);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        {...data}
        getRowHeight={() => 'auto'}
        virtualizeColumnsWithAutoRowHeight
      />
    </div>
  );
}

```

## Row density

Give your users the option to change the default row density to match their preferences—compact, standard, or comfortable.
Density is calculated based on the `rowHeight` and/or `columnHeaderHeight` props, when present.
See [Density](https://mui.com/x/react-data-grid/accessibility/#density) for details.

## Row spacing

You can use the `getRowSpacing` prop to increase the spacing between rows.
This prop is called with a [`GridRowSpacingParams`](/x/api/data-grid/grid-row-spacing-params/) object.

```tsx
const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
  return {
    top: params.isFirstVisible ? 0 : 5,
    bottom: params.isLastVisible ? 0 : 5,
  };
}, []);
```

```tsx
import * as React from 'react';
import { DataGrid, GridRowSpacingParams, gridClasses } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { grey } from '@mui/material/colors';

export default function RowMarginGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    maxColumns: 6,
  });

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 5,
      bottom: params.isLastVisible ? 0 : 5,
    };
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        getRowSpacing={getRowSpacing}
        sx={(theme) => ({
          [`& .${gridClasses.row}`]: {
            bgcolor: grey[200],
            ...theme.applyStyles('dark', { bgcolor: grey[900] }),
          },
        })}
      />
    </div>
  );
}

```

By default, setting `getRowSpacing` will change the `marginXXX` CSS properties of each row.
To add a border instead, set `rowSpacingType` to `"border"` and customize the color and style.

```tsx
<DataGrid
  getRowSpacing={...}
  rowSpacingType="border"
  sx={{ '& .MuiDataGrid-row': { borderTopColor: 'yellow', borderTopStyle: 'solid' } }}
/>
```

:::success
Adding a bottom margin or border to rows that also have a [detail panel](/x/react-data-grid/master-detail/) is not recommended because the detail panel relies on the bottom margin to work.

As an alternative, you can use the top spacing to define the space between rows.
It's easier to always increase the next row spacing no matter if the detail panel is expanded or not, but you can use `gridDetailPanelExpandedRowIdsSelector` to apply a spacing depending on the open state.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
