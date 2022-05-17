import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const rows = [
  {
    hierarchy: ['README.md'],
    size: 167,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['package.json'],
    size: 2545,
    updatedAt: '2022-05-11T14:29:21.869Z',
  },
  {
    hierarchy: ['src', 'Button', 'Button.d.ts'],
    size: 5641,
    updatedAt: '2022-04-12T09:21:38.140Z',
  },
  {
    hierarchy: ['src', 'Button', 'Button.js'],
    size: 17667,
    updatedAt: '2022-03-31T09:20:29.921Z',
  },
  {
    hierarchy: ['src', 'Button', 'Button.spec.tsx'],
    size: 3134,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'Button.test.js'],
    size: 14234,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'Ripple.js'],
    size: 2117,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'Ripple.test.js'],
    size: 3883,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'TouchRipple.d.ts'],
    size: 930,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'TouchRipple.js'],
    size: 8940,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'TouchRipple.test.js'],
    size: 8180,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'buttonClasses.ts'],
    size: 4671,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'index.ts'],
    size: 156,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Button', 'touchRippleClasses.ts'],
    size: 1214,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Input', 'Input.d.ts'],
    size: 6606,
    updatedAt: '2022-04-28T14:31:02.491Z',
  },
  {
    hierarchy: ['src', 'Input', 'Input.js'],
    size: 15688,
    updatedAt: '2022-03-31T09:20:29.921Z',
  },
  {
    hierarchy: ['src', 'Input', 'Input.test.js'],
    size: 10723,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Input', 'index.ts'],
    size: 93,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Input', 'inputClasses.ts'],
    size: 1826,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tab', 'Tab.d.ts'],
    size: 2068,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tab', 'Tab.js'],
    size: 7067,
    updatedAt: '2022-03-31T09:20:29.921Z',
  },
  {
    hierarchy: ['src', 'Tab', 'Tab.test.js'],
    size: 5605,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tab', 'index.d.ts'],
    size: 141,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tab', 'index.js'],
    size: 118,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tab', 'tabClasses.ts'],
    size: 1697,
    updatedAt: '2022-04-11T08:05:44.594Z',
  },
  {
    hierarchy: ['src', 'TabScrollButton', 'TabScrollButton.d.ts'],
    size: 1155,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TabScrollButton', 'TabScrollButton.js'],
    size: 3516,
    updatedAt: '2022-03-31T09:20:29.921Z',
  },
  {
    hierarchy: ['src', 'TabScrollButton', 'TabScrollButton.test.js'],
    size: 1825,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TabScrollButton', 'index.d.ts'],
    size: 201,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TabScrollButton', 'index.js'],
    size: 166,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TabScrollButton', 'tabScrollButtonClasses.ts'],
    size: 763,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'TablePagination.d.ts'],
    size: 6509,
    updatedAt: '2022-04-11T08:05:44.594Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'TablePagination.js'],
    size: 12766,
    updatedAt: '2022-04-11T08:05:44.594Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'TablePagination.spec.tsx'],
    size: 408,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'TablePagination.test.js'],
    size: 13072,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'index.d.ts'],
    size: 201,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'index.js'],
    size: 166,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'TablePagination', 'tablePaginationClasses.ts'],
    size: 1524,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'ScrollbarSize.js'],
    size: 1522,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'ScrollbarSize.test.js'],
    size: 1674,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'Tabs.d.ts'],
    size: 4943,
    updatedAt: '2022-04-11T08:05:44.594Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'Tabs.js'],
    size: 23031,
    updatedAt: '2022-04-11T08:05:44.594Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'Tabs.spec.tsx'],
    size: 407,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'Tabs.test.js'],
    size: 43572,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'TabsList.js'],
    size: 1469,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'index.d.ts'],
    size: 146,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'index.js'],
    size: 122,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'Tabs', 'tabsClasses.ts'],
    size: 1914,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'index.test.js'],
    size: 563,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['src', 'index.ts'],
    size: 348,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['tsconfig.build.json'],
    size: 590,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
  {
    hierarchy: ['tsconfig.json'],
    size: 61,
    updatedAt: '2022-03-28T11:53:29.818Z',
  },
];

const columns = [
  {
    field: 'size',
    headerName: 'Size',
    type: 'number',
    valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }
      if (params.value < 100) {
        return `${params.value} b`;
      }

      if (params.value < 100_000) {
        return `${Math.floor(params.value / 100) / 10} Kb`;
      }

      if (params.value < 100_000_000) {
        return `${Math.floor(params.value / 100_000) / 10} Mb`;
      }

      return `${Math.floor(params.value / 100_000_000) / 10} Gb`;
    },
  },
  {
    field: 'updatedAt',
    headerName: 'Last modification',
    type: 'dateTime',
    width: 200,
    valueGetter: (params) => {
      if (params.value == null) {
        return null;
      }

      return new Date(params.value);
    },
  },
];

const getTreeDataPath = (row) => row.hierarchy;

const getRowId = (row) => row.hierarchy.join('/');

const GROUPING_COL_DEF = { headerName: 'Files' };

export default function AggregationTreeData() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        treeData
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        getRowId={getRowId}
        groupingColDef={GROUPING_COL_DEF}
        initialState={{
          aggregation: {
            model: {
              size: {
                inline: 'sum',
                footer: 'max',
              },
            },
          },
        }}
      />
    </div>
  );
}
