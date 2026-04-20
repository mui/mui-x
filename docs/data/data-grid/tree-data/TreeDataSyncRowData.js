import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { TreeDataSyncRowDataGroupingCell } from './utils/TreeDataSyncRowDataGroupingCell';
import { DataStore } from './utils/DataStore';

export default function TreeDataSyncRowData() {
  const apiRef = useGridApiRef();

  const dataStore = React.useMemo(() => new DataStore(), []);

  const { rows, loading } = React.useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot,
    dataStore.getSnapshot,
  );

  return (
    <div
      style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <Button variant="outlined" onClick={() => dataStore.reset()}>
        Reset Local Storage Data
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPro
          apiRef={apiRef}
          loading={loading}
          rows={rows}
          columns={columns}
          treeData
          rowReordering
          isValidRowReorder={isValidRowReorder}
          disableRowSelectionOnClick
          onRowOrderChange={dataStore.handleRowOrderChange}
          processRowUpdate={dataStore.processRowUpdate}
          getTreeDataPath={getTreeDataPath}
          setTreeDataPath={setTreeDataPath}
          groupingColDef={groupingColDef}
        />
      </div>
    </div>
  );
}

const columns = [
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    editable: true,
    valueGetter: (value) => {
      const typeMap = {
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
      return typeMap[value] || value;
    },
  },
  {
    field: 'modified',
    headerName: 'Modified',
    editable: true,
    width: 140,
    type: 'date',
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
  { field: 'size', headerName: 'Size', width: 100, editable: true },
];

const isValidRowReorder = (context) => {
  const targetRow = context.apiRef.current.getRow(context.targetNode.id);
  if (
    !targetRow ||
    (targetRow.type.toLowerCase() !== 'folder' && context.dropPosition === 'inside')
  ) {
    return false;
  }
  return true;
};

const getTreeDataPath = (row) => {
  return row.path;
};

const setTreeDataPath = (path, row) => {
  return {
    ...row,
    path,
  };
};

const groupingColDef = {
  headerName: 'Name',
  renderCell: TreeDataSyncRowDataGroupingCell,
};
