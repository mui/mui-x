import * as React from 'react';
import { GridToolbarProps, Grid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { ColumnsPanelTrigger } from './ColumnsPanelTrigger';
import { FilterPanelTrigger } from './FilterPanelTrigger';
import { PrintTrigger } from './PrintTrigger';
import { DownloadMenu } from './DownloadMenu';

export function Toolbar(props: GridToolbarProps) {
  const { quickFilterProps } = props;

  return (
    <Grid.Toolbar.Root>
      <GridToolbarQuickFilter sx={{ mr: 'auto' }} {...quickFilterProps} />
      <ColumnsPanelTrigger />
      <FilterPanelTrigger />
      <Grid.Toolbar.Separator />
      <PrintTrigger />
      <DownloadMenu />
    </Grid.Toolbar.Root>
  );
}
