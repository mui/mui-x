import * as React from 'react';
import { GridRow as DataGridRow, GridRowProps } from '@mui/x-data-grid';
import { useGridPrivateApiContext } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridRowPro, GridTreeNodeWithParent } from './GridProRow';

export function GridRow(props: GridRowProps) {
  const { rowId } = props;

  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const rowNode = apiRef.current.getRowNode(rowId);

  return rootProps.treeData !== true || rowNode === null || rowNode.parent === null ? (
    <DataGridRow {...props} />
  ) : (
    <GridRowPro {...props} rowNode={rowNode as GridTreeNodeWithParent} />
  );
}
