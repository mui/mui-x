import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridRenderCellParams,
} from '@mui/x-data-grid-premium';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const getChipProperties = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'premium':
      return { avatarLink: '/static/x/premium.svg', color: '#ffecc8' };
    case 'pro':
      return { avatarLink: '/static/x/pro.svg', color: '#c8e9ff' };
    default:
      return { avatarLink: undefined, color: '#c8ffdb' };
  }
};

function PlanTag(props: { plan?: string }) {
  if (!props.plan) {
    return null;
  }
  const chipPropperties = getChipProperties(props.plan);
  const avatar = !chipPropperties.avatarLink ? undefined : (
    <Avatar src={chipPropperties.avatarLink} />
  );
  return (
    <Stack sx={{ width: '100%' }}>
      <Chip
        avatar={avatar}
        sx={{ background: chipPropperties.color, color: 'rgba(0, 0, 0, 0.87)' }}
        label={props.plan}
      />
    </Stack>
  );
}

function ComponentTag(props: { value?: string }) {
  if (!props.value) {
    return null;
  }
  const components = props.value.split(',');
  return (
    <Stack gap={0.5}>
      {components.map((c, key) => (
        <Typography
          key={key}
          sx={{
            borderRadius: '5px',
            background: 'rgba(102, 178, 255, 0.15)',
            fontSize: '0.8rem',
          }}
        >
          {c}
        </Typography>
      ))}
    </Stack>
  );
}

const columns = [
  {
    field: 'slot',
    headerName: 'Slot',
    width: 220,
    renderCell: (params: GridRenderCellParams<string>) => (
      <ComponentTag value={params.value} />
    ),
  },
  {
    field: 'plan',
    headerName: 'Plan',
    width: 170,
    type: 'singleSelect',
    valueOptions: ['Premium', 'Pro', 'Community'],
    renderCell: (params: GridRenderCellParams<string>) => (
      <PlanTag plan={params.value} />
    ),
  },
  { field: 'design', headerName: 'Menu Design' },
  {
    field: 'defaultComponent',
    headerName: 'Default Components',
    width: 280,
    renderCell: (params: GridRenderCellParams<string>) => (
      <ComponentTag value={params.value} />
    ),
  },
  { field: 'displayOrder', headerName: 'Display Order', width: 140, type: 'number' },
];

const rows = [
  {
    id: 1,
    slot: 'ColumnMenuSortItem',
    defaultComponent: '<GridColumnMenuSortItem />',
    design: 'Default',
    displayOrder: 0,
    plan: 'Community',
  },
  {
    id: 2,
    slot: 'ColumnMenuSortItem',
    defaultComponent: '<GridColumnMenuSortItemSimple />',
    design: 'Simple',
    displayOrder: 0,
    plan: 'Community',
  },
  {
    id: 3,
    slot: 'ColumnMenuFilterItem',
    defaultComponent: '<GridColumnMenuFilterItem />',
    design: 'Default',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 4,
    slot: 'ColumnMenuFilterItem',
    defaultComponent: '<GridColumnMenuFilterItemSimple />',
    design: 'Simple',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 5,
    slot: 'ColumnMenuHideItem',
    defaultComponent: '<GridColumnMenuHideItem />',
    design: 'Default',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 6,
    slot: 'ColumnMenuHideItem',
    defaultComponent: '<GridColumnMenuHideItemSimple />',
    design: 'Simple',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 7,
    slot: 'ColumnMenuColumnsItem',
    defaultComponent: '<GridColumnMenuColumnsItem />',
    design: 'Default',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 8,
    slot: 'ColumnMenuColumnsItem',
    defaultComponent: '<GridColumnMenuColumnsItemSimple />',
    design: 'Simple',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 9,
    slot: 'ColumnMenuPinningItem',
    defaultComponent: '<GridColumnMenuPinningItem />',
    design: 'Default',
    displayOrder: 5,
    plan: 'Pro',
  },
  {
    id: 10,
    slot: 'ColumnMenuPinningItem',
    defaultComponent: '<GridColumnMenuPinningItemSimple />',
    design: 'Simple',
    displayOrder: 35,
    plan: 'Pro',
  },
  {
    id: 11,
    slot: 'ColumnMenuAggregationItem',
    defaultComponent: '<GridColumnMenuAggregationItem />',
    design: 'Default',
    displayOrder: 17,
    plan: 'Premium',
  },
  {
    id: 12,
    slot: 'ColumnMenuAggregationItem',
    defaultComponent: '<GridColumnMenuAggregationItemSimple />',
    design: 'Simple',
    displayOrder: 37,
    plan: 'Premium',
  },
  {
    id: 13,
    slot: 'ColumnMenuGroupingItem',
    defaultComponent:
      '<GridColumnMenuRowGroupItem />,<GridColumnMenuRowUngroupItem />',
    design: 'Default',
    displayOrder: 13,
    plan: 'Premium',
  },
  {
    id: 14,
    slot: 'ColumnMenuGroupingItem',
    defaultComponent:
      '<GridColumnMenuRowGroupItemSimple />,<GridColumnMenuRowUngroupItemSimple />',
    design: 'Simple',
    displayOrder: 33,
    plan: 'Premium',
  },
];

export default function ColumnMenuGridReferences() {
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      columns: {
        columnVisibilityModel: {
          plan: false,
        },
      },
      rowGrouping: {
        model: ['design'],
      },
    },
  });
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        rows={rows}
        initialState={initialState}
        disableColumnMenu
        hideFooter
        isGroupExpandedByDefault={(node) => node.groupingKey === 'Default'}
        groupingColDef={{
          headerName: 'Design & Plan',
          hideDescendantCount: true,
          leafField: 'plan',
          width: 140,
        }}
      />
    </div>
  );
}
