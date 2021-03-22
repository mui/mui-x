import { useContext } from 'react';
import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
} from '../containers/GridToolbarContainer';
import { GridColumnsToolbarButton } from './GridColumnsToolbarButton';
import { GridDensitySelector } from './GridDensitySelector';
import { GridFilterToolbarButton } from './GridFilterToolbarButton';
import { GridToolbarExport } from './GridToolbarExport';
import { useGridStripBaseComponentsProps } from '../../hooks/utils/useGridStripBaseComponentsProps';

export const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbar(props, ref) {
    const strippedProps = useGridStripBaseComponentsProps(props);
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
      <GridToolbarContainer ref={ref} {...strippedProps}>
        <GridColumnsToolbarButton />
        <GridFilterToolbarButton />
        <GridDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  },
);
