import * as React from 'react';
import {
  DataGridPro,
  GridValidRowModel,
  ReorderValidationContext,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const isValidRowReorder = (context: ReorderValidationContext) => {
  if (context.sourceNode.type === 'group') {
    return true;
  }
  if (
    context.targetNode.type === 'group' &&
    context.targetNode.id !== context.sourceNode.parent &&
    context.dropPosition === 'inside'
  ) {
    return true;
  }
  if (context.targetNode.type === 'leaf') {
    return context.sourceNode.parent !== context.targetNode.parent;
  }
  return false;
};

const getTreeDataPath = (row: GridValidRowModel) => {
  return row.path;
};

const setTreeDataPath = (path: string[], row: GridValidRowModel) => {
  return { ...row, path };
};

export default function RowReorderingValidation() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 4 },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        setTreeDataPath={setTreeDataPath}
        getTreeDataPath={getTreeDataPath}
        loading={loading}
        rowReordering
        isValidRowReorder={isValidRowReorder}
      />
    </div>
  );
}
