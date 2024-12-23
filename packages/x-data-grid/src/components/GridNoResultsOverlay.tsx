import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export const GridNoResultsOverlay = forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridNoResultsOverlay(props, ref) {
    const apiRef = useGridApiContext();
    const noResultsOverlayLabel = apiRef.current.getLocaleText('noResultsOverlayLabel');

    return (
      <GridOverlay {...props} ref={ref}>
        {noResultsOverlayLabel}
      </GridOverlay>
    );
  },
);
