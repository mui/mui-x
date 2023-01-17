import * as React from 'react';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridDensityFactorSelector } from '../hooks/features/density/densitySelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { DataGridProps } from '../models/props/DataGridProps';
import { isObject } from '../utils/utils';

export interface GridErrorOverlayProps extends GridOverlayProps {
  error?: DataGridProps['error'];
}

export const GridErrorOverlay = React.forwardRef<HTMLDivElement, GridErrorOverlayProps>(
  function GridErrorOverlay(props, ref) {
    const { error, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');
    const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
    const rowHeight = Math.floor(rootProps.rowHeight * densityFactor);
    const errorMessage = isObject(error) ? error.message : error;

    return (
      <GridOverlay ref={ref} sx={{ width: '100%', minHeight: 2 * rowHeight }} {...other}>
        {typeof errorMessage === 'string' ? errorMessage : defaultLabel}
      </GridOverlay>
    );
  },
);
