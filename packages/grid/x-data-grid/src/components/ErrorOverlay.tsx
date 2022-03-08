import * as React from 'react';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';

export interface ErrorOverlayProps extends GridOverlayProps {
  message?: string;
  hasError: boolean;
  errorInfo: any;
}

// TODO v6: rename to GridErrorOverlay
export const ErrorOverlay = React.forwardRef<HTMLDivElement, ErrorOverlayProps>(
  function ErrorOverlay(props: ErrorOverlayProps, ref) {
    const { message, hasError, errorInfo, ...other } = props;
    const apiRef = useGridApiContext();
    const defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');
    const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

    return (
      <GridOverlay ref={ref} sx={{ width: '100%', minHeight: 2 * rowHeight }} {...other}>
        {message || defaultLabel}
      </GridOverlay>
    );
  },
);
