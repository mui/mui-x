import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import { GRID_BOOLEAN_COL_DEF } from '../../../models/colDef/gridBooleanColDef';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridApiContext } from '../../root/useGridApiContext';
import { GridRowId } from '../../../models/gridRows';

const TreeDataToggleIcon = ({ id }: { id: GridRowId }) => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const Icon = apiRef.current.isTreeDataRowExpanded!(id)
    ? rootProps.components.TreeDataCollapseIcon
    : rootProps.components.TreeDataExpandIcon;

  return (
    <IconButton size="small" onClick={() => apiRef.current.toggleTreeDataRow!(id)}>
      <Icon />
    </IconButton>
  );
};

export const GridTreeDataToggleExpansionColDef: GridColDef = {
  ...GRID_BOOLEAN_COL_DEF,
  field: '__check__',
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  disableReorder: true,
  valueGetter: () => true,
  renderHeader: () => 'Header',
  renderCell: (params) => {
    return <TreeDataToggleIcon id={params.id} />;
  },
};
