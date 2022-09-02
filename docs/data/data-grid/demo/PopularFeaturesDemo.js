import React from 'react';
import PropTypes from 'prop-types';
import {
  DataGridPremium,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AggregationRowGrouping from '../aggregation/AggregationRowGrouping';
import BasicColumnPinning from '../column-pinning/BasicColumnPinning';
import ColumnSelectorGrid from '../column-visibility/ColumnSelectorGrid';
import EditingWithDatePickers from '../editing/EditingWithDatePickers';
import ExcelExport from '../export/ExcelExport';
import QuickFilteringGrid from '../filtering/QuickFilteringGrid';
import BasicDetailPanels from '../master-detail/BasicDetailPanels';
import RowGroupingInitialState from '../row-grouping/RowGroupingInitialState';
import RowOrderingGrid from '../row-ordering/RowOrderingGrid';
import RowPinningWithPagination from '../row-pinning/RowPinningWithPagination';
import RestoreStateInitialState from '../state/RestoreStateInitialState';
import TreeDataFullExample from '../tree-data/TreeDataFullExample';
import ColumnVirtualizationGrid from '../virtualization/ColumnVirtualizationGrid';
import FullFeaturedDemo from './FullFeaturedDemo';
import LazyLoadingGrid from '../row-updates/LazyLoadingGrid';
import BasicGroupingDemo from '../column-groups/BasicGroupingDemo';

export const featuresSet = [
  {
    id: 1,
    name: 'Master detail',
    description: 'A parent row with a collapsible child panel',
    plan: 'Pro',
    detailPage: '/master-detail/',
    demo: <BasicDetailPanels />,
  },
  {
    id: 2,
    name: 'Inline editing',
    description:
      'Edit your data inside the cells by double-clicking or pressing Enter',
    plan: 'Community',
    detailPage: '/editing/',
    demo: <EditingWithDatePickers />,
  },
  {
    id: 3,
    name: 'Column groups',
    description: 'Group columns in a multi-level hierarchy',
    plan: 'Community',
    detailPage: '/column-groups/',
    newBadge: true,
    demo: <BasicGroupingDemo />,
  },
  {
    id: 4,
    name: 'Lazy Loading',
    description: 'Easily paginate your rows and only fetch what you need',
    plan: 'Pro',
    detailPage: '/pagination/',
    newBadge: true,
    demo: <LazyLoadingGrid />,
  },
  {
    id: 5,
    name: 'Save and restore state',
    description:
      'Save and restore internal state and configurations like active filters and sorting',
    plan: 'Community',
    detailPage: '/state/#save-and-restore-the-state',
    demo: <RestoreStateInitialState />,
  },
  {
    id: 6,
    name: 'Row Grouping',
    description: 'Group rows with repeating column values',
    plan: 'Premium',
    detailPage: '/row-grouping/',
    demo: <RowGroupingInitialState />,
  },
  {
    id: 7,
    name: 'Excel export',
    description:
      'Easily export the rows in various file formats such as CSV, PDF or Excel',
    plan: 'Premium',
    detailPage: '/export/#excel-export',
    demo: <ExcelExport />,
  },
  {
    id: 8,
    name: 'Quick filter',
    description: 'Use a single text input to filter multiple fields',
    plan: 'Community',
    detailPage: '/filtering/#quick-filter',
    demo: <QuickFilteringGrid />,
  },
  {
    id: 9,
    name: 'Row reorder',
    description: 'Drag and drop to reorder your data',
    plan: 'Pro',
    detailPage: '/row-ordering/',
    demo: <RowOrderingGrid />,
  },
  {
    id: 10,
    name: 'Column Pinning',
    description: 'Pin your columns to the left or right',
    plan: 'Pro',
    detailPage: '/column-pinning/',
    demo: <BasicColumnPinning />,
  },
  {
    id: 11,
    name: 'Row Pinning',
    description: 'Pin your rows up or down',
    plan: 'Pro',
    detailPage: '/row-pinning/',
    demo: <RowPinningWithPagination />,
    newBadge: true,
  },
  {
    id: 12,
    name: 'Aggretation and Summary rows',
    description: 'Set summary footer rows or inline summaries with row grouping',
    plan: 'Premium',
    detailPage: '/aggregation/',
    demo: <AggregationRowGrouping />,
    newBadge: true,
  },
  {
    id: 13,
    name: 'Column Visibility',
    description:
      'Display different columns in different use cases by defining which columns are visible',
    plan: 'Community',
    detailPage: '"/column-visibility/',
    demo: <ColumnSelectorGrid />,
  },
  {
    id: 14,
    name: 'Column Virtualization',
    description: 'High performance support for thousands of columns',
    plan: 'Community',
    detailPage: '/virtualization/#column-virtualization',
    demo: <ColumnVirtualizationGrid />,
  },
  {
    id: 15,
    name: 'Row Virtualization',
    description: 'High performance support for vast volume of data',
    plan: 'Pro',
    detailPage: '/virtualization/#row-virtualization',
    demo: <FullFeaturedDemo />,
  },
  {
    id: 16,
    name: 'Tree data',
    description: 'Support rows with parent / child relationship',
    plan: 'Pro',
    detailPage: '/tree-data/',
    demo: <TreeDataFullExample />,
  },
];

const getChipProperties = (plan) => {
  switch (plan.toLowerCase()) {
    case 'premium':
      return { avatarLink: '/static/x/premium.svg', color: '#ffecc8' };
    case 'pro':
      return { avatarLink: '/static/x/pro.svg', color: '#c8e9ff' };
    default:
      return { avatarLink: undefined, color: '#c8ffdb' };
  }
};

const PlanTag = (props) => {
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

PlanTag.propTypes = {
  plan: PropTypes.string.isRequired,
};

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

const renderFeatures = (row) => {
  return <Box sx={{ width: '80%', margin: 'auto', py: 2 }}>{row.demo}</Box>;
};

const columns = [
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
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: '500' }}>
            <Link
              href={`/x/react-data-grid${params.row.detailPage}`}
              target="_blank"
            >
              {params.value}
            </Link>
          </Typography>
          {params.row.newBadge && (
            <Box
              sx={{
                width: 'fit-content',
                height: 'fit-content',
                fontSize: '0.8em',
                fontWeight: 600,
                position: 'absolute',
                textAlign: 'center',
                top: -13,
                left: -20,
                background: '#fcf0a0',
                color: '#af5b00',
                px: 1,
                borderRadius: 10,
              }}
            >
              New
            </Box>
          )}
        </Box>
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
    renderCell: (params) => {
      if (!params.value) {
        return <React.Fragment />;
      }
      return <PlanTag plan={params.value} />;
    },
  },
];

function PopularFeaturesDemo() {
  const getDetailPanelContent = React.useCallback(
    ({ row }) => renderFeatures(row),
    [],
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        components={{ Toolbar: CustomToolbar }}
        componentsProps={{
          toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
        }}
        getDetailPanelContent={getDetailPanelContent}
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
        groupingColDef={{
          headerName: 'Grouped by Plan',
          width: 200,
          valueFormatter: (valueFormatterParams) => {
            console.log(valueFormatterParams);
            if (!valueFormatterParams.value) {
              return <React.Fragment />;
            }
            return <PlanTag plan={valueFormatterParams.value} />;
          },
        }}
      />
    </div>
  );
}

export default PopularFeaturesDemo;
