import { useContext } from 'react';
import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';
import { GridToolbar } from '../styled-wrappers/GridToolbar';
import { ColumnsToolbarButton } from './ColumnsToolbarButton';
import { DensitySelector } from './DensitySelector';
import { FilterToolbarButton } from './FilterToolbarButton';

export function DefaultToolbar() {
  const apiRef = useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  if (
    options.disableColumnFilter &&
    options.disableColumnSelector &&
    options.disableDensitySelector
  ) {
    return null;
  }

  return (
    <GridToolbar>
      {!options.disableColumnSelector && <ColumnsToolbarButton />}
      {!options.disableColumnFilter && <FilterToolbarButton />}
      {!options.disableDensitySelector && <DensitySelector />}
    </GridToolbar>
  );
}
