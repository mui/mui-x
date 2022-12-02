import * as React from 'react';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';

export interface GridErrorOverlayProps extends GridOverlayProps {
  error?: Error;
  hasError: boolean;
  errorInfo: any;
}

export const GridErrorOverlay = React.forwardRef<HTMLDivElement, GridErrorOverlayProps>(
  function GridErrorOverlay(props, ref) {
    const { error, hasError, errorInfo, ...other } = props;
    const apiRef = useGridApiContext();
    const defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');
    const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

    return (
      <GridOverlay ref={ref} sx={{ width: '100%', minHeight: 2 * rowHeight }} {...other}>
        {error?.message || defaultLabel}
      </GridOverlay>
    );
  },
);
