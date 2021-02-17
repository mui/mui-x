import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { GridOverlay } from './containers/GridOverlay';

export function GridNoRowsOverlay() {
  const apiRef = React.useContext(GridApiContext);
  const noRowsLabel = apiRef!.current.getLocaleText('noRowsLabel');
  return <GridOverlay>{noRowsLabel}</GridOverlay>;
}
