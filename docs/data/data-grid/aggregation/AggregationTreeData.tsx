import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowsProp,
  DataGridPremiumProps,
  GridGroupingColDefOverride,
} from '@mui/x-data-grid-premium';

interface File {
  hierarchy: string[];
  size: number;
  updatedAt: string;
}

const rows: GridRowsProp<File> = [
  {
    hierarchy: ['.gitignore'],
    size: 413,
    updatedAt: '2022-04-08T07:29:49.228Z',
  },
  {
    hierarchy: ['README.md'],
    size: 1671,
    updatedAt: '2022-04-11T08:05:44.590Z',
  },
  {
    hierarchy: ['next-env.d.ts'],
    size: 201,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['next.config.js'],
    size: 88,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['package.json'],
    size: 766,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', '_app.tsx'],
    size: 1105,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', '_document.tsx'],
    size: 2715,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', 'about.tsx'],
    size: 1034,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', 'index.tsx'],
    size: 911,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['public', 'favicon.ico'],
    size: 25931,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'Copyright.tsx'],
    size: 428,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'Link.tsx'],
    size: 2851,
    updatedAt: '2022-04-08T07:29:49.228Z',
  },
  {
    hierarchy: ['src', 'ProTip.tsx'],
    size: 927,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'createEmotionCache.ts'],
    size: 331,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'theme.ts'],
    size: 332,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['tsconfig.json'],
    size: 550,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
];

const columns: GridColDef<File>[] = [
  {
    field: 'size',
    headerName: 'Size',
    type: 'number',
    valueGetter: (value) => {
      if (value == null) {
        return 0;
      }
      const sizeInKb = value / 1024;
      // Round to 2 decimal places
      return Math.round(sizeInKb * 100) / 100;
    },
    valueFormatter: (value) => `${value} Kb`,
  },
  {
    field: 'updatedAt',
    headerName: 'Last modification',
    type: 'dateTime',
    width: 200,
    valueGetter: (value) => {
      if (value == null) {
        return null;
      }

      return new Date(value);
    },
  },
];

const getTreeDataPath: DataGridPremiumProps<File>['getTreeDataPath'] = (row) =>
  row.hierarchy;

const getRowId: DataGridPremiumProps<File>['getRowId'] = (row) =>
  row.hierarchy.join('/');

const groupingColDef: GridGroupingColDefOverride<File> = {
  headerName: 'Files',
  width: 350,
};

export default function AggregationTreeData() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        treeData
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        getRowId={getRowId}
        groupingColDef={groupingColDef}
        initialState={{
          aggregation: {
            model: {
              size: 'sum',
              updatedAt: 'max',
            },
          },
        }}
      />
    </div>
  );
}
