import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    return (
      <GridOverlay ref={ref} {...props}>
        <CircularProgress />
      </GridOverlay>
    );
  },
);
