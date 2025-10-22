import * as React from 'react';
import {
  DataGridPro,
  gridOrderedDataRowsSelector,
  GridValidRowModel,
  useGridApiRef,
  type DataGridProProps,
} from '@mui/x-data-grid-pro';
import { TreeDataSyncRowDataGroupingCell } from './TreeDataSyncRowDataGroupingCell';

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => {
  return row.path;
};

const setTreeDataPath: DataGridProProps['setTreeDataPath'] = (path, row) => {
  return {
    ...row,
    path,
  };
};

const initialRows = [
  // src folder
  {
    id: 5,
    path: ['src'],
    name: 'src',
    type: 'folder',
    size: '',
    modified: '2025-01-22',
  },

  // src/components
  {
    id: 9,
    path: ['src', 'components'],
    name: 'components',
    type: 'folder',
    size: '',
    modified: '2025-01-21',
  },
  {
    id: 10,
    path: ['src', 'components', 'Button.tsx'],
    name: 'Button.tsx',
    type: 'tsx',
    size: '2.4 KB',
    modified: '2025-01-19',
  },
  {
    id: 11,
    path: ['src', 'components', 'Drawer.tsx'],
    name: 'Drawer.tsx',
    type: 'tsx',
    size: '5.8 KB',
    modified: '2025-01-20',
  },
  {
    id: 12,
    path: ['src', 'components', 'Navbar.tsx'],
    name: 'Navbar.tsx',
    type: 'tsx',
    size: '4.2 KB',
    modified: '2025-01-21',
  },
  {
    id: 13,
    path: ['src', 'components', 'TreeView.tsx'],
    name: 'TreeView.tsx',
    type: 'tsx',
    size: '6.7 KB',
    modified: '2025-01-18',
  },
  {
    id: 14,
    path: ['src', 'components', 'Modal.tsx'],
    name: 'Modal.tsx',
    type: 'tsx',
    size: '3.1 KB',
    modified: '2025-01-17',
  },
  {
    id: 15,
    path: ['src', 'components', 'index.ts'],
    name: 'index.ts',
    type: 'ts',
    size: '842 B',
    modified: '2025-01-21',
  },

  // src/hooks
  {
    id: 16,
    path: ['src', 'hooks'],
    name: 'hooks',
    type: 'folder',
    size: '',
    modified: '2025-01-19',
  },
  {
    id: 17,
    path: ['src', 'hooks', 'useAuth.ts'],
    name: 'useAuth.ts',
    type: 'ts',
    size: '2.8 KB',
    modified: '2025-01-16',
  },
  {
    id: 18,
    path: ['src', 'hooks', 'useLocalStorage.ts'],
    name: 'useLocalStorage.ts',
    type: 'ts',
    size: '1.5 KB',
    modified: '2025-01-14',
  },
  {
    id: 19,
    path: ['src', 'hooks', 'useDebounce.ts'],
    name: 'useDebounce.ts',
    type: 'ts',
    size: '948 B',
    modified: '2025-01-12',
  },
  {
    id: 20,
    path: ['src', 'hooks', 'index.ts'],
    name: 'index.ts',
    type: 'ts',
    size: '456 B',
    modified: '2025-01-19',
  },

  // src/utils
  {
    id: 21,
    path: ['src', 'utils'],
    name: 'utils',
    type: 'folder',
    size: '',
    modified: '2025-01-18',
  },
  {
    id: 22,
    path: ['src', 'utils', 'formatters.ts'],
    name: 'formatters.ts',
    type: 'ts',
    size: '3.2 KB',
    modified: '2025-01-15',
  },
  {
    id: 23,
    path: ['src', 'utils', 'validators.ts'],
    name: 'validators.ts',
    type: 'ts',
    size: '2.1 KB',
    modified: '2025-01-13',
  },
  {
    id: 24,
    path: ['src', 'utils', 'api.ts'],
    name: 'api.ts',
    type: 'ts',
    size: '4.8 KB',
    modified: '2025-01-18',
  },

  // src/types
  {
    id: 25,
    path: ['src', 'types'],
    name: 'types',
    type: 'folder',
    size: '',
    modified: '2025-01-17',
  },
  {
    id: 26,
    path: ['src', 'types', 'user.ts'],
    name: 'user.ts',
    type: 'ts',
    size: '1.6 KB',
    modified: '2025-01-17',
  },
  {
    id: 27,
    path: ['src', 'types', 'api.ts'],
    name: 'api.ts',
    type: 'ts',
    size: '2.3 KB',
    modified: '2025-01-16',
  },

  // src/pages
  {
    id: 28,
    path: ['src', 'pages'],
    name: 'pages',
    type: 'folder',
    size: '',
    modified: '2025-01-20',
  },
  {
    id: 29,
    path: ['src', 'pages', 'Home.tsx'],
    name: 'Home.tsx',
    type: 'tsx',
    size: '5.4 KB',
    modified: '2025-01-20',
  },
  {
    id: 30,
    path: ['src', 'pages', 'Dashboard.tsx'],
    name: 'Dashboard.tsx',
    type: 'tsx',
    size: '7.9 KB',
    modified: '2025-01-19',
  },
  {
    id: 31,
    path: ['src', 'pages', 'Settings.tsx'],
    name: 'Settings.tsx',
    type: 'tsx',
    size: '4.6 KB',
    modified: '2025-01-18',
  },

  // src/assets
  {
    id: 32,
    path: ['src', 'assets'],
    name: 'assets',
    type: 'folder',
    size: '',
    modified: '2025-01-15',
  },
  {
    id: 33,
    path: ['src', 'assets', 'logo.svg'],
    name: 'logo.svg',
    type: 'svg',
    size: '2.8 KB',
    modified: '2025-01-10',
  },
  {
    id: 34,
    path: ['src', 'assets', 'icon.png'],
    name: 'icon.png',
    type: 'png',
    size: '14.2 KB',
    modified: '2025-01-10',
  },

  // src/files
  {
    id: 6,
    path: ['src', 'index.tsx'],
    name: 'index.tsx',
    type: 'tsx',
    size: '1.8 KB',
    modified: '2025-01-18',
  },
  {
    id: 7,
    path: ['src', 'App.tsx'],
    name: 'App.tsx',
    type: 'tsx',
    size: '3.4 KB',
    modified: '2025-01-22',
  },
  {
    id: 8,
    path: ['src', 'App.css'],
    name: 'App.css',
    type: 'css',
    size: '1.2 KB',
    modified: '2025-01-21',
  },

  // public folder
  {
    id: 35,
    path: ['public'],
    name: 'public',
    type: 'folder',
    size: '',
    modified: '2025-01-15',
  },
  {
    id: 36,
    path: ['public', 'index.html'],
    name: 'index.html',
    type: 'txt',
    size: '1.8 KB',
    modified: '2025-01-15',
  },
  {
    id: 37,
    path: ['public', 'favicon.ico'],
    name: 'favicon.ico',
    type: 'png',
    size: '4.2 KB',
    modified: '2025-01-08',
  },
  {
    id: 38,
    path: ['public', 'robots.txt'],
    name: 'robots.txt',
    type: 'txt',
    size: '234 B',
    modified: '2025-01-08',
  },

  // Root files
  {
    id: 1,
    path: ['package.json'],
    name: 'package.json',
    type: 'json',
    size: '2.1 KB',
    modified: '2025-01-15',
  },
  {
    id: 2,
    path: ['tsconfig.json'],
    name: 'tsconfig.json',
    type: 'json',
    size: '856 B',
    modified: '2025-01-10',
  },
  {
    id: 3,
    path: ['README.md'],
    name: 'README.md',
    type: 'md',
    size: '4.2 KB',
    modified: '2025-01-20',
  },
  {
    id: 4,
    path: ['.gitignore'],
    name: '.gitignore',
    type: 'txt',
    size: '428 B',
    modified: '2025-01-08',
  },
];

const groupingColDef: DataGridProProps['groupingColDef'] = {
  headerName: 'Name',
  renderCell: TreeDataSyncRowDataGroupingCell as any,
};

const columns: DataGridProProps['columns'] = [
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    valueGetter: (value) => {
      const typeMap: Record<string, string> = {
        folder: 'Folder',
        tsx: 'TypeScript',
        ts: 'TypeScript',
        json: 'JSON',
        md: 'Markdown',
        css: 'CSS',
        svg: 'SVG Image',
        png: 'PNG Image',
        jpg: 'JPEG Image',
        txt: 'Text',
      };
      return typeMap[value] || 'File';
    },
  },
  {
    field: 'modified',
    headerName: 'Modified',
    width: 140,
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
  },
  { field: 'size', headerName: 'Size', width: 100 },
];

const isValidRowReorder: DataGridProProps['isValidRowReorder'] = (context) => {
  if (context.targetNode.type === 'leaf' && context.dropPosition === 'over') {
    return false;
  }
  return true;
};

export default function TreeDataSyncRowData() {
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState<GridValidRowModel[]>(initialRows);
  const [loading, setLoading] = React.useState(false);

  const handleRowOrderChange: DataGridProProps['onRowOrderChange'] =
    React.useCallback(() => {
      setLoading(true);
      const updatedOrderedDataRows = gridOrderedDataRowsSelector(apiRef);
      // Add a fake delay to simulate loading
      setTimeout(() => {
        setRows(updatedOrderedDataRows);
        setLoading(false);
      }, 300);
    }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        apiRef={apiRef}
        loading={loading}
        rows={rows}
        columns={columns}
        treeData
        rowReordering
        isValidRowReorder={isValidRowReorder}
        disableRowSelectionOnClick
        onRowOrderChange={handleRowOrderChange}
        getTreeDataPath={getTreeDataPath}
        setTreeDataPath={setTreeDataPath}
        groupingColDef={groupingColDef}
      />
    </div>
  );
}
