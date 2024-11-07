import * as React from 'react';
import { GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import { ColumnsPanelTrigger } from './ColumnsPanelTrigger';
import { FilterPanelTrigger } from './FilterPanelTrigger';
import { PrintTrigger } from './PrintTrigger';
import { DownloadMenu } from './DownloadMenu';

export function Toolbar(props) {
  const { quickFilterProps, filterButtonRef, columnsButtonRef } = props;

  return (
    <GridToolbar.Root>
      <GridToolbar.QuickFilter sx={{ mr: 'auto' }} {...quickFilterProps} />
      <ColumnsPanelTrigger ref={columnsButtonRef} />
      <FilterPanelTrigger ref={filterButtonRef} />
      <GridToolbar.Separator />
      <PrintTrigger />
      <DownloadMenu />
    </GridToolbar.Root>
  );
}
