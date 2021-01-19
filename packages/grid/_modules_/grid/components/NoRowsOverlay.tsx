import * as React from 'react';
import { ApiContext } from './api-context';
import { GridOverlay } from './containers/GridOverlay';

export function NoRowsOverlay() {
  const apiRef = React.useContext(ApiContext);
  const noRowsLabel = apiRef!.current.getLocaleText('noRowsLabel');
  return <GridOverlay>{noRowsLabel}</GridOverlay>;
}
