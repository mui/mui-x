import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export const GridNoResultsOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridNoResultsOverlay(props, ref) {
    const apiRef = React.useContext(GridApiContext);
    const allRowsFilteredLabel = apiRef!.current.getLocaleText('allRowsFilteredLabel');

    return (
      <GridOverlay ref={ref} {...props}>
        {allRowsFilteredLabel}
      </GridOverlay>
    );
  },
);
