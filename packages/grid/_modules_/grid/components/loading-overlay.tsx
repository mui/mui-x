import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay } from './styled-wrappers/GridOverlay';

export function LoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress />
    </GridOverlay>
  );
}
