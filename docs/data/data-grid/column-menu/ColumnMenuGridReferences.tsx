import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridRenderCellParams,
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
    <a href={planProps.href} target="_blank" rel="noreferrer">
      <span className={planProps.className} title={planProps.title} />
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

const columns = [
  {
    field: 'slot',
    headerName: 'Component',
    width: 240,
    renderCell: (params: GridRenderCellParams<string>) => (
      <ComponentTag value={params.value} plan={params.row.plan} />
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
    defaultComponent: 'GridColumnMenuSortItem',
    design: 'Default',
    displayOrder: 0,
    plan: 'Community',
  },
  {
    id: 2,
    slot: 'ColumnMenuSortItem',
    defaultComponent: 'GridColumnMenuSortItemSimple',
    design: 'Simple',
    displayOrder: 0,
    plan: 'Community',
  },
  {
    id: 3,
    slot: 'ColumnMenuFilterItem',
    defaultComponent: 'GridColumnMenuFilterItem',
    design: 'Default',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 4,
    slot: 'ColumnMenuFilterItem',
    defaultComponent: 'GridColumnMenuFilterItemSimple',
    design: 'Simple',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 5,
    slot: 'ColumnMenuHideItem',
    defaultComponent: 'GridColumnMenuHideItem',
    design: 'Default',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 6,
    slot: 'ColumnMenuHideItem',
    defaultComponent: 'GridColumnMenuHideItemSimple',
    design: 'Simple',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 7,
    slot: 'ColumnMenuColumnsItem',
    defaultComponent: 'GridColumnMenuColumnsItem',
    design: 'Default',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 8,
    slot: 'ColumnMenuColumnsItem',
    defaultComponent: 'GridColumnMenuColumnsItemSimple',
    design: 'Simple',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 9,
    slot: 'ColumnMenuPinningItem',
    defaultComponent: 'GridColumnMenuPinningItem',
    design: 'Default',
    displayOrder: 5,
    plan: 'Pro',
  },
  {
    id: 10,
    slot: 'ColumnMenuPinningItem',
    defaultComponent: 'GridColumnMenuPinningItemSimple',
    design: 'Simple',
    displayOrder: 35,
    plan: 'Pro',
  },
  {
    id: 11,
    slot: 'ColumnMenuAggregationItem',
    defaultComponent: 'GridColumnMenuAggregationItem',
    design: 'Default',
    displayOrder: 17,
    plan: 'Premium',
  },
  {
    id: 12,
    slot: 'ColumnMenuAggregationItem',
    defaultComponent: 'GridColumnMenuAggregationItemSimple',
    design: 'Simple',
    displayOrder: 37,
    plan: 'Premium',
  },
  {
    id: 13,
    slot: 'ColumnMenuGroupingItem',
    defaultComponent: 'GridColumnMenuRowGroupItem,GridColumnMenuRowUngroupItem',
    design: 'Default',
    displayOrder: 13,
    plan: 'Premium',
  },
  {
    id: 14,
    slot: 'ColumnMenuGroupingItem',
    defaultComponent:
      'GridColumnMenuRowGroupItemSimple,GridColumnMenuRowUngroupItemSimple',
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
          hideDescendantCount: true,
        }}
      />
    </div>
  );
}
