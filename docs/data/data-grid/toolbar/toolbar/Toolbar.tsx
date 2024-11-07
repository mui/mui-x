import * as React from 'react';
import { GridToolbarProps, GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import { ColumnsPanelTrigger } from './ColumnsPanelTrigger';
import { FilterPanelTrigger } from './FilterPanelTrigger';
import { PrintTrigger } from './PrintTrigger';
import { DownloadMenu } from './DownloadMenu';

export function Toolbar(props: GridToolbarProps) {
  const { quickFilterProps } = props;

  return (
    <GridToolbar.Root>
      <GridToolbar.QuickFilter sx={{ mr: 'auto' }} {...quickFilterProps} />
      <ColumnsPanelTrigger />
      <FilterPanelTrigger />
      <GridToolbar.Separator />
      <PrintTrigger />
      <DownloadMenu />
    </GridToolbar.Root>
  );
}
