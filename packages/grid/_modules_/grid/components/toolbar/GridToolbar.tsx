import { useContext } from 'react';
import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { ApiContext } from '../api-context';
import { GridToolbarContainer } from '../containers/GridToolbarContainer';
import { ColumnsToolbarButton } from './ColumnsToolbarButton';
import { DensitySelector } from './DensitySelector';
import { FilterToolbarButton } from './FilterToolbarButton';

export function GridToolbar() {
  const apiRef = useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  if (
    !options.showToolbar ||
    (options.disableColumnFilter && options.disableColumnSelector && options.disableDensitySelector)
  ) {
    return null;
  }

  return (
    <GridToolbarContainer>
      {!options.disableColumnSelector && <ColumnsToolbarButton />}
      {!options.disableColumnFilter && <FilterToolbarButton />}
      {!options.disableDensitySelector && <DensitySelector />}
    </GridToolbarContainer>
  );
}
