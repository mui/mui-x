import React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import DemoHub, { featuresSet } from './DemoHub';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export const PlanTag = (props: { plan: string }) => {
  const { plan } = props;
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

  const chipPropperties = getChipProperties(plan);
  const avatar = !chipPropperties.avatarLink ? undefined : (
    <Avatar src={chipPropperties.avatarLink} />
  );
  return (
    <Chip avatar={avatar} sx={{ background: chipPropperties.color }} label={plan} />
  );
};

function OneMasterDemo() {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Feature name',
      width: 130,
      renderCell: (params) => {
        if (!params.value) return;
        return (
          <Typography sx={{ fontSize: '1rem', fontWeight: '500' }}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 0.5,
    },
    {
      field: 'plan',
      headerName: 'Plan',
      width: 130,
      renderCell: (params: GridRenderCellParams<string>) => {
        if (!params.value) return;
        return <PlanTag plan={params.value} />;
      },
    },
    {
      field: 'detailPage',
      headerName: 'Details',
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {
        if (!params.value) return;
        return <Link href={params.value}>{params.value} </Link>;
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        components={{ Toolbar: CustomToolbar }}
        getDetailPanelContent={({ row }) => DemoHub(row)}
        getDetailPanelHeight={({ row }) => 300}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
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
