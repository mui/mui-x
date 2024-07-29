import * as React from 'react';
import { DataGridPremium, GridToolbar } from '@mui/x-data-grid-premium';

const rows = [
  {
    id: 1,
    path: ['Column', 'Column groups'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 2,
    path: ['Column', 'Column spanning'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 3,
    path: ['Column', 'Column resizing'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 4,
    path: ['Column', 'Column reorder'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 5,
    path: ['Column', 'Column pinning'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 6,
    path: ['Row', 'Row sorting'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 7,
    path: ['Row', 'Row height'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 8,
    path: ['Row', 'Row spanning'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 9,
    path: ['Row', 'Row reordering'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 10,
    path: ['Row', 'Row pinning'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 11,
    path: ['Selection', 'Single row selection'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 12,
    path: ['Selection', 'Checkbox selection'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 13,
    path: ['Selection', 'Multiple row selection'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 14,
    path: ['Selection', 'Cell range selection'],
    plan: 'Premium',
    developed: false,
  },
  {
    id: 15,
    path: ['Filtering', 'Quick filter'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 16,
    path: ['Filtering', 'Column filters'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 17,
    path: ['Filtering', 'Multi-column filtering'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 18,
    path: ['Pagination', 'Pagination'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 19,
    path: ['Pagination', 'Pagination > 100 rows per page'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 20,
    path: ['Editing', 'Row editing'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 21,
    path: ['Editing', 'Cell editing'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 22,
    path: ['Import & export', 'CSV export'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 23,
    path: ['Import & export', 'Print'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 24,
    path: ['Import & export', 'Clipboard'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 25,
    path: ['Import & export', 'Excel export'],
    plan: 'Premium',
    developed: true,
  },
  {
    id: 26,
    path: ['Rendering', 'Customizable components'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 27,
    path: ['Rendering', 'Column virtualization'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 28,
    path: ['Rendering', 'Row virtualization > 100 rows'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 29,
    path: ['Group & Pivot', 'Tree data'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 30,
    path: ['Group & Pivot', 'Master detail'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 31,
    path: ['Group & Pivot', 'Grouping'],
    plan: 'Premium',
    developed: true,
  },
  {
    id: 32,
    path: ['Group & Pivot', 'Aggregation'],
    plan: 'Premium',
    developed: false,
  },
  {
    id: 33,
    path: ['Group & Pivot', 'Pivoting'],
    plan: 'Premium',
    developed: false,
  },
  {
    id: 34,
    path: ['Misc', 'Accessibility'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 35,
    path: ['Misc', 'Keyboard navigation'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 36,
    path: ['Misc', 'Localization'],
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

const exceljsPreProcess = ({ workbook, worksheet }) => {
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
const exceljsPostProcess = ({ worksheet }) => {
  // add a text after the data
  worksheet.addRow({}); // Add empty row

  worksheet.addRow(['Those data are for internal use only']);
};

const excelOptions = { exceljsPreProcess, exceljsPostProcess };

const getTreeDataPath = (row) => row.path;

export default function ExcelCustomExport() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        treeData
        getTreeDataPath={getTreeDataPath}
        rows={rows}
        columns={columns}
        groupingColDef={groupingColDef}
        defaultGroupingExpansionDepth={-1}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { excelOptions } }}
      />
    </div>
  );
}
