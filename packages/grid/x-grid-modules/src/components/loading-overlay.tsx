import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay } from './styled-wrappers';

export function LoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress />
    </GridOverlay>
  );
}
