import React from 'react';
import {
  DataGridPremium,
  gridClasses,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { featuresSet } from './features';
import Box from '@mui/material/Box';

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

const PlanTag = (props: { plan: string }) => {
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

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

const renderFeatures = (row: any) => {
  return <Box sx={{ width: '80%', margin: 'auto', py: 2 }}>{row.demo}</Box>;
};

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Feature name',
    width: 160,
    groupable: false,
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
    groupable: false,
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

function PopularFeaturesDemo() {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        components={{ Toolbar: CustomToolbar }}
        componentsProps={{
          toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
        }}
        getDetailPanelContent={({ row }) => renderFeatures(row)}
        getDetailPanelHeight={() => 'auto'}
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
        groupingColDef={() => {
          return {
            headerName: 'Grouped by Plan',
            width: 200,
            valueFormatter: (valueFormatterParams) => {
              console.log(valueFormatterParams);
              if (!valueFormatterParams.value) {
                return <React.Fragment />;
              }
              return <PlanTag plan={valueFormatterParams.value} />;
            },
          };
        }}
      />
    </div>
  );
}

export default PopularFeaturesDemo;
