import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Chip from '@mui/material/Chip';
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
    <a href={planProps.href} target="_blank" rel="noreferrer">
      <span className={planProps.className} title={planProps.title} />
    </a>
  );
}

PlanIcon.propTypes = {
  plan: PropTypes.string,
};

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

ComponentTag.propTypes = {
  plan: PropTypes.string,
  value: PropTypes.string,
};

const columns = [
  {
    field: 'slot',
    headerName: 'Component',
    width: 240,
    renderCell: (params) => (
      <ComponentTag value={params.value} plan={params.row.plan} />
    ),
  },
  {
    field: 'defaultComponent',
    headerName: 'Default Components',
    width: 300,
    renderCell: (params) => <ComponentTag value={params.value} />,
  },
  { field: 'displayOrder', headerName: 'Display Order', width: 140, type: 'number' },
];

const allRows = [
  {
    id: 1,
    slot: 'ColumnMenuSortItem',
    defaultComponent: 'GridColumnMenuSortItem',
    design: 'default',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 2,
    slot: 'ColumnMenuSortItem',
    defaultComponent: 'GridColumnMenuSortItemSimple',
    design: 'simple',
    displayOrder: 10,
    plan: 'Community',
  },
  {
    id: 3,
    slot: 'ColumnMenuFilterItem',
    defaultComponent: 'GridColumnMenuFilterItem',
    design: 'default',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 4,
    slot: 'ColumnMenuFilterItem',
    defaultComponent: 'GridColumnMenuFilterItemSimple',
    design: 'simple',
    displayOrder: 20,
    plan: 'Community',
  },
  {
    id: 5,
    slot: 'ColumnMenuHideItem',
    defaultComponent: 'GridColumnMenuHideItem',
    design: 'default',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 6,
    slot: 'ColumnMenuHideItem',
    defaultComponent: 'GridColumnMenuHideItemSimple',
    design: 'simple',
    displayOrder: 30,
    plan: 'Community',
  },
  {
    id: 7,
    slot: 'ColumnMenuColumnsItem',
    defaultComponent: 'GridColumnMenuColumnsItem',
    design: 'default',
    displayOrder: 40,
    plan: 'Community',
  },
  {
    id: 8,
    slot: 'ColumnMenuColumnsItem',
    defaultComponent: 'GridColumnMenuColumnsItemSimple',
    design: 'simple',
    displayOrder: 40,
    plan: 'Community',
  },
  {
    id: 9,
    slot: 'ColumnMenuPinningItem',
    defaultComponent: 'GridColumnMenuPinningItem',
    design: 'default',
    displayOrder: 15,
    plan: 'Pro',
  },
  {
    id: 10,
    slot: 'ColumnMenuPinningItem',
    defaultComponent: 'GridColumnMenuPinningItemSimple',
    design: 'simple',
    displayOrder: 45,
    plan: 'Pro',
  },
  {
    id: 11,
    slot: 'ColumnMenuAggregationItem',
    defaultComponent: 'GridColumnMenuAggregationItem',
    design: 'default',
    displayOrder: 27,
    plan: 'Premium',
  },
  {
    id: 12,
    slot: 'ColumnMenuAggregationItem',
    defaultComponent: 'GridColumnMenuAggregationItemSimple',
    design: 'simple',
    displayOrder: 47,
    plan: 'Premium',
  },
  {
    id: 13,
    slot: 'ColumnMenuGroupingItem',
    defaultComponent: 'GridColumnMenuRowGroupItem,GridColumnMenuRowUngroupItem',
    design: 'default',
    displayOrder: 23,
    plan: 'Premium',
  },
  {
    id: 14,
    slot: 'ColumnMenuGroupingItem',
    defaultComponent:
      'GridColumnMenuRowGroupItemSimple,GridColumnMenuRowUngroupItemSimple',
    design: 'simple',
    displayOrder: 43,
    plan: 'Premium',
  },
];

export default function ColumnMenuGridReferences() {
  const [menuDesign, setMenuDesign] = React.useState('default');

  const rows = React.useMemo(
    () => allRows.filter((row) => row.design === menuDesign),
    [menuDesign],
  );

  return (
    <div style={{ width: '100%' }}>
      <Stack
        sx={{ width: '100%', mb: 1 }}
        direction="row"
        alignItems="flex-start"
        columnGap={1}
      >
        <Chip
          label="Default Menu"
          onClick={() => setMenuDesign('default')}
          variant="outlined"
          color={menuDesign === 'default' ? 'primary' : undefined}
        />
        <Chip
          label="Simple Menu"
          onClick={() => setMenuDesign('simple')}
          variant="outlined"
          color={menuDesign === 'simple' ? 'primary' : undefined}
        />
      </Stack>
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
