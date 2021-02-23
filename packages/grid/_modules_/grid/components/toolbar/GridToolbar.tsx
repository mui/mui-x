import { useContext } from 'react';
import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';
import { GridToolbarContainer } from '../containers/GridToolbarContainer';
import { GridColumnsToolbarButton } from './GridColumnsToolbarButton';
import { GridDensitySelector } from './GridDensitySelector';
import { GridFilterToolbarButton } from './GridFilterToolbarButton';
import { GridToolbarExport } from './GridToolbarExport';

export function GridToolbar() {
  const apiRef = useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  if (
    options.disableColumnFilter &&
    options.disableColumnSelector &&
    options.disableDensitySelector
  ) {
    return null;
  }

  return (
    <GridToolbarContainer>
      <GridColumnsToolbarButton />
      <GridFilterToolbarButton />
      <GridDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
