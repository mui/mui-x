import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useStrippedProps } from '../hooks/utils/useStrippedProps';

export const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    const strippedProps = useStrippedProps(props);

    return (
      <GridOverlay ref={ref} {...strippedProps}>
        <CircularProgress />
      </GridOverlay>
    );
  },
);
