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
import RestoreStateInitialState from '../state/RestoreStateInitialState';

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
    description: 'Edit your data inside the grid',
    plan: 'Community',
    detailPage: '/editing/',
    demo: <EditingWithDatePickers />,
  },
  {
    id: 3,
    name: 'Pagination',
    description: 'Easily paginate your rows and only fetch what you need',
    plan: 'Community',
    detailPage: '/pagination/',
    demo: <CursorPaginationGrid />,
  },
  {
    id: 4,
    name: 'Save and Restore state',
    description:
      'Save and Restore internal state and configurations like active filters and sorting',
    plan: 'Community',
    detailPage: '/state/#save-and-restore-the-state',
    demo: <RestoreStateInitialState />,
  },
  {
    id: 5,
    name: 'Row Grouping',
    description: 'Group rows with repeating column values',
    plan: 'Premium',
    detailPage: '/row-grouping/',
    demo: <RowGroupingInitialState />,
  },
  {
    id: 6,
    name: 'Excel export',
    description:
      'Easily export the rows in various file formats such as CSV, PDF or Excel',
    plan: 'Premium',
    detailPage: '/export/#excel-export',
    demo: <ExcelExport />,
  },
  {
    id: 7,
    name: 'Quick filter',
    description: 'Use a single text input to filter multiple fields',
    plan: 'Community',
    detailPage: '/filtering/#quick-filter',
    demo: <QuickFilteringGrid />,
  },
  {
    id: 8,
    name: 'Row reorder',
    description: 'Drag and drop to reorder your data',
    plan: 'Pro',
    detailPage: '/rows/#row-reorder',
    demo: <RowOrderingGrid />,
  },
  {
    id: 9,
    name: 'Column Pinning',
    description: 'Pin your columns to the left or right',
    plan: 'Pro',
    detailPage: '/column-pinning/',
    demo: <ControlPinnedColumns />,
  },
  {
    id: 10,
    name: 'Column Visibility',
    description:
      'Display different columns in different use cases, by defining which columns are visible.',
    plan: 'Community',
    detailPage: '"/column-visibility/',
    demo: <ColumnSelectorGrid />,
  },
  {
    id: 11,
    name: 'Column Virtualization',
    description: 'High performance support for thousands of columns',
    plan: 'Community',
    detailPage: '/virtualization/#column-virtualization',
    demo: <ColumnVirtualizationGrid />,
  },
  {
    id: 12,
    name: 'Row Virtualization',
    description: 'High performance support for vast volume of data',
    plan: 'Pro',
    detailPage: '/virtualization/#row-virtualization',
    demo: <FullFeaturedDemo />,
  },
  {
    id: 13,
    name: 'Tree data',
    description: 'Support rows with parent / child relationship',
    plan: 'Pro',
    detailPage: '/tree-data/',
    demo: <TreeDataFullExample />,
  },
];

const DemoHub = (row) => {
  return <Box sx={{ width: '80%', margin: 'auto', py: 2 }}>{row.demo}</Box>;
};

export default DemoHub;
