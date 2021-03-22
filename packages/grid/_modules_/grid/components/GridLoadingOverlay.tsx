import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useGridStripBaseComponentsProps } from '../hooks/utils/useGridStripBaseComponentsProps';

export const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    const strippedProps = useGridStripBaseComponentsProps(props);

    return (
      <GridOverlay ref={ref} {...strippedProps}>
        <CircularProgress />
      </GridOverlay>
    );
  },
);
