import React from 'react';
import EditingWithDatePickers from '../editing/EditingWithDatePickers';
import ExcelExport from '../export/ExcelExport';
import QuickFilteringGrid from '../filtering/QuickFilteringGrid';
import BasicDetailPanels from '../master-detail/BasicDetailPanels';
import RowGroupingInitialState from '../row-grouping/RowGroupingInitialState';
import FullFeaturedDemo from './FullFeaturedDemo';
import BasicColumnPinning from '../column-pinning/BasicColumnPinning';
import ColumnVirtualizationGrid from '../virtualization/ColumnVirtualizationGrid';
import CursorPaginationGrid from '../pagination/CursorPaginationGrid';
import ColumnSelectorGrid from '../column-visibility/ColumnSelectorGrid';
import RowOrderingGrid from '../rows/RowOrderingGrid';
import TreeDataFullExample from '../tree-data/TreeDataFullExample';
import RestoreStateInitialState from '../state/RestoreStateInitialState';
import AggregationRowGrouping from '../aggregation/AggregationRowGrouping';

export const featuresSet = [
  {
    id: 1,
    name: 'Master detail',
    description: 'A parent row, with a collapsible child panel',
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
    name: 'Pagination',
    description: 'Easily paginate your rows and only fetch what you need',
    plan: 'Community',
    detailPage: '/pagination/',
    demo: <CursorPaginationGrid />,
  },
  {
    id: 4,
    name: 'Save and restore state',
    description:
      'Save and restore internal state and configurations like active filters and sorting',
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
    demo: <BasicColumnPinning />,
  },
  {
    id: 10,
    name: 'Row Pinning',
    description: 'Pin your rows up or down',
    plan: 'Pro',
    detailPage: '/row-pinning/',
    demo: <div>Waiting for row pinning branch to merge to master</div>,
    newBadge: true,
  },
  {
    id: 11,
    name: 'Aggretation and Summary rows',
    description: 'Set summary footer rows or inline summaries with row grouping',
    plan: 'Premium',
    detailPage: '/aggregation/',
    demo: <AggregationRowGrouping />,
    newBadge: true,
  },
  {
    id: 12,
    name: 'Column Visibility',
    description:
      'Display different columns in different use cases, by defining which columns are visible',
    plan: 'Community',
    detailPage: '"/column-visibility/',
    demo: <ColumnSelectorGrid />,
  },
  {
    id: 13,
    name: 'Column Virtualization',
    description: 'High performance support for thousands of columns',
    plan: 'Community',
    detailPage: '/virtualization/#column-virtualization',
    demo: <ColumnVirtualizationGrid />,
  },
  {
    id: 14,
    name: 'Row Virtualization',
    description: 'High performance support for vast volume of data',
    plan: 'Pro',
    detailPage: '/virtualization/#row-virtualization',
    demo: <FullFeaturedDemo />,
  },
  {
    id: 15,
    name: 'Tree data',
    description: 'Support rows with parent / child relationship',
    plan: 'Pro',
    detailPage: '/tree-data/',
    demo: <TreeDataFullExample />,
  },
];
