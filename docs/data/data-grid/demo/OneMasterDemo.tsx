import React from 'react';
import {
  DataGridPremium,
  gridClasses,
  GridColDef,
  GridRenderCellParams,
  GridRowHeightParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DemoHub, { featuresSet } from './DemoHub';

export const PlanTag = (props: { plan: string }) => {
  function getChipProperties(plan: string) {
    switch (plan.toLowerCase()) {
      case 'premium':
        return { avatarLink: '/static/x/premium.svg', color: '#ffecc8' };
      case 'pro':
        return { avatarLink: '/static/x/pro.svg', color: '#c8e9ff' };
      default:
        return { avatarLink: undefined, color: '#c8ffdb' };
    }
  }

  const chipPropperties = getChipProperties(props.plan);
  const avatar = !chipPropperties.avatarLink ? undefined : (
    <Avatar src={chipPropperties.avatarLink} />
  );
  return (
    <Chip
      avatar={avatar}
      sx={{ background: chipPropperties.color, color: 'rgba(0, 0, 0, 0.87)' }}
      label={props.plan}
    />
  );
};

function OneMasterDemo() {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Feature name',
      width: 160,
      renderCell: (params) => {
        if (!params.value) {
          return <React.Fragment />;
        }
        return (
          <Typography sx={{ fontSize: '1rem', fontWeight: '500' }}>
            <Link href={`/x/react-data-grid${params.row.detailPage}`} target="_blank">
            {params.value}
            </Link>
          </Typography>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Brief description',
      flex: 0.5,
    },
    {
      field: 'plan',
      headerName: 'Plan',
      width: 130,
      type: 'singleSelect',
      valueOptions: ['Premium', 'Pro', 'Community'],
      renderCell: (params: GridRenderCellParams<string>) => {
        if (!params.value) {
          return <React.Fragment />;
        }
        return <PlanTag plan={params.value} />;
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ p: 1 }}>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        components={{ Toolbar: CustomToolbar }}
        componentsProps={{
          toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
        }}
        getDetailPanelContent={({ row }) => DemoHub(row)}
        getDetailPanelHeight={({ row }) => 'auto'}
        getRowHeight={() => 'auto'} 
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 2,
          },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            fontWeight: 400,
          },
          borderRadius: 2,
        }}
        rows={featuresSet}
        columns={columns}
      />
    </div>
  );
}

export default OneMasterDemo;
