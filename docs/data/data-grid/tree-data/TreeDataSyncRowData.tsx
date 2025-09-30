import * as React from 'react';
import {
  DataGridPro,
  GridGroupNode,
  gridOrderedDataRowsSelector,
  GridRowId,
  GridValidRowModel,
  useGridApiRef,
  type DataGridProProps,
} from '@mui/x-data-grid-pro';

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
  { id: 1, path: ['Documents'], name: 'Documents', size: '' },
  { id: 2, path: ['Documents', 'Work'], name: 'Work', size: '' },
  { id: 3, path: ['Documents', 'Work', 'Reports'], name: 'Reports', size: '' },
  {
    id: 4,
    path: ['Documents', 'Work', 'Reports', 'Q1.pdf'],
    name: 'Q1.pdf',
    size: '120 kB',
  },
  {
    id: 5,
    path: ['Documents', 'Work', 'Reports', 'Q2.pdf'],
    name: 'Q2.pdf',
    size: '98 kB',
  },
  { id: 6, path: ['Documents', 'Work', 'Invoices'], name: 'Invoices', size: '' },
  {
    id: 7,
    path: ['Documents', 'Work', 'Invoices', 'Invoice1.pdf'],
    name: 'Invoice1.pdf',
    size: '45 kB',
  },
  {
    id: 8,
    path: ['Documents', 'Work', 'Invoices', 'Invoice2.pdf'],
    name: 'Invoice2.pdf',
    size: '47 kB',
  },
  { id: 9, path: ['Documents', 'Personal'], name: 'Personal', size: '' },
  {
    id: 10,
    path: ['Documents', 'Personal', 'Resume.pdf'],
    name: 'Resume.pdf',
    size: '32 kB',
  },
  {
    id: 11,
    path: ['Documents', 'Personal', 'CoverLetter.docx'],
    name: 'CoverLetter.docx',
    size: '24 kB',
  },
  { id: 12, path: ['Documents', 'Personal', 'Taxes'], name: 'Taxes', size: '' },
  {
    id: 13,
    path: ['Documents', 'Personal', 'Taxes', '2022.pdf'],
    name: '2022.pdf',
    size: '210 kB',
  },
  {
    id: 14,
    path: ['Documents', 'Personal', 'Taxes', '2023.pdf'],
    name: '2023.pdf',
    size: '225 kB',
  },
  { id: 15, path: ['Pictures'], name: 'Pictures', size: '' },
  { id: 16, path: ['Pictures', 'Vacation'], name: 'Vacation', size: '' },
  {
    id: 17,
    path: ['Pictures', 'Vacation', 'Beach.jpg'],
    name: 'Beach.jpg',
    size: '2.1 MB',
  },
  {
    id: 18,
    path: ['Pictures', 'Vacation', 'Mountains.jpg'],
    name: 'Mountains.jpg',
    size: '3.4 MB',
  },
  { id: 19, path: ['Pictures', 'Family'], name: 'Family', size: '' },
  {
    id: 20,
    path: ['Pictures', 'Family', 'Birthday.png'],
    name: 'Birthday.png',
    size: '1.2 MB',
  },
];

const columns = [{ field: 'size', headerName: 'Size', width: 100 }];

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
        disableRowSelectionOnClick
        onRowOrderChange={handleRowOrderChange}
        getTreeDataPath={getTreeDataPath}
        setTreeDataPath={setTreeDataPath}
      />
    </div>
  );
}
