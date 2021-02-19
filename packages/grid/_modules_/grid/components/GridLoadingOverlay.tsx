import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay } from './containers/GridOverlay';

export function GridLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress />
    </GridOverlay>
  );
}
