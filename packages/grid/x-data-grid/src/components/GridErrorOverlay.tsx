import * as React from 'react';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridDensityFactorSelector } from '../hooks/features/density/densitySelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export interface GridErrorOverlayProps extends GridOverlayProps {
  error?: Error;
  hasError: boolean;
  errorInfo: any;
}

export const GridErrorOverlay = React.forwardRef<HTMLDivElement, GridErrorOverlayProps>(
  function GridErrorOverlay(props, ref) {
    const { error, hasError, errorInfo, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');
    const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
    const rowHeight = Math.floor(rootProps.rowHeight * densityFactor);

    return (
      <GridOverlay ref={ref} sx={{ width: '100%', minHeight: 2 * rowHeight }} {...other}>
        {error?.message || defaultLabel}
      </GridOverlay>
    );
  },
);
