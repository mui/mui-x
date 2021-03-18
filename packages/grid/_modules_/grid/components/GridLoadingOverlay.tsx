import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    const { className, ...other } = props;

    return (
      <GridOverlay ref={ref} className={className} {...other}>
        <CircularProgress />
      </GridOverlay>
    );
  },
);
