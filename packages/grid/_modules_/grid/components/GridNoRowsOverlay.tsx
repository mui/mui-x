import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { useStrippedProps } from '../hooks/utils/useStrippedProps';

export const GridNoRowsOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridNoRowsOverlay(props, ref) {
    const strippedProps = useStrippedProps(props);
    const apiRef = React.useContext(GridApiContext);
    const noRowsLabel = apiRef!.current.getLocaleText('noRowsLabel');

    return (
      <GridOverlay ref={ref} {...strippedProps}>
        {noRowsLabel}
      </GridOverlay>
    );
  },
);
