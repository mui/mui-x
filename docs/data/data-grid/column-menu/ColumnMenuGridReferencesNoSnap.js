import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const getPlanProps = (plan) => {
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

function PlanIcon(props) {
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

function ComponentTag(props) {
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
    headerName: 'Slot',
    width: 240,
    renderCell: (params) => (
      <ComponentTag value={params.value} plan={params.row.plan} />
    ),
  },
  {
    field: 'defaultComponent',
    headerName: 'Default Component',
    width: 300,
    renderCell: (params) => <ComponentTag value={params.value} />,
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
    <div style={{ width: '100%' }}>
      <DataGridPremium
        columns={columns}
        rows={rows}
        disableColumnMenu
        autoHeight
        hideFooter
      />
    </div>
  );
}
