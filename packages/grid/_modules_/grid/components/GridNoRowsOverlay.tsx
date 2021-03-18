import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export const GridNoRowsOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridNoRowsOverlay(props, ref) {
    const apiRef = React.useContext(GridApiContext);
    const noRowsLabel = apiRef!.current.getLocaleText('noRowsLabel');

    return (
      <GridOverlay ref={ref} {...props}>
        {noRowsLabel}
      </GridOverlay>
    );
  },
);
