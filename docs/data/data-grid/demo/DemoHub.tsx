import React from 'react';
import { Box } from '@mui/material';
import EditingWithDatePickers from '../editing/EditingWithDatePickers';
import ExcelExport from '../export/ExcelExport';
import QuickFilteringGrid from '../filtering/QuickFilteringGrid';
import BasicDetailPanels from '../master-detail/BasicDetailPanels';
import RowGroupingInitialState from '../row-grouping/RowGroupingInitialState';
import FullFeaturedDemo from './FullFeaturedDemo';
import ControlPinnedColumns from '../column-pinning/ControlPinnedColumns';
import ColumnVirtualizationGrid from '../virtualization/ColumnVirtualizationGrid';
import CursorPaginationGrid from '../pagination/CursorPaginationGrid';
import ColumnSelectorGrid from '../column-visibility/ColumnSelectorGrid';
import RowOrderingGrid from '../rows/RowOrderingGrid';
import TreeDataFullExample from '../tree-data/TreeDataFullExample';

export const featuresSet = [
  {
    id: 1,
    name: 'Master detail',
    description: 'A parent row, with a collapsible child panel.',
    plan: 'Pro',
    detailPage: '/master-detail/',
    demo: <BasicDetailPanels />,
  },
  {
    id: 2,
    name: 'Editing inline',
    description: 'Edit your data inside the grid.´',
    plan: 'Community',
    detailPage: '/editing/',
    demo: <EditingWithDatePickers />,
  },
  {
    id: 3,
    name: 'Pagination',
    description: 'Quickly setup pagination',
    plan: 'Community',
    detailPage: '/pagination/',
    demo: <CursorPaginationGrid />,
  },
  {
    id: 4,
    name: 'Row Grouping',
    description: 'Group rows with repeating column values',
    plan: 'Premium',
    detailPage: '/row-grouping/',
    demo: <RowGroupingInitialState />,
  },
  {
    id: 5,
    name: 'Excel export',
    description: 'Export your custom view to excel',
    plan: 'Premium',
    detailPage: '/export/#excel-export',
    demo: <ExcelExport />,
  },
  {
    id: 6,
    name: 'Quick filter',
    description: 'One filter to rule them all',
    plan: 'Community',
    detailPage: '/filtering/#quick-filter',
    demo: <QuickFilteringGrid />,
  },
  {
    id: 7,
    name: 'Row reorder',
    description: 'Drag and drop to reorder your data',
    plan: 'Pro',
    detailPage: '/rows/#row-reorder',
    demo: <RowOrderingGrid />,
  },
  {
    id: 8,
    name: 'Column Pinning',
    description: 'Pin your columns to the left or right',
    plan: 'Pro',
    detailPage: '/column-pinning/',
    demo: <ControlPinnedColumns />,
  },
  {
    id: 9,
    name: 'Column Visibility',
    description:
      "Display different columns, and let your user choose pick what's important",
    plan: 'Community',
    detailPage: '"/column-visibility/',
    demo: <ColumnSelectorGrid />,
  },
  {
    id: 10,
    name: 'Column Virtualization',
    description: 'Wanna try the grid with 1000 columns?',
    plan: 'Community',
    detailPage: '/virtualization/#column-virtualization',
    demo: <ColumnVirtualizationGrid />,
  },
  {
    id: 11,
    name: 'Row Virtualization',
    description: 'To support vast volumes of data',
    plan: 'Pro',
    detailPage: '/virtualization/#row-virtualization',
    demo: <FullFeaturedDemo />,
  },
  {
    id: 12,
    name: 'Tree data',
    description: 'support rows with parent / child relationship',
    plan: 'Pro',
    detailPage: '/tree-data/',
    demo: <TreeDataFullExample />,
  },
];

const DemoHub = (row: any) => {
  return <Box sx={{ width: '80%', margin: 'auto', py: 2 }}>{row.demo}</Box>;
};

export default DemoHub;
