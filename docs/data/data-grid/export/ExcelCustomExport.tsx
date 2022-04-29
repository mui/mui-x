import * as React from 'react';
import {
  DataGridPremium,
  GridToolbar,
  GridExceljsProcessInput,
} from '@mui/x-data-grid-premium';

const rows = [
  {
    id: 1,
    path: ['Column', 'Column groups'],
    url: '/components/data-grid/columns/#column-groups',
    plan: 'Community',
    developed: false,
  },
  {
    id: 2,
    path: ['Column', 'Column spanning'],
    url: '/components/data-grid/columns/#column-spanning',
    plan: 'Community',
    developed: false,
  },
  {
    id: 3,
    path: ['Column', 'Column resizing'],
    url: '/components/data-grid/columns/#column-resizing',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 4,
    path: ['Column', 'Column reorder'],
    url: '/components/data-grid/columns/#column-reorder',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 5,
    path: ['Column', 'Column pinning'],
    url: '/components/data-grid/columns/#column-pinning',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 6,
    path: ['Row', 'Row sorting'],
    url: '/components/data-grid/rows/#row-sorting',
    plan: 'Community',
    developed: true,
  },
  {
    id: 7,
    path: ['Row', 'Row height'],
    url: '/components/data-grid/rows/#row-height',
    plan: 'Community',
    developed: true,
  },
  {
    id: 8,
    path: ['Row', 'Row spanning'],
    url: '/components/data-grid/rows/#row-spanning',
    plan: 'Community',
    developed: false,
  },
  {
    id: 9,
    path: ['Row', 'Row reordering'],
    url: '/components/data-grid/rows/#row-reorder',
    plan: 'Pro',
    developed: false,
  },
  {
    id: 10,
    path: ['Row', 'Row pinning'],
    url: '/components/data-grid/rows/#row-pinning',
    plan: 'Pro',
    developed: false,
  },

  {
    id: 11,
    path: ['Selection', 'Single row selection'],
    url: '/components/data-grid/selection/#single-row-selection',
    plan: 'Community',
    developed: true,
  },
  {
    id: 12,
    path: ['Selection', 'Checkbox selection'],
    url: '/components/data-grid/selection/#checkbox-selection',
    plan: 'Community',
    developed: true,
  },
  {
    id: 13,
    path: ['Selection', 'Multiple row selection'],
    url: '/components/data-grid/selection/#multiple-row-selection',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 14,
    path: ['Selection', 'Cell range selection'],
    url: '/components/data-grid/selection/#range-selection',
    plan: 'Premium',
    developed: false,
  },
  {
    id: 15,
    path: ['Filtering', 'Quick filter'],
    url: '/components/data-grid/filtering/#quick-filter',
    plan: 'Community',
    developed: false,
  },
  {
    id: 16,
    path: ['Filtering', 'Column filters'],
    url: '/components/data-grid/filtering/#column-filters',
    plan: 'Community',
    developed: true,
  },
  {
    id: 17,
    path: ['Filtering', 'Multi-column filtering'],
    url: '/components/data-grid/filtering/#single-and-multi-filtering',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 18,
    path: ['Pagination', 'Pagination'],
    url: '/components/data-grid/pagination/)',
    plan: 'Community',
    developed: true,
  },
  {
    id: 19,
    path: ['Pagination', 'Pagination > 100 rows per page'],
    url: '/components/data-grid/pagination/#paginate-gt-100-rows',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 20,
    path: ['Editing', 'Row editing'],
    url: '/components/data-grid/editing/#row-editing',
    plan: 'Community',
    developed: true,
  },
  {
    id: 21,
    path: ['Editing', 'Cell editing'],
    url: '/components/data-grid/editing/#cell-editing',
    plan: 'Community',
    developed: true,
  },
  {
    id: 22,
    path: ['Import & export', 'CSV export'],
    url: '/components/data-grid/export/#csv-export',
    plan: 'Community',
    developed: true,
  },
  {
    id: 23,
    path: ['Import & export', 'Print'],
    url: '/components/data-grid/export/#print',
    plan: 'Community',
    developed: true,
  },
  {
    id: 24,
    path: ['Import & export', 'Clipboard'],
    url: '/components/data-grid/export/#clipboard',
    plan: 'Pro',
    developed: false,
  },
  {
    id: 25,
    path: ['Import & export', 'Excel export'],
    url: '/components/data-grid/export/#excel-export',
    plan: 'Premium',
    developed: true,
  },
  {
    id: 26,
    path: ['Rendering', 'Customizable components'],
    url: '/components/data-grid/components/)',
    plan: 'Community',
    developed: true,
  },
  {
    id: 27,
    path: ['Rendering', 'Column virtualization'],
    url: '/components/data-grid/virtualization/#column-virtualization',
    plan: 'Community',
    developed: true,
  },
  {
    id: 28,
    path: ['Rendering', 'Row virtualization > 100 rows'],
    url: '/components/data-grid/virtualization/#row-virtualization',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 29,
    path: ['Group & Pivot', 'Tree data'],
    url: '/components/data-grid/group-pivot/#tree-data',
    plan: 'Pro',
    developed: true,
  },
  {
    id: 30,
    path: ['Group & Pivot', 'Master detail'],
    url: '/components/data-grid/group-pivot/#master-detail',
    plan: 'Pro',
    developed: false,
  },
  {
    id: 31,
    path: ['Group & Pivot', 'Grouping'],
    url: '/components/data-grid/group-pivot/#grouping',
    plan: 'Premium',
    developed: true,
  },
  {
    id: 32,
    path: ['Group & Pivot', 'Aggregation'],
    url: '/components/data-grid/group-pivot/#aggregation',
    plan: 'Premium',
    developed: false,
  },
  {
    id: 33,
    path: ['Group & Pivot', 'Pivoting'],
    url: '/components/data-grid/group-pivot/#pivoting',
    plan: 'Premium',
    developed: false,
  },
  {
    id: 34,
    path: ['Misc', 'Accessibility'],
    url: '/components/data-grid/accessibility/)',
    plan: 'Community',
    developed: true,
  },
  {
    id: 35,
    path: ['Misc', 'Keyboard navigation'],
    url: '/components/data-grid/accessibility/#keyboard-navigation',
    plan: 'Community',
    developed: true,
  },
  {
    id: 36,
    path: ['Misc', 'Localization'],
    url: '/components/data-grid/localization/)',
    plan: 'Community',
    developed: true,
  },
];

const columns = [
  {
    field: 'plan',
    type: 'singleSelect',
    valueOptions: ['Community', 'Pro', 'Premium'],
  },
  {
    field: 'developed',
    type: 'boolean',
  },
];

const groupingColDef = {
  headerName: 'Feature',
};

const exceljsPreProcess = ({ workbook, worksheet }: GridExceljsProcessInput) => {
  // Set document meta data
  workbook.creator = 'MUI-X team';
  workbook.created = new Date();

  // Customize default excel properties
  worksheet.properties.defaultRowHeight = 30;

  // Create a custom file header
  worksheet.mergeCells('A1:C2');
  worksheet.getCell('A1').value =
    'This is an helping document for the MUI-X team.\nPlease refer to the doc for up to date data.';

  worksheet.getCell('A1').border = {
    bottom: { style: 'medium', color: { argb: 'FF007FFF' } },
  };

  worksheet.getCell('A1').font = {
    name: 'Arial Black',
    size: 14,
  };
  worksheet.getCell('A1').alignment = {
    vertical: 'top',
    horizontal: 'center',
    wrapText: true,
  };
  worksheet.addRow([]);
};
const exceljsPostProcess = ({ worksheet }: GridExceljsProcessInput) => {
  // add a text after the data
  worksheet.addRow({}); // Add empty row

  worksheet.addRow(['Those data are for internal use only']);
};

const excelOptions = { exceljsPreProcess, exceljsPostProcess };

export default function ExcelCustomExport() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        treeData
        getTreeDataPath={(row) => row.path}
        rows={rows}
        columns={columns}
        groupingColDef={groupingColDef}
        defaultGroupingExpansionDepth={-1}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{ toolbar: { excelOptions } }}
      />
    </div>
  );
}
