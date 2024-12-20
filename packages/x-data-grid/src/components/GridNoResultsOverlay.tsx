import * as React from 'react';
import { forwardRefShim } from '@mui/x-internals/forwardRefShim';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export const GridNoResultsOverlay = forwardRefShim<HTMLDivElement, GridOverlayProps>(
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
