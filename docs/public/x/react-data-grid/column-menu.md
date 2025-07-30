# Data Grid - Column menu

Customize your columns menu.

## Column menu

Each column header comes with a column menu with quickly accessible Data Grid features like column visibility, sorting, filtering, and others.

It can be accessed by clicking on the 3-dots icon that appears on hover on a header cell or when focusing on a column header and pressing <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> (or <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> on macOS).

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} />
    </div>
  );
}

```

## Customize column menu items

You can customize the column menu items by passing the `slots` and `slotProps` props to the `<GridColumnMenu />` component:

- `slots` - use this prop to override default column menu slots or add new slots.
- `slotProps` - use this prop to override or pass [`displayOrder`](/x/react-data-grid/column-menu/#reordering-menu-items) for column menu items. You can also use this to pass extra props to custom column menu slots.

### Adding a menu item

To add a new menu item, create a new item slot and pass it to the `slots` prop. In the example below, the new slot is called `columnMenuUserItem` but you can choose any name and it'll be added to the menu automatically.
You can also set the `displayOrder` (default `100`) or pass new props to the slots using the `slotProps` prop.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Add new item
        columnMenuUserItem: CustomUserItem,
      }}
      slotProps={{
        columnMenuUserItem: {
          // set `displayOrder` for the new item
          displayOrder: 15,
          // Additional props
          myCustomValue: 'Do custom action',
          myCustomHandler: () => alert('Custom handler fired'),
        },
      }}
    />
  );
}
```

```tsx
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuProps,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomUserItem(props: GridColumnMenuItemProps) {
  const { myCustomHandler, myCustomValue } = props;
  return (
    <MenuItem onClick={myCustomHandler}>
      <ListItemIcon>
        <SettingsApplicationsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{myCustomValue}</ListItemText>
    </MenuItem>
  );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Add new item
        columnMenuUserItem: CustomUserItem,
      }}
      slotProps={{
        columnMenuUserItem: {
          // set `displayOrder` for new item
          displayOrder: 15,
          // pass additional props
          myCustomValue: 'Do custom action',
          myCustomHandler: () => alert('Custom handler fired'),
        },
      }}
    />
  );
}

export default function AddNewColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ columnMenu: CustomColumnMenu }} />
    </div>
  );
}

```

### Overriding default menu items

Use the `slots` prop to override default menu items.
Check [this table](/x/react-data-grid/column-menu/#default-column-menu-items) to know the overridable slot name for each menu item.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Override `columnMenuFilterItem` component
        columnMenuFilterItem: CustomFilterItem,
      }}
    />
  );
}
```

```tsx
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconFilter from '@mui/icons-material/FilterAlt';
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuProps,
  GridColumnMenuItemProps,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomFilterItem(props: GridColumnMenuItemProps) {
  const { onClick, colDef } = props;
  const apiRef = useGridApiContext();
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.showFilterPanel(colDef.field);
      onClick(event);
    },
    [apiRef, colDef.field, onClick],
  );
  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <IconFilter fontSize="small" />
      </ListItemIcon>
      <ListItemText>Show Filters</ListItemText>
    </MenuItem>
  );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Override slot for `columnMenuFilterItem`
        columnMenuFilterItem: CustomFilterItem,
      }}
    />
  );
}

export default function OverrideColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ columnMenu: CustomColumnMenu }} />
    </div>
  );
}

```

### Hiding a menu item

To hide a menu item, you can set its respective slot in `slots` to `null`.
Check [this table](/x/react-data-grid/column-menu/#default-column-menu-items) to know the slot name for each menu item.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Hide `columnMenuColumnsItem`
        columnMenuColumnsItem: null,
      }}
    />
  );
}
```

```tsx
import * as React from 'react';
import { DataGrid, GridColumnMenu, GridColumnMenuProps } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Hide `columnMenuColumnsItem`
        columnMenuColumnsItem: null,
      }}
    />
  );
}

export default function HideColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ columnMenu: CustomColumnMenu }} />
    </div>
  );
}

```

### Reordering menu items

Every item is assigned a `displayOrder` based on which it is shown before or after other items. It works in ascending order; the smaller the number is, the earlier it is displayed on the list. For new items default value for `displayOrder` is **100**.

You can override `displayOrder` for the default or new items in `slotProps`.

Check [this table](/x/react-data-grid/column-menu/#default-column-menu-items) to see default `displayOrder` for each menu item.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slotProps={{
        // Swap positions of filter and sort items
        columnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        columnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
      }}
    />
  );
}
```

```tsx
import * as React from 'react';
import { DataGrid, GridColumnMenu, GridColumnMenuProps } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slotProps={{
        // Swap positions of filter and sort items
        columnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        columnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
      }}
    />
  );
}

export default function ReorderColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ columnMenu: CustomColumnMenu }} />
    </div>
  );
}

```

### Default column menu items

As a reference, here are the column menu `slots` along with the default item components and `displayOrder`.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridRenderCellParams,
  GridColDef,
} from '@mui/x-data-grid-premium';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const getPlanProps = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'premium':
      return {
        href: '/x/introduction/licensing/#premium-plan',
        className: 'plan-premium',
        title: 'Premium plan',
      };
    case 'pro':
      return {
        href: '/x/introduction/licensing/#pro-plan',
        className: 'plan-pro',
        title: 'Pro plan',
      };
    default:
      return null;
  }
};

function PlanIcon(props: { plan?: string }) {
  if (!props.plan) {
    return null;
  }
  const planProps = getPlanProps(props.plan);
  if (!planProps) {
    return null;
  }
  return (
    <a
      href={planProps.href}
      target="_blank"
      rel="noopener"
      aria-label={planProps.title}
      title={planProps.title}
    >
      <span className={planProps.className} />
    </a>
  );
}

function ComponentTag(props: { value?: string; plan?: string }) {
  if (!props.value) {
    return null;
  }
  const components = props.value.split(',');
  return (
    <Stack gap={0.5}>
      {components.map((c, key) => (
        <div>
          <Typography
            key={key}
            sx={{
              borderRadius: '5px',
              background: 'rgba(102, 178, 255, 0.15)',
              fontSize: '0.8rem',
              fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
              padding: '0 5px',
              display: 'inline-block',
            }}
          >
            {c}
          </Typography>
          <PlanIcon plan={props.plan} />
        </div>
      ))}
    </Stack>
  );
}

const columns: GridColDef[] = [
  {
    field: 'slot',
    headerName: 'Slot',
    width: 240,
    renderCell: (params: GridRenderCellParams<any, string>) => (
      <ComponentTag value={params.value} plan={params.row.plan} />
    ),
  },
  {
    field: 'defaultComponent',
    headerName: 'Default Component',
    width: 300,
    renderCell: (params: GridRenderCellParams<any, string>) => (
      <ComponentTag value={params.value} />
    ),
  },
  { field: 'displayOrder', headerName: 'Display Order', width: 140, type: 'number' },
];

const rows = [
  {
    id: 1,
    slot: 'columnMenuSortItem',
    defaultComponent: 'GridColumnMenuSortItem',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 3,
    slot: 'columnMenuFilterItem',
    defaultComponent: 'GridColumnMenuFilterItem',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 7,
    slot: 'columnMenuColumnsItem',
    defaultComponent: 'GridColumnMenuColumnsItem',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 9,
    slot: 'columnMenuPinningItem',
    defaultComponent: 'GridColumnMenuPinningItem',
    displayOrder: 15,
    plan: 'Pro',
  },
  {
    id: 11,
    slot: 'columnMenuAggregationItem',
    defaultComponent: 'GridColumnMenuAggregationItem',
    displayOrder: 23,
    plan: 'Premium',
  },
  {
    id: 13,
    slot: 'columnMenuGroupingItem',
    defaultComponent: 'GridColumnMenuGroupingItem',
    displayOrder: 27,
    plan: 'Premium',
  },
];

export default function ColumnMenuGridReferencesNoSnap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <DataGridPremium columns={columns} rows={rows} disableColumnMenu hideFooter />
    </div>
  );
}

```

## Custom menu component

You can also customize and replace the column menu by [passing a fully custom component](/x/react-data-grid/components/#component-slots) to the `columnMenu` slot of the Data Grid. If you want to add some of the default menu items to your custom component, you can import and re-use them.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridColumnMenuFilterItem,
  GridColumnMenuSortItem,
  GridColumnMenuColumnsItem,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function MenuCloseComponent(props: GridColumnMenuItemProps) {
  return (
    <Button color="primary" onClick={props.onClick}>
      Close Menu
    </Button>
  );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
  const itemProps = {
    colDef: props.colDef,
    onClick: props.hideMenu,
  };
  return (
    <React.Fragment>
      <Stack px={0.5} py={0.5}>
        <GridColumnMenuSortItem {...itemProps} />
        {/* Only provide filtering on desk */}
        {itemProps.colDef.field === 'desk' ? (
          <GridColumnMenuFilterItem {...itemProps} />
        ) : null}
      </Stack>
      <Divider />
      <Stack px={0.5} py={0.5}>
        <GridColumnMenuColumnsItem {...itemProps} />
        <MenuCloseComponent {...itemProps} />
      </Stack>
    </React.Fragment>
  );
}

export default function CustomColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{
          columnMenu: CustomColumnMenu,
        }}
      />
    </div>
  );
}

```

:::info
<strong>Tip</strong>: The `columnMenu` component and its components slots receive the `colDef` prop corresponding to the current column; you can use this to conditionally render some items or change some logic.
:::

## Disable column menu

By default, each column header has the column menu enabled. To disable the column menu, set the prop `disableColumnMenu={true}`.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DisabledColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid {...data} disableColumnMenu />
    </div>
  );
}

```

## Column menu with Pro/Premium features [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

In the following demo, in addition to Data Grid MIT features, you can see commercial features like [grouping](/x/react-data-grid/row-grouping/), and [aggregation](/x/react-data-grid/aggregation/) in action. Try tweaking the values from respective column menu items.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridGroupingColDefOverride,
  GridValidRowModel,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const groupingColDef: GridGroupingColDefOverride<GridValidRowModel> = {
  leafField: 'title',
};

export default function ColumnMenuGridPremium() {
  const apiRef = useGridApiRef();
  const data = useMovieData();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      aggregation: {
        model: {
          gross: 'avg',
        },
      },
      columns: {
        columnVisibilityModel: {
          cinematicUniverse: false,
          title: false,
        },
      },
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        groupingColDef={groupingColDef}
        initialState={initialState}
      />
    </div>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
